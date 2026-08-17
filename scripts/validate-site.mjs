import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const errors = [];
const jsonFiles = [
  'data/recent-updates.json',
  'data/facebook-video-archive.json',
  'data/announcements.json',
  'data/july-resources.json',
  'data/july-36-special.json',
  'data/sovereignty-archive.json',
  'data/blog-posts.json',
  'data/social-publishing-state.json',
  'data/social-review-queue.json',
  'social-feed.config.json',
  'social-publishing.config.json'
];

for (const relativePath of jsonFiles) {
  try {
    JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
  }
}

const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const siteScript = fs.readFileSync(path.join(rootDir, 'js/site.js'), 'utf8');
const markup = html.split('<script>')[0];
for (const id of ['home', 'july-36', 'announcements', 'uprising', 'about', 'pillars', 'updates', 'blog', 'why-join', 'join']) {
  if (!markup.includes(`id="${id}"`)) errors.push(`index.html: missing #${id}`);
}
if (!markup.includes('data-update-filter="featured"')) errors.push('index.html: missing featured updates filter');
if (!html.includes('<script src="js/site.js?v=20260817-barapukuria-name" defer></script>')) {
  errors.push('index.html: missing cache-versioned deferred site interaction script');
}
if (!markup.includes('id="blogMore"')) errors.push('index.html: missing Blog More control');
if (!markup.includes('id="updatesMore"')) errors.push('index.html: missing updates More control');
if (!markup.includes('id="sovereignty"') || !markup.includes('href="sovereignty/"')) {
  errors.push('index.html: missing sovereignty archive gateway or navigation link');
}
for (const contract of [
  'initialBlogLimit = () => mobileBlogQuery.matches ? 3 : 6',
  'initialUpdateLimit = () => mobileUpdatesQuery.matches ? 3 : 6',
  "t('আরও দেখুন')",
  'showingAllArticles',
  'showingAllUpdates'
]) {
  if (!siteScript.includes(contract)) errors.push(`js/site.js: missing responsive content limit contract ${contract}`);
}
if (html.includes('<meta property="og:image" content="https://ncpdagermany.de/img/announcements/rokte-july-2026.webp"')) {
  errors.push('index.html: retired event poster must not be the website Open Graph image');
}
if (!markup.includes('id="blogModalShare"')) {
  errors.push('index.html: missing Blog share panel');
}
for (const shareContract of [
  'articleShareUrl',
  'facebook.com/sharer/sharer.php',
  'wa.me/?text=',
  'twitter.com/intent/tweet',
  'linkedin.com/sharing/share-offsite'
]) {
  if (!siteScript.includes(shareContract)) errors.push(`js/site.js: missing Blog share contract ${shareContract}`);
}
if (!siteScript.includes("activeFilter === 'featured' ? 4 : 6")) {
  errors.push('index.html: recent-update limits must remain 4 featured and 6 other Facebook items');
}
for (const contract of ['function initJuly36Special()', "searchParams.get('july-day')", "timeZone || 'Europe/Berlin'", 'navigator.share', 'new URL(`/july/${day.julyDay}/${languageSuffix}`']) {
  if (!siteScript.includes(contract)) errors.push(`js/site.js: missing 32–36 July contract ${contract}`);
}

const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
for (const id of new Set(ids)) {
  if (ids.filter((candidate) => candidate === id).length > 1) errors.push(`index.html: duplicate id "${id}"`);
}

for (const relativePath of ['data/recent-updates.json', 'data/announcements.json', 'data/blog-posts.json']) {
  const data = JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
  for (const item of data.items || []) {
    if (item.image && !/^https?:|^data:/i.test(item.image) && !fs.existsSync(path.join(rootDir, item.image))) {
      errors.push(`${relativePath}: missing image ${item.image}`);
    }
    if (item.shareImage && !/^https?:|^data:/i.test(item.shareImage) && !fs.existsSync(path.join(rootDir, item.shareImage))) {
      errors.push(`${relativePath}: missing share image ${item.shareImage}`);
    }
    for (const block of item.blocks || []) {
      if (block?.type !== 'image') continue;
      if (!block.src || (!/^https?:|^data:/i.test(block.src) && !fs.existsSync(path.join(rootDir, block.src)))) {
        errors.push(`${relativePath}: missing inline image ${block.src || '(empty)'}`);
      }
      if (!block.credit || !block.sourceUrl) {
        errors.push(`${relativePath}: inline image ${block.src || '(empty)'} must include credit and sourceUrl`);
      }
    }
  }
}

const blogData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/blog-posts.json'), 'utf8'));
for (const article of blogData.items || []) {
  if (!article.imageAlt || !article.imageCredit || !article.license || !article.imageSourceUrl) {
    errors.push(`data/blog-posts.json: ${article.id || '(missing id)'} must include imageAlt, imageCredit, license and imageSourceUrl`);
  }
  try {
    const sourceUrl = new URL(article.imageSourceUrl);
    if (sourceUrl.protocol !== 'https:') throw new Error('Photo source must use HTTPS');
  } catch {
    errors.push(`data/blog-posts.json: ${article.id || '(missing id)'} has an invalid imageSourceUrl`);
  }
  for (const language of ['en', 'de']) {
    if (!article.translations?.[language]?.imageAlt || !article.translations?.[language]?.imageCredit) {
      errors.push(`data/blog-posts.json: ${article.id || '(missing id)'} is missing ${language} photo alt text or credit`);
    }
  }
  if (article.automation) {
    if (article.automation.evidenceScore < 80 || article.automation.factCheckStatus !== 'PASS') {
      errors.push(`data/blog-posts.json: automated article ${article.id || '(missing id)'} fails the publication quality gate`);
    }
    if (!Array.isArray(article.sources) || article.sources.length < 3) {
      errors.push(`data/blog-posts.json: automated article ${article.id || '(missing id)'} needs at least three sources`);
    }
  }
  if (!article.sharePath) continue;
  for (const suffix of ['', 'en', 'de']) {
    const previewPath = path.join(rootDir, article.sharePath, suffix, 'index.html');
    if (!fs.existsSync(previewPath)) {
      errors.push(`data/blog-posts.json: missing generated preview page ${previewPath}`);
      continue;
    }
    const previewHtml = fs.readFileSync(previewPath, 'utf8');
    if (!previewHtml.includes('property="og:type" content="article"')) {
      errors.push(`${previewPath}: missing article Open Graph metadata`);
    }
    if (!previewHtml.includes(`https://ncpdagermany.de/${String(article.shareImage || '').replace(/^\/+/, '')}`)) {
      errors.push(`${previewPath}: missing expected Open Graph image`);
    }
  }
}

for (const asset of ['img/blog/governance-analysis.svg', 'img/blog/governance-analysis-share.jpg']) {
  if (!fs.existsSync(path.join(rootDir, asset))) errors.push(`automated Blog Agent: missing ${asset}`);
}

for (const relativePath of ['sovereignty/index.html', 'sovereignty/archive.js', 'sovereignty/styles.css']) {
  if (!fs.existsSync(path.join(rootDir, relativePath))) errors.push(`sovereignty archive: missing ${relativePath}`);
}
const sovereigntyData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/sovereignty-archive.json'), 'utf8'));
if (!Array.isArray(sovereigntyData.stories) || sovereigntyData.stories.length !== 4) {
  errors.push('data/sovereignty-archive.json: expected four featured histories');
}
if (!Array.isArray(sovereigntyData.borderVictims) || sovereigntyData.borderVictims.length < 20) {
  errors.push('data/sovereignty-archive.json: expected at least 20 sourced border-victim records');
}
for (const story of sovereigntyData.stories || []) {
  if (!story.image || !fs.existsSync(path.resolve(rootDir, 'sovereignty', story.image))) {
    errors.push(`data/sovereignty-archive.json: ${story.id || '(missing id)'} has a missing image`);
  }
  if (!story.imageAlt || !story.credit || !Array.isArray(story.sources) || story.sources.length < 2) {
    errors.push(`data/sovereignty-archive.json: ${story.id || '(missing id)'} needs alt text, credit and at least two sources`);
  }
  for (const language of ['en', 'de']) {
    const translation = story.translations?.[language];
    if (!translation?.opening || !translation?.summary || !translation?.connection || !translation?.known || !translation?.unresolved) {
      errors.push(`data/sovereignty-archive.json: ${story.id || '(missing id)'} is missing the ${language} evidence translation`);
    }
  }
}
for (const record of sovereigntyData.borderVictims || []) {
  if (!record.name || !record.nameLatin || !record.year || !record.district || !/^https:\/\//.test(record.source || '')) {
    errors.push(`data/sovereignty-archive.json: incomplete border-victim record ${record.name || '(missing name)'}`);
  }
}

const july36Data = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/july-36-special.json'), 'utf8'));
const july36Days = Array.isArray(july36Data.days) ? july36Data.days : [];
if (july36Days.length !== 5 || july36Days.map((day) => day.julyDay).join(',') !== '32,33,34,35,36') {
  errors.push('data/july-36-special.json: expected the five chronological days 32–36 July');
}
if (july36Data.schedule?.startMonth !== 8 || july36Data.schedule?.startDay !== 1
  || july36Data.schedule?.endMonth !== 8 || july36Data.schedule?.endDay !== 5) {
  errors.push('data/july-36-special.json: scheduled visibility must remain 1–5 August');
}
for (const day of july36Days) {
  if (!day.image || !fs.existsSync(path.join(rootDir, day.image))) {
    errors.push(`data/july-36-special.json: ${day.id || '(missing id)'} has a missing image`);
  }
  if (!day.imageAlt || !day.imageCredit) {
    errors.push(`data/july-36-special.json: ${day.id || '(missing id)'} needs image alt text and credit`);
  }
  if (!Array.isArray(day.sources) || day.sources.length < 2 || day.sources.some((source) => !/^https:\/\//.test(source.url || ''))) {
    errors.push(`data/july-36-special.json: ${day.id || '(missing id)'} needs at least two HTTPS sources`);
  }
  for (const language of ['en', 'de']) {
    const translation = day.translations?.[language];
    if (!translation?.title || !translation?.summary || !translation?.mantra || !Array.isArray(translation?.sources)) {
      errors.push(`data/july-36-special.json: ${day.id || '(missing id)'} is missing the ${language} translation`);
    }
  }
  const shareImage = path.join(rootDir, 'img', 'july', 'share', `july-${day.julyDay}.jpg`);
  if (!fs.existsSync(shareImage)) {
    errors.push(`data/july-36-special.json: missing July share image ${shareImage}`);
  }
  for (const suffix of ['', 'en', 'de']) {
    const previewPath = path.join(rootDir, 'july', String(day.julyDay), suffix, 'index.html');
    if (!fs.existsSync(previewPath)) {
      errors.push(`data/july-36-special.json: missing generated preview page ${previewPath}`);
      continue;
    }
    const previewHtml = fs.readFileSync(previewPath, 'utf8');
    const expectedUrl = `https://ncpdagermany.de/july/${day.julyDay}/${suffix ? `${suffix}/` : ''}`;
    const expectedImage = `https://ncpdagermany.de/img/july/share/july-${day.julyDay}.jpg`;
    if (!previewHtml.includes('property="og:type" content="article"')) {
      errors.push(`${previewPath}: missing article Open Graph metadata`);
    }
    if (!previewHtml.includes(`property="og:url" content="${expectedUrl}"`)) {
      errors.push(`${previewPath}: missing canonical Open Graph URL`);
    }
    if (!previewHtml.includes(`property="og:image" content="${expectedImage}"`)) {
      errors.push(`${previewPath}: missing expected Open Graph image`);
    }
    if (!previewHtml.includes('name="twitter:card" content="summary_large_image"')) {
      errors.push(`${previewPath}: missing large-image X card metadata`);
    }
  }
}

const recentUpdates = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/recent-updates.json'), 'utf8'));
const featuredBySource = new Map();
for (const item of (recentUpdates.items || []).filter((candidate) => candidate.featured === true)) {
  try {
    const hostname = new URL(item.sourceUrl).hostname;
    if (!/(^|\.)facebook\.com$/i.test(hostname)) errors.push(`data/recent-updates.json: featured item ${item.id} is not linked to Facebook`);
  } catch {
    errors.push(`data/recent-updates.json: featured item ${item.id} has an invalid sourceUrl`);
  }
  featuredBySource.set(item.sourceKey, (featuredBySource.get(item.sourceKey) || 0) + 1);
}
const featuredCount = [...featuredBySource.values()].reduce((sum, count) => sum + count, 0);
if (featuredCount > 4) errors.push(`data/recent-updates.json: ${featuredCount} featured items found; at most four are allowed`);

const socialConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'social-feed.config.json'), 'utf8'));
if (socialConfig.maxFeedItems !== 6) errors.push('social-feed.config.json: maxFeedItems must be 6');
if (socialConfig.maxFeaturedItems !== 4) errors.push('social-feed.config.json: maxFeaturedItems must be 4');
if (socialConfig.maxVideoItems !== 6) errors.push('social-feed.config.json: maxVideoItems must be 6');
if (socialConfig.videoArchiveMaxItems < socialConfig.maxVideoItems) {
  errors.push('social-feed.config.json: videoArchiveMaxItems must cover the displayed video count');
}

const publishingConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'social-publishing.config.json'), 'utf8'));
if (publishingConfig.policy?.facebook !== 'automatic') {
  errors.push('social-publishing.config.json: Facebook-origin posts must remain automatic');
}
if (publishingConfig.policy?.blog !== 'approval-required') {
  errors.push('social-publishing.config.json: Blog-origin posts must remain approval-required');
}
for (const platform of ['x', 'tiktok']) {
  if (!publishingConfig.platforms?.includes(platform)) {
    errors.push(`social-publishing.config.json: missing ${platform} platform`);
  }
}

const socialQueue = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/social-review-queue.json'), 'utf8'));
const queueIds = new Set();
for (const item of socialQueue.items || []) {
  if (!item.id || queueIds.has(item.id)) errors.push(`data/social-review-queue.json: duplicate or missing queue id ${item.id || '(empty)'}`);
  queueIds.add(item.id);
  const expectedApproval = item.sourceType === 'facebook' ? 'automatic' : item.sourceType === 'blog' ? 'required' : null;
  if (!expectedApproval || item.approval !== expectedApproval) {
    errors.push(`data/social-review-queue.json: ${item.id || '(missing id)'} violates the source approval policy`);
  }
  for (const platform of ['x', 'tiktok']) {
    if (!item.platforms?.[platform]) errors.push(`data/social-review-queue.json: ${item.id || '(missing id)'} is missing ${platform} draft`);
  }
}

if (/example\.com|images\.unsplash\.com/i.test(html)) errors.push('index.html: placeholder or stock-demo URL found');

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${jsonFiles.length} JSON files, ${ids.length} HTML ids, required sections, and local content images.`);
