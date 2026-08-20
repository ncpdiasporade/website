import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const origin = 'https://ncpdagermany.de';
const generatedOn = '2026-08-17';
const organizationName = 'NCP Diaspora Alliance Germany';
const socialProfiles = [
  'https://www.facebook.com/ncpdagermany',
  'https://www.instagram.com/ncpda.germany',
  'https://www.youtube.com/@NCPDA_Germany',
  'https://www.tiktok.com/@ncpda.germany'
];

const locales = {
  en: {
    locale: 'en_GB',
    path: '/en/',
    title: 'NCP Germany | National Citizen Party Diaspora Alliance',
    description: 'NCP Diaspora Alliance Germany connects Bangladeshis in Germany with the National Citizen Party’s reform agenda, diaspora rights and the legacy of the July Uprising 2024.',
    eyebrow: 'National Citizen Party · Bangladesh · Germany',
    heading: 'NCP Diaspora Alliance Germany',
    lead: 'A Germany-based platform for Bangladeshis who support democratic reform, equal citizenship and the public-interest politics inspired by the July Uprising 2024.',
    aboutTitle: 'NCP in Germany: who we are',
    aboutBody: 'NCP Diaspora Alliance Germany brings together members and supporters of the Bangladeshi diaspora in Germany. We create space for informed political dialogue, diaspora participation, community cooperation and constructive engagement with the National Citizen Party (NCP) in Bangladesh.',
    partyTitle: 'About the National Citizen Party',
    partyBody: 'The National Citizen Party (NCP) was founded in Bangladesh on 28 February 2025 by a generation of organisers who became nationally prominent during the July Uprising. Its public agenda emphasises democratic institutions, accountability, equality, decentralisation and meaningful citizen participation. This Germany platform explains that agenda in a diaspora context; official party positions should always be checked through the NCP’s official channels.',
    workTitle: 'What the Germany diaspora platform does',
    workItems: [
      'Connects Bangladeshis across Germany through civic and community activities.',
      'Advocates for expatriate voting rights, better consular services and dignified treatment of migrants.',
      'Documents the July Uprising and shares reliable sources in Bengali, English and German.',
      'Publishes sourced analysis on Bangladesh, Germany–Bangladesh relations, skills and diaspora policy.',
      'Shares current NCP and NCP Diaspora Alliance Germany activities from verified official channels.'
    ],
    julyTitle: 'July Uprising 2024',
    julyBody: 'The July Uprising began with student demands for fairness and grew into a nationwide movement after violent repression. Students, workers, women, families, professionals and the diaspora all contributed. Our July archive separates memory, evidence and later political interpretation so readers can understand what happened and why the uprising still matters.',
    trustTitle: 'How to identify the correct “NCP Germany”',
    trustBody: 'People sometimes search for “German NCP”, but the abbreviation NCP is used by many unrelated organisations in Germany. This website concerns Bangladesh’s National Citizen Party and its diaspora network in Germany. The consistent identifiers are the full name NCP Diaspora Alliance Germany, the domain ncpdagermany.de and the official social accounts linked below.',
    ctaPrimary: 'Open the full website',
    ctaSecondary: 'Explore the July archive',
    updates: 'Latest activities',
    blog: 'Analysis & Blog',
    join: 'Join in Germany',
    footer: 'Supporting informed diaspora participation, democratic reform and the memory of July 2024.',
    languageLabel: 'Languages',
    homeLabel: 'Bengali',
    currentLabel: 'English',
    otherLabel: 'Deutsch'
  },
  de: {
    locale: 'de_DE',
    path: '/de/',
    title: 'NCP Deutschland | NCP Diaspora Alliance Germany',
    description: 'Die NCP Diaspora Alliance Germany verbindet Bangladescher in Deutschland mit der Reformagenda der National Citizen Party, Diaspora-Rechten und dem Juli-Aufstand 2024.',
    eyebrow: 'National Citizen Party · Bangladesch · Deutschland',
    heading: 'NCP Diaspora Alliance Germany',
    lead: 'Eine Plattform in Deutschland für Bangladescherinnen und Bangladescher, die demokratische Reformen, gleiche Bürgerrechte und eine am Gemeinwohl orientierte Politik im Geist des Juli-Aufstands 2024 unterstützen.',
    aboutTitle: 'NCP in Deutschland: Wer wir sind',
    aboutBody: 'Die NCP Diaspora Alliance Germany bringt Mitglieder und Unterstützer der bangladeschischen Diaspora in Deutschland zusammen. Wir schaffen Raum für fundierten politischen Dialog, gesellschaftliche Teilhabe, Zusammenarbeit in der Community und einen konstruktiven Austausch mit der National Citizen Party (NCP) in Bangladesch.',
    partyTitle: 'Über die National Citizen Party',
    partyBody: 'Die National Citizen Party (NCP) wurde am 28. Februar 2025 in Bangladesch von einer Generation von Organisatoren gegründet, die während des Juli-Aufstands landesweit bekannt wurde. Zu ihrer öffentlich erklärten Agenda gehören demokratische Institutionen, Rechenschaftspflicht, Gleichheit, Dezentralisierung und echte Bürgerbeteiligung. Diese Deutschland-Plattform ordnet die Agenda aus Sicht der Diaspora ein; verbindliche Parteipositionen sollten stets über die offiziellen NCP-Kanäle geprüft werden.',
    workTitle: 'Woran die Diaspora-Plattform in Deutschland arbeitet',
    workItems: [
      'Vernetzung von Bangladescherinnen und Bangladeschern in Deutschland durch zivilgesellschaftliche und gemeinschaftliche Aktivitäten.',
      'Einsatz für Auslandswahlrecht, bessere konsularische Dienste und eine würdevolle Behandlung von Migrantinnen und Migranten.',
      'Dokumentation des Juli-Aufstands mit verlässlichen Quellen auf Bengalisch, Englisch und Deutsch.',
      'Quellenbasierte Analysen zu Bangladesch, den Beziehungen zwischen Deutschland und Bangladesch, Qualifizierung und Diaspora-Politik.',
      'Aktuelle Aktivitäten der NCP und der NCP Diaspora Alliance Germany aus verifizierten offiziellen Kanälen.'
    ],
    julyTitle: 'Juli-Aufstand 2024',
    julyBody: 'Der Juli-Aufstand begann mit studentischen Forderungen nach Gerechtigkeit und entwickelte sich nach gewaltsamer Repression zu einer landesweiten Bewegung. Studierende, Beschäftigte, Frauen, Familien, Fachleute und die Diaspora wirkten mit. Unser Juli-Archiv trennt Erinnerung, Belege und spätere politische Deutung, damit nachvollziehbar bleibt, was geschah und warum der Aufstand bis heute wichtig ist.',
    trustTitle: 'So erkennen Sie die richtige „NCP Deutschland“',
    trustBody: 'Die Abkürzung NCP wird in Deutschland von mehreren, nicht miteinander verbundenen Organisationen verwendet. Diese Website bezieht sich auf die National Citizen Party aus Bangladesch und ihr Diaspora-Netzwerk in Deutschland. Eindeutige Merkmale sind der vollständige Name NCP Diaspora Alliance Germany, die Domain ncpdagermany.de und die unten verlinkten offiziellen Social-Media-Konten.',
    ctaPrimary: 'Vollständige Website öffnen',
    ctaSecondary: 'Juli-Archiv erkunden',
    updates: 'Aktuelle Aktivitäten',
    blog: 'Analysen & Blog',
    join: 'In Deutschland mitmachen',
    footer: 'Für fundierte Diaspora-Teilhabe, demokratische Reformen und die Erinnerung an den Juli 2024.',
    languageLabel: 'Sprachen',
    homeLabel: 'বাংলা',
    currentLabel: 'Deutsch',
    otherLabel: 'English'
  }
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
}

function organizationJsonLd() {
  return {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: organizationName,
    alternateName: ['NCP Germany', 'NCP Deutschland', 'NCPDA Germany', 'NCP Diaspora Germany'],
    url: `${origin}/`,
    logo: `${origin}/img/logo/logo-navbar-en-clear.png`,
    email: 'mailto:ncpdiasporade@gmail.com',
    telephone: '+49 15678 304651',
    areaServed: { '@type': 'Country', name: 'Germany' },
    sameAs: socialProfiles,
    knowsAbout: [
      'National Citizen Party Bangladesh',
      'Bangladeshi diaspora in Germany',
      'July Uprising 2024',
      'Diaspora voting rights',
      'Germany–Bangladesh relations'
    ]
  };
}

function renderLanding(language, copy) {
  const canonical = `${origin}${copy.path}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: `${origin}/`,
        name: organizationName,
        alternateName: ['NCP Germany', 'NCP Deutschland', 'NCPDA Germany', 'NCP Diaspora Germany'],
        publisher: { '@id': `${origin}/#organization` }
      },
      organizationJsonLd(),
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: copy.title,
        description: copy.description,
        inLanguage: language,
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#organization` },
        dateModified: generatedOn
      }
    ]
  };
  const primaryHref = `/?lang=${language}#about`;
  const otherPath = language === 'en' ? '/de/' : '/en/';
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="theme-color" content="#0b5b31">
  <title>${escapeHtml(copy.title)}</title>
  <meta name="description" content="${escapeHtml(copy.description)}">
  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="bn" href="${origin}/">
  <link rel="alternate" hreflang="en" href="${origin}/en/">
  <link rel="alternate" hreflang="de" href="${origin}/de/">
  <link rel="alternate" hreflang="x-default" href="${origin}/">
  <link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${organizationName}">
  <meta property="og:locale" content="${copy.locale}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escapeHtml(copy.title)}">
  <meta property="og:description" content="${escapeHtml(copy.description)}">
  <meta property="og:image" content="${origin}/img/logo/logo-navbar-en-clear.png">
  <meta property="og:image:width" content="720">
  <meta property="og:image:height" content="720">
  <meta property="og:image:alt" content="${organizationName}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(copy.title)}">
  <meta name="twitter:description" content="${escapeHtml(copy.description)}">
  <meta name="twitter:image" content="${origin}/img/logo/logo-navbar-en-clear.png">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>
  <style>
    :root{--green:#0b5b31;--green2:#0e7a43;--red:#c3193b;--ink:#102218;--muted:#506257;--paper:#f4faf6;--line:#d9e8de}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;color:var(--ink);background:linear-gradient(180deg,#f8fcf9,#edf7f1);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.65}a{color:inherit}.shell{width:min(1120px,calc(100% - 36px));margin:auto}.top{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:18px 0}.brand{display:flex;align-items:center;gap:12px;text-decoration:none;font-weight:850}.brand img{width:68px;height:68px;object-fit:contain}.brand span{display:grid;line-height:1.1}.brand small{margin-top:5px;color:var(--green2);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase}.languages{display:flex;gap:7px;flex-wrap:wrap}.languages a{border:1px solid var(--line);border-radius:999px;padding:7px 11px;background:#fff;text-decoration:none;font-size:.82rem;font-weight:750}.languages a[aria-current]{background:var(--green);color:#fff;border-color:var(--green)}.hero{position:relative;overflow:hidden;border:1px solid var(--line);border-radius:32px;background:radial-gradient(circle at 85% 10%,rgba(14,122,67,.18),transparent 30%),linear-gradient(135deg,#fff 0%,#f0f9f3 62%,#e4f4ea 100%);padding:clamp(48px,8vw,94px);box-shadow:0 28px 80px rgba(5,49,25,.12)}.hero:before{content:"";position:absolute;left:0;top:0;width:9px;height:100%;background:linear-gradient(var(--red),#e0aa2a,var(--green2))}.hero-grid{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:44px;align-items:center}.eyebrow{margin:0 0 17px;color:var(--green2);font-size:.78rem;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.hero h1{margin:0;font-size:clamp(2.5rem,6vw,5.5rem);line-height:.98;letter-spacing:-.055em}.lead{max-width:760px;margin:26px 0 0;color:#30463a;font-size:clamp(1.05rem,2vw,1.27rem)}.hero-logo{width:250px;height:250px;object-fit:contain;filter:drop-shadow(0 18px 26px rgba(5,58,30,.18))}.actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.button{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 20px;border-radius:999px;text-decoration:none;font-weight:850}.button.primary{background:var(--green);color:#fff}.button.secondary{background:#fff;border:1px solid var(--line);color:var(--green)}.quick{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:18px 0 62px}.quick a{padding:17px 20px;border:1px solid var(--line);border-radius:18px;background:#fff;text-decoration:none;font-weight:800;box-shadow:0 8px 28px rgba(5,49,25,.06)}.content{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-bottom:64px}.card{border:1px solid var(--line);border-radius:24px;background:rgba(255,255,255,.94);padding:clamp(26px,4vw,42px)}.card.wide{grid-column:1/-1}.card h2{margin:0 0 13px;font-size:clamp(1.45rem,3vw,2.15rem);line-height:1.15}.card p{margin:0;color:var(--muted)}.card ul{margin:0;padding-left:1.2rem;color:var(--muted)}.card li+li{margin-top:10px}.identity{border-left:5px solid var(--red)}.social{display:flex;gap:9px;flex-wrap:wrap;margin-top:22px}.social a{font-size:.84rem;font-weight:800;color:var(--green);text-decoration:none;border-bottom:1px solid currentColor}.footer{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;padding:28px 0 42px;border-top:1px solid var(--line);color:var(--muted);font-size:.9rem}.footer strong{color:var(--ink)}@media(max-width:760px){.top{align-items:flex-start}.brand span{display:none}.brand img{width:62px;height:62px}.hero{padding:44px 26px}.hero-grid{grid-template-columns:1fr}.hero-logo{width:170px;height:170px;grid-row:1}.quick,.content{grid-template-columns:1fr}.card.wide{grid-column:auto}.footer{display:grid}.languages{justify-content:flex-end}}
  </style>
</head>
<body>
  <header class="shell top">
    <a class="brand" href="${origin}/" aria-label="${organizationName} home"><img src="/img/logo/logo-navbar-en-seo.webp" width="220" height="220" alt="${organizationName}"><span>${organizationName}<small>NCP Germany · Bangladesh diaspora</small></span></a>
    <nav class="languages" aria-label="${escapeHtml(copy.languageLabel)}"><a href="/">${escapeHtml(copy.homeLabel)}</a><a href="${copy.path}" aria-current="page">${escapeHtml(copy.currentLabel)}</a><a href="${otherPath}">${escapeHtml(copy.otherLabel)}</a></nav>
  </header>
  <main class="shell">
    <section class="hero">
      <div class="hero-grid"><div><p class="eyebrow">${escapeHtml(copy.eyebrow)}</p><h1>${escapeHtml(copy.heading)}</h1><p class="lead">${escapeHtml(copy.lead)}</p><div class="actions"><a class="button primary" href="${primaryHref}">${escapeHtml(copy.ctaPrimary)}</a><a class="button secondary" href="https://july36.ncpdagermany.de/">${escapeHtml(copy.ctaSecondary)}</a></div></div><img class="hero-logo" src="/img/logo/logo-premium-en-seo.webp" width="360" height="360" alt="${organizationName} logo"></div>
    </section>
    <nav class="quick" aria-label="Primary resources"><a href="/?lang=${language}#updates">${escapeHtml(copy.updates)} →</a><a href="/?lang=${language}#blog">${escapeHtml(copy.blog)} →</a><a href="/?lang=${language}#join">${escapeHtml(copy.join)} →</a></nav>
    <div class="content">
      <article class="card identity"><h2>${escapeHtml(copy.aboutTitle)}</h2><p>${escapeHtml(copy.aboutBody)}</p></article>
      <article class="card"><h2>${escapeHtml(copy.partyTitle)}</h2><p>${escapeHtml(copy.partyBody)}</p></article>
      <article class="card wide"><h2>${escapeHtml(copy.workTitle)}</h2><ul>${copy.workItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>
      <article class="card"><h2>${escapeHtml(copy.julyTitle)}</h2><p>${escapeHtml(copy.julyBody)}</p></article>
      <article class="card"><h2>${escapeHtml(copy.trustTitle)}</h2><p>${escapeHtml(copy.trustBody)}</p><div class="social">${socialProfiles.map((url) => `<a href="${url}" rel="me noopener noreferrer">${new URL(url).hostname.replace('www.', '')}</a>`).join('')}</div></article>
    </div>
  </main>
  <footer class="shell footer"><p><strong>${organizationName}</strong><br>${escapeHtml(copy.footer)}</p><p><a href="mailto:ncpdiasporade@gmail.com">ncpdiasporade@gmail.com</a><br><a href="https://wa.me/4915678304651">+49 15678 304651</a></p></footer>
</body>
</html>\n`;
}

function sitemapEntry(location, lastModified, alternates = []) {
  const links = alternates.map(({ language, href }) => `    <xhtml:link rel="alternate" hreflang="${language}" href="${href}"/>`).join('\n');
  return `  <url>\n    <loc>${location}</loc>\n    <lastmod>${lastModified}</lastmod>${links ? `\n${links}` : ''}\n  </url>`;
}

function buildSitemap() {
  const entries = [];
  const homepageAlternates = [
    { language: 'bn', href: `${origin}/` },
    { language: 'en', href: `${origin}/en/` },
    { language: 'de', href: `${origin}/de/` },
    { language: 'x-default', href: `${origin}/` }
  ];
  for (const href of [`${origin}/`, `${origin}/en/`, `${origin}/de/`]) {
    entries.push(sitemapEntry(href, generatedOn, homepageAlternates));
  }

  entries.push(sitemapEntry(`${origin}/july-uprising/`, '2026-08-01'));
  entries.push(sitemapEntry(`${origin}/sovereignty/`, '2026-08-13'));

  const blogData = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/blog-posts.json'), 'utf8'));
  for (const article of blogData.items || []) {
    const sharePath = String(article.sharePath || '').replace(/^\/+|\/+$/g, '');
    if (!sharePath) continue;
    const lastModified = String(article.publishedAt || generatedOn).slice(0, 10);
    entries.push(sitemapEntry(`${origin}/${sharePath}/`, lastModified));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
}

async function generateImages() {
  const logoDir = path.join(rootDir, 'img', 'logo');
  const julyDir = path.join(rootDir, 'img', 'july', 'selected');
  await sharp(path.join(logoDir, 'logo-navbar-bn-clear.png')).resize(220, 220, { fit: 'contain' }).webp({ quality: 88, effort: 6 }).toFile(path.join(logoDir, 'logo-navbar-bn-seo.webp'));
  await sharp(path.join(logoDir, 'logo-navbar-en-clear.png')).resize(220, 220, { fit: 'contain' }).webp({ quality: 88, effort: 6 }).toFile(path.join(logoDir, 'logo-navbar-en-seo.webp'));
  await sharp(path.join(logoDir, 'logo-premium.png')).resize(360, 360, { fit: 'contain' }).webp({ quality: 90, effort: 6 }).toFile(path.join(logoDir, 'logo-premium-seo.webp'));
  await sharp(path.join(logoDir, 'logo-navbar-en-clear.png')).resize(360, 360, { fit: 'contain' }).webp({ quality: 90, effort: 6 }).toFile(path.join(logoDir, 'logo-premium-en-seo.webp'));
  await sharp(path.join(logoDir, 'logo-premium.png')).resize(48, 48, { fit: 'contain' }).png({ compressionLevel: 9 }).toFile(path.join(rootDir, 'favicon-48.png'));
  await sharp(path.join(logoDir, 'logo-premium.png')).resize(180, 180, { fit: 'contain' }).png({ compressionLevel: 9 }).toFile(path.join(rootDir, 'apple-touch-icon.png'));
  await sharp(path.join(julyDir, 'august-05-parliament-afp.webp'))
    .resize(900, 1100, { fit: 'cover', position: 'centre' })
    .webp({ quality: 58, effort: 6 })
    .toFile(path.join(julyDir, 'august-05-parliament-hero.webp'));
}

await generateImages();
for (const [language, copy] of Object.entries(locales)) {
  const outputDirectory = path.join(rootDir, language);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'index.html'), renderLanding(language, copy), 'utf8');
}
fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), buildSitemap(), 'utf8');
fs.writeFileSync(path.join(rootDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, 'utf8');
fs.writeFileSync(path.join(rootDir, 'site.webmanifest'), JSON.stringify({
  name: organizationName,
  short_name: 'NCPDA Germany',
  start_url: '/',
  display: 'standalone',
  background_color: '#ffffff',
  theme_color: '#0d6130',
  icons: [
    { src: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
  ]
}, null, 2) + '\n', 'utf8');

console.log('Generated English/German SEO landing pages, optimized logos, robots.txt, sitemap.xml and web manifest.');
