import https from 'node:https';

const META_GRAPH_HOST = 'graph.facebook.com';
const MAX_RESPONSE_BYTES = 16 * 1024 * 1024;

export function metaGraphGet(input, timeoutMs = 30000) {
  const url = input instanceof URL ? input : new URL(String(input));
  if (url.protocol !== 'https:' || url.hostname !== META_GRAPH_HOST || url.port || url.username || url.password) {
    throw new Error('Refusing a request outside the official Meta Graph API host.');
  }

  return new Promise((resolve, reject) => {
    const request = https.request({
      protocol: 'https:',
      hostname: META_GRAPH_HOST,
      port: 443,
      method: 'GET',
      path: `${url.pathname}${url.search}`,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'NCPDA-Germany-Social-Sync/1.0'
      },
      timeout: timeoutMs
    }, (response) => {
      const chunks = [];
      let receivedBytes = 0;

      response.on('data', (chunk) => {
        receivedBytes += chunk.length;
        if (receivedBytes > MAX_RESPONSE_BYTES) {
          request.destroy(new Error('Meta Graph API response exceeded the safe size limit.'));
          return;
        }
        chunks.push(chunk);
      });

      response.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        const status = Number(response.statusCode || 0);
        resolve({
          ok: status >= 200 && status < 300,
          status,
          text: async () => body,
          json: async () => JSON.parse(body)
        });
      });
    });

    request.on('timeout', () => request.destroy(new Error('Meta Graph API request timed out.')));
    request.on('error', reject);
    request.end();
  });
}
