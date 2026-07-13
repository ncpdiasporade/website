import {
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

const posts = readJson('data/blog-posts.json');
const topics = readJson('data/blog-topics.json');
const maxPosts = Number(process.env.BLOG_MAX_POSTS || config.blog.maxPostsPerRun || 1);
const generator = process.env.BLOG_GENERATOR || config.blog.generator || 'template';
const dryRun = process.env.BLOG_DRY_RUN === '1' || process.env.BLOG_DRY_RUN === 'true';
const existingTopicIds = new Set(posts.items.map((post) => post.topicId).filter(Boolean));
const existingSlugs = new Set(posts.items.map((post) => post.slug).filter(Boolean));
const readyTopics = topics.items
  .filter((topic) => topic.status === 'ready' && !existingTopicIds.has(topic.id))
  .slice(0, maxPosts);

if (!readyTopics.length) {
  console.log('No ready blog topics found.');
  process.exit(0);
}

function splitContext(context) {
  return String(context || '')
    .split(/[,;।|\n]| এবং | ও /)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function buildTemplateDraft(topic) {
  const tag = topic.tag || config.blog.defaultTag || 'ডায়াস্পোরা';
  const contextParts = splitContext(topic.context);
  const firstContext = contextParts[0] || 'প্রবাসী নাগরিক অংশগ্রহণ';
  const secondContext = contextParts[1] || 'বাংলাদেশের গণতান্ত্রিক ভবিষ্যৎ';
  const thirdContext = contextParts[2] || 'জার্মানির বাংলাদেশি কমিউনিটি';
  const contextSentence = contextParts.length
    ? contextParts.join(', ')
    : 'প্রবাসী নাগরিক অংশগ্রহণ, গণতন্ত্র এবং কমিউনিটি নেতৃত্ব';

  return {
    title: topic.title,
    excerpt: `${firstContext} ও ${secondContext} প্রসঙ্গে এই খসড়াটি প্রবাসী বাংলাদেশিদের ভূমিকা, দায়িত্ব এবং সম্পাদকীয় আলোচনার জন্য মূল পয়েন্টগুলো সাজিয়ে দেয়।`,
    tag,
    body: [
      `${topic.title} প্রশ্নটি শুধু একটি নীতিগত আলোচনা নয়; এটি প্রবাসী বাংলাদেশিদের নাগরিক মর্যাদা, অংশগ্রহণ এবং বাংলাদেশের ভবিষ্যৎ নিয়ে দায়িত্বশীল ভাবনার অংশ। ${contextSentence} - এই প্রেক্ষাপটগুলো একসঙ্গে দেখলে বোঝা যায়, ডায়াস্পোরার কণ্ঠস্বর এখন আর প্রান্তিক নয়।`,
      `জার্মানিতে বসবাসরত বাংলাদেশিরা শিক্ষা, পেশা, শ্রম, গবেষণা, উদ্যোক্তা উদ্যোগ এবং সামাজিক সংগঠনের মাধ্যমে দুই দেশের অভিজ্ঞতাকে একসঙ্গে বহন করেন। তাই ${firstContext} নিয়ে আলোচনায় তাঁদের অভিজ্ঞতা বাস্তব, বহুমাত্রিক এবং নীতিনির্ধারণের জন্য গুরুত্বপূর্ণ।`,
      `${secondContext} প্রসঙ্গটি শক্তিশালী করতে হলে প্রবাসীদের সঙ্গে সম্পর্ককে শুধু রেমিট্যান্সের ভাষায় দেখা যথেষ্ট নয়। রাজনৈতিক অধিকার, তথ্যপ্রাপ্তি, স্বচ্ছ সেবা, সাংগঠনিক অংশগ্রহণ এবং নতুন প্রজন্মের নেতৃত্বকে একই কাঠামোর ভেতরে ভাবতে হবে।`,
      `${thirdContext} প্রসঙ্গটি এই আলোচনায় একটি বিশেষ ক্ষেত্র তৈরি করে। এখানে নাগরিক শৃঙ্খলা, গণতান্ত্রিক সংস্কৃতি, স্বেচ্ছাসেবা এবং বহুসাংস্কৃতিক সহাবস্থানের অভিজ্ঞতা আছে। এই অভিজ্ঞতা বাংলাদেশের গণতান্ত্রিক পুনর্গঠন ও কমিউনিটি নেতৃত্বে নতুন ধারণা যোগ করতে পারে।`,
      `তবে এই বিষয়ে যেকোনো প্রকাশনা সতর্কতার সঙ্গে করতে হবে। যাচাই করা তথ্য, সংযত ভাষা, অন্তর্ভুক্তিমূলক অবস্থান এবং স্পষ্ট সম্পাদকীয় দায়িত্ব ছাড়া রাজনৈতিক বা সামাজিক বিষয়ে লেখা সহজেই ভুল বোঝাবুঝি তৈরি করতে পারে।`,
      `NCP Diaspora Alliance Germany-এর Writing Forum এই কারণে একটি পর্যালোচনাভিত্তিক লেখার সংস্কৃতি গড়তে পারে। লক্ষ্য হওয়া উচিত উত্তেজনা নয়, বরং যুক্তি, ন্যায়, গণতান্ত্রিক অংশগ্রহণ এবং বৈষম্যমুক্ত বাংলাদেশের পক্ষে প্রবাসী কণ্ঠকে সুসংগঠিত করা।`
    ],
    reviewNotes: `Free template draft generated from topic context. Editorial team should verify facts, add concrete sources if needed, and improve voice before publishing. Topic notes: ${topic.notes || 'None.'}`,
    generator: 'template'
  };
}

function extractJsonObject(value) {
  const text = String(value || '').trim();
  if (!text) throw new Error('Empty model response');

  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) throw new Error('Model response did not contain JSON');
    return JSON.parse(text.slice(start, end + 1));
  }
}

function normalizeDraft(topic, draft, fallbackGenerator) {
  const fallback = buildTemplateDraft(topic);
  const body = Array.isArray(draft.body)
    ? draft.body.map((paragraph) => String(paragraph || '').trim()).filter(Boolean)
    : [];
  const uniqueParagraphs = new Set(body.map((paragraph) => paragraph.replace(/\s+/g, ' ').slice(0, 120)));
  const averageLength = body.length
    ? body.reduce((sum, paragraph) => sum + paragraph.length, 0) / body.length
    : 0;
  const hasUsefulBody = body.length >= 3 && uniqueParagraphs.size >= 3 && averageLength >= 90;
  const title = String(draft.title || topic.title).trim();
  const excerpt = String(draft.excerpt || fallback.excerpt).trim();

  if (!hasUsefulBody || title.length < 12 || excerpt.length < 40) {
    return {
      ...fallback,
      reviewNotes: `${fallback.reviewNotes} ${fallbackGenerator === 'ollama' ? 'Ollama output was too short or repetitive, so the free template fallback was used.' : ''}`.trim(),
      generator: fallbackGenerator === 'ollama' ? 'template-fallback' : fallback.generator
    };
  }

  return {
    title,
    excerpt,
    tag: String(draft.tag || topic.tag || config.blog.defaultTag || fallback.tag).trim(),
    body: body.length >= 3 ? body.slice(0, 9) : fallback.body,
    reviewNotes: String(draft.reviewNotes || fallback.reviewNotes).trim(),
    generator: draft.generator || fallbackGenerator
  };
}

async function generateWithOllama(topic) {
  const baseUrl = process.env.OLLAMA_BASE_URL || config.blog.ollama?.baseUrl || 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL || config.blog.ollama?.model;

  if (!model) {
    throw new Error('OLLAMA_MODEL is not configured');
  }

  const prompt = `
You are a careful Bangla editorial assistant for NCP Diaspora Alliance Germany.
Return JSON only. No markdown. No commentary.

Required JSON shape:
{
  "title": "string",
  "excerpt": "string",
  "tag": "string",
  "body": ["paragraph 1", "paragraph 2", "paragraph 3", "paragraph 4", "paragraph 5"],
  "reviewNotes": "string"
}

Draft a civic, factual, non-inflammatory Bangla blog article.
Do not invent specific dates, statistics, named people, quotes, or events.
If something is analysis, write it as analysis rather than fact.

Topic:
- Title: ${topic.title}
- Tag: ${topic.tag || config.blog.defaultTag}
- Context: ${topic.context}
- Notes: ${topic.notes || 'No extra notes.'}
- Voice: ${config.blog.siteVoice}
`;

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: 'json',
      options: {
        temperature: 0.35,
        top_p: 0.9
      }
    }),
    signal: AbortSignal.timeout(Number(process.env.OLLAMA_TIMEOUT_MS || 60000))
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama request failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  const draft = extractJsonObject(data.response);
  const normalized = normalizeDraft(topic, draft, 'ollama');

  return {
    ...normalized,
    model: normalized.generator === 'ollama' ? model : undefined
  };
}

async function generatePost(topic) {
  if (generator === 'template') return buildTemplateDraft(topic);

  if (generator === 'ollama' || generator === 'auto') {
    try {
      return await generateWithOllama(topic);
    } catch (error) {
      console.warn(`Ollama generation unavailable; using template draft. ${error.message}`);
      return buildTemplateDraft(topic);
    }
  }

  console.warn(`Unknown BLOG_GENERATOR "${generator}"; using template draft.`);
  return buildTemplateDraft(topic);
}

let generatedCount = 0;
const preview = [];

for (const topic of readyTopics) {
  const draft = normalizeDraft(topic, await generatePost(topic), generator);
  const slug = uniqueSlug(slugify(draft.title, topic.id), existingSlugs);
  const id = slug;
  const post = {
    id,
    slug,
    topicId: topic.id,
    status: 'published',
    tag: draft.tag,
    author: config.blog.defaultAuthor || 'Writing Forum',
    date: formatBanglaMonthYear(new Date()),
    title: draft.title,
    excerpt: draft.excerpt,
    link: `blog/${slug}.html`,
    body: draft.body,
    generated: true,
    generator: draft.generator,
    model: draft.model,
    reviewRequired: true,
    reviewNotes: draft.reviewNotes,
    createdAt: new Date().toISOString()
  };

  preview.push(post);

  if (!dryRun) {
    posts.items.unshift(post);
    topic.status = 'drafted';
    topic.generatedPostId = id;
    topic.generatedAt = new Date().toISOString();
  }

  generatedCount += 1;
}

if (dryRun) {
  console.log(`Dry run generated ${generatedCount} blog draft preview(s):`);
  console.log(JSON.stringify(preview, null, 2));
  process.exit(0);
}

writeJson('data/blog-posts.json', posts);
writeJson('data/blog-topics.json', topics);
console.log(`Generated ${generatedCount} blog draft(s) with ${generator} generator.`);
