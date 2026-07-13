import { isSafeLink, readJson } from './lib/content-utils.mjs';

const errors = [];

function requireString(path, value, { allowEmpty = false } = {}) {
  if (typeof value !== 'string' || (!allowEmpty && value.trim() === '')) {
    errors.push(`${path} must be a non-empty string`);
  }
}

function validateRecentUpdates() {
  const data = readJson('data/recent-updates.json');
  if (!Array.isArray(data.items)) {
    errors.push('data/recent-updates.json must contain an items array');
    return;
  }

  data.items.forEach((item, index) => {
    const path = `recent-updates.items[${index}]`;
    requireString(`${path}.id`, item.id);
    requireString(`${path}.status`, item.status);
    requireString(`${path}.date`, item.date);
    requireString(`${path}.badge`, item.badge);
    requireString(`${path}.title`, item.title);
    requireString(`${path}.excerpt`, item.excerpt);

    if (!['published', 'draft'].includes(item.status)) {
      errors.push(`${path}.status must be published or draft`);
    }

    if (!isSafeLink(item.sourceUrl || item.link || '#')) {
      errors.push(`${path}.sourceUrl must be #, http(s), mailto, or a relative URL`);
    }
  });
}

function validateBlogPosts() {
  const data = readJson('data/blog-posts.json');
  if (!Array.isArray(data.items)) {
    errors.push('data/blog-posts.json must contain an items array');
    return;
  }

  data.items.forEach((item, index) => {
    const path = `blog-posts.items[${index}]`;
    requireString(`${path}.id`, item.id);
    requireString(`${path}.slug`, item.slug);
    requireString(`${path}.status`, item.status);
    requireString(`${path}.tag`, item.tag);
    requireString(`${path}.author`, item.author);
    requireString(`${path}.date`, item.date);
    requireString(`${path}.title`, item.title);
    requireString(`${path}.excerpt`, item.excerpt);

    if (!['published', 'draft'].includes(item.status)) {
      errors.push(`${path}.status must be published or draft`);
    }

    if (!isSafeLink(item.link || '#')) {
      errors.push(`${path}.link must be #, http(s), mailto, or a relative URL`);
    }

    if (item.body !== undefined) {
      if (!Array.isArray(item.body) || item.body.length < 3) {
        errors.push(`${path}.body must contain at least 3 paragraphs when present`);
      } else {
        item.body.forEach((paragraph, paragraphIndex) => {
          requireString(`${path}.body[${paragraphIndex}]`, paragraph);
        });
      }
    }
  });
}

function validateBlogTopics() {
  const data = readJson('data/blog-topics.json');
  if (!Array.isArray(data.items)) {
    errors.push('data/blog-topics.json must contain an items array');
    return;
  }

  data.items.forEach((item, index) => {
    const path = `blog-topics.items[${index}]`;
    requireString(`${path}.id`, item.id);
    requireString(`${path}.status`, item.status);
    requireString(`${path}.title`, item.title);
    requireString(`${path}.context`, item.context);

    if (!['idea', 'ready', 'drafted', 'paused'].includes(item.status)) {
      errors.push(`${path}.status must be idea, ready, drafted, or paused`);
    }
  });
}

validateRecentUpdates();
validateBlogPosts();
validateBlogTopics();

if (errors.length) {
  console.error('Content validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Content validation passed.');
