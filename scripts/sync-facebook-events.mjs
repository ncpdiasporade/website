import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const config = JSON.parse(fs.readFileSync(path.join(rootDir, 'social-feed.config.json'), 'utf8'));
const outputPath = path.join(rootDir, 'data', 'announcements.json');
const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
const graphVersion = process.env.META_GRAPH_VERSION || config.graphVersion;
const requireSync = String(process.env.REQUIRE_FACEBOOK_EVENTS || '').toLowerCase() === 'true';
const page = config.pages.find((candidate) => candidate.key === 'germany');
const token = page ? process.env[page.tokenEnv] : '';
const pageId = page ? (process.env[page.pageIdEnv] || page.pageId) : '';

function clean(value) {
  return String(value || '')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/(^|\s)#[\p{L}\p{N}_-]+/gu, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function clipAtWord(value, maxLength) {
  const text = clean(value).replace(/\s+/g, ' ');
  if (text.length <= maxLength) return text;
  const sample = text.slice(0, maxLength + 1);
  const lastSpace = sample.lastIndexOf(' ');
  return `${sample.slice(0, lastSpace > maxLength * 0.65 ? lastSpace : maxLength).trim()}…`;
}

function eventIdFromUrl(value) {
  return String(value || '').match(/facebook\.com\/events\/(\d+)/i)?.[1] || '';
}

function eventUrl(id) {
  return `https://www.facebook.com/events/${id}/`;
}

function canonicalUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    url.hash = '';
    url.search = '';
    return url.href.replace(/\/$/, '');
  } catch {
    return String(value || '').trim().replace(/\/$/, '');
  }
}

function extensionFromContentType(contentType) {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('gif')) return 'gif';
  return 'jpg';
}

async function cacheImage(imageUrl, eventId) {
  if (!imageUrl) return '';
  const response = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`event image download returned ${response.status}`);
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  if (!contentType.startsWith('image/')) throw new Error(`unsupported event image type ${contentType}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > config.maxImageBytes) throw new Error(`event image is larger than ${config.maxImageBytes} bytes`);

  const relativeDir = path.join('img', 'events');
  const relativePath = path.join(relativeDir, `facebook-event-${eventId}.${extensionFromContentType(contentType)}`);
  fs.mkdirSync(path.join(rootDir, relativeDir), { recursive: true });
  fs.writeFileSync(path.join(rootDir, relativePath), bytes);
  return relativePath.split(path.sep).join('/');
}

async function graphRequest(objectId, edge, fields, limit = config.eventsPerPage) {
  const suffix = edge ? `/${edge}` : '';
  const url = new URL(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(objectId)}${suffix}`);
  url.searchParams.set('fields', fields);
  if (edge) url.searchParams.set('limit', String(limit));
  url.searchParams.set('access_token', token);
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) {
    const detail = clipAtWord(await response.text(), 260).replaceAll(token, '[redacted]');
    throw new Error(`Meta Graph API ${edge || 'event'} request failed (${response.status}): ${detail}`);
  }
  return response.json();
}

const eventFields = 'id,name,description,start_time,end_time,timezone,place,cover,ticket_uri,updated_time';

function collectEventIds(attachment, ids) {
  if (!attachment) return;
  const directId = eventIdFromUrl(attachment.url) || eventIdFromUrl(attachment.target?.url);
  const looksLikeEvent = /event/i.test(String(attachment.media_type || attachment.type || ''));
  const targetId = looksLikeEvent ? String(attachment.target?.id || '') : '';
  if (directId) ids.add(directId);
  if (/^\d+$/.test(targetId)) ids.add(targetId);
  for (const child of attachment.subattachments?.data || []) collectEventIds(child, ids);
}

async function fetchEvents() {
  const eventsById = new Map();
  let pageReadSucceeded = false;

  try {
    const payload = await graphRequest(pageId, 'events', eventFields);
    for (const event of payload.data || []) eventsById.set(String(event.id), event);
    pageReadSucceeded = true;
  } catch (error) {
    console.warn(`${error.message} Falling back to event links attached to recent Page posts.`);
  }

  const configuredEventUrls = String(process.env.NCPDA_GERMANY_EVENT_URLS || '')
    .split(/[\n,]+/)
    .map((value) => value.trim())
    .filter(Boolean);
  const eventIds = new Set(configuredEventUrls.map(eventIdFromUrl).filter(Boolean));

  try {
    const postFields = 'id,attachments{media_type,type,url,target,subattachments}';
    const payload = await graphRequest(pageId, 'posts', postFields, config.postsPerPage);
    for (const post of payload.data || []) {
      for (const attachment of post.attachments?.data || []) collectEventIds(attachment, eventIds);
    }
    pageReadSucceeded = true;
  } catch (error) {
    console.warn(`${error.message} No event links could be discovered from recent Page posts.`);
  }

  for (const id of eventIds) {
    if (eventsById.has(id)) continue;
    try {
      const event = await graphRequest(id, '', eventFields);
      eventsById.set(String(event.id || id), event);
    } catch (error) {
      console.warn(`Could not read Facebook Event ${id}: ${error.message}`);
    }
  }

  return { events: [...eventsById.values()], pageReadSucceeded };
}

function dateLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Berlin'
  }).format(date);
}

function timeLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('bn-BD', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Europe/Berlin'
  }).format(date);
}

function locationLabel(place) {
  const address = place?.location || {};
  const parts = [
    place?.name,
    address.street,
    [address.zip, address.city].filter(Boolean).join(' '),
    address.country
  ].filter(Boolean);
  return [...new Set(parts)].join(' · ') || 'Facebook Event-এ স্থান দেখুন';
}

async function normalizeEvent(event) {
  const id = String(event.id || '').replace(/[^0-9]/g, '');
  const title = clipAtWord(event.name || 'আসন্ন কর্মসূচি', 100);
  let image = '';
  try {
    image = await cacheImage(event.cover?.source, id);
  } catch (error) {
    console.warn(`Could not cache Facebook Event image ${id}: ${error.message}`);
  }

  return {
    id: `facebook-event-${id}`,
    status: 'published',
    featured: false,
    kicker: 'Facebook Event · আসন্ন কর্মসূচি',
    title,
    excerpt: clipAtWord(event.description || 'অনুষ্ঠানের সময়, স্থান ও সর্বশেষ তথ্য Facebook Event-এ দেখুন।', 620),
    date: dateLabel(event.start_time),
    dateISO: event.start_time,
    time: timeLabel(event.start_time),
    location: locationLabel(event.place),
    ...(image ? { image, imageAlt: `${title} Facebook Event cover` } : {}),
    posterUrl: eventUrl(id),
    sourceType: 'facebook-event',
    sourceName: page.sourceName,
    sourceUrl: eventUrl(id),
    managedBy: 'facebook-events',
    updatedAt: event.updated_time || event.start_time
  };
}

if (!page || !token) {
  const message = `Facebook Events sync skipped: ${page?.tokenEnv || 'Page access token'} is not configured.`;
  if (requireSync) {
    console.error(message);
    process.exit(1);
  }
  console.log(message);
  process.exit(0);
}

let fetched;
try {
  fetched = await fetchEvents();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

if (!fetched.pageReadSucceeded) {
  const message = 'Facebook Events could not be checked through the Meta Graph API; existing কর্মসূচি content was left unchanged.';
  if (requireSync) {
    console.error(message);
    process.exit(1);
  }
  console.log(message);
  process.exit(0);
}

const now = Date.now();
const upcomingEvents = fetched.events
  .filter((event) => {
    const start = new Date(event.start_time).getTime();
    const end = new Date(event.end_time || event.start_time).getTime();
    return Number.isFinite(start) && Number.isFinite(end) && end >= now - 6 * 60 * 60 * 1000;
  })
  .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
const normalizedEvents = [];
for (const event of upcomingEvents) normalizedEvents.push(await normalizeEvent(event));

const normalizedEventUrls = new Set(normalizedEvents.map((item) => canonicalUrl(item.sourceUrl)));
const preserved = (existing.items || []).filter((item) => {
  if (item.managedBy === 'facebook-events') return false;
  if (normalizedEventUrls.has(canonicalUrl(item.sourceUrl))) return false;
  if (!item.dateISO) return true;
  const end = new Date(item.endDateISO || item.dateISO).getTime();
  return !Number.isFinite(end) || end >= now - 6 * 60 * 60 * 1000;
});
const items = [...normalizedEvents, ...preserved]
  .sort((a, b) => new Date(a.dateISO || 8640000000000000) - new Date(b.dateISO || 8640000000000000));
for (const [index, item] of items.entries()) item.featured = index === 0;

fs.writeFileSync(outputPath, `${JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2)}\n`);

const referencedImages = new Set(items.map((item) => item.image).filter(Boolean));
const generatedDir = path.join(rootDir, 'img', 'events');
if (fs.existsSync(generatedDir)) {
  for (const name of fs.readdirSync(generatedDir)) {
    if (!name.startsWith('facebook-event-')) continue;
    const relativePath = path.join('img', 'events', name).split(path.sep).join('/');
    if (!referencedImages.has(relativePath)) fs.unlinkSync(path.join(generatedDir, name));
  }
}

console.log(`Published ${normalizedEvents.length} upcoming Facebook Event(s); কর্মসূচি was checked successfully.`);
