import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  escapeHtml,
  readJson,
  resolveRepoPath,
  slugify,
  uniqueSlug,
  writeJson
} from './lib/content-utils.mjs';

const data = readJson('data/blog-posts.json');
const existingSlugs = new Set();
let changed = false;

function renderPage(post) {
  const body = post.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n        ');

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(post.title)} | NCP Diaspora Alliance Germany</title>
  <meta name="description" content="${escapeHtml(post.excerpt)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=DM+Sans:wght@400;500;600&display=swap" />
  <style>
    :root { --green: #0d6130; --ink: #0e1e14; --muted: #4d6355; --surface: #f5faf7; --border: rgba(18,90,50,.13); }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Hind Siliguri', sans-serif; color: var(--ink); background: var(--surface); line-height: 1.75; }
    main { width: min(820px, calc(100% - 32px)); margin: 0 auto; padding: 48px 0 72px; }
    a { color: var(--green); text-decoration: none; font-weight: 600; }
    .back { display: inline-flex; margin-bottom: 28px; }
    article { background: #fff; border: 1px solid var(--border); border-radius: 18px; padding: clamp(24px, 5vw, 48px); box-shadow: 0 18px 60px rgba(6,16,10,.08); }
    .meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; color: var(--muted); font-family: 'DM Sans', sans-serif; font-size: .9rem; }
    .tag { color: var(--green); font-weight: 700; }
    h1 { margin: 0 0 18px; font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.12; }
    .excerpt { color: var(--muted); font-size: 1.08rem; margin-bottom: 30px; }
    p { font-size: 1.04rem; margin: 0 0 18px; }
    footer { margin-top: 32px; color: var(--muted); font-size: .92rem; }
  </style>
</head>
<body>
  <main>
    <a class="back" href="../index.html#blog">← ব্লগে ফিরে যান</a>
    <article>
      <div class="meta">
        <span class="tag">${escapeHtml(post.tag)}</span>
        <span>${escapeHtml(post.author)}</span>
        <span>${escapeHtml(post.date)}</span>
      </div>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="excerpt">${escapeHtml(post.excerpt)}</p>
      ${body}
      <footer>প্রকাশের আগে সম্পাদকীয় পর্যালোচনা করা উচিত।</footer>
    </article>
  </main>
</body>
</html>
`;
}

for (const post of data.items) {
  if (post.status === 'draft' || !Array.isArray(post.body) || post.body.length === 0) {
    if (post.slug) existingSlugs.add(post.slug);
    continue;
  }

  const slug = uniqueSlug(post.slug || slugify(post.title, post.id), existingSlugs);
  if (post.slug !== slug) {
    post.slug = slug;
    changed = true;
  }

  const link = `blog/${slug}.html`;
  if (post.link !== link) {
    post.link = link;
    changed = true;
  }

  const target = resolveRepoPath(link);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, renderPage(post));
}

if (changed) {
  writeJson('data/blog-posts.json', data);
}

console.log('Blog pages rendered.');
