import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const file = (...parts) => path.join(rootDir, ...parts);

const configPath = file('config', 'blog-agent.json');
const promptPath = file('prompts', 'bangladesh-accountability-analyst.md');
const blogPath = file('data', 'blog-posts.json');
const queuePath = file('data', 'blog-agent-review-queue.json');
const runsPath = file('data', 'blog-agent-runs.json');

function readJson(target) {
  return JSON.parse(fs.readFileSync(target, 'utf8'));
}

function writeJson(target, value) {
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function cleanInput(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function environmentValue(name, fallback = '') {
  return cleanInput(process.env[name]) || cleanInput(fallback);
}

function slugify(value) {
  return cleanInput(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function responseText(response) {
  if (typeof response.output_text === 'string' && response.output_text.trim()) return response.output_text.trim();
  return (response.output || [])
    .filter((item) => item.type === 'message')
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === 'output_text')
    .map((content) => content.text || '')
    .join('\n')
    .trim();
}

function parseJsonText(text) {
  const stripped = cleanInput(text).replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  return JSON.parse(stripped);
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid)/i.test(key)) url.searchParams.delete(key);
    }
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return url.toString();
  } catch {
    return '';
  }
}

function collectResearchSources(value, found = new Map()) {
  if (!value || typeof value !== 'object') return found;
  if (!Array.isArray(value) && typeof value.url === 'string' && /^https:\/\//i.test(value.url)) {
    const normalized = normalizeUrl(value.url);
    if (normalized) found.set(normalized, { url: value.url, title: cleanInput(value.title || value.name) });
  }
  for (const child of Array.isArray(value) ? value : Object.values(value)) collectResearchSources(child, found);
  return found;
}

async function createResponse(apiKey, body) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `${response.status} ${response.statusText}`;
    throw new Error(`OpenAI Responses API request failed: ${message}`);
  }
  return payload;
}

function outputSchema() {
  const source = {
    type: 'object',
    additionalProperties: false,
    required: ['organisation', 'title', 'publication_date', 'url', 'tier'],
    properties: {
      organisation: { type: 'string' },
      title: { type: 'string' },
      publication_date: { type: 'string' },
      url: { type: 'string' },
      tier: { type: 'string', enum: ['primary', 'international', 'journalism', 'research'] }
    }
  };
  return {
    type: 'object',
    additionalProperties: false,
    required: [
      'article_status', 'topic', 'research_reason', 'evidence_score', 'confidence', 'title',
      'seo_title', 'slug', 'meta_description', 'excerpt', 'categories', 'tags', 'article_blocks',
      'key_data', 'government_position', 'analytical_findings', 'featured_image_concept', 'sources',
      'fact_check_status'
    ],
    properties: {
      article_status: { type: 'string', enum: ['PUBLISH', 'REVIEW', 'REJECT'] },
      topic: { type: 'string' },
      research_reason: { type: 'string' },
      evidence_score: { type: 'integer', minimum: 0, maximum: 100 },
      confidence: { type: 'string', enum: ['HIGH', 'MEDIUM', 'LOW'] },
      title: { type: 'string' },
      seo_title: { type: 'string' },
      slug: { type: 'string' },
      meta_description: { type: 'string' },
      excerpt: { type: 'string' },
      categories: { type: 'array', minItems: 1, maxItems: 3, items: { type: 'string' } },
      tags: { type: 'array', minItems: 5, maxItems: 10, items: { type: 'string' } },
      article_blocks: {
        type: 'array',
        minItems: 8,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['type', 'text', 'items'],
          properties: {
            type: { type: 'string', enum: ['heading', 'paragraph', 'callout', 'list'] },
            text: { type: 'string' },
            items: { type: 'array', items: { type: 'string' } }
          }
        }
      },
      key_data: {
        type: 'array',
        minItems: 3,
        maxItems: 8,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['value', 'label'],
          properties: { value: { type: 'string' }, label: { type: 'string' } }
        }
      },
      government_position: { type: 'string' },
      analytical_findings: { type: 'array', minItems: 2, maxItems: 8, items: { type: 'string' } },
      featured_image_concept: { type: 'string' },
      sources: { type: 'array', minItems: 3, maxItems: 12, items: source },
      fact_check_status: { type: 'string', enum: ['PASS', 'NEEDS_REVIEW'] }
    }
  };
}

function renderRole(template, values) {
  return template.replace(/\{\{([A-Z_]+)\}\}/g, (_match, key) => values[key] ?? '');
}

function publicationDecision(result, config, researchSources, duplicate) {
  const reasons = [];
  if (result.article_status !== 'PUBLISH') reasons.push(`model status is ${result.article_status}`);
  if (result.evidence_score < config.minimumEvidenceScore) reasons.push(`evidence score is below ${config.minimumEvidenceScore}`);
  if (result.fact_check_status !== 'PASS') reasons.push('fact check did not pass');
  if (result.confidence === 'LOW') reasons.push('confidence is low');
  if (result.sources.length < config.minimumSources) reasons.push(`fewer than ${config.minimumSources} sources`);
  if (config.requireInstitutionalSource && !result.sources.some((source) => ['primary', 'international'].includes(source.tier))) {
    reasons.push('no primary or international institutional source');
  }
  const unverified = result.sources.filter((source) => !researchSources.has(normalizeUrl(source.url)));
  if (unverified.length) reasons.push(`${unverified.length} source URL(s) were not returned by the research pass`);
  if (duplicate) reasons.push('slug duplicates an existing article or queued item');
  if (config.publicationMode === 'review-only') reasons.push('publication mode requires editorial review');
  return { publish: reasons.length === 0, reasons };
}

function toSiteArticle(result, now, timezone) {
  const slug = slugify(result.slug);
  const imageAlt = 'বাংলাদেশের সরকার, অর্থনীতি ও জননীতির জবাবদিহিমূলক বিশ্লেষণের সম্পাদকীয় ইলাস্ট্রেশন';
  const imageCredit = 'NCP Diaspora Alliance Germany-এর জন্য তৈরি মৌলিক সম্পাদকীয় ইলাস্ট্রেশন।';
  return {
    id: slug,
    slug,
    status: 'published',
    tag: result.categories[0],
    author: 'সম্পাদকীয় ডেস্ক',
    date: new Intl.DateTimeFormat('bn-BD', { dateStyle: 'long', timeZone: timezone }).format(now),
    title: result.title,
    excerpt: result.excerpt,
    image: 'img/blog/governance-analysis.svg',
    sharePath: `blog/${slug}`,
    shareImage: 'img/blog/governance-analysis-share.jpg',
    shareImageWidth: 1200,
    shareImageHeight: 630,
    publishedAt: now.toISOString(),
    imageAlt,
    imageCredit,
    license: 'Original editorial illustration — NCP Diaspora Alliance Germany.',
    imageSourceUrl: 'https://ncpdagermany.de/',
    facts: result.key_data,
    blocks: result.article_blocks.map((block) => block.type === 'list'
      ? { type: 'list', items: block.items }
      : { type: block.type, text: block.text }),
    sources: result.sources.map((source) => ({
      label: `${source.organisation} — ${source.title}${source.publication_date ? ` (${source.publication_date})` : ''}`,
      url: source.url
    })),
    translations: {
      en: { imageAlt: 'Editorial illustration for evidence-based analysis of Bangladesh government and public policy', imageCredit },
      de: { imageAlt: 'Redaktionelle Illustration zur evidenzbasierten Analyse von Regierung und Politik in Bangladesch', imageCredit }
    },
    automation: {
      generatedAt: now.toISOString(),
      modelStatus: result.article_status,
      evidenceScore: result.evidence_score,
      confidence: result.confidence,
      factCheckStatus: result.fact_check_status,
      researchReason: result.research_reason,
      governmentPosition: result.government_position,
      analyticalFindings: result.analytical_findings,
      featuredImageConcept: result.featured_image_concept,
      seoTitle: result.seo_title,
      metaDescription: result.meta_description,
      categories: result.categories,
      tags: result.tags
    }
  };
}

function validateConfiguration(config, role) {
  const errors = [];
  if (!config.model) errors.push('config.model is required');
  if (!['quality-gated', 'review-only'].includes(config.publicationMode)) errors.push('publicationMode must be quality-gated or review-only');
  if (!Number.isInteger(config.minimumEvidenceScore) || config.minimumEvidenceScore < 80) errors.push('minimumEvidenceScore must be an integer of at least 80');
  if (!Array.isArray(config.preferredTopics) || !config.preferredTopics.length) errors.push('preferredTopics must not be empty');
  for (const token of ['{{CURRENT_DATE}}', '{{TIMEZONE}}', '{{CONTEXT}}', '{{TOPICS}}', '{{REQUIREMENTS}}', '{{RECENT_TOPICS}}']) {
    if (!role.includes(token)) errors.push(`role prompt is missing ${token}`);
  }
  if (errors.length) throw new Error(errors.join('; '));
}

async function main() {
  const config = readJson(configPath);
  if (cleanInput(process.env.BLOG_AGENT_PUBLICATION_MODE)) config.publicationMode = cleanInput(process.env.BLOG_AGENT_PUBLICATION_MODE);
  const roleTemplate = fs.readFileSync(promptPath, 'utf8');
  validateConfiguration(config, roleTemplate);
  if (process.argv.includes('--check')) {
    console.log('Automated Blog Agent configuration and prompt are valid.');
    return;
  }

  const apiKey = cleanInput(process.env.OPENAI_API_KEY);
  if (!apiKey) throw new Error('OPENAI_API_KEY is required. Add it as a GitHub Actions secret or local environment variable.');

  const blogData = readJson(blogPath);
  const queueData = readJson(queuePath);
  const runsData = readJson(runsPath);
  const now = new Date();
  const recent = (blogData.items || []).slice(0, config.maxRecentTopics).map((item) => `${item.date}: ${item.title}`);
  const role = renderRole(roleTemplate, {
    CURRENT_DATE: now.toISOString(),
    TIMEZONE: config.timezone,
    CONTEXT: environmentValue('BLOG_AGENT_CONTEXT', config.context) || 'কোনো অতিরিক্ত প্রশাসনিক প্রেক্ষাপট দেওয়া হয়নি।',
    TOPICS: environmentValue('BLOG_AGENT_TOPICS', config.preferredTopics.join(', ')),
    REQUIREMENTS: environmentValue('BLOG_AGENT_REQUIREMENTS', config.additionalRequirements),
    RECENT_TOPICS: recent.length ? recent.join('\n') : 'কোনো সাম্প্রতিক লেখা নেই।'
  });

  const research = await createResponse(apiKey, {
    model: environmentValue('OPENAI_BLOG_MODEL', config.model),
    reasoning: { effort: config.reasoningEffort },
    tools: [{ type: 'web_search' }],
    include: ['web_search_call.action.sources'],
    max_output_tokens: 18000,
    input: `${role}\n\n# RESEARCH PASS\nSearch broadly, generate and compare several candidates, then prepare a detailed research dossier for the strongest qualifying issue. Include the current-government verification, exact event dates, the government's position, historical comparisons, calculations, counter-evidence, claim confidence, and source citations. Do not draft the final article yet.`
  });
  const dossier = responseText(research);
  if (!dossier) throw new Error('The research pass returned no text.');
  const researchSources = collectResearchSources(research);
  if (researchSources.size < config.minimumSources) {
    throw new Error(`Research returned only ${researchSources.size} inspectable source URL(s); at least ${config.minimumSources} are required.`);
  }

  const allowedSourceList = [...researchSources.values()]
    .map((source, index) => `${index + 1}. ${source.title || 'Untitled source'} — ${source.url}`)
    .join('\n');
  const editorial = await createResponse(apiKey, {
    model: environmentValue('OPENAI_BLOG_MODEL', config.model),
    reasoning: { effort: config.reasoningEffort },
    max_output_tokens: 22000,
    text: {
      format: {
        type: 'json_schema',
        name: 'bangladesh_accountability_article',
        strict: true,
        schema: outputSchema()
      }
    },
    input: `${role}\n\n# VERIFIED RESEARCH DOSSIER\n${dossier}\n\n# ALLOWED SOURCE URLS\n${allowedSourceList}\n\n# EDITORIAL AND FACT-CHECK PASS\nWrite and independently check the final Bengali analysis. Use only source URLs in the allowed list. For non-list blocks, return an empty items array. For list blocks, return an empty text string. If the evidence does not support a critical accountability article, return REVIEW or REJECT honestly.`
  });
  const result = parseJsonText(responseText(editorial));
  result.slug = slugify(result.slug);
  if (!result.slug) throw new Error('The editorial pass returned an invalid empty slug.');

  const existingIds = new Set([
    ...(blogData.items || []).flatMap((item) => [item.id, item.slug]),
    ...(queueData.items || []).map((item) => item.result?.slug)
  ].filter(Boolean));
  const decision = publicationDecision(result, config, researchSources, existingIds.has(result.slug));
  let outcome = 'REJECTED';

  if (result.article_status !== 'REJECT' && decision.publish) {
    blogData.items = [toSiteArticle(result, now, config.timezone), ...(blogData.items || [])];
    writeJson(blogPath, blogData);
    outcome = 'PUBLISHED';
  } else if (result.article_status !== 'REJECT') {
    queueData.updatedAt = now.toISOString();
    queueData.items = [{
      id: `${now.toISOString().replace(/[:.]/g, '-')}-${result.slug}`,
      createdAt: now.toISOString(),
      status: 'pending-review',
      gateReasons: decision.reasons,
      researchSourceUrls: [...researchSources.values()],
      result
    }, ...(queueData.items || [])].slice(0, 50);
    writeJson(queuePath, queueData);
    outcome = 'QUEUED_FOR_REVIEW';
  }

  runsData.updatedAt = now.toISOString();
  runsData.items = [{
    runAt: now.toISOString(),
    outcome,
    topic: result.topic,
    slug: result.slug,
    model: environmentValue('OPENAI_BLOG_MODEL', config.model),
    modelStatus: result.article_status,
    evidenceScore: result.evidence_score,
    factCheckStatus: result.fact_check_status,
    sourceCount: result.sources.length,
    gateReasons: decision.reasons
  }, ...(runsData.items || [])].slice(0, 100);
  writeJson(runsPath, runsData);

  const summary = [
    `Automated Blog Agent outcome: ${outcome}`,
    `Topic: ${result.topic}`,
    `Slug: ${result.slug}`,
    `Evidence: ${result.evidence_score}/100`,
    `Fact check: ${result.fact_check_status}`,
    `Sources: ${result.sources.length}`,
    decision.reasons.length ? `Gate reasons: ${decision.reasons.join('; ')}` : 'Gate reasons: none'
  ].join('\n');
  console.log(summary);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
