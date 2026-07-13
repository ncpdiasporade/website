import { readJson, writeJson, formatBanglaMonthYear, slugify } from './lib/content-utils.mjs';

const config = readJson('automation.config.json');

if (!config.news?.enabled) {
  console.log('News automation disabled.');
  process.exit(0);
}

const updates = readJson('data/recent-updates.json');
const knownUrls = new Set(updates.items.map((item) => item.sourceUrl).filter(Boolean));
const knownIds = new Set(updates.items.map((item) => item.id).filter(Boolean));
const lookbackDays = Number(process.env.NEWS_LOOKBACK_DAYS || config.news.lookbackDays || 14);
const maxItems = Number(process.env.NEWS_MAX_ITEMS || config.news.maxItems || 3);
const proposedStatus = process.env.NEWS_PROPOSED_STATUS || config.news.proposedStatus || 'published';

function articleId(article) {
  const base = slugify(`${article.domain || 'source'}-${article.title}`, 'news-item');
  let candidate = base;
  let index = 2;

  while (knownIds.has(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }

  knownIds.add(candidate);
  return candidate;
}

async function searchGdelt(query) {
  const url = new URL('https://api.gdeltproject.org/api/v2/doc/doc');
  url.searchParams.set('query', query);
  url.searchParams.set('mode', 'ArtList');
  url.searchParams.set('format', 'json');
  url.searchParams.set('maxrecords', '10');
  url.searchParams.set('sort', 'DateDesc');
  url.searchParams.set('timespan', `${lookbackDays}d`);

  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) {
    throw new Error(`GDELT search failed for ${query}: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.articles) ? data.articles : [];
}

const candidates = [];

for (const query of config.news.queries || []) {
  try {
    const articles = await searchGdelt(query);
    for (const article of articles) {
      if (!article.url || !article.title || knownUrls.has(article.url)) continue;

      knownUrls.add(article.url);
      candidates.push({
        id: articleId(article),
        status: proposedStatus,
        date: formatBanglaMonthYear(article.seendate),
        badge: article.domain || 'সংবাদ',
        title: article.title.trim(),
        excerpt: `এই সাম্প্রতিক কভারেজটি ${article.domain || 'উৎস'} থেকে পাওয়া গেছে। প্রকাশের আগে শিরোনাম, প্রেক্ষাপট এবং ভাষা সম্পাদকীয়ভাবে যাচাই করুন।`,
        source: article.domain || 'GDELT',
        sourceUrl: article.url,
        discoveredAt: new Date().toISOString(),
        reviewRequired: true
      });

      if (candidates.length >= maxItems) break;
    }
  } catch (error) {
    console.warn(error.message);
  }

  if (candidates.length >= maxItems) break;
}

if (!candidates.length) {
  console.log('No new news candidates found.');
  process.exit(0);
}

updates.items = [...candidates, ...updates.items].slice(0, 12);
writeJson('data/recent-updates.json', updates);
console.log(`Added ${candidates.length} news candidate(s) to data/recent-updates.json.`);
