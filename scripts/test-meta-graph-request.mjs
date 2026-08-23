import assert from 'node:assert/strict';
import { metaGraphGet, metaGraphRequest } from './lib/meta-graph-request.mjs';

const originalFetch = globalThis.fetch;
const calls = [];
globalThis.fetch = async (url, options) => {
  calls.push({ url: String(url), options });
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
  await assert.rejects(() => metaGraphRequest('https://example.com/v24.0/123/feed', { method: 'POST' }), /official Meta Graph API host/);
  console.log('Shared Meta Graph GET/POST host restriction and response handling tests passed.');
} finally {
  globalThis.fetch = originalFetch;
}
