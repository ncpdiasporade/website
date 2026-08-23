const META_GRAPH_HOST = 'graph.facebook.com';
const MAX_RESPONSE_BYTES = 16 * 1024 * 1024;

export async function metaGraphRequest(input, options = {}) {
  const url = input instanceof URL ? input : new URL(String(input));
  if (url.protocol !== 'https:' || url.hostname !== META_GRAPH_HOST || url.port || url.username || url.password) {
    throw new Error('Refusing a request outside the official Meta Graph API host.');
  }

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: { Accept: 'application/json', 'User-Agent': 'NCPDA-Germany-Social-Publisher/2.0', ...(options.headers || {}) },
    body: options.body,
    signal: AbortSignal.timeout(options.timeoutMs || 30_000),
    redirect: 'error'
  });
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > MAX_RESPONSE_BYTES) throw new Error('Meta Graph API response exceeded the safe size limit.');
  const body = new TextDecoder().decode(bytes);
  return { ok: response.ok, status: response.status, headers: response.headers, text: async () => body, json: async () => JSON.parse(body) };
}

export function metaGraphGet(input, timeoutMs = 30000) {
  return metaGraphRequest(input, { timeoutMs });
}
