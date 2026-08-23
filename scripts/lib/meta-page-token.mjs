import { metaGraphGet } from './meta-graph-request.mjs';

export async function resolveMetaPageAccessToken({ graphVersion, pageId, token, sourceName = 'Meta Page' }) {
  if (!/^v\d{1,2}\.\d{1,2}$/.test(String(graphVersion || ''))) {
    throw new Error('META_GRAPH_VERSION must use the expected vNN.N format.');
  }
  if (!/^\d+$/.test(String(pageId || ''))) throw new Error(`${sourceName} has an invalid Page ID.`);
  if (!String(token || '').trim()) throw new Error(`${sourceName} access token is not configured.`);

  const url = new URL(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(pageId)}`);
  url.searchParams.set('fields', 'id,access_token');
  url.searchParams.set('access_token', token);
  const response = await metaGraphGet(url);
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    const providerMessage = String(payload?.error?.message || 'Meta rejected the Page-token lookup.');
    throw new Error(`${sourceName} Page access token lookup failed (${response.status}): ${providerMessage}`);
  }
  const pageToken = String(payload?.access_token || '').trim();
  if (!pageToken) throw new Error(`${sourceName} did not return a Page access token for the configured Page.`);

  return { token: pageToken, resolved: pageToken !== token };
}
