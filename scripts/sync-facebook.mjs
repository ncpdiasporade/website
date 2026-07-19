import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const configPath = path.join(rootDir, 'social-feed.config.json');
const outputPath = path.join(rootDir, 'data', 'recent-updates.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
const graphVersion = process.env.META_GRAPH_VERSION || config.graphVersion;
const successfulSources = new Set();
const featuredResolvedSources = new Set();
const configuredFeaturedUrls = new Map();
const freshItems = [];

function clean(value) {
  return String(value || '')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/(^|\s)#[\p{L}\p{N}_-]+/gu, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
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

function clipAtWord(value, maxLength) {
  const text = clean(value).replace(/\s+/g, ' ');
  if (text.length <= maxLength) return text;
  const sample = text.slice(0, maxLength + 1);
  const lastSpace = sample.lastIndexOf(' ');
  return `${sample.slice(0, lastSpace > maxLength * 0.65 ? lastSpace : maxLength).trim()}…`;
}

function captionTitle(message, attachment, mediaType) {
  const lines = clean(message)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const candidate = lines[0] || clean(attachment?.title) || (mediaType === 'video' ? 'নতুন ভিডিও আপডেট' : 'নতুন কার্যক্রমের আপডেট');
  const firstSentence = candidate.split(/(?<=[।!?])\s+/u)[0];
  return clipAtWord(firstSentence, 118);
}

function captionExcerpt(message, title, attachment) {
  const source = clean(message || attachment?.description || attachment?.title);
  if (!source) return 'অফিসিয়াল ফেসবুক পেজে নতুন আপডেট প্রকাশিত হয়েছে। বিস্তারিত জানতে মূল পোস্টটি দেখুন।';

  const segments = source
    .split(/(?<=[।!?])\s+|\n+/u)
    .map((segment) => clean(segment))
    .filter((segment) => segment && segment !== title && segment.length > 12);
  const selected = [];
  let length = 0;

  for (const segment of segments) {
    if (selected.length >= 3 || (selected.length && length + segment.length > 330)) break;
    selected.push(segment);
    length += segment.length;
  }

  return clipAtWord(selected.join(' ') || source, 340);
}

function classifyBadge(message, mediaType, fallback) {
  const value = clean(message).toLowerCase();
  if (mediaType === 'video') return 'ভিডিও';
  if (/শোক|মৃত্যু|সমবেদনা/u.test(value)) return 'শোকবার্তা';
  if (/ঘোষণা|আয়োজন|অনুষ্ঠান|নিবন্ধন|register|event/u.test(value)) return 'আয়োজন';
  if (/জুলাই|uprising|revolution/u.test(value)) return 'জুলাই';
  if (/ভোট|নির্বাচন|ballot|election/u.test(value)) return 'নির্বাচন';
  if (/দূতাবাস|প্রবাসী|diaspora|embassy/u.test(value)) return 'প্রবাসী ইস্যু';
  return fallback;
}

function banglaDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Berlin'
  }).format(date);
}

function firstAttachment(post) {
  return Array.isArray(post.attachments?.data) ? post.attachments.data[0] : undefined;
}

function attachmentImage(post, attachment) {
  return post.full_picture
    || attachment?.media?.image?.src
    || attachment?.subattachments?.data?.[0]?.media?.image?.src
    || '';
}

function mediaTypeFor(attachment) {
  const value = String(attachment?.media_type || attachment?.type || '').toLowerCase();
  if (value.includes('video')) return 'video';
  if (value.includes('photo') || value.includes('image') || value.includes('album')) return 'image';
  return 'text';
}

function extensionFromContentType(contentType) {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('gif')) return 'gif';
  return 'jpg';
}

async function cacheImage(imageUrl, pageKey, postId) {
  if (!imageUrl) return '';
  const response = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`image download returned ${response.status}`);

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  if (!contentType.startsWith('image/')) throw new Error(`unsupported media type ${contentType}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > config.maxImageBytes) throw new Error(`image is larger than ${config.maxImageBytes} bytes`);

  const safeId = String(postId).replace(/[^a-zA-Z0-9_-]/g, '-');
  const relativeDir = path.join('img', 'social', pageKey);
  const relativePath = path.join(relativeDir, `fb-${safeId}.${extensionFromContentType(contentType)}`);
  const absoluteDir = path.join(rootDir, relativeDir);
  fs.mkdirSync(absoluteDir, { recursive: true });
  fs.writeFileSync(path.join(rootDir, relativePath), bytes);
  return relativePath.split(path.sep).join('/');
}

async function graphRequest(page, pageId, edge, fields, token) {
  const url = new URL(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(pageId)}/${edge}`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('limit', String(config.postsPerPage));
  url.searchParams.set('access_token', token);

  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) {
    const detail = clipAtWord(await response.text(), 260).replace(token, '[redacted]');
    throw new Error(`${page.sourceName} Graph API ${edge} request failed (${response.status}): ${detail}`);
  }

  return response.json();
}

async function fetchPagePosts(page) {
  const token = process.env[page.tokenEnv];
  if (!token) {
    console.log(`Skipping ${page.sourceName}: ${page.tokenEnv} is not configured.`);
    return [];
  }

  const pageId = process.env[page.pageIdEnv] || page.pageId;
  const baseFields = 'id,message,created_time,permalink_url,full_picture,attachments{media_type,type,url,title,description,target,media,subattachments}';
  let posts = [];
  let featuredResolved = false;

  try {
    const payload = await graphRequest(page, pageId, 'posts', `${baseFields},is_pinned`, token);
    posts = Array.isArray(payload.data) ? payload.data : [];
    featuredResolved = posts.some((post) => Object.prototype.hasOwnProperty.call(post, 'is_pinned'));
  } catch (error) {
    console.warn(`${error.message} Retrying without the optional featured flag.`);
    const payload = await graphRequest(page, pageId, 'posts', baseFields, token);
    posts = Array.isArray(payload.data) ? payload.data : [];
  }

  try {
    const payload = await graphRequest(page, pageId, 'pinned_posts', baseFields, token);
    const pinnedPosts = Array.isArray(payload.data) ? payload.data : [];
    const postsById = new Map(posts.map((post) => [post.id, post]));
    for (const post of pinnedPosts) {
      postsById.set(post.id, { ...postsById.get(post.id), ...post, is_pinned: true });
    }
    posts = [...postsById.values()];
    featuredResolved = true;
  } catch (error) {
    console.warn(`${page.sourceName}: Meta did not expose the pinned-post collection; preserving the last verified featured state.`);
  }

  const configuredFeaturedUrlList = String(
    process.env[page.featuredPostUrlsEnv]
      || process.env[page.featuredPostUrlEnv]
      || ''
  )
    .split(/[\n,]+/)
    .map((value) => canonicalUrl(value))
    .filter(Boolean);
  const configuredFeaturedUrlSet = new Set(configuredFeaturedUrlList);
  if (configuredFeaturedUrlSet.size) {
    configuredFeaturedUrls.set(page.key, configuredFeaturedUrlSet);
    posts = posts.map((post) => ({
      ...post,
      is_pinned: configuredFeaturedUrlSet.has(canonicalUrl(post.permalink_url))
    }));
    featuredResolved = true;
  }

  successfulSources.add(page.key);
  if (featuredResolved) featuredResolvedSources.add(page.key);
  return posts;
}

async function normalizePost(post, page) {
  const attachment = firstAttachment(post);
  const mediaType = mediaTypeFor(attachment);
  const title = captionTitle(post.message, attachment, mediaType);
  const excerpt = captionExcerpt(post.message, title, attachment);
  let image = '';

  try {
    image = await cacheImage(attachmentImage(post, attachment), page.key, post.id);
  } catch (error) {
    console.warn(`Could not cache media for ${post.id}: ${error.message}`);
  }

  return {
    id: `facebook-${page.key}-${String(post.id).replace(/[^a-zA-Z0-9_-]/g, '-')}`,
    status: 'published',
    date: banglaDate(post.created_time),
    createdAt: post.created_time,
    badge: classifyBadge(post.message, mediaType, page.defaultBadge),
    title,
    excerpt,
    sourceKey: page.key,
    sourceName: page.sourceName,
    sourceUrl: post.permalink_url || attachment?.url || page.pageUrl,
    mediaType,
    featured: Boolean(post.is_pinned),
    ...(image ? { image, imageAlt: title } : {}),
    managedBy: 'facebook-sync'
  };
}

for (const page of config.pages) {
  try {
    const posts = await fetchPagePosts(page);
    for (const post of posts) freshItems.push(await normalizePost(post, page));
  } catch (error) {
    console.error(error.message);
  }
}

if (!successfulSources.size) {
  console.log('No Facebook source was synchronized; existing content was left unchanged.');
  process.exit(0);
}

const existingFeaturedIds = new Set((existing.items || []).filter((item) => item.featured === true).map((item) => item.id));
const existingFeaturedUrls = new Set((existing.items || []).filter((item) => item.featured === true).map((item) => item.sourceUrl).filter(Boolean));
for (const item of freshItems) {
  if (featuredResolvedSources.has(item.sourceKey)) continue;
  if (existingFeaturedIds.has(item.id) || existingFeaturedUrls.has(item.sourceUrl)) item.featured = true;
}

const freshIds = new Set(freshItems.map((item) => item.id));
const freshUrls = new Set(freshItems.map((item) => item.sourceUrl).filter(Boolean));
const preserved = (existing.items || [])
  .filter((item) => {
    if (freshIds.has(item.id) || freshUrls.has(item.sourceUrl)) return false;
    if (item.managedBy === 'facebook-sync' && successfulSources.has(item.sourceKey)) return false;
    return true;
  })
  .map((item) => {
    const configuredUrls = configuredFeaturedUrls.get(item.sourceKey);
    if (configuredUrls?.size) return { ...item, featured: configuredUrls.has(canonicalUrl(item.sourceUrl)) };
    if (featuredResolvedSources.has(item.sourceKey) && item.featured === true) return { ...item, featured: false };
    return item;
  });

const sortedCandidates = [...freshItems, ...preserved]
  .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
const selectedCandidates = [
  ...sortedCandidates.filter((item) => item.featured === true),
  ...sortedCandidates.filter((item) => item.featured !== true)
].slice(0, config.maxPublishedItems);
const selectedIds = new Set(selectedCandidates.map((item) => item.id));
const items = sortedCandidates.filter((item) => selectedIds.has(item.id));
const output = { updatedAt: new Date().toISOString(), items };
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

const referencedImages = new Set(items.map((item) => item.image).filter(Boolean));
for (const page of config.pages) {
  const generatedDir = path.join(rootDir, 'img', 'social', page.key);
  if (!fs.existsSync(generatedDir)) continue;
  for (const name of fs.readdirSync(generatedDir)) {
    if (!name.startsWith('fb-')) continue;
    const relativePath = path.join('img', 'social', page.key, name).split(path.sep).join('/');
    if (!referencedImages.has(relativePath)) fs.unlinkSync(path.join(generatedDir, name));
  }
}

const featuredCount = items.filter((item) => item.featured === true).length;
console.log(`Published ${freshItems.length} Facebook post(s) from ${successfulSources.size} source(s); ${featuredCount} featured post(s) are active.`);
