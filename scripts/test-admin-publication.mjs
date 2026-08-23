import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const recentPath = path.join(root, 'data/recent-updates.json');
const work = path.join(root, '.publisher-work');
const payloadPath = path.join(work, 'publication.json');
const resultsPath = path.join(work, 'results.json');
const original = fs.readFileSync(recentPath);

function run(command) {
  const result = spawnSync(process.execPath, [path.join(root, 'scripts/admin-publication.mjs'), command], {
    cwd: root, encoding: 'utf8', env: { ...process.env, SOCIAL_ADMIN_MODE: 'true', PUBLISHER_PAYLOAD_PATH: payloadPath, PUBLISHER_RESULTS_PATH: resultsPath }
  });
  assert.equal(result.status, 0, `${command} failed\n${result.stdout}\n${result.stderr}`);
}

try {
  fs.mkdirSync(work, { recursive: true });
  fs.writeFileSync(payloadPath, JSON.stringify({
    publication: {
      id: 'pub-test-stable', draftId: 'test-stable', type: 'SOCIAL_UPDATE', status: 'PUBLISHING', sourceFingerprint: 'abc123',
      content: { primaryLanguage: 'bn', title: 'Stable projection test', caption: 'Canonical caption', excerpt: 'Readable excerpt', websiteVisibility: 'RECENT_UPDATES', platforms: ['website'], media: [], translations: {}, platformOverrides: {} },
      deliveries: [{ platform: 'website', status: 'PUBLISHING', mode: 'AUTOMATIC', attempts: 0 }]
    }, adminOrigin: 'https://publisher-admin.example'
  }, null, 2));
  run('project');
  run('project');
  const data = JSON.parse(fs.readFileSync(recentPath, 'utf8'));
  const matches = data.items.filter((item) => item.publisherId === 'pub-test-stable');
  assert.equal(matches.length, 1, 'stable publisher identity must prevent duplicate Recent Updates');
  assert.equal(matches[0].managedBy, 'publisher-admin');
  assert.equal(matches[0].preserveCopy, true);
  const result = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  assert.deepEqual(result.deliveries.map((item) => [item.platform, item.status]), [['website', 'PUBLISHED']]);
  console.log('Admin projection stable-ID, website delivery and duplicate-protection tests passed.');
} finally {
  fs.writeFileSync(recentPath, original);
  fs.rmSync(work, { recursive: true, force: true });
}
