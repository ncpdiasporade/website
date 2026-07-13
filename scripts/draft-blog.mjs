import {
  extractResponseText,
  formatBanglaMonthYear,
  readJson,
  slugify,
  uniqueSlug,
  writeJson
} from './lib/content-utils.mjs';

const config = readJson('automation.config.json');

if (!config.blog?.enabled) {
  console.log('Blog automation disabled.');
  process.exit(0);
}

if (!process.env.OPENAI_API_KEY) {
  console.log('OPENAI_API_KEY is not set; skipping blog generation.');
  process.exit(0);
}

const posts = readJson('data/blog-posts.json');
const topics = readJson('data/blog-topics.json');
const maxPosts = Number(process.env.BLOG_MAX_POSTS || config.blog.maxPostsPerRun || 1);
const existingTopicIds = new Set(posts.items.map((post) => post.topicId).filter(Boolean));
const existingSlugs = new Set(posts.items.map((post) => post.slug).filter(Boolean));
const readyTopics = topics.items
  .filter((topic) => topic.status === 'ready' && !existingTopicIds.has(topic.id))
  .slice(0, maxPosts);

if (!readyTopics.length) {
  console.log('No ready blog topics found.');
  process.exit(0);
}

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'excerpt', 'tag', 'body', 'reviewNotes'],
  properties: {
    title: { type: 'string' },
    excerpt: { type: 'string' },
    tag: { type: 'string' },
    body: {
      type: 'array',
      minItems: 5,
      maxItems: 9,
      items: { type: 'string' }
    },
    reviewNotes: { type: 'string' }
  }
};

async function generatePost(topic) {
  const prompt = `
Write one publication-ready blog article for NCP Diaspora Alliance Germany.

Title/context requested by editor:
- Title: ${topic.title}
- Tag: ${topic.tag || config.blog.defaultTag}
- Context: ${topic.context}
- Notes: ${topic.notes || 'No extra notes.'}

Rules:
- Language: ${config.blog.defaultLanguage === 'bn' ? 'Bangla' : config.blog.defaultLanguage}
- Voice: ${config.blog.siteVoice}
- Structure: 5-9 short paragraphs.
- Do not invent specific dates, statistics, named people, quotes, or events.
- If the article includes analysis, make it clear as analysis.
- Return only the requested JSON shape.
`;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4.1',
      input: [
        {
          role: 'developer',
          content: 'You are a careful editorial assistant for a public civic organization website. Accuracy, restraint, and reviewability matter more than persuasion.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'blog_post_draft',
          strict: true,
          schema
        }
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${body}`);
  }

  return JSON.parse(extractResponseText(await response.json()));
}

let generatedCount = 0;

for (const topic of readyTopics) {
  const draft = await generatePost(topic);
  const slug = uniqueSlug(slugify(draft.title, topic.id), existingSlugs);
  const id = slug;

  posts.items.unshift({
    id,
    slug,
    topicId: topic.id,
    status: 'published',
    tag: draft.tag || topic.tag || config.blog.defaultTag,
    author: config.blog.defaultAuthor || 'Writing Forum',
    date: formatBanglaMonthYear(new Date()),
    title: draft.title,
    excerpt: draft.excerpt,
    link: `blog/${slug}.html`,
    body: draft.body,
    generated: true,
    reviewRequired: true,
    reviewNotes: draft.reviewNotes,
    createdAt: new Date().toISOString()
  });

  topic.status = 'drafted';
  topic.generatedPostId = id;
  topic.generatedAt = new Date().toISOString();
  generatedCount += 1;
}

writeJson('data/blog-posts.json', posts);
writeJson('data/blog-topics.json', topics);
console.log(`Generated ${generatedCount} blog draft(s).`);
