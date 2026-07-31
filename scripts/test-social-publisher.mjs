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
  blogs: path.join(temporaryDir, 'blogs.json'),
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
      SOCIAL_BLOG_PATH: files.blogs,
      SOCIAL_OUTBOUND_DIR: files.outbound,
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
    policy: { facebook: 'automatic', blog: 'approval-required' },
    platforms: ['x', 'tiktok'],
    maximumAutomaticItemsPerRun: 3,
    maximumAttemptsPerPlatform: 3,
    x: { publishingMode: 'automatic', maximumCharacters: 280, hashtags: ['#NCPDAGermany'] },
    tiktok: { username: 'ncpda_germany', privacyLevel: 'PUBLIC_TO_EVERYONE', autoAddMusic: false, hashtags: ['#NCPDAGermany'] }
  });
  writeJson(files.queue, { version: 1, updatedAt: null, items: [] });
  writeJson(files.state, { version: 1, initializedAt: null, updatedAt: null, knownSources: {}, publications: [] });
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
  writeJson(files.blogs, {
    items: [{
      id: 'existing-blog',
      slug: 'existing-blog',
      status: 'published',
      publishedAt: '2026-07-01T11:00:00Z',
      sharePath: 'blog/existing-blog',
      title: 'Existing Blog',
      excerpt: 'Existing Blog content'
    }]
  });

  run('seed');
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
  const blogs = readJson(files.blogs);
  blogs.items.unshift({
    id: 'new-blog',
    slug: 'new-blog',
    status: 'published',
    publishedAt: future,
    sharePath: 'blog/new-blog',
    title: 'নতুন বিশ্লেষণধর্মী ব্লগ',
    excerpt: 'এই ব্লগের social post প্রকাশের আগে অনুমোদন আবশ্যক।',
    imageCredit: 'Test image credit'
  });
  writeJson(files.blogs, blogs);

  run('prepare');
  let queue = readJson(files.queue);
  assert.equal(queue.items.length, 2);
  const facebookQueueItem = queue.items.find((item) => item.sourceType === 'facebook');
  const blogQueueItem = queue.items.find((item) => item.sourceType === 'blog');
  assert.equal(facebookQueueItem.approval, 'automatic');
  assert.equal(facebookQueueItem.status, 'pending');
  assert.match(facebookQueueItem.platforms.x.text, /এটি মূল Facebook caption/u);
  assert.doesNotMatch(facebookQueueItem.platforms.x.text, /Website summary/u);
  assert.equal(blogQueueItem.approval, 'required');
  assert.equal(blogQueueItem.status, 'awaiting-approval');
  assert.ok(fs.existsSync(path.resolve(rootDir, facebookQueueItem.platforms.x.mediaPath)) || fs.existsSync(path.join(temporaryDir, 'outbound', path.basename(facebookQueueItem.platforms.x.mediaPath))));

  run('claim', ['--approval', 'automatic', '--claim-id', 'auto-test'], { SOCIAL_MOCK_PUBLISHING: 'true' });
  run('execute', ['--claim-id', 'auto-test'], { SOCIAL_MOCK_PUBLISHING: 'true' });
  queue = readJson(files.queue);
  assert.equal(queue.items.find((item) => item.sourceType === 'facebook').status, 'completed');
  assert.equal(queue.items.find((item) => item.sourceType === 'blog').status, 'awaiting-approval');

  run('claim', ['--approval', 'required', '--item', 'new-blog', '--claim-id', 'blog-denied'], { SOCIAL_MOCK_PUBLISHING: 'true' }, 1);
  run('claim', ['--approval', 'required', '--item', 'new-blog', '--claim-id', 'blog-approved'], {
    SOCIAL_MOCK_PUBLISHING: 'true',
    SOCIAL_APPROVAL_CONFIRMED: 'true',
    SOCIAL_X_TEXT_OVERRIDE: 'অনুমোদিত X caption https://ncpdagermany.de/blog/new-blog/'
  });
  run('execute', ['--claim-id', 'blog-approved'], { SOCIAL_MOCK_PUBLISHING: 'true' });
  queue = readJson(files.queue);
  const approvedBlog = queue.items.find((item) => item.sourceType === 'blog');
  assert.equal(approvedBlog.status, 'completed');
  assert.equal(approvedBlog.approvalStatus, 'approved');
  assert.match(approvedBlog.platforms.x.text, /^অনুমোদিত X caption/u);

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
  assert.equal(readJson(files.queue).items.length, 2, 'prepare must not duplicate known source items');
  assert.equal(readJson(files.state).publications.length, 4, 'two platforms should be recorded for each source item');

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
  assert.equal(readJson(files.state).publications.length, 5, 'draft-only X must not create an X publication record');
  console.log('Social publisher policy, approval gate, media generation, delivery state and deduplication tests passed.');
} finally {
  fs.rmSync(temporaryDir, { recursive: true, force: true });
}
