import assert from 'node:assert/strict';
import { metaGraphGet, metaGraphRequest } from './lib/meta-graph-request.mjs';
import { resolveMetaPageAccessToken } from './lib/meta-page-token.mjs';

const originalFetch = globalThis.fetch;
const calls = [];
globalThis.fetch = async (url, options) => {
  calls.push({ url: String(url), options });
  if (new URL(String(url)).searchParams.get('fields') === 'id,access_token') {
    return new Response(JSON.stringify({ id: '123', access_token: 'resolved-page-token' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ id: 'test-id' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};

try {
  const read = await metaGraphGet('https://graph.facebook.com/v24.0/123/posts?fields=id');
  assert.equal(read.ok, true);
  assert.equal((await read.json()).id, 'test-id');
  const body = new URLSearchParams({ message: 'Safe caption' });
  const write = await metaGraphRequest('https://graph.facebook.com/v24.0/123/feed', { method: 'POST', body });
  assert.equal(write.status, 200);
  assert.equal(calls[1].options.method, 'POST');
  assert.equal(calls[1].options.body.get('message'), 'Safe caption');
  const resolved = await resolveMetaPageAccessToken({ graphVersion: 'v24.0', pageId: '123', token: 'system-user-token', sourceName: 'Test Page' });
  assert.deepEqual(resolved, { token: 'resolved-page-token', resolved: true });
  await assert.rejects(() => metaGraphRequest('https://example.com/v24.0/123/feed', { method: 'POST' }), /official Meta Graph API host/);
  console.log('Shared Meta Graph host restriction, response handling, and Page-token resolution tests passed.');
} finally {
  globalThis.fetch = originalFetch;
}
