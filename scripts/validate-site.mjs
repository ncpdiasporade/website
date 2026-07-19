import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const errors = [];
const jsonFiles = [
  'data/recent-updates.json',
  'data/announcements.json',
  'data/july-resources.json',
  'data/blog-posts.json',
  'social-feed.config.json'
];

for (const relativePath of jsonFiles) {
  try {
    JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
  }
}

const html = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const markup = html.split('<script>')[0];
for (const id of ['home', 'announcements', 'uprising', 'about', 'pillars', 'updates', 'blog', 'why-join', 'join']) {
  if (!markup.includes(`id="${id}"`)) errors.push(`index.html: missing #${id}`);
}
if (!markup.includes('data-update-filter="featured"')) errors.push('index.html: missing featured updates filter');

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
  }
}

const recentUpdates = JSON.parse(fs.readFileSync(path.join(rootDir, 'data/recent-updates.json'), 'utf8'));
for (const item of (recentUpdates.items || []).filter((candidate) => candidate.featured === true)) {
  try {
    const hostname = new URL(item.sourceUrl).hostname;
    if (!/(^|\.)facebook\.com$/i.test(hostname)) errors.push(`data/recent-updates.json: featured item ${item.id} is not linked to Facebook`);
  } catch {
    errors.push(`data/recent-updates.json: featured item ${item.id} has an invalid sourceUrl`);
  }
}

if (/example\.com|images\.unsplash\.com/i.test(html)) errors.push('index.html: placeholder or stock-demo URL found');

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${jsonFiles.length} JSON files, ${ids.length} HTML ids, required sections, and local content images.`);
