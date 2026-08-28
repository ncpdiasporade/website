import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { materializeMedia, publishToTikTok, publishToX, redactedError, xDraft, tiktokDraft } from './social-publisher.mjs';
import { metaGraphRequest } from './lib/meta-graph-request.mjs';
import { resolveMetaPageAccessToken } from './lib/meta-page-token.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const command = process.argv[2] || 'project';
const payloadPath = path.resolve(process.env.PUBLISHER_PAYLOAD_PATH || process.argv[3] || '.publisher-work/publication.json');
const resultsPath = path.resolve(process.env.PUBLISHER_RESULTS_PATH || '.publisher-work/results.json');
const workDir = path.resolve(root, '.publisher-work');
const updatesPath = path.join(root, 'data/recent-updates.json');
const siteUrl = 'https://ncpdagermany.de';
const repo = 'ncpdiasporade/website';

function assertInside(candidate) {
  const allowed = [root, ...(process.env.RUNNER_TEMP ? [path.resolve(process.env.RUNNER_TEMP)] : [])];
  if (!allowed.some((base) => { const relative = path.relative(base, candidate); return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative)); })) {
    throw new Error('Publisher path escaped the repository or runner temporary directory.');
  }
}
[payloadPath, resultsPath, workDir].forEach(assertInside);

function readJson(file, fallback) {
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (arguments.length > 1) return fallback;
  throw new Error(`Required publisher payload is missing: ${file}`);
}
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); }
function safe(value) { return String(value || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100); }
function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }
function bnDate(value) { return new Intl.DateTimeFormat('bn-BD', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' }).format(new Date(value)); }
function contentTitle(publication) { return clean(publication.content?.title || 'NCP Diaspora Alliance Germany'); }
function selected(publication, platform) {
  if (platform === 'website') return publication.content?.websiteVisibility === 'RECENT_UPDATES';
  const list = publication.content?.platforms;
  return Array.isArray(list) && list.includes(platform);
}
function assertSupported(publication) {
  if (publication.type !== 'SOCIAL_UPDATE') {
    throw new Error('The admin publisher accepts SOCIAL_UPDATE records only; automated website/blog publication is disabled.');
  }
}
function override(publication, platform) { return publication.content?.platformOverrides?.[platform] || {}; }
function captionFor(publication, platform) {
  const custom = override(publication, platform);
  const content = publication.content || {};
  return clean(custom.caption || custom.description || content.caption || content.excerpt || content.title);
}
function mediaItems(publication) {
  const values = publication.content?.media;
  return Array.isArray(values) ? values : [];
}
function extFor(mime, filename) {
  const known = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'video/mp4': 'mp4', 'video/webm': 'webm' };
  return known[mime] || path.extname(filename || '').replace('.', '') || 'bin';
}
function publicMediaPath(publication, item, index) {
  return `img/social/publisher/${safe(publication.id)}-${index + 1}.${extFor(item.mimeType, item.filename)}`;
}
function workingMediaPath(item, index) { return path.join(workDir, `source-${safe(item.id)}-${index + 1}.${extFor(item.mimeType, item.filename)}`); }
function absolutePublic(relative) { return new URL(relative, `${siteUrl}/`).href; }
function rawPublic(relative) { return `https://raw.githubusercontent.com/${repo}/main/${String(relative).split('/').map(encodeURIComponent).join('/')}`; }

async function downloadPrivateMedia(payload) {
  fs.mkdirSync(workDir, { recursive: true });
  const privateItems = mediaItems(payload.publication).filter((item) => item.privateStorageKey);
  if (!privateItems.length) return;
  const token = process.env.PUBLISHER_CALLBACK_TOKEN;
  if (!token) throw new Error('PUBLISHER_CALLBACK_TOKEN is required for private media retrieval.');
  for (const [index, item] of mediaItems(payload.publication).entries()) {
    if (!item.privateStorageKey) continue;
    const target = workingMediaPath(item, index);
    if (fs.existsSync(target)) continue;
    const url = new URL(`/api/internal/media/${encodeURIComponent(item.id)}`, payload.adminOrigin);
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(90_000) });
    if (!response.ok) throw new Error(`Private media ${item.id} download failed (${response.status}).`);
    fs.writeFileSync(target, Buffer.from(await response.arrayBuffer()), { mode: 0o600 });
  }
}

async function materializePublicMedia(payload) {
  const publication = payload.publication;
  const output = [];
  for (const [index, item] of mediaItems(publication).entries()) {
    const source = workingMediaPath(item, index);
    if (!fs.existsSync(source)) continue;
    if (item.type === 'video') {
      const approvedPublicUrl = /^https:\/\//i.test(item.publicUrl || '') ? item.publicUrl : null;
      output.push({ ...item, localPath: source, publicUrl: approvedPublicUrl, rawUrl: approvedPublicUrl, variants: {} });
      continue;
    }
    const relative = publicMediaPath(publication, item, index);
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
    const variants = item.type === 'image'
      ? await materializeMedia(`${publication.id}-${index + 1}`, contentTitle(publication), publication.content.excerpt || publication.content.caption || publication.content.title, source)
      : {};
    output.push({ ...item, localPath: source, publicPath: relative, publicUrl: absolutePublic(relative), rawUrl: rawPublic(relative), variants });
  }
  return output;
}

async function projectSocial(payload, media) {
  const publication = payload.publication;
  if (!selected(publication, 'website')) return;
  const data = readJson(updatesPath, { updatedAt: null, items: [] });
  const timestamp = new Date().toISOString();
  const id = `publisher-${safe(publication.id)}`;
  const primary = media[0];
  const record = {
    id, publisherId: publication.id, status: 'published', date: bnDate(timestamp), createdAt: timestamp,
    badge: 'সংগঠন', title: contentTitle(publication), excerpt: clean(publication.content.excerpt || publication.content.caption || publication.content.title),
    sourceCaption: clean(publication.content.caption), sourceKey: 'germany', sourceName: 'NCP Diaspora Alliance Germany',
    sourceUrl: `${siteUrl}/#updates`, mediaType: primary?.type || 'text', featured: false,
    ...(primary ? { image: primary.publicPath, imageAlt: primary.alt || contentTitle(publication), imageCredit: primary.credit, imageSourceUrl: primary.sourceUrl, license: primary.license } : {}),
    translations: publication.content.translations || {}, sourceFingerprint: publication.sourceFingerprint,
    managedBy: 'publisher-admin', preserveCopy: true
  };
  const index = (data.items || []).findIndex((item) => item.publisherId === publication.id || item.id === id);
  if (index >= 0) data.items[index] = { ...data.items[index], ...record };
  else data.items.unshift(record);
  data.updatedAt = timestamp;
  writeJson(updatesPath, data);
}

async function project() {
  const payload = readJson(payloadPath);
  assertSupported(payload.publication);
  await downloadPrivateMedia(payload);
  const media = await materializePublicMedia(payload);
  await projectSocial(payload, media);
  writeJson(resultsPath, { publicationId: payload.publication.id, deliveries: selected(payload.publication, 'website') ? [{ platform: 'website', status: 'PUBLISHED', publishedAt: new Date().toISOString(), externalUrl: `${siteUrl}/#updates` }] : [] });
  console.log(`Projected ${payload.publication.id} through the existing public content model.`);
}

async function graph(pathname, body, token, method = 'POST') {
  const version = process.env.META_GRAPH_VERSION || 'v24.0';
  const url = new URL(`https://graph.facebook.com/${version}/${pathname.replace(/^\/+/, '')}`);
  if (method === 'GET') url.searchParams.set('access_token', token);
  let requestBody = body;
  const headers = {};
  if (body instanceof URLSearchParams) body.set('access_token', token);
  else if (body instanceof FormData) body.set('access_token', token);
  else if (body) { requestBody = JSON.stringify({ ...body, access_token: token }); headers['Content-Type'] = 'application/json'; }
  const response = await metaGraphRequest(url, { method, body: requestBody, headers, timeoutMs: 120_000 });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok || payload.error) throw new Error(`Meta Graph API ${response.status}: ${payload.error?.message || 'request failed'}`);
  return payload;
}

function formWithFile(media, field, captionField, caption) {
  const form = new FormData();
  form.set(field, new Blob([fs.readFileSync(media.localPath)], { type: media.mimeType }), path.basename(media.localPath));
  if (caption) form.set(captionField, caption);
  return form;
}

let metaPageTokenPromise;
async function metaPageToken() {
  const configuredToken = process.env.NCPDA_GERMANY_PAGE_ACCESS_TOKEN;
  const pageId = process.env.NCPDA_GERMANY_PAGE_ID;
  if (!configuredToken || !pageId) return '';
  metaPageTokenPromise ||= resolveMetaPageAccessToken({
    graphVersion: process.env.META_GRAPH_VERSION || 'v24.0',
    pageId,
    token: configuredToken,
    sourceName: 'NCP Diaspora Alliance Germany'
  }).then((result) => result.token);
  return metaPageTokenPromise;
}

async function publishFacebook(publication, media) {
  const token = await metaPageToken();
  const pageId = process.env.NCPDA_GERMANY_PAGE_ID;
  if (!token || !pageId) return { platform: 'facebook', status: 'NOT_CONFIGURED' };
  const caption = captionFor(publication, 'facebook');
  let result;
  if (media[0]?.type === 'video') result = await graph(`${pageId}/videos`, formWithFile(media[0], 'source', 'description', caption), token);
  else if (media.length === 1) result = await graph(`${pageId}/photos`, formWithFile(media[0], 'source', 'caption', caption), token);
  else if (media.length > 1) {
    const ids = [];
    for (const item of media) { const form = formWithFile(item, 'source', 'caption', ''); form.set('published', 'false'); const uploaded = await graph(`${pageId}/photos`, form, token); ids.push(uploaded.id); }
    const body = new URLSearchParams({ message: caption }); ids.forEach((id, index) => body.set(`attached_media[${index}]`, JSON.stringify({ media_fbid: id })));
    result = await graph(`${pageId}/feed`, body, token);
  } else {
    const body = new URLSearchParams({ message: caption });
    result = await graph(`${pageId}/feed`, body, token);
  }
  const id = String(result.post_id || result.id || '');
  if (!id) throw new Error('Facebook did not return a publication ID.');
  return { platform: 'facebook', status: 'PUBLISHED', externalId: id, externalUrl: `https://www.facebook.com/${id}`, publishedAt: new Date().toISOString() };
}

async function waitContainer(id, token) {
  for (let attempt = 0; attempt < 15; attempt += 1) {
    const payload = await graph(`${id}?fields=status_code`, null, token, 'GET');
    if (payload.status_code === 'FINISHED') return;
    if (payload.status_code === 'ERROR' || payload.status_code === 'EXPIRED') throw new Error(`Instagram container ${payload.status_code}.`);
    await new Promise((resolve) => setTimeout(resolve, 4000));
  }
  throw new Error('Instagram media processing timed out.');
}

async function publishInstagram(publication, media) {
  const token = await metaPageToken();
  const userId = process.env.META_INSTAGRAM_USER_ID;
  if (!token || !userId) return { platform: 'instagram', status: 'NOT_CONFIGURED' };
  if (!media.length) return { platform: 'instagram', status: 'NOT_APPLICABLE' };
  if (media.some((item) => !item.rawUrl)) {
    return { platform: 'instagram', status: 'BLOCKED', error: 'Instagram video delivery requires configured public object storage.' };
  }
  const caption = captionFor(publication, 'instagram');
  let creationId;
  if (media.length > 1) {
    const children = [];
    for (const item of media.slice(0, 10)) {
      const child = new URLSearchParams({ is_carousel_item: 'true', [item.type === 'video' ? 'video_url' : 'image_url']: item.rawUrl });
      if (item.type === 'video') child.set('media_type', 'VIDEO');
      const created = await graph(`${userId}/media`, child, token); children.push(created.id); await waitContainer(created.id, token);
    }
    const created = await graph(`${userId}/media`, new URLSearchParams({ media_type: 'CAROUSEL', children: children.join(','), caption }), token); creationId = created.id;
  } else {
    const item = media[0]; const body = new URLSearchParams({ caption, [item.type === 'video' ? 'video_url' : 'image_url']: item.rawUrl });
    if (item.type === 'video') body.set('media_type', 'REELS');
    const created = await graph(`${userId}/media`, body, token); creationId = created.id;
  }
  await waitContainer(creationId, token);
  const published = await graph(`${userId}/media_publish`, new URLSearchParams({ creation_id: creationId }), token);
  const id = String(published.id || '');
  const details = id ? await graph(`${id}?fields=permalink`, null, token, 'GET') : {};
  return { platform: 'instagram', status: 'PUBLISHED', externalId: id, externalUrl: details.permalink, publishedAt: new Date().toISOString() };
}

async function publishYouTube(publication, media) {
  const video = media.find((item) => item.type === 'video');
  if (!video) return { platform: 'youtube', status: 'NOT_APPLICABLE' };
  if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET || !process.env.YOUTUBE_REFRESH_TOKEN) return { platform: 'youtube', status: 'NOT_CONFIGURED' };
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: process.env.YOUTUBE_CLIENT_ID, client_secret: process.env.YOUTUBE_CLIENT_SECRET, refresh_token: process.env.YOUTUBE_REFRESH_TOKEN, grant_type: 'refresh_token' }) });
  const tokenPayload = await tokenResponse.json(); if (!tokenResponse.ok || !tokenPayload.access_token) throw new Error('YouTube OAuth refresh failed.');
  const custom = override(publication, 'youtube');
  const metadata = { snippet: { title: clean(custom.title || publication.content.title).slice(0, 100), description: clean(custom.description || publication.content.caption || publication.content.excerpt).slice(0, 5000) }, status: { privacyStatus: process.env.YOUTUBE_PRIVACY_STATUS || 'public', selfDeclaredMadeForKids: false } };
  const start = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', { method: 'POST', headers: { Authorization: `Bearer ${tokenPayload.access_token}`, 'Content-Type': 'application/json', 'X-Upload-Content-Type': video.mimeType, 'X-Upload-Content-Length': String(fs.statSync(video.localPath).size) }, body: JSON.stringify(metadata) });
  if (!start.ok || !start.headers.get('Location')) throw new Error(`YouTube resumable upload initialization failed (${start.status}).`);
  const upload = await fetch(start.headers.get('Location'), { method: 'PUT', headers: { Authorization: `Bearer ${tokenPayload.access_token}`, 'Content-Type': video.mimeType }, body: fs.readFileSync(video.localPath) });
  const result = await upload.json(); if (!upload.ok || !result.id) throw new Error(`YouTube upload failed (${upload.status}).`);
  return { platform: 'youtube', status: 'PUBLISHED', externalId: result.id, externalUrl: `https://www.youtube.com/watch?v=${result.id}`, publishedAt: new Date().toISOString() };
}

async function publish() {
  const payload = readJson(payloadPath); const publication = payload.publication;
  assertSupported(publication);
  await downloadPrivateMedia(payload); const media = await materializePublicMedia(payload);
  const previous = readJson(resultsPath, { publicationId: publication.id, deliveries: [] });
  const retryPlatform = process.env.PUBLISHER_RETRY_PLATFORM || '';
  const targets = ['facebook','instagram','tiktok','youtube','x','whatsapp'].filter((platform) => selected(publication, platform) && (!retryPlatform || platform === retryPlatform));
  for (const platform of targets) {
    try {
      let result;
      if (platform === 'facebook') result = await publishFacebook(publication, media);
      else if (platform === 'instagram') result = await publishInstagram(publication, media);
      else if (platform === 'youtube') result = await publishYouTube(publication, media);
      else if (platform === 'tiktok') {
        if (!media.length) result = { platform, status: 'NOT_APPLICABLE' };
        else if (process.env.TIKTOK_PRODUCTION_APPROVED !== 'true' && process.env.SOCIAL_MOCK_PUBLISHING !== 'true') result = { platform, status: 'APPROVAL_REQUIRED', error: 'TikTok production review must be approved before public publishing is enabled.' };
        else if (!(process.env.TIKTOK_ACCESS_TOKEN || (process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET && process.env.TIKTOK_REFRESH_TOKEN))) result = { platform, status: 'NOT_CONFIGURED' };
        else if (media.some((item) => item.type === 'video') && media.length !== 1) result = { platform, status: 'BLOCKED', error: 'TikTok accepts one approved video or a photo set, not mixed media.' };
        else { const title = clean(override(publication, 'tiktok').title || publication.content.title).slice(0, 90); const description = tiktokDraft(title, captionFor(publication, 'tiktok'), `${siteUrl}/#updates`); const video = media.find((item) => item.type === 'video'); const published = await publishToTikTok({ title, description, ...(video ? { videoPath: video.localPath, mimeType: video.mimeType } : { mediaPaths: media.map((item) => item.variants?.tiktok || item.publicPath) }) }); result = { platform, status: published.status === 'submitted' ? 'SUBMITTED' : 'PUBLISHED', externalId: published.publishId, publishedAt: new Date().toISOString() }; }
      } else if (platform === 'x') {
        const url = `${siteUrl}/#updates`; const text = clean(override(publication, 'x').caption || xDraft(publication.content.title, publication.content.excerpt || publication.content.caption, url));
        if ((process.env.X_PUBLISHING_MODE || 'MANUAL') !== 'API') result = { platform, status: 'MANUAL', externalUrl: `https://x.com/intent/post?text=${encodeURIComponent(text)}` };
        else if (!(process.env.X_API_KEY && process.env.X_API_SECRET && process.env.X_ACCESS_TOKEN && process.env.X_ACCESS_TOKEN_SECRET)) result = { platform, status: 'NOT_CONFIGURED' };
        else { const sent = await publishToX({ text, mediaPath: media[0]?.variants?.x || media[0]?.publicPath }); result = { platform, status: 'PUBLISHED', externalId: sent.id, externalUrl: sent.url, publishedAt: new Date().toISOString() }; }
      } else {
        const url = `${siteUrl}/#updates`; const message = clean(override(publication, 'whatsapp').caption || `${publication.content.title}\n\n${publication.content.excerpt || publication.content.caption}\n\n${url}`);
        result = { platform, status: 'MANUAL', externalUrl: `https://wa.me/?text=${encodeURIComponent(message)}` };
      }
      previous.deliveries = previous.deliveries.filter((item) => item.platform !== platform); previous.deliveries.push(result);
    } catch (error) {
      previous.deliveries = previous.deliveries.filter((item) => item.platform !== platform); previous.deliveries.push({ platform, status: 'FAILED', error: redactedError(error) });
    }
    writeJson(resultsPath, previous);
  }
  console.log(`Executed ${targets.length} admin platform delivery target(s).`);
}

function reconcileWebsite() {
  const payload = readJson(payloadPath); const results = readJson(resultsPath, { deliveries: [] });
  assertSupported(payload.publication);
  const facebook = results.deliveries.find((item) => item.platform === 'facebook' && item.status === 'PUBLISHED');
  if (!facebook) return;
  const data = readJson(updatesPath, { items: [] });
  const item = data.items.find((candidate) => candidate.publisherId === payload.publication.id);
  if (!item) throw new Error('Projected Recent Updates record was not found for Facebook reconciliation.');
  item.facebookId = String(facebook.externalId || '').split('_').pop(); item.sourceUrl = facebook.externalUrl; item.publishedAt = facebook.publishedAt; item.preserveCopy = true;
  data.updatedAt = new Date().toISOString(); writeJson(updatesPath, data);
}

if (command === 'project') await project();
else if (command === 'publish') await publish();
else if (command === 'reconcile') reconcileWebsite();
else throw new Error(`Unknown admin publication command: ${command}`);
