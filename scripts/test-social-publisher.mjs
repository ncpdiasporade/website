import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const temporaryDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ncpda-social-test-'));
const files = {
  config: path.join(temporaryDir, 'config.json'),
  queue: path.join(temporaryDir, 'queue.json'),
  state: path.join(temporaryDir, 'state.json'),
  facebook: path.join(temporaryDir, 'facebook.json'),
  outbound: path.join(temporaryDir, 'outbound')
};

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function run(command, extraArgs = [], extraEnv = {}, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [path.join(rootDir, 'scripts/social-publisher.mjs'), command, ...extraArgs], {
    cwd: rootDir,
    encoding: 'utf8',
    env: {
      ...process.env,
      SOCIAL_TEST_MODE: 'true',
      SOCIAL_CONFIG_PATH: files.config,
      SOCIAL_QUEUE_PATH: files.queue,
      SOCIAL_STATE_PATH: files.state,
      SOCIAL_FACEBOOK_PATH: files.facebook,
      SOCIAL_OUTBOUND_DIR: files.outbound,
      TIKTOK_PRODUCTION_APPROVED: 'true',
      ...extraEnv
    }
  });
  assert.equal(result.status, expectedStatus, `${command} exited ${result.status}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`);
  return result;
}

try {
  writeJson(files.config, {
    version: 1,
    siteUrl: 'https://ncpdagermany.de',
    facebookSourceKeys: ['germany'],
    policy: { facebook: 'automatic' },
    platforms: ['x', 'tiktok'],
    maximumAutomaticItemsPerRun: 3,
    maximumAttemptsPerPlatform: 3,
    x: { publishingMode: 'automatic', maximumCharacters: 280, hashtags: ['#NCPDAGermany'] },
    tiktok: { username: 'ncpda.germany', privacyLevel: 'PUBLIC_TO_EVERYONE', autoAddMusic: false, hashtags: ['#NCPDAGermany'] }
  });
  writeJson(files.queue, { version: 1, updatedAt: null, items: [{ id: 'legacy-item', sourceType: 'blog' }] });
  writeJson(files.state, { version: 1, initializedAt: null, updatedAt: null, knownSources: { 'blog:legacy-item': 'legacy' }, publications: [] });
  writeJson(files.facebook, {
    items: [{
      id: 'facebook-germany-existing',
      facebookId: 'existing',
      status: 'published',
      sourceKey: 'germany',
      sourceName: 'NCP Diaspora Alliance Germany',
      sourceUrl: 'https://www.facebook.com/ncpdagermany/posts/existing',
      createdAt: '2026-07-01T10:00:00Z',
      title: 'Existing Facebook post',
      excerpt: 'Existing content'
    }]
  });
  run('seed');
  assert.deepEqual(readJson(files.queue).items, [], 'seed must purge unsupported legacy queue items');
  assert.deepEqual(readJson(files.state).knownSources, { 'facebook:germany:existing': readJson(files.state).knownSources['facebook:germany:existing'] });
  const future = new Date(Date.now() + 60000).toISOString();
  const facebook = readJson(files.facebook);
  facebook.items.unshift({
    id: 'facebook-germany-new',
    facebookId: 'new',
    status: 'published',
    sourceKey: 'germany',
    sourceName: 'NCP Diaspora Alliance Germany',
    sourceUrl: 'https://www.facebook.com/ncpdagermany/posts/new',
    createdAt: future,
    title: 'নতুন ফেসবুক আপডেট',
    excerpt: 'Website summary',
    sourceCaption: 'এটি মূল Facebook caption। মূল বক্তব্য অপরিবর্তিত থাকবে।'
  });
  writeJson(files.facebook, facebook);

  run('prepare');
  let queue = readJson(files.queue);
  assert.equal(queue.items.length, 1);
  const facebookQueueItem = queue.items.find((item) => item.sourceType === 'facebook');
  assert.equal(facebookQueueItem.approval, 'automatic');
  assert.equal(facebookQueueItem.status, 'pending');
  assert.match(facebookQueueItem.platforms.x.text, /এটি মূল Facebook caption/u);
  assert.doesNotMatch(facebookQueueItem.platforms.x.text, /Website summary/u);
  assert.ok(fs.existsSync(path.resolve(rootDir, facebookQueueItem.platforms.x.mediaPath)) || fs.existsSync(path.join(temporaryDir, 'outbound', path.basename(facebookQueueItem.platforms.x.mediaPath))));

  run('claim', ['--approval', 'automatic', '--claim-id', 'auto-test'], { SOCIAL_MOCK_PUBLISHING: 'true' });
  run('execute', ['--claim-id', 'auto-test'], { SOCIAL_MOCK_PUBLISHING: 'true' });
  queue = readJson(files.queue);
  assert.equal(queue.items.find((item) => item.sourceType === 'facebook').status, 'completed');

  const completedFacebook = queue.items.find((item) => item.sourceType === 'facebook');
  completedFacebook.platforms.x.status = 'blocked';
  completedFacebook.platforms.x.blockReason = 'credits-depleted';
  completedFacebook.status = 'blocked';
  writeJson(files.queue, queue);
  run('unblock', ['--item', 'new', '--platforms', 'x']);
  queue = readJson(files.queue);
  assert.equal(queue.items.find((item) => item.sourceType === 'facebook').platforms.x.status, 'failed');
  assert.equal(queue.items.find((item) => item.sourceType === 'facebook').platforms.x.blockReason, undefined);

  run('prepare');
  assert.equal(readJson(files.queue).items.length, 1, 'prepare must not duplicate known source items');
  assert.equal(readJson(files.state).publications.length, 2, 'two platforms should be recorded for the Facebook item');

  const draftConfig = readJson(files.config);
  draftConfig.x.publishingMode = 'draft-only';
  writeJson(files.config, draftConfig);
  const draftFacebook = readJson(files.facebook);
  draftFacebook.items.unshift({
    id: 'facebook-germany-manual-x',
    facebookId: 'manual-x',
    status: 'published',
    sourceKey: 'germany',
    sourceName: 'NCP Diaspora Alliance Germany',
    sourceUrl: 'https://www.facebook.com/ncpdagermany/posts/manual-x',
    createdAt: new Date(Date.now() + 120000).toISOString(),
    title: 'Manual X draft',
    excerpt: 'Website summary for manual draft',
    sourceCaption: 'এই caption-টি manual X draft হিসেবে প্রস্তুত হবে।'
  });
  writeJson(files.facebook, draftFacebook);
  run('prepare');
  queue = readJson(files.queue);
  const manualXItem = queue.items.find((item) => item.sourceId === 'manual-x');
  assert.equal(manualXItem.platforms.x.status, 'draft-ready');
  assert.equal(manualXItem.platforms.tiktok.status, 'pending');
  run('claim', ['--approval', 'automatic', '--claim-id', 'manual-x-test'], { SOCIAL_MOCK_PUBLISHING: 'true' });
  run('execute', ['--claim-id', 'manual-x-test'], { SOCIAL_MOCK_PUBLISHING: 'true' });
  queue = readJson(files.queue);
  assert.equal(queue.items.find((item) => item.sourceId === 'manual-x').platforms.x.status, 'draft-ready');
  assert.equal(queue.items.find((item) => item.sourceId === 'manual-x').platforms.tiktok.status, 'submitted');
  const draftOutput = run('drafts');
  assert.match(draftOutput.stdout, /এই caption-টি manual X draft/u);
  assert.match(draftOutput.stdout, /Download the X-ready image/u);
  assert.equal(readJson(files.state).publications.length, 3, 'draft-only X must not create an X publication record');

  const sandboxFacebook = readJson(files.facebook);
  sandboxFacebook.items.unshift({
    id: 'facebook-germany-sandbox-gated',
    facebookId: 'sandbox-gated',
    status: 'published',
    sourceKey: 'germany',
    sourceName: 'NCP Diaspora Alliance Germany',
    sourceUrl: 'https://www.facebook.com/ncpdagermany/posts/sandbox-gated',
    createdAt: new Date(Date.now() + 180000).toISOString(),
    title: 'TikTok production gate',
    excerpt: 'This post must not be sent while TikTok production review is pending.',
    sourceCaption: 'TikTok production gate test.'
  });
  writeJson(files.facebook, sandboxFacebook);
  run('prepare', [], { TIKTOK_PRODUCTION_APPROVED: 'false' });
  queue = readJson(files.queue);
  const gatedItem = queue.items.find((item) => item.sourceId === 'sandbox-gated');
  assert.equal(gatedItem.platforms.tiktok.status, 'blocked');
  assert.equal(gatedItem.platforms.tiktok.blockReason, 'production-approval-required');
  console.log('Facebook-only social publisher policy, media generation, delivery state and deduplication tests passed.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}
