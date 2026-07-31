import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const siteOrigin = 'https://ncpdagermany.de';
const data = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/july-36-special.json'), 'utf8'));
const shareImageDir = path.join(rootDir, 'img', 'july', 'share');
const logoPath = path.join(rootDir, 'img', 'logo', 'logo-premium.png');
const width = 1200;
const height = 630;
const languages = [
  { code: 'bn', locale: 'bn_BD', suffix: '', dayLabel: (day) => `${bengaliNumber(day)} জুলাই`, cta: 'সম্পূর্ণ স্মৃতি দেখুন' },
  { code: 'en', locale: 'en_US', suffix: 'en', dayLabel: (day) => `${day} July`, cta: 'View the complete memory' },
  { code: 'de', locale: 'de_DE', suffix: 'de', dayLabel: (day) => `${day}. Juli`, cta: 'Vollständige Erinnerung ansehen' }
];

function bengaliNumber(value) {
  const digits = '০১২৩৪৫৬৭৮৯';
  return String(value).replace(/\d/g, (digit) => digits[Number(digit)]);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function localizedDay(day, language) {
  if (language === 'bn') return day;
  return day.translations?.[language] ? { ...day, ...day.translations[language] } : day;
}

function sharePagePath(day, language) {
  return `july/${day.julyDay}/${language.suffix ? `${language.suffix}/` : ''}`;
}

function shareImagePath(day) {
  return `img/july/share/july-${day.julyDay}.jpg`;
}

function redirectDestination(day, language) {
  const params = new URLSearchParams({ 'july-day': String(day.julyDay) });
  if (language.code !== 'bn') params.set('lang', language.code);
  return `/?${params.toString()}#july-36`;
}

function pageTitle(day, localized, language) {
  return `${language.dayLabel(day.julyDay)} | ${localized.title}`;
}

function pageDescription(localized) {
  return `${localized.date} · ${localized.theme} — ${localized.mantra}`;
}

function renderPage(day, language) {
  const localized = localizedDay(day, language.code);
  const pagePath = sharePagePath(day, language);
  const canonicalUrl = `${siteOrigin}/${pagePath}`;
  const image = `${siteOrigin}/${shareImagePath(day)}`;
  const destination = redirectDestination(day, language);
  const title = pageTitle(day, localized, language);
  const description = pageDescription(localized);
  const alternates = languages.map((alternate) => (
    `  <link rel="alternate" hreflang="${alternate.code}" href="${siteOrigin}/${sharePagePath(day, alternate)}">`
  )).join('\n');
  const alternateLocales = languages
    .filter((alternate) => alternate.code !== language.code)
    .map((alternate) => `  <meta property="og:locale:alternate" content="${alternate.locale}">`)
    .join('\n');

  return `<!doctype html>
<html lang="${language.code}" data-redirect="${escapeHtml(destination)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self'; style-src 'unsafe-inline'; script-src 'self'; upgrade-insecure-requests">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <title>${escapeHtml(title)} | NCP Diaspora Alliance Germany</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
${alternates}
  <link rel="alternate" hreflang="x-default" href="${siteOrigin}/${sharePagePath(day, languages[0])}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="NCP Diaspora Alliance Germany">
  <meta property="og:locale" content="${language.locale}">
${alternateLocales}
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:image:secure_url" content="${escapeHtml(image)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(localized.imageAlt || localized.title)}">
  <meta property="article:published_time" content="2024-08-${String(day.calendarDay).padStart(2, '0')}T00:00:00+06:00">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <meta name="twitter:image:alt" content="${escapeHtml(localized.imageAlt || localized.title)}">
  <script src="/js/share-redirect.js" defer></script>
  <style>body{margin:0;background:#071c10;color:#fff;font-family:system-ui,sans-serif;display:grid;min-height:100vh;place-items:center}main{max-width:42rem;padding:2rem;text-align:center}img{width:min(100%,48rem);height:auto;border-radius:1rem}a{display:inline-block;margin-top:1rem;padding:.8rem 1.2rem;border-radius:999px;background:#fff;color:#0d6130;font-weight:700;text-decoration:none}</style>
</head>
<body>
  <main>
    <img src="/${shareImagePath(day)}" width="1200" height="630" alt="${escapeHtml(localized.imageAlt || localized.title)}">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <a href="${escapeHtml(destination)}">${escapeHtml(language.cta)}</a>
  </main>
</body>
</html>
`;
}

async function renderShareImage(day) {
  const inputPath = path.join(rootDir, day.image);
  const metadata = await sharp(inputPath).metadata();
  const portrait = Number(metadata.width || 0) / Number(metadata.height || 1) < 1.2;
  const background = await sharp(inputPath)
    .rotate()
    .resize(width, height, { fit: 'cover', position: 'attention' })
    .blur(portrait ? 18 : 1.2)
    .modulate({ brightness: portrait ? 0.5 : 0.72, saturation: 0.9 })
    .jpeg({ quality: 88 })
    .toBuffer();
  const composites = [];

  if (portrait) {
    const foreground = await sharp(inputPath)
      .rotate()
      .resize({ width: 690, height: 630, fit: 'contain', withoutEnlargement: false })
      .jpeg({ quality: 92 })
      .toBuffer();
    const foregroundMeta = await sharp(foreground).metadata();
    composites.push({
      input: foreground,
      left: width - Number(foregroundMeta.width || 690),
      top: Math.max(0, Math.round((height - Number(foregroundMeta.height || 630)) / 2))
    });
  }

  const overlay = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#031b0d" stop-opacity=".98"/><stop offset=".5" stop-color="#031b0d" stop-opacity=".72"/><stop offset="1" stop-color="#031b0d" stop-opacity=".08"/></linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset=".48" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".72"/></linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#shade)"/><rect width="1200" height="630" fill="url(#floor)"/>
    <rect x="0" y="0" width="16" height="630" fill="#c01636"/><rect x="16" y="0" width="7" height="630" fill="#0e8a42"/>
    <text x="80" y="92" fill="#d7eadf" font-family="Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="3">NCP DIASPORA ALLIANCE GERMANY</text>
    <text x="72" y="430" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-size="150" font-weight="900" letter-spacing="-6">${day.julyDay}</text>
    <text x="76" y="520" fill="#ffffff" font-family="Arial Black, Arial, sans-serif" font-size="70" font-weight="900" letter-spacing="5">JULY</text>
    <text x="80" y="574" fill="#f0c75b" font-family="Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="2">${day.calendarDay} AUGUST 2024 · MEMORY &amp; RESPONSIBILITY</text>
  </svg>`);
  const logo = await sharp(logoPath).resize(112, 112, { fit: 'contain' }).png().toBuffer();
  composites.push({ input: overlay, left: 0, top: 0 });
  composites.push({ input: logo, left: width - 152, top: 38 });

  fs.mkdirSync(shareImageDir, { recursive: true });
  await sharp(background)
    .composite(composites)
    .jpeg({ quality: 90, progressive: true, mozjpeg: true })
    .toFile(path.join(shareImageDir, `july-${day.julyDay}.jpg`));
}

let pagesGenerated = 0;
for (const day of data.days || []) {
  await renderShareImage(day);
  for (const language of languages) {
    const outputDir = path.join(rootDir, sharePagePath(day, language));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'index.html'), renderPage(day, language), 'utf8');
    pagesGenerated += 1;
  }
}

console.log(`Generated ${pagesGenerated} localized July preview pages and ${(data.days || []).length} share images.`);
