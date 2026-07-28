import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const siteOrigin = 'https://ncpdagermany.de';
const blogData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/blog-posts.json'), 'utf8'));
const languages = [
  { code: 'bn', locale: 'bn_BD', suffix: '', linkLabel: 'NCP Diaspora Alliance Germany-তে লেখাটি পড়ুন' },
  { code: 'en', locale: 'en_US', suffix: 'en', linkLabel: 'Read the article on NCP Diaspora Alliance Germany' },
  { code: 'de', locale: 'de_DE', suffix: 'de', linkLabel: 'Artikel bei NCP Diaspora Alliance Germany lesen' }
];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function cleanPath(value) {
  return String(value ?? '').trim().replace(/^\/+|\/+$/g, '').replace(/[^a-zA-Z0-9/_-]+/g, '');
}

function absoluteAsset(value) {
  const asset = String(value ?? '').trim().replace(/^\/+/, '');
  return `${siteOrigin}/${asset}`;
}

function localizedArticle(article, language) {
  if (language === 'bn') return article;
  return article.translations?.[language]
    ? { ...article, ...article.translations[language] }
    : article;
}

function renderPage(article, language) {
  const localized = localizedArticle(article, language.code);
  const sharePath = cleanPath(article.sharePath);
  const pagePath = `${sharePath}/${language.suffix ? `${language.suffix}/` : ''}`;
  const canonicalUrl = `${siteOrigin}/${pagePath}`;
  const params = new URLSearchParams({ blog: article.id });
  if (language.code !== 'bn') params.set('lang', language.code);
  const destination = `/?${params.toString()}#blog`;
  const title = String(localized.title || '').trim();
  const description = String(localized.excerpt || '').trim();
  const image = absoluteAsset(article.shareImage || article.image || 'img/logo/logo-premium.png');
  const imageAlt = String(localized.imageAlt || title).trim();
  const width = Number(article.shareImageWidth) || 1200;
  const height = Number(article.shareImageHeight) || 630;

  return `<!doctype html>
<html lang="${escapeHtml(language.code)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} | NCP Diaspora Alliance Germany</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="NCP Diaspora Alliance Germany">
  <meta property="og:locale" content="${escapeHtml(language.locale)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:image:secure_url" content="${escapeHtml(image)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="${width}">
  <meta property="og:image:height" content="${height}">
  <meta property="og:image:alt" content="${escapeHtml(imageAlt)}">
  <meta property="article:published_time" content="${escapeHtml(article.publishedAt || '')}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <script>window.location.replace(${JSON.stringify(destination)});</script>
</head>
<body>
  <main>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
    <p><a href="${escapeHtml(destination)}">${escapeHtml(language.linkLabel)}</a></p>
  </main>
</body>
</html>
`;
}

let generated = 0;
for (const article of blogData.items || []) {
  const sharePath = cleanPath(article.sharePath);
  if (!sharePath) continue;

  for (const language of languages) {
    const outputDir = path.join(rootDir, sharePath, language.suffix);
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'index.html'), renderPage(article, language), 'utf8');
    generated += 1;
  }
}

console.log(`Generated ${generated} localized Blog social-preview pages.`);
