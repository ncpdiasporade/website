import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

const banglaMonths = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

export function resolveRepoPath(path) {
  return resolve(repoRoot, path);
}

export function readJson(path) {
  return JSON.parse(readFileSync(resolveRepoPath(path), 'utf8'));
}

export function writeJson(path, data) {
  const target = resolveRepoPath(path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

export function formatBanglaMonthYear(dateValue = new Date()) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'চলমান';
  return `${banglaMonths[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function slugify(value, fallback = 'post') {
  const slug = String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug || fallback;
}

export function uniqueSlug(base, existingSlugs) {
  let candidate = base;
  let index = 2;

  while (existingSlugs.has(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }

  existingSlugs.add(candidate);
  return candidate;
}

export function isSafeLink(value) {
  if (!value || value === '#') return true;

  try {
    const url = new URL(String(value), 'https://ncpdagermany.de/');
    return ['http:', 'https:', 'mailto:'].includes(url.protocol);
  } catch {
    return false;
  }
}

export function extractResponseText(response) {
  if (typeof response.output_text === 'string') return response.output_text;

  const chunks = [];
  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (typeof content.text === 'string') chunks.push(content.text);
    }
  }

  return chunks.join('\n').trim();
}
