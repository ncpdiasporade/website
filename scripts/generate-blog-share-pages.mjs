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

function renderArticleBody(article) {
  const blocks = Array.isArray(article.blocks) && article.blocks.length
    ? article.blocks
    : (article.content || []).map((text) => ({ type: 'paragraph', text }));
  return blocks.map((block) => {
    if (block.type === 'heading') return `<h2>${escapeHtml(block.text)}</h2>`;
    if (block.type === 'callout') return `<aside class="callout">${escapeHtml(block.text)}</aside>`;
    if (block.type === 'list') return `<ul>${(block.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    if (block.type === 'image') {
      const source = absoluteAsset(block.src || article.image);
      const sourceLink = String(block.sourceUrl || '').trim();
      return `<figure><img src="${escapeHtml(source)}" alt="${escapeHtml(block.alt || article.imageAlt || article.title)}" loading="lazy"><figcaption>${escapeHtml(block.caption || block.credit || '')}${sourceLink ? ` · <a href="${escapeHtml(sourceLink)}" rel="noopener noreferrer">ছবির উৎস</a>` : ''}</figcaption></figure>`;
    }
    return `<p>${escapeHtml(block.text)}</p>`;
  }).join('\n      ');
}

function renderFullArticle(article) {
  const sharePath = cleanPath(article.sharePath);
  const canonicalUrl = `${siteOrigin}/${sharePath}/`;
  const title = String(article.title || '').trim();
  const description = String(article.excerpt || '').trim();
  const image = absoluteAsset(article.shareImage || article.image || 'img/logo/logo-premium.png');
  const imageAlt = String(article.imageAlt || title).trim();
  const width = Number(article.shareImageWidth) || 1200;
  const height = Number(article.shareImageHeight) || 630;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: canonicalUrl,
    headline: title,
    description,
    image: [image],
    datePublished: article.publishedAt || undefined,
    dateModified: article.publishedAt || undefined,
    inLanguage: 'bn',
    author: { '@type': 'Organization', name: article.author || 'NCP Diaspora Alliance Germany Editorial Desk' },
    publisher: {
      '@type': 'Organization',
      name: 'NCP Diaspora Alliance Germany',
      url: `${siteOrigin}/`,
      logo: { '@type': 'ImageObject', url: `${siteOrigin}/img/logo/logo-premium.png` }
    }
  };
  const facts = (article.facts || []).map((fact) => `<li><strong>${escapeHtml(fact.value)}</strong><span>${escapeHtml(fact.label)}</span></li>`).join('');
  const sources = (article.sources || []).map((source) => `<li><a href="${escapeHtml(source.url)}" rel="noopener noreferrer">${escapeHtml(source.label)}</a></li>`).join('');
  return `<!doctype html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="theme-color" content="#0d6130">
  <title>${escapeHtml(title)} | NCP Diaspora Alliance Germany</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="NCP Diaspora Alliance Germany">
  <meta property="og:locale" content="bn_BD">
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
  <script type="application/ld+json">${JSON.stringify(articleJsonLd).replace(/</g, '\\u003c')}</script>
  <style>:root{--green:#0d6130;--red:#c01636;--ink:#14251a;--muted:#526158;--line:#dce9e0}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:#f6faf7;font-family:"Noto Sans Bengali","Hind Siliguri",system-ui,sans-serif;line-height:1.78}a{color:var(--green)}.shell{width:min(900px,calc(100% - 34px));margin:auto}.site-head{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 0}.brand{display:flex;align-items:center;gap:11px;text-decoration:none;font-weight:800;color:var(--ink)}.brand img{width:58px;height:58px;object-fit:contain}.site-head>a:last-child{font-weight:750;text-decoration:none}.article{margin:18px auto 60px;background:#fff;border:1px solid var(--line);border-radius:28px;overflow:hidden;box-shadow:0 24px 70px rgba(9,70,37,.1)}.article-head{padding:clamp(30px,7vw,68px)}.tag{margin:0;color:var(--red);font-weight:850}.article h1{margin:13px 0 18px;font-size:clamp(2rem,5vw,4.3rem);line-height:1.1;letter-spacing:-.025em}.meta{color:var(--muted);font-size:.9rem}.dek{font-size:1.15rem;color:#34473b}.cover{width:100%;aspect-ratio:1200/628;object-fit:cover}.credit{margin:0;padding:9px 18px;background:#edf5f0;color:var(--muted);font-size:.78rem}.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;padding:0;list-style:none}.facts li{display:grid;gap:6px;padding:16px;border:1px solid var(--line);border-radius:15px;background:#f7fbf8}.facts strong{color:var(--green);font-size:1.15rem}.body{padding:clamp(30px,7vw,68px);padding-top:22px}.body h2{margin:2.2em 0 .55em;font-size:clamp(1.5rem,3vw,2.2rem);line-height:1.25}.body p,.body li{font-size:1.06rem}.body .callout{margin:30px 0;padding:22px;border-left:5px solid var(--red);background:#fff4f6;font-size:1.1rem;font-weight:700}.body figure{margin:32px 0}.body figure img{width:100%;height:auto;border-radius:18px}.body figcaption{margin-top:8px;color:var(--muted);font-size:.8rem}.sources{margin-top:50px;padding-top:28px;border-top:1px solid var(--line)}.sources li+li{margin-top:10px}.cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:34px}.cta a{padding:11px 17px;border-radius:999px;background:var(--green);color:#fff;text-decoration:none;font-weight:800}.cta a+ a{background:#edf6f0;color:var(--green)}footer{padding:28px 0;color:var(--muted);font-size:.85rem}@media(max-width:640px){.brand span{display:none}.article{border-radius:20px}.article h1{font-size:2rem}.body p,.body li{font-size:1rem}}</style>
</head>
<body>
  <header class="shell site-head"><a class="brand" href="/"><img src="/img/logo/logo-navbar-bn-seo.webp" width="220" height="220" alt="NCP Diaspora Alliance Germany"><span>NCP Diaspora Alliance Germany</span></a><a href="/?blog=${escapeHtml(article.id)}#blog">মূল ওয়েবসাইট →</a></header>
  <main class="shell article">
    <header class="article-head"><p class="tag">${escapeHtml(article.tag || 'বিশ্লেষণ')}</p><h1>${escapeHtml(title)}</h1><p class="meta">${escapeHtml(article.author || '')} · ${escapeHtml(article.date || '')}</p><p class="dek">${escapeHtml(description)}</p>${facts ? `<ul class="facts">${facts}</ul>` : ''}</header>
    <img class="cover" src="/${String(article.image || article.shareImage).replace(/^\/+/, '')}" width="${width}" height="${height}" alt="${escapeHtml(imageAlt)}">
    <p class="credit">${escapeHtml(article.imageCredit || '')}</p>
    <article class="body">${renderArticleBody(article)}${sources ? `<section class="sources"><h2>তথ্যসূত্র</h2><ol>${sources}</ol></section>` : ''}<div class="cta"><a href="/?blog=${escapeHtml(article.id)}#blog">ইন্টার‍্যাক্টিভ পাঠ খুলুন</a><a href="/">NCP Germany হোম</a></div></article>
  </main>
  <footer class="shell">© 2026 NCP Diaspora Alliance Germany · তথ্যভিত্তিক প্রবাসী অংশগ্রহণের প্ল্যাটফর্ম</footer>
</body>
</html>\n`;
}

function renderPage(article, language) {
  if (language.code === 'bn') return renderFullArticle(article);
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
  <meta name="robots" content="noindex,follow">
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
