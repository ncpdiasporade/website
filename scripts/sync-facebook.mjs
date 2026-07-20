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
const requireSync = String(process.env.REQUIRE_FACEBOOK_SYNC || '').toLowerCase() === 'true';
const requiredSourceKeys = new Set(
  String(process.env.REQUIRE_FACEBOOK_SYNC_SOURCES || 'germany')
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean)
);
const successfulSources = new Set();
const featuredResolvedSources = new Set();
const videoMetricsFailures = new Set();
const configuredFeaturedUrls = new Map();
const configuredFeaturedIds = new Map();
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

function absoluteFacebookUrl(value, fallback = '') {
  const candidate = String(value || fallback || '').trim();
  if (!candidate) return '';
  try {
    return new URL(candidate, 'https://www.facebook.com').href;
  } catch {
    return candidate;
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

function rokteJulyCopy(message) {
  if (!/রক্তে\s+জুলাই/u.test(String(message || ''))) return null;
  const lines = String(message || '')
    .split(/\n+/)
    .map((line) => clean(line).replace(/^[^\p{L}\p{N}“‘]+/u, '').trim())
    .filter(Boolean);
  const invitationIndex = lines.findIndex((line) => /রক্তে\s+জুলাই.*(যুক্ত থাকবেন|উপস্থিত থাকবেন)/u.test(line));
  if (invitationIndex < 0) return null;

  const invitation = lines[invitationIndex];
  const participation = invitation.includes('অনলাইনে যুক্ত থাকবেন')
    ? 'অনলাইনে যুক্ত হবেন'
    : 'উপস্থিত থাকবেন';
  const guest = lines[invitationIndex + 1];
  if (!guest || guest.length > 90 || /তারিখ|জুলাইয়ের|রেজিস্ট্রেশন/u.test(guest)) return null;

  const detailLines = lines.slice(invitationIndex + 2);
  const roleLines = detailLines
    .filter((line) => !/প্রবাস থেকে|জুলাইয়ের|রেজিস্ট্রেশন|\d{1,2}\s+জুলাই\s+\d{4}|বিকাল|সকাল|Bilker|Germany|Düsseldorf/u.test(line))
    .slice(0, 3);
  const context = detailLines.find((line) => /প্রবাস থেকে জুলাইয়ের স্মৃতি/u.test(line));
  const date = detailLines.find((line) => /\d{1,2}\s+জুলাই\s+\d{4}/u.test(line));
  const time = detailLines.find((line) => /বিকাল|সকাল/u.test(line));
  const location = detailLines.find((line) => /Bilker|Düsseldorf/u.test(line));
  const role = roleLines.length ? ` (${roleLines.join('; ')})` : '';
  const schedule = [date, time, location].filter(Boolean).join(' · ');
  const excerpt = [
    `মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে ${participation} ${guest}${role}।`,
    context,
    schedule ? `${schedule}।` : ''
  ].filter(Boolean).join(' ');

  return {
    title: `‘রক্তে জুলাই’ অনুষ্ঠানে ${participation} ${guest}`,
    excerpt: clipAtWord(excerpt, 420)
  };
}

function classifyBadge(message, mediaType, fallback) {
  const value = clean(message).toLowerCase();
  if (mediaType === 'video') return 'ভিডিও';
  if (/রক্তে\s+জুলাই/u.test(value)) return 'রক্তে জুলাই';
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
  if (value.includes('video') || value.includes('reel')) return 'video';
  if (value.includes('photo') || value.includes('image') || value.includes('album')) return 'image';
  return 'text';
}

function extensionFromContentType(contentType) {
  if (contentType.includes('png')) return 'png';
  if (contentType.includes('webp')) return 'webp';
  if (contentType.includes('gif')) return 'gif';
  return 'jpg';
}

function viewCount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : 0;
}

function facebookId(value) {
  return String(value || '').split('_').pop().replace(/[^a-zA-Z0-9_-]/g, '-');
}

function configuredUrlsFor(page) {
  const values = String(
    process.env[page.featuredPostUrlsEnv]
      || process.env[page.featuredPostUrlEnv]
      || ''
  )
    .split(/[\n,]+/)
    .map((value) => canonicalUrl(value))
    .filter(Boolean);
  if (values.length) configuredFeaturedUrls.set(page.key, values);
  return values;
}

function configuredIdsFor(page) {
  const values = String(
    process.env[page.featuredPostIdsEnv]
      || (Array.isArray(page.featuredPostIds) ? page.featuredPostIds.join(',') : '')
  )
    .split(/[\s,]+/)
    .map((value) => value.trim().split('_').pop())
    .filter((value) => /^\d+$/.test(value));
  if (values.length) configuredFeaturedIds.set(page.key, [...new Set(values)]);
  return configuredFeaturedIds.get(page.key) || [];
}

async function cacheImage(imageUrl, pageKey, postId) {
  if (!imageUrl) return '';
  const response = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`image download returned ${response.status}`);

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  if (!contentType.startsWith('image/')) throw new Error(`unsupported media type ${contentType}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > config.maxImageBytes) throw new Error(`image is larger than ${config.maxImageBytes} bytes`);

  const safeId = facebookId(postId);
  const relativeDir = path.join('img', 'social', pageKey);
  const relativePath = path.join(relativeDir, `fb-${safeId}.${extensionFromContentType(contentType)}`);
  const absoluteDir = path.join(rootDir, relativeDir);
  fs.mkdirSync(absoluteDir, { recursive: true });
  fs.writeFileSync(path.join(rootDir, relativePath), bytes);
  return relativePath.split(path.sep).join('/');
}

async function graphRequest(page, pageId, edge, fields, token, limit = config.postsPerPage) {
  const url = new URL(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(pageId)}/${edge}`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('access_token', token);

  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) {
    const detail = clipAtWord(await response.text(), 260).replaceAll(token, '[redacted]');
    throw new Error(`${page.sourceName} Graph API ${edge} request failed (${response.status}): ${detail}`);
  }

  return response.json();
}

async function graphObjectRequest(page, objectId, fields, token) {
  const url = new URL(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(objectId)}`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('access_token', token);

  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) {
    const detail = clipAtWord(await response.text(), 260).replaceAll(token, '[redacted]');
    throw new Error(`${page.sourceName} Graph API object request failed (${response.status}): ${detail}`);
  }

  return response.json();
}

async function fetchVideoViews(page, video, token) {
  const isReel = /\/reels?\//i.test(String(video.permalink_url || ''));
  const metricSets = isReel
    ? ['blue_reels_play_count,total_video_views', 'total_video_views']
    : ['total_video_views'];
  let lastError;

  for (const metricNames of metricSets) {
    const url = new URL(`https://graph.facebook.com/${graphVersion}/${encodeURIComponent(video.id)}/video_insights`);
    url.searchParams.set('metric', metricNames);
    url.searchParams.set('access_token', token);
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) {
      const detail = clipAtWord(await response.text(), 220).replaceAll(token, '[redacted]');
      lastError = new Error(`${page.sourceName} video insights failed (${response.status}): ${detail}`);
      continue;
    }
    const payload = await response.json();
    const metric = (payload.data || []).find((item) => item.name === 'blue_reels_play_count')
      || (payload.data || []).find((item) => item.name === 'total_video_views');
    const value = metric?.values?.[0]?.value;
    return Number.isFinite(Number(value)) ? Number(value) : null;
  }

  throw lastError || new Error(`${page.sourceName} video insights did not return a view metric.`);
}

async function fetchPageVideos(page, pageId, token) {
  const baseFields = 'id,title,description,created_time,updated_time,permalink_url,picture,thumbnails{uri,is_preferred}';
  try {
    const payload = await graphRequest(page, pageId, 'videos', baseFields, token, config.videosPerPage);
    const videos = Array.isArray(payload.data) ? payload.data : [];
    let resolvedCount = 0;
    const withViews = [];
    for (let index = 0; index < videos.length; index += 5) {
      const batch = videos.slice(index, index + 5);
      const resolved = await Promise.all(batch.map(async (video) => {
        try {
          const views = await fetchVideoViews(page, video, token);
          if (views !== null) resolvedCount += 1;
          return { ...video, views: views ?? 0 };
        } catch (error) {
          console.warn(error.message);
          return { ...video, views: 0 };
        }
      }));
      withViews.push(...resolved);
    }
    if (videos.length && resolvedCount === 0) videoMetricsFailures.add(page.key);
    return withViews;
  } catch (error) {
    console.warn(`${error.message} Continuing with video posts found in the Page feed.`);
    videoMetricsFailures.add(page.key);
    return [];
  }
}

async function fetchPageContent(page) {
  const token = process.env[page.tokenEnv];
  configuredUrlsFor(page);
  configuredIdsFor(page);
  if (!token) {
    console.warn(`Skipping ${page.sourceName}: ${page.tokenEnv} is not configured.`);
    return { posts: [], videos: [] };
  }

  const pageId = process.env[page.pageIdEnv] || page.pageId;
  const baseFields = 'id,message,created_time,permalink_url,full_picture,attachments{media_type,type,url,title,description,target,media,subattachments}';
  let posts = [];
  let featuredResolved = false;

  try {
    const payload = await graphRequest(page, pageId, 'posts', baseFields, token);
    posts = Array.isArray(payload.data) ? payload.data : [];
  } catch (error) {
    throw error;
  }

  try {
    const payload = await graphRequest(page, pageId, 'pinned_posts', baseFields, token, 5);
    const pinnedPosts = Array.isArray(payload.data) ? payload.data : [];
    const postsById = new Map(posts.map((post) => [post.id, post]));
    for (const post of pinnedPosts) {
      postsById.set(post.id, { ...postsById.get(post.id), ...post, is_pinned: true });
    }
    posts = [...postsById.values()];
    featuredResolved = true;
  } catch {
    console.warn(`${page.sourceName}: Meta did not expose the pinned-post collection; using the configured permalink or the last verified pinned item.`);
  }

  const configuredIds = configuredFeaturedIds.get(page.key) || [];
  if (configuredIds.length) {
    const postsById = new Map(posts.map((post) => [post.id, post]));
    let resolvedCount = 0;
    for (const postId of configuredIds) {
      try {
        const objectId = `${pageId}_${postId}`;
        const post = await graphObjectRequest(page, objectId, baseFields, token);
        postsById.set(post.id, { ...postsById.get(post.id), ...post, is_pinned: true });
        resolvedCount += 1;
      } catch (error) {
        console.warn(`Could not refresh configured featured post ${postId}: ${error.message}`);
      }
    }
    posts = [...postsById.values()];
    if (resolvedCount === configuredIds.length) featuredResolved = true;
  }

  const configured = configuredFeaturedUrls.get(page.key) || [];
  if (configured.length) {
    posts = posts.map((post) => ({
      ...post,
      is_pinned: configured.includes(canonicalUrl(post.permalink_url))
    }));
    featuredResolved = true;
  }

  successfulSources.add(page.key);
  if (featuredResolved) featuredResolvedSources.add(page.key);
  return { posts, videos: await fetchPageVideos(page, pageId, token) };
}

async function normalizePost(post, page) {
  const attachment = firstAttachment(post);
  const mediaType = mediaTypeFor(attachment);
  const eventCopy = rokteJulyCopy(post.message);
  const title = eventCopy?.title || captionTitle(post.message, attachment, mediaType);
  const excerpt = eventCopy?.excerpt || captionExcerpt(post.message, title, attachment);
  let image = '';

  try {
    image = await cacheImage(attachmentImage(post, attachment), page.key, post.id);
  } catch (error) {
    console.warn(`Could not cache media for ${post.id}: ${error.message}`);
  }

  const sourceUrl = absoluteFacebookUrl(post.permalink_url || attachment?.url, page.pageUrl);
  const normalized = {
    id: `facebook-${page.key}-${facebookId(post.id)}`,
    facebookId: facebookId(post.id),
    status: 'published',
    date: banglaDate(post.created_time),
    createdAt: post.created_time,
    badge: classifyBadge(post.message, mediaType, page.defaultBadge),
    title,
    excerpt,
    sourceKey: page.key,
    sourceName: page.sourceName,
    sourceUrl,
    mediaType,
    isReel: /\/reels?\//i.test(sourceUrl),
    featured: Boolean(post.is_pinned),
    ...(image ? { image, imageAlt: title } : {}),
    managedBy: 'facebook-sync'
  };
  return preserveReviewedCopy(normalized);
}

async function normalizeVideo(video, page) {
  const message = video.description || video.title;
  const attachment = { title: video.title, description: video.description };
  const title = captionTitle(message, attachment, 'video');
  const preferredThumbnail = (video.thumbnails?.data || []).find((item) => item.is_preferred)?.uri
    || video.thumbnails?.data?.[0]?.uri
    || video.picture
    || '';
  let image = '';

  try {
    image = await cacheImage(preferredThumbnail, page.key, video.id);
  } catch (error) {
    console.warn(`Could not cache video thumbnail for ${video.id}: ${error.message}`);
  }

  const sourceUrl = absoluteFacebookUrl(
    video.permalink_url,
    `${page.pageUrl.replace(/\/$/, '')}/videos/${facebookId(video.id)}/`
  );
  const normalized = {
    id: `facebook-${page.key}-video-${facebookId(video.id)}`,
    facebookId: facebookId(video.id),
    status: 'published',
    date: banglaDate(video.created_time),
    createdAt: video.created_time || video.updated_time,
    badge: 'ভিডিও',
    title,
    excerpt: captionExcerpt(message, title, attachment),
    sourceKey: page.key,
    sourceName: page.sourceName,
    sourceUrl,
    mediaType: 'video',
    isReel: /\/reels?\//i.test(sourceUrl),
    viewCount: viewCount(video.views),
    featured: false,
    ...(image ? { image, imageAlt: title } : {}),
    managedBy: 'facebook-sync'
  };
  return preserveReviewedCopy(normalized);
}

function preserveReviewedCopy(normalized) {
  const reviewed = (existing.items || []).find((item) => (
    item.preserveCopy === true
    && item.sourceKey === normalized.sourceKey
    && (
      (item.facebookId && item.facebookId === normalized.facebookId)
      || canonicalUrl(item.sourceUrl) === canonicalUrl(normalized.sourceUrl)
    )
  ));
  if (!reviewed) return normalized;

  return {
    ...normalized,
    id: reviewed.id || normalized.id,
    date: reviewed.date || normalized.date,
    badge: reviewed.badge || normalized.badge,
    title: reviewed.title || normalized.title,
    excerpt: reviewed.excerpt || normalized.excerpt,
    sourceUrl: reviewed.sourceUrl || normalized.sourceUrl,
    image: reviewed.image || normalized.image,
    imageAlt: reviewed.imageAlt || normalized.imageAlt,
    preserveCopy: true
  };
}

function mergeFreshItems(items) {
  const merged = new Map();
  for (const item of items) {
    const key = `${item.sourceKey}:${item.facebookId || canonicalUrl(item.sourceUrl)}`;
    const previous = merged.get(key);
    if (!previous) {
      merged.set(key, item);
      continue;
    }
    const preferred = item.mediaType === 'video' ? item : previous;
    merged.set(key, {
      ...previous,
      ...preferred,
      featured: previous.featured === true || item.featured === true,
      viewCount: Math.max(viewCount(previous.viewCount), viewCount(item.viewCount)),
      image: preferred.image || previous.image,
      imageAlt: preferred.imageAlt || previous.imageAlt,
      isReel: previous.isReel === true || item.isReel === true
    });
  }
  return [...merged.values()];
}

for (const page of config.pages) {
  try {
    const { posts, videos } = await fetchPageContent(page);
    const normalized = [];
    for (const post of posts) normalized.push(await normalizePost(post, page));
    for (const video of videos) normalized.push(await normalizeVideo(video, page));
    freshItems.push(...mergeFreshItems(normalized));
  } catch (error) {
    console.error(error.message);
  }
}

if (!successfulSources.size) {
  const message = 'No Facebook source was synchronized; existing content was left unchanged.';
  if (requireSync) {
    console.error(`${message} Configure at least one Page access token in GitHub Secrets.`);
    process.exit(1);
  }
  console.log(message);
  process.exit(0);
}

if (requireSync && [...requiredSourceKeys].some((key) => !successfulSources.has(key))) {
  const missing = config.pages
    .filter((page) => requiredSourceKeys.has(page.key) && !successfulSources.has(page.key))
    .map((page) => page.sourceName);
  console.error(`Facebook sync is incomplete. Missing or unreadable source(s): ${missing.join(', ')}.`);
  process.exit(1);
}

if (requireSync && videoMetricsFailures.size) {
  const failed = config.pages
    .filter((page) => requiredSourceKeys.has(page.key) && videoMetricsFailures.has(page.key))
    .map((page) => page.sourceName);
  if (!failed.length) {
    videoMetricsFailures.clear();
  } else {
    console.error(`Top-viewed Reel ranking could not be verified for: ${failed.join(', ')}. The Page token needs video insights access.`);
    process.exit(1);
  }
}

const freshIds = new Set(freshItems.map((item) => item.id));
const freshUrls = new Set(freshItems.map((item) => canonicalUrl(item.sourceUrl)).filter(Boolean));
const preserved = (existing.items || []).filter((item) => {
  if (freshIds.has(item.id) || freshUrls.has(canonicalUrl(item.sourceUrl))) return false;
  if (item.managedBy !== 'facebook-sync' || !successfulSources.has(item.sourceKey)) return true;

  const configured = configuredFeaturedUrls.get(item.sourceKey) || [];
  if (configured.includes(canonicalUrl(item.sourceUrl))) return true;
  return item.featured === true && !featuredResolvedSources.has(item.sourceKey);
});

const sortedCandidates = [...freshItems, ...preserved]
  .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
const detectedFeaturedIds = new Set(
  sortedCandidates.filter((item) => item.featured === true).map((item) => item.id)
);

for (const item of sortedCandidates) {
  if (config.pages.some((page) => page.key === item.sourceKey)) {
    item.featured = false;
    delete item.featuredOrder;
  }
}

const featuredItems = [];
const featuredCandidatesByPage = new Map();
for (const page of config.pages) {
  const candidates = sortedCandidates.filter((item) => item.sourceKey === page.key);
  const configured = configuredFeaturedUrls.get(page.key) || [];
  const configuredIds = configuredFeaturedIds.get(page.key) || [];
  const ordered = [];

  for (const id of configuredIds) {
    const match = candidates.find((item) => item.facebookId === id);
    if (match && !ordered.includes(match)) ordered.push(match);
  }
  for (const url of configured) {
    const match = candidates.find((item) => canonicalUrl(item.sourceUrl) === url);
    if (match && !ordered.includes(match)) ordered.push(match);
  }

  const detected = candidates.filter((item) => freshItems.includes(item) && detectedFeaturedIds.has(item.id));
  for (const match of detected) if (!ordered.includes(match)) ordered.push(match);

  const existingFeaturedIds = new Set((existing.items || [])
    .filter((item) => item.sourceKey === page.key && item.featured === true)
    .map((item) => item.id));
  if (!featuredResolvedSources.has(page.key)) {
    for (const match of candidates.filter((item) => existingFeaturedIds.has(item.id))) {
      if (!ordered.includes(match)) ordered.push(match);
    }
  }

  featuredCandidatesByPage.set(page.key, ordered);
}

for (const [pageIndex, page] of config.pages.entries()) {
  const selected = featuredCandidatesByPage.get(page.key)?.[0];
  if (selected) {
    selected.featured = true;
    selected.featuredOrder = pageIndex + 1;
    featuredItems.push(selected);
  }
}

for (const page of config.pages) {
  if (featuredItems.length >= (config.maxFeaturedItems || 2)) break;
  for (const selected of (featuredCandidatesByPage.get(page.key) || []).slice(1)) {
    if (featuredItems.length >= (config.maxFeaturedItems || 2)) break;
    if (featuredItems.includes(selected)) continue;
    selected.featured = true;
    selected.featuredOrder = featuredItems.length + 1;
    featuredItems.push(selected);
  }
}

const videoCandidates = sortedCandidates.filter((item) => item.mediaType === 'video');
const reelCandidates = videoCandidates.some((item) => item.isReel === true)
  ? videoCandidates.filter((item) => item.isReel === true)
  : videoCandidates;
const topVideos = reelCandidates
  .sort((a, b) => viewCount(b.viewCount) - viewCount(a.viewCount)
    || new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  .slice(0, config.maxVideoItems);
const recentItems = sortedCandidates.slice(0, config.maxFeedItems);
const unavailableSourceItems = preserved.filter((item) => !successfulSources.has(item.sourceKey));
const selectedIds = new Set(
  [...featuredItems, ...topVideos, ...recentItems, ...unavailableSourceItems].map((item) => item.id)
);
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

console.log(
  `Published ${items.length} item(s) from ${successfulSources.size} Facebook source(s); `
  + `${featuredItems.length} pinned item(s) and ${topVideos.length} top-viewed video/Reel item(s) are active.`
);
