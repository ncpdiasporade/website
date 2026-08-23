import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const paths = {
  config: resolvePath(process.env.SOCIAL_CONFIG_PATH || 'social-publishing.config.json'),
  queue: resolvePath(process.env.SOCIAL_QUEUE_PATH || 'data/social-review-queue.json'),
  state: resolvePath(process.env.SOCIAL_STATE_PATH || 'data/social-publishing-state.json'),
  facebook: resolvePath(process.env.SOCIAL_FACEBOOK_PATH || 'data/recent-updates.json'),
  blogs: resolvePath(process.env.SOCIAL_BLOG_PATH || 'data/blog-posts.json'),
  outbound: resolvePath(process.env.SOCIAL_OUTBOUND_DIR || 'img/social/outbound')
};

const config = readJson(paths.config);
const args = parseArgs(process.argv.slice(3));
const command = process.argv[2] || 'status';
const now = () => new Date().toISOString();
const terminalPlatformStatuses = new Set(['published', 'submitted', 'skipped', 'draft-ready']);

function platformPublishingMode(platformName) {
  return String(config[platformName]?.publishingMode || 'automatic');
}

function tiktokProductionApproved() {
  return process.env.TIKTOK_PRODUCTION_APPROVED === 'true'
    || process.env.SOCIAL_MOCK_PUBLISHING === 'true';
}

function resolvePath(value) {
  const resolved = path.resolve(rootDir, String(value || ''));
  const allowedRoots = [rootDir];
  if (process.env.SOCIAL_TEST_MODE === 'true' || process.env.SOCIAL_ADMIN_MODE === 'true') allowedRoots.push(path.resolve(os.tmpdir()));
  if (!allowedRoots.some((allowedRoot) => isPathInside(allowedRoot, resolved))) {
    throw new Error('Social publishing paths must stay inside the repository.');
  }
  return resolved;
}

function isPathInside(allowedRoot, candidate) {
  const relative = path.relative(allowedRoot, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function runnerOutputPath(value, label) {
  const candidate = path.resolve(String(value || ''));
  const allowedRoots = [];
  if (process.env.RUNNER_TEMP) allowedRoots.push(path.resolve(process.env.RUNNER_TEMP));
  if (process.env.SOCIAL_TEST_MODE === 'true') allowedRoots.push(path.resolve(os.tmpdir()));
  if (!allowedRoots.some((allowedRoot) => isPathInside(allowedRoot, candidate))) {
    throw new Error(`${label} must stay inside the GitHub Actions temporary directory.`);
  }
  return candidate;
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) {
    if (fallback !== undefined) return structuredClone(fallback);
    throw new Error(`Missing JSON file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function parseArgs(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 1) {
    const token = values[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = values[index + 1];
    if (!next || next.startsWith('--')) result[key] = true;
    else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function clipAtWord(value, maximum) {
  const text = clean(value);
  if (text.length <= maximum) return text;
  const sample = text.slice(0, maximum + 1);
  const lastSpace = sample.lastIndexOf(' ');
  return `${sample.slice(0, lastSpace > maximum * 0.65 ? lastSpace : maximum).trim()}…`;
}

function fingerprint(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function safeId(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100);
}

function publicUrl(relativePath) {
  return new URL(String(relativePath || '').replace(/^\/+/, ''), `${config.siteUrl.replace(/\/$/, '')}/`).href;
}

function localRelativePath(absolutePath) {
  return path.relative(rootDir, absolutePath).split(path.sep).join('/');
}

function publishedAt(record, sourceType) {
  return sourceType === 'facebook'
    ? record.createdAt || record.created_time || null
    : record.publishedAt || null;
}

function sourceRecords() {
  const facebook = readJson(paths.facebook, { items: [] });
  const blogs = readJson(paths.blogs, { items: [] });
  const allowedFacebookSources = new Set(config.facebookSourceKeys || ['germany']);
  const records = [];

  for (const item of facebook.items || []) {
    if (item.status !== 'published' || !allowedFacebookSources.has(item.sourceKey)) continue;
    const sourceId = item.facebookId || item.id;
    records.push({
      sourceType: 'facebook',
      sourceId: String(sourceId),
      sourceKey: `facebook:${item.sourceKey}:${sourceId}`,
      sourceCreatedAt: publishedAt(item, 'facebook'),
      approval: 'automatic',
      item
    });
  }

  for (const item of blogs.items || []) {
    if (item.status !== 'published') continue;
    const sourceId = item.slug || item.id;
    records.push({
      sourceType: 'blog',
      sourceId: String(sourceId),
      sourceKey: `blog:${sourceId}`,
      sourceCreatedAt: publishedAt(item, 'blog'),
      approval: 'required',
      item
    });
  }

  return records.sort((a, b) => new Date(a.sourceCreatedAt || 0) - new Date(b.sourceCreatedAt || 0));
}

function sourceFingerprint(record) {
  if (record.sourceType === 'facebook') return fingerprint({ id: record.sourceId });
  const item = record.item;
  return fingerprint({
    id: record.sourceId,
    title: item.title,
    excerpt: item.excerpt,
    image: item.shareImage || item.image,
    publishedAt: item.publishedAt
  });
}

function articleUrl(item) {
  if (item.sharePath) return publicUrl(`${String(item.sharePath).replace(/^\/+|\/+$/g, '')}/`);
  return `${config.siteUrl}/?blog=${encodeURIComponent(item.slug || item.id)}#blog`;
}

function xDraft(title, excerpt, url) {
  const hashtags = (config.x?.hashtags || []).join(' ');
  const reservedLinkLength = 23;
  const separators = 2 + (hashtags ? hashtags.length + 1 : 0);
  const maximum = Number(config.x?.maximumCharacters || 280) - reservedLinkLength - separators;
  const titleText = clean(title);
  const excerptText = clean(excerpt);
  let body = titleText;
  if (excerptText && excerptText !== titleText) {
    const remaining = maximum - titleText.length - 2;
    if (remaining > 40) body = `${titleText}\n\n${clipAtWord(excerptText, remaining)}`;
  }
  body = clipAtWord(body, maximum);
  return [body, url, hashtags].filter(Boolean).join('\n');
}

function tiktokDraft(title, excerpt, url, imageCredit = '') {
  const hashtags = (config.tiktok?.hashtags || []).join(' ');
  const credit = imageCredit ? `ছবির কৃতজ্ঞতা: ${clipAtWord(imageCredit.replace(/^.*?ছবি:\s*/u, ''), 180)}` : '';
  return [clipAtWord(title, 150), clipAtWord(excerpt, 700), `বিস্তারিত: ${url}`, credit, hashtags]
    .filter(Boolean)
    .join('\n\n');
}

function escapeXml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapWords(value, maximumCharacters, maximumLines) {
  const words = clean(value).split(' ').filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maximumCharacters) current = candidate;
    else {
      if (current) lines.push(current);
      current = word;
      if (lines.length >= maximumLines) break;
    }
  }
  if (current && lines.length < maximumLines) lines.push(current);
  if (words.join(' ').length > lines.join(' ').length && lines.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.…]+$/u, '')}…`;
  }
  return lines;
}

function textCardSvg(width, height, title, excerpt) {
  const titleLines = wrapWords(title, width > height ? 42 : 29, width > height ? 3 : 6);
  const excerptLines = wrapWords(excerpt, width > height ? 72 : 46, width > height ? 2 : 5);
  const titleSize = width > height ? 54 : 64;
  const bodySize = width > height ? 27 : 34;
  const startY = width > height ? 190 : 285;
  const titleSpans = titleLines.map((line, index) => (
    `<tspan x="${Math.round(width * 0.09)}" dy="${index ? Math.round(titleSize * 1.38) : 0}">${escapeXml(line)}</tspan>`
  )).join('');
  const bodyY = startY + titleLines.length * titleSize * 1.38 + 46;
  const bodySpans = excerptLines.map((line, index) => (
    `<tspan x="${Math.round(width * 0.09)}" dy="${index ? Math.round(bodySize * 1.58) : 0}">${escapeXml(line)}</tspan>`
  )).join('');
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#071f18"/>
          <stop offset="0.58" stop-color="#0d4935"/>
          <stop offset="1" stop-color="#11372e"/>
        </linearGradient>
        <radialGradient id="light" cx="82%" cy="12%" r="70%">
          <stop offset="0" stop-color="#2f8f66" stop-opacity=".48"/>
          <stop offset="1" stop-color="#2f8f66" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#light)"/>
      <rect x="${Math.round(width * 0.09)}" y="${Math.round(height * 0.09)}" width="86" height="9" rx="4" fill="#e44336"/>
      <text x="${Math.round(width * 0.09)}" y="${Math.round(height * 0.14)}" fill="#bde4d4" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.021)}" font-weight="700" letter-spacing="1.4">NCP DIASPORA ALLIANCE · GERMANY</text>
      <text x="${Math.round(width * 0.09)}" y="${startY}" fill="#ffffff" font-family="Noto Sans Bengali, Kohinoor Bangla, Arial Unicode MS, sans-serif" font-size="${titleSize}" font-weight="700">${titleSpans}</text>
      <text x="${Math.round(width * 0.09)}" y="${bodyY}" fill="#d7e9e2" font-family="Noto Sans Bengali, Kohinoor Bangla, Arial Unicode MS, sans-serif" font-size="${bodySize}" font-weight="400">${bodySpans}</text>
      <text x="${Math.round(width * 0.09)}" y="${Math.round(height * 0.92)}" fill="#9ccbbb" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.019)}">ncpdagermany.de</text>
    </svg>
  `);
}

async function renderSourceMedia(inputPath, outputPath, width, height) {
  const image = sharp(inputPath).rotate();
  const background = await image.clone()
    .resize(width, height, { fit: 'cover' })
    .blur(22)
    .modulate({ brightness: 0.52, saturation: 0.72 })
    .jpeg({ quality: 84 })
    .toBuffer();
  const foreground = await image.clone()
    .resize({ width: Math.round(width * 0.9), height: Math.round(height * 0.86), fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toBuffer();
  const metadata = await sharp(foreground).metadata();
  await sharp(background)
    .composite([{
      input: foreground,
      left: Math.round((width - metadata.width) / 2),
      top: Math.round((height - metadata.height) / 2)
    }])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outputPath);
}

async function materializeMedia(queueId, title, excerpt, sourceImage) {
  fs.mkdirSync(paths.outbound, { recursive: true });
  const stem = safeId(queueId);
  const xPath = path.join(paths.outbound, `${stem}-x.jpg`);
  const tiktokPath = path.join(paths.outbound, `${stem}-tiktok.jpg`);
  const inputPath = sourceImage && !/^https?:/i.test(sourceImage) ? resolvePath(sourceImage) : null;

  if (inputPath && fs.existsSync(inputPath)) {
    await renderSourceMedia(inputPath, xPath, 1200, 675);
    await renderSourceMedia(inputPath, tiktokPath, 1080, 1350);
  } else {
    await sharp(textCardSvg(1200, 675, title, excerpt)).jpeg({ quality: 90, mozjpeg: true }).toFile(xPath);
    await sharp(textCardSvg(1080, 1350, title, excerpt)).jpeg({ quality: 90, mozjpeg: true }).toFile(tiktokPath);
  }
  return {
    x: localRelativePath(xPath),
    tiktok: localRelativePath(tiktokPath)
  };
}

async function queueRecord(record, sourceHash) {
  const item = record.item;
  const isBlog = record.sourceType === 'blog';
  const sourceCaption = isBlog ? '' : clean(item.sourceCaption);
  const firstSourceSentence = sourceCaption.split(/(?<=[।!?])\s+/u)[0];
  const title = isBlog
    ? clean(item.title || 'NCP Diaspora Alliance Germany আপডেট')
    : clipAtWord(firstSourceSentence || item.title || 'NCP Diaspora Alliance Germany আপডেট', 150);
  const excerpt = isBlog ? clean(item.excerpt || title) : (sourceCaption || clean(item.excerpt || title));
  const url = isBlog ? articleUrl(item) : item.sourceUrl;
  const image = isBlog ? (item.shareImage || item.image) : item.image;
  const queueId = `${record.sourceType}-${safeId(record.sourceId)}-${sourceHash.slice(0, 10)}`;
  const media = await materializeMedia(queueId, title, excerpt, image);
  const xStatus = platformPublishingMode('x') === 'draft-only'
    ? (record.approval === 'required' ? 'awaiting-approval' : 'draft-ready')
    : 'pending';
  return {
    id: queueId,
    sourceType: record.sourceType,
    sourceId: record.sourceId,
    sourceKey: record.sourceKey,
    sourceFingerprint: sourceHash,
    sourceCreatedAt: record.sourceCreatedAt,
    sourceUrl: url,
    sourceName: isBlog ? 'NCPDA Germany Blog' : item.sourceName,
    approval: record.approval,
    approvalStatus: record.approval === 'required' ? 'awaiting-approval' : 'not-required',
    status: record.approval === 'required' ? 'awaiting-approval' : 'pending',
    createdAt: now(),
    updatedAt: now(),
    title,
    excerpt,
    sourceCaption: sourceCaption || null,
    image: image || null,
    imageCredit: isBlog ? item.imageCredit || null : null,
    imageSourceUrl: isBlog ? item.imageSourceUrl || null : null,
    platforms: {
      x: {
        status: xStatus,
        attempts: 0,
        text: xDraft(title, excerpt, url),
        mediaPath: media.x
      },
      tiktok: {
        status: tiktokProductionApproved() ? 'pending' : 'blocked',
        attempts: 0,
        title: clipAtWord(title, 90),
        description: tiktokDraft(title, excerpt, url, isBlog ? item.imageCredit : ''),
        mediaPaths: [media.tiktok],
        ...(tiktokProductionApproved() ? {} : { blockReason: 'production-approval-required' })
      }
    }
  };
}

function applyPublishingModes(queue) {
  let changed = false;
  for (const item of queue.items || []) {
    let itemChanged = false;
    const xPlatform = item.platforms?.x;
    if (platformPublishingMode('x') === 'draft-only'
      && xPlatform
      && !['published', 'submitted', 'skipped', 'draft-ready'].includes(xPlatform.status)) {
      xPlatform.status = item.approval === 'required' && item.approvalStatus !== 'approved'
        ? 'awaiting-approval'
        : 'draft-ready';
      xPlatform.attempts = 0;
      delete xPlatform.blockReason;
      delete xPlatform.claimId;
      delete xPlatform.claimedAt;
      delete xPlatform.lastAttemptAt;
      delete xPlatform.lastError;
      itemChanged = true;
    }

    const tiktokPlatform = item.platforms?.tiktok;
    if (!tiktokProductionApproved()
      && tiktokPlatform
      && !['published', 'submitted', 'skipped'].includes(tiktokPlatform.status)
      && (tiktokPlatform.status !== 'blocked' || tiktokPlatform.blockReason !== 'production-approval-required')) {
      tiktokPlatform.status = 'blocked';
      tiktokPlatform.blockReason = 'production-approval-required';
      tiktokPlatform.attempts = 0;
      delete tiktokPlatform.claimId;
      delete tiktokPlatform.claimedAt;
      delete tiktokPlatform.lastAttemptAt;
      delete tiktokPlatform.lastError;
      itemChanged = true;
    }

    if (itemChanged) {
      item.status = recalculateItemStatus(item);
      item.updatedAt = now();
      changed = true;
    }
  }
  return changed;
}

function loadState() {
  return readJson(paths.state, {
    version: 1,
    initializedAt: null,
    updatedAt: null,
    knownSources: {},
    publications: []
  });
}

function loadQueue() {
  return readJson(paths.queue, { version: 1, updatedAt: null, items: [] });
}

function recalculateItemStatus(item) {
  const statuses = Object.values(item.platforms || {}).map((platform) => platform.status);
  if (statuses.length && statuses.every((status) => terminalPlatformStatuses.has(status))) return 'completed';
  if (statuses.some((status) => status === 'publishing')) return 'publishing';
  if (item.approval === 'required' && item.approvalStatus !== 'approved') return 'awaiting-approval';
  if (statuses.some((status) => status === 'blocked')) return 'blocked';
  if (statuses.some((status) => status === 'failed')) return 'failed';
  return 'pending';
}

async function seed() {
  const state = loadState();
  if (state.initializedAt && !args.force) {
    throw new Error(`Social publishing is already initialized at ${state.initializedAt}. Use --force only for an intentional re-baseline.`);
  }
  state.initializedAt = now();
  state.updatedAt = state.initializedAt;
  state.knownSources = {};
  for (const record of sourceRecords()) state.knownSources[record.sourceKey] = sourceFingerprint(record);
  state.publications ||= [];
  writeJson(paths.state, state);
  const queue = loadQueue();
  queue.updatedAt = state.updatedAt;
  queue.items ||= [];
  writeJson(paths.queue, queue);
  console.log(`Established a no-backfill baseline for ${Object.keys(state.knownSources).length} existing source item(s).`);
}

async function prepare() {
  const state = loadState();
  if (!state.initializedAt) throw new Error('Run social:seed once before preparing posts.');
  const queue = loadQueue();
  const queuedFingerprints = new Set((queue.items || []).map((item) => `${item.sourceKey}:${item.sourceFingerprint}`));
  let created = 0;
  let changed = applyPublishingModes(queue);

  for (const record of sourceRecords()) {
    const sourceHash = sourceFingerprint(record);
    const previousHash = state.knownSources[record.sourceKey];
    const changedBlog = record.sourceType === 'blog' && previousHash && previousHash !== sourceHash;
    if (previousHash && !changedBlog) continue;
    if (queuedFingerprints.has(`${record.sourceKey}:${sourceHash}`)) continue;

    const sourceTime = new Date(record.sourceCreatedAt || 0).getTime();
    const initializedTime = new Date(state.initializedAt).getTime();
    if (!previousHash && Number.isFinite(sourceTime) && sourceTime <= initializedTime) {
      state.knownSources[record.sourceKey] = sourceHash;
      changed = true;
      continue;
    }

    const queued = await queueRecord(record, sourceHash);
    queue.items.push(queued);
    queuedFingerprints.add(`${record.sourceKey}:${sourceHash}`);
    state.knownSources[record.sourceKey] = sourceHash;
    created += 1;
    changed = true;
  }

  if (!changed) {
    console.log('Prepared 0 new social item(s): the queue and baseline are unchanged.');
    return;
  }
  const timestamp = now();
  queue.updatedAt = timestamp;
  state.updatedAt = timestamp;
  queue.items = queue.items.slice(-500);
  writeJson(paths.queue, queue);
  writeJson(paths.state, state);
  console.log(`Prepared ${created} new social item(s): Facebook items are automatic; blog items await explicit approval.`);
}

function availablePlatforms() {
  return {
    x: platformPublishingMode('x') !== 'draft-only'
      && Boolean(process.env.X_API_KEY && process.env.X_API_SECRET && process.env.X_ACCESS_TOKEN && process.env.X_ACCESS_TOKEN_SECRET),
    tiktok: tiktokProductionApproved() && Boolean(
      process.env.TIKTOK_ACCESS_TOKEN
      || (process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET && process.env.TIKTOK_REFRESH_TOKEN)
    )
  };
}

function requestedPlatforms() {
  const requested = String(args.platforms || process.env.SOCIAL_PLATFORMS || config.platforms?.join(',') || 'x,tiktok')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(requested)].filter((value) => (config.platforms || []).includes(value));
}

function applyOverrides(item) {
  const xText = args['x-text'] || process.env.SOCIAL_X_TEXT_OVERRIDE;
  const tiktokDescription = args['tiktok-description'] || process.env.SOCIAL_TIKTOK_DESCRIPTION_OVERRIDE;
  if (xText) item.platforms.x.text = String(xText).trim();
  if (tiktokDescription) item.platforms.tiktok.description = String(tiktokDescription).trim();
}

async function claim() {
  const queue = loadQueue();
  const claimId = String(args['claim-id'] || process.env.GITHUB_RUN_ID || `local-${Date.now()}`);
  const approvalMode = String(args.approval || 'automatic');
  const itemSelector = String(args.item || process.env.SOCIAL_ITEM || '').trim();
  const credentials = availablePlatforms();
  const platforms = requestedPlatforms();
  const maximum = approvalMode === 'automatic' ? Number(config.maximumAutomaticItemsPerRun || 3) : 1;
  let claimedItems = 0;

  if (approvalMode === 'required' && process.env.SOCIAL_APPROVAL_CONFIRMED !== 'true') {
    throw new Error('Blog publishing requires SOCIAL_APPROVAL_CONFIRMED=true from the manual approval workflow.');
  }

  for (const item of queue.items || []) {
    if (claimedItems >= maximum) break;
    if (approvalMode === 'automatic' && item.approval !== 'automatic') continue;
    if (approvalMode === 'required' && item.approval !== 'required') continue;
    if (itemSelector && item.id !== itemSelector && item.sourceId !== itemSelector) continue;

    const claimablePlatforms = platforms.filter((platformName) => {
      const platform = item.platforms?.[platformName];
      if (!platform) return false;
      if (platformPublishingMode(platformName) === 'draft-only') {
        return approvalMode === 'required' && platform.status === 'awaiting-approval';
      }
      if (terminalPlatformStatuses.has(platform.status) || platform.status === 'publishing' || platform.status === 'blocked') return false;
      if ((platform.attempts || 0) >= Number(config.maximumAttemptsPerPlatform || 3)) return false;
      return credentials[platformName] || process.env.SOCIAL_MOCK_PUBLISHING === 'true';
    });
    if (!claimablePlatforms.length) continue;

    if (approvalMode === 'required') {
      item.approvalStatus = 'approved';
      item.approvedAt = now();
      item.approvedBy = process.env.GITHUB_ACTOR || 'manual-workflow';
      applyOverrides(item);
    }

    let platformClaims = 0;
    for (const platformName of claimablePlatforms) {
      const platform = item.platforms?.[platformName];
      if (platformPublishingMode(platformName) === 'draft-only') {
        platform.status = 'draft-ready';
        platform.draftApprovedAt = now();
        delete platform.claimId;
        delete platform.claimedAt;
      } else {
        platform.status = 'publishing';
        platform.claimId = claimId;
        platform.claimedAt = now();
      }
      platformClaims += 1;
    }
    if (platformClaims) {
      item.status = recalculateItemStatus(item);
      item.updatedAt = now();
      claimedItems += 1;
    }
  }

  if (approvalMode === 'required' && itemSelector && !claimedItems) {
    throw new Error(`No publishable blog queue item matched "${itemSelector}". Check the queue ID, credentials, and platform status.`);
  }
  if (claimedItems) {
    queue.updatedAt = now();
    writeJson(paths.queue, queue);
  }
  console.log(`Claimed ${claimedItems} item(s) as ${claimId}. Missing platform credentials remain safely pending.`);
}

function percentEncode(value) {
  return encodeURIComponent(String(value)).replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

function oauth1Header(method, urlString) {
  const oauth = {
    oauth_consumer_key: process.env.X_API_KEY,
    oauth_nonce: crypto.randomBytes(18).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: process.env.X_ACCESS_TOKEN,
    oauth_version: '1.0'
  };
  const url = new URL(urlString);
  const parameters = [...url.searchParams.entries(), ...Object.entries(oauth)]
    .map(([key, value]) => [percentEncode(key), percentEncode(value)])
    .sort(([aKey, aValue], [bKey, bValue]) => aKey.localeCompare(bKey) || aValue.localeCompare(bValue));
  const normalized = parameters.map(([key, value]) => `${key}=${value}`).join('&');
  const baseUrl = `${url.protocol}//${url.host}${url.pathname}`;
  const signatureBase = [method.toUpperCase(), percentEncode(baseUrl), percentEncode(normalized)].join('&');
  const signingKey = `${percentEncode(process.env.X_API_SECRET)}&${percentEncode(process.env.X_ACCESS_TOKEN_SECRET)}`;
  oauth.oauth_signature = crypto.createHmac('sha1', signingKey).update(signatureBase).digest('base64');
  return `OAuth ${Object.entries(oauth).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`).join(', ')}`;
}

async function responseJson(response, platformName) {
  const text = await response.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: clipAtWord(text, 300) };
  }
  if (!response.ok || payload.errors?.length || (payload.error && payload.error.code && payload.error.code !== 'ok')) {
    throw new Error(`${platformName} API returned ${response.status}: ${clipAtWord(JSON.stringify(payload), 500)}`);
  }
  return payload;
}

function mimeTypeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.png') return 'image/png';
  if (extension === '.webp') return 'image/webp';
  return 'image/jpeg';
}

async function publishToX(platform) {
  if (process.env.SOCIAL_MOCK_PUBLISHING === 'true') {
    const id = `mock-x-${Date.now()}`;
    return { id, url: `https://x.com/i/web/status/${id}` };
  }
  let mediaId;
  if (platform.mediaPath) {
    const mediaUrl = 'https://upload.twitter.com/1.1/media/upload.json';
    const absoluteMediaPath = resolvePath(platform.mediaPath);
    const form = new FormData();
    form.append('media', new Blob([fs.readFileSync(absoluteMediaPath)], { type: mimeTypeFor(absoluteMediaPath) }), path.basename(absoluteMediaPath));
    const upload = await fetch(mediaUrl, {
      method: 'POST',
      headers: { Authorization: oauth1Header('POST', mediaUrl) },
      body: form,
      signal: AbortSignal.timeout(60000)
    });
    const uploadPayload = await responseJson(upload, 'X media');
    mediaId = uploadPayload.media_id_string || uploadPayload.media_id;
  }

  const postUrl = 'https://api.x.com/2/tweets';
  const response = await fetch(postUrl, {
    method: 'POST',
    headers: {
      Authorization: oauth1Header('POST', postUrl),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: platform.text,
      ...(mediaId ? { media: { media_ids: [String(mediaId)] } } : {})
    }),
    signal: AbortSignal.timeout(60000)
  });
  const payload = await responseJson(response, 'X');
  const id = payload.data?.id;
  if (!id) throw new Error('X API did not return a post ID.');
  return { id, url: `https://x.com/i/web/status/${id}`, mediaId: mediaId ? String(mediaId) : null };
}

async function refreshTikTokToken() {
  if (process.env.TIKTOK_ACCESS_TOKEN) return process.env.TIKTOK_ACCESS_TOKEN;
  const body = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: process.env.TIKTOK_REFRESH_TOKEN
  });
  const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(30000)
  });
  const payload = await responseJson(response, 'TikTok OAuth');
  if (!payload.access_token) throw new Error('TikTok OAuth did not return an access token.');
  if (payload.refresh_token && payload.refresh_token !== process.env.TIKTOK_REFRESH_TOKEN && process.env.TIKTOK_REFRESH_TOKEN_OUTPUT) {
    fs.writeFileSync(runnerOutputPath(process.env.TIKTOK_REFRESH_TOKEN_OUTPUT, 'TikTok refresh-token output'), payload.refresh_token, { mode: 0o600 });
  }
  return payload.access_token;
}

async function auth() {
  if (!availablePlatforms().tiktok) {
    console.log(tiktokProductionApproved()
      ? 'TikTok credentials are not configured; token preparation skipped.'
      : 'TikTok production publishing is not approved; token preparation skipped.');
    return;
  }
  const token = await refreshTikTokToken();
  if (process.env.TIKTOK_ACCESS_TOKEN_OUTPUT) {
    fs.writeFileSync(runnerOutputPath(process.env.TIKTOK_ACCESS_TOKEN_OUTPUT, 'TikTok access-token output'), token, { mode: 0o600 });
  }
  console.log('TikTok access token prepared without exposing it to logs.');
}

async function tiktokRequest(endpoint, token, body) {
  const response = await fetch(`https://open.tiktokapis.com${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000)
  });
  return responseJson(response, 'TikTok');
}

async function ensurePublicMedia(url) {
  if (process.env.SOCIAL_MOCK_PUBLISHING === 'true') return;
  const maximumWaitMs = Number(process.env.SOCIAL_MEDIA_WAIT_MS || 240000);
  const started = Date.now();
  let lastStatus = 0;
  while (Date.now() - started < maximumWaitMs) {
    try {
      const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
      lastStatus = response.status;
      if (response.ok) return;
    } catch {
      lastStatus = 0;
    }
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  throw new Error(`Outbound media is not live yet (${lastStatus || 'network error'}): ${url}`);
}

async function uploadTikTokVideo(platform, token, privacyLevel) {
  const videoPath = path.resolve(String(platform.videoPath || ''));
  if (!isPathInside(rootDir, videoPath) && !isPathInside(path.resolve(os.tmpdir()), videoPath)) {
    throw new Error('TikTok video path escaped the approved workspace.');
  }
  const stat = fs.statSync(videoPath);
  if (!stat.isFile() || stat.size < 1) throw new Error('TikTok video file is empty or unavailable.');

  const chunkSize = Math.min(stat.size, 10 * 1024 * 1024);
  const totalChunks = Math.ceil(stat.size / chunkSize);
  const payload = await tiktokRequest('/v2/post/publish/video/init/', token, {
    post_info: {
      title: clipAtWord(platform.description || platform.title, 2200),
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      privacy_level: privacyLevel,
      video_cover_timestamp_ms: 1000
    },
    source_info: {
      source: 'FILE_UPLOAD',
      video_size: stat.size,
      chunk_size: chunkSize,
      total_chunk_count: totalChunks
    }
  });
  const publishId = payload.data?.publish_id;
  const uploadUrl = payload.data?.upload_url;
  if (!publishId || !uploadUrl) throw new Error('TikTok API did not return a video upload target.');
  const parsedUploadUrl = new URL(uploadUrl);
  if (parsedUploadUrl.protocol !== 'https:' || parsedUploadUrl.hostname !== 'open-upload.tiktokapis.com') {
    throw new Error('TikTok returned an untrusted video upload target.');
  }

  const handle = fs.openSync(videoPath, 'r');
  try {
    for (let offset = 0; offset < stat.size; offset += chunkSize) {
      const length = Math.min(chunkSize, stat.size - offset);
      const chunk = Buffer.allocUnsafe(length);
      fs.readSync(handle, chunk, 0, length, offset);
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': platform.mimeType || 'video/mp4',
          'Content-Length': String(length),
          'Content-Range': `bytes ${offset}-${offset + length - 1}/${stat.size}`
        },
        body: chunk,
        signal: AbortSignal.timeout(120000)
      });
      if (!response.ok) throw new Error(`TikTok video upload failed (${response.status}).`);
    }
  } finally {
    fs.closeSync(handle);
  }
  return { publishId, status: 'submitted' };
}

async function publishToTikTok(platform) {
  if (process.env.SOCIAL_MOCK_PUBLISHING === 'true') {
    return { publishId: `mock-tiktok-${Date.now()}`, status: 'submitted' };
  }
  const token = await refreshTikTokToken();
  const creator = await tiktokRequest('/v2/post/publish/creator_info/query/', token, {});
  const privacyLevel = String(process.env.TIKTOK_PRIVACY_LEVEL || config.tiktok?.privacyLevel || 'PUBLIC_TO_EVERYONE');
  const availablePrivacy = creator.data?.privacy_level_options || [];
  if (!availablePrivacy.includes(privacyLevel)) {
    throw new Error(`TikTok creator does not currently allow privacy level ${privacyLevel}. Available: ${availablePrivacy.join(', ')}`);
  }
  if (platform.videoPath) return uploadTikTokVideo(platform, token, privacyLevel);
  const photoUrls = (platform.mediaPaths || []).map(publicUrl);
  for (const photoUrl of photoUrls) await ensurePublicMedia(photoUrl);
  const payload = await tiktokRequest('/v2/post/publish/content/init/', token, {
    post_info: {
      title: platform.title,
      description: platform.description,
      disable_comment: false,
      privacy_level: privacyLevel,
      auto_add_music: Boolean(config.tiktok?.autoAddMusic)
    },
    source_info: {
      source: 'PULL_FROM_URL',
      photo_cover_index: 0,
      photo_images: photoUrls
    },
    post_mode: 'DIRECT_POST',
    media_type: 'PHOTO'
  });
  const publishId = payload.data?.publish_id;
  if (!publishId) throw new Error('TikTok API did not return a publish ID.');
  return { publishId, status: 'submitted' };
}

function redactedError(error) {
  let message = String(error?.message || error || 'Unknown publishing error');
  for (const key of Object.keys(process.env)) {
    if (!/(TOKEN|SECRET|API_KEY)/i.test(key)) continue;
    const secret = process.env[key];
    if (secret && secret.length > 8) message = message.replaceAll(secret, '[redacted]');
  }
  return clipAtWord(message, 700);
}

function blockingPlatformReason(platformName, error) {
  const message = String(error?.message || error || '');
  if (platformName === 'x' && /(credits depleted|credits-depleted|payment required)/i.test(message)) {
    return 'credits-depleted';
  }
  return null;
}

function recordPublication(state, item, platformName, result) {
  state.publications ||= [];
  state.publications.push({
    queueId: item.id,
    sourceType: item.sourceType,
    sourceId: item.sourceId,
    platform: platformName,
    publishedAt: now(),
    ...result
  });
  state.publications = state.publications.slice(-1000);
}

async function execute() {
  const queue = loadQueue();
  const state = loadState();
  const claimId = String(args['claim-id'] || process.env.GITHUB_RUN_ID || '');
  if (!claimId) throw new Error('execute requires --claim-id.');
  let attempted = 0;
  let failures = 0;

  for (const item of queue.items || []) {
    for (const [platformName, platform] of Object.entries(item.platforms || {})) {
      if (platform.status !== 'publishing' || platform.claimId !== claimId) continue;
      attempted += 1;
      platform.attempts = Number(platform.attempts || 0) + 1;
      platform.lastAttemptAt = now();
      try {
        if (platformName === 'x') {
          const result = await publishToX(platform);
          platform.status = 'published';
          platform.postId = result.id;
          platform.postUrl = result.url;
          platform.publishedAt = now();
          recordPublication(state, item, platformName, result);
        } else if (platformName === 'tiktok') {
          const result = await publishToTikTok(platform);
          platform.status = 'submitted';
          platform.publishId = result.publishId;
          platform.submittedAt = now();
          recordPublication(state, item, platformName, result);
        } else {
          platform.status = 'skipped';
          platform.skipReason = 'Unsupported platform';
        }
        delete platform.lastError;
      } catch (error) {
        failures += 1;
        const blockReason = blockingPlatformReason(platformName, error);
        platform.status = blockReason ? 'blocked' : 'failed';
        if (blockReason) platform.blockReason = blockReason;
        else delete platform.blockReason;
        platform.lastError = redactedError(error);
        console.error(`${item.id} → ${platformName}: ${platform.lastError}`);
      }
      item.status = recalculateItemStatus(item);
      item.updatedAt = now();
      queue.updatedAt = item.updatedAt;
      state.updatedAt = item.updatedAt;
      writeJson(paths.queue, queue);
      writeJson(paths.state, state);
    }
  }
  if (failures && process.env.SOCIAL_FAILURE_OUTPUT) {
    fs.writeFileSync(runnerOutputPath(process.env.SOCIAL_FAILURE_OUTPUT, 'Social failure output'), `${failures}\n`, { mode: 0o600 });
  }
  console.log(`Executed ${attempted} claimed platform publication(s) for ${claimId}; ${failures} failed.`);
}

function unblock() {
  const queue = loadQueue();
  const itemSelector = String(args.item || process.env.SOCIAL_ITEM || '').trim();
  if (!itemSelector) throw new Error('unblock requires --item with a queue ID or source ID.');
  const platforms = requestedPlatforms();
  let unblocked = 0;

  for (const item of queue.items || []) {
    if (item.id !== itemSelector && item.sourceId !== itemSelector) continue;
    for (const platformName of platforms) {
      const platform = item.platforms?.[platformName];
      if (!platform || platform.status !== 'blocked') continue;
      platform.status = 'failed';
      delete platform.blockReason;
      delete platform.claimId;
      delete platform.claimedAt;
      item.updatedAt = now();
      unblocked += 1;
    }
    item.status = recalculateItemStatus(item);
  }

  if (!unblocked) throw new Error(`No blocked platform matched "${itemSelector}" for ${platforms.join(', ')}.`);
  queue.updatedAt = now();
  writeJson(paths.queue, queue);
  console.log(`Unblocked ${unblocked} platform delivery target(s) for ${itemSelector}.`);
}

async function reconcile() {
  if (!availablePlatforms().tiktok || process.env.SOCIAL_MOCK_PUBLISHING === 'true') {
    console.log('TikTok reconciliation skipped because live TikTok credentials are not available.');
    return;
  }
  const queue = loadQueue();
  const state = loadState();
  let token;
  try {
    token = await refreshTikTokToken();
  } catch (error) {
    console.warn(`TikTok reconciliation could not authenticate: ${redactedError(error)}`);
    return;
  }
  let checked = 0;
  let attempted = 0;
  for (const item of queue.items || []) {
    const platform = item.platforms?.tiktok;
    if (platform?.status !== 'submitted' || !platform.publishId) continue;
    attempted += 1;
    try {
      const payload = await tiktokRequest('/v2/post/publish/status/fetch/', token, { publish_id: platform.publishId });
      checked += 1;
      const status = payload.data?.status;
      if (status === 'PUBLISH_COMPLETE') {
        platform.status = 'published';
        platform.publishedAt = now();
        const postId = payload.data?.publicaly_available_post_id?.[0];
        if (postId) {
          platform.postId = String(postId);
          platform.postUrl = `https://www.tiktok.com/@${config.tiktok?.username}/video/${postId}`;
        }
      } else if (status === 'FAILED') {
        platform.status = 'failed';
        platform.lastError = `TikTok processing failed: ${payload.data?.fail_reason || 'unknown reason'}`;
      }
      platform.remoteStatus = status || 'UNKNOWN';
      delete platform.lastCheckError;
    } catch (error) {
      platform.lastCheckError = redactedError(error);
    }
    platform.lastCheckedAt = now();
    item.status = recalculateItemStatus(item);
    item.updatedAt = now();
  }
  if (!attempted) {
    console.log('No submitted TikTok items currently require reconciliation.');
    return;
  }
  queue.updatedAt = now();
  state.updatedAt = queue.updatedAt;
  writeJson(paths.queue, queue);
  writeJson(paths.state, state);
  console.log(`Reconciled ${checked} of ${attempted} submitted TikTok item(s).`);
}

function status() {
  const queue = loadQueue();
  const counts = {};
  for (const item of queue.items || []) counts[item.status] = (counts[item.status] || 0) + 1;
  console.log(`Social queue: ${(queue.items || []).length} item(s) — ${Object.entries(counts).map(([key, value]) => `${key}: ${value}`).join(', ') || 'empty'}`);
  for (const item of (queue.items || []).filter((candidate) => candidate.status !== 'completed')) {
    const destinations = Object.entries(item.platforms || {}).map(([name, platform]) => `${name}:${platform.status}`).join(', ');
    console.log(`- ${item.sourceType}/${item.sourceId} [${item.id}] ${item.approvalStatus} — ${destinations}`);
  }
}

function drafts() {
  const queue = loadQueue();
  const items = (queue.items || []).filter((item) => item.platforms?.x?.status === 'draft-ready');
  console.log('### X manual drafts');
  if (!items.length) {
    console.log('\nNo X drafts are currently ready.');
    return;
  }
  for (const item of items) {
    const platform = item.platforms.x;
    const safeText = String(platform.text || '').replaceAll('```', "'''");
    console.log(`\n#### ${item.title}`);
    console.log(`\nSource: [open original](${item.sourceUrl})`);
    console.log(`\n\`\`\`text\n${safeText}\n\`\`\``);
    if (platform.mediaPath) console.log(`\n[Download the X-ready image](${publicUrl(platform.mediaPath)})`);
  }
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const supportedCommands = new Set(['seed', 'prepare', 'auth', 'claim', 'execute', 'reconcile', 'unblock', 'status', 'drafts']);
  if (!supportedCommands.has(command)) throw new Error(`Unknown social publisher command: ${command}`);
  switch (command) {
    case 'seed': await seed(); break;
    case 'prepare': await prepare(); break;
    case 'auth': await auth(); break;
    case 'claim': await claim(); break;
    case 'execute': await execute(); break;
    case 'reconcile': await reconcile(); break;
    case 'unblock': await unblock(); break;
    case 'status': await status(); break;
    case 'drafts': await drafts(); break;
    default: throw new Error(`Unknown social publisher command: ${command}`);
  }
}

export { sourceRecords, sourceFingerprint, prepare, queueRecord, materializeMedia, claim, execute, reconcile, publishToTikTok, publishToX, redactedError, xDraft, tiktokDraft };
