import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

// ── Auth ──────────────────────────────────────────────────────────────────────
function isAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return true // dev: no secret = open
  return req.headers.get('authorization') === `Bearer ${secret}`
}

// ── Supabase (service role for writes) ────────────────────────────────────────
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// ── RSS feeds ─────────────────────────────────────────────────────────────────
const FEEDS = [
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://venturebeat.com/category/ai/feed/',
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://feeds.feedburner.com/TechCrunch/',
]

interface RSSItem {
  title: string
  link: string
  description: string
  pubDate: string
}

function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = []
  const re = /<item[\s>]([\s\S]*?)<\/item>/g
  let m
  while ((m = re.exec(xml)) !== null) {
    const s = m[1]
    const title = (
      s.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
      s.match(/<title>([\s\S]*?)<\/title>/)?.[1] || ''
    ).trim()
    const link = (
      s.match(/<link>([\s\S]*?)<\/link>/)?.[1] ||
      s.match(/<link[^>]*href="([^"]+)"/)?.[1] || ''
    ).trim()
    const description = (
      s.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ||
      s.match(/<description>([\s\S]*?)<\/description>/)?.[1] || ''
    ).replace(/<[^>]+>/g, '').slice(0, 600).trim()
    const pubDate = s.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || ''
    if (title && link) items.push({ title, link, description, pubDate })
  }
  return items.slice(0, 5)
}

async function fetchFeed(url: string): Promise<RSSItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []
    return parseRSS(await res.text())
  } catch {
    return []
  }
}

// ── Slug ──────────────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
    .replace(/-$/, '')
}

// ── Claude article generation ─────────────────────────────────────────────────
const SYSTEM = `You are TechFastForward's editorial AI. You write deeply analytical AI and tech industry articles in Korean.

Rules:
- Title: Korean (한국어), punchy and curiosity-inducing
- Body: Korean, rich with hidden insights, contrarian angles, and "what this really means" analysis
- Use <h2> for main sections, <h3> for sub-points
- Use <strong> for key numbers and terms
- Use <blockquote> for the sharpest insight in the article (one per article)
- Reading time 5–8 min worth of content
- ALWAYS end the article with these three elements in order:
  1. <hr/>
  2. <div class="summary-box"><h3>핵심 요약</h3><ul>exactly 5 <li> items with key facts/data</ul></div>
  3. <div class="think-box"><h3>더 생각해볼 것들</h3><ol>exactly 3 <li> thought-provoking questions</ol></div>`

function buildPrompt(item: RSSItem): string {
  return `Write a full TechFastForward article for this news item:

Title: ${item.title}
Source: ${item.link}
Summary: ${item.description}

Return ONLY raw JSON — no markdown fences, no explanation. Exactly this shape:
{
  "title": "Korean article title",
  "subtitle": "English one-sentence excerpt under 160 chars",
  "category": "one of: funding | model_release | technology | product_launch | acquisition | partnership | regulation | other",
  "tags": ["tag1", "tag2", "tag3"],
  "reading_time_min": 6,
  "key_takeaways": ["point 1", "point 2", "point 3"],
  "body_html": "full Korean HTML article with h2/h3/p/strong/blockquote/hr/summary-box/think-box",
  "body_html_ko": "(same as body_html)"
}`
}

interface GeneratedArticle {
  title: string
  subtitle: string
  category: string
  tags: string[]
  reading_time_min: number
  key_takeaways: string[]
  body_html: string
  body_html_ko: string
}

async function generateArticle(item: RSSItem): Promise<GeneratedArticle | null> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: SYSTEM,
      messages: [{ role: 'user', content: buildPrompt(item) }],
    })
    const raw = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
    // strip accidental markdown fences if any
    const json = raw.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(json) as GeneratedArticle
  } catch (e) {
    console.error('[collect-news] Claude error:', e)
    return null
  }
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 })
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 })
  }

  const sb = getSupabase()

  // Get recent slugs to deduplicate
  const { data: existing } = await sb
    .from('articles')
    .select('slug')
    .order('created_at', { ascending: false })
    .limit(300)
  const existingSlugs = new Set((existing ?? []).map((r: { slug: string }) => r.slug))

  // Fetch feeds in parallel
  const allItems = (await Promise.all(FEEDS.map(fetchFeed))).flat()

  // Deduplicate and pick new items (max 3 per run to control API cost)
  const seen = new Set<string>()
  const toProcess: RSSItem[] = []
  for (const item of allItems) {
    const slug = slugify(item.title)
    if (!seen.has(slug) && !existingSlugs.has(slug)) {
      seen.add(slug)
      toProcess.push(item)
    }
    if (toProcess.length >= 3) break
  }

  if (toProcess.length === 0) {
    return NextResponse.json({ published: 0, message: 'No new items' })
  }

  // Generate articles sequentially (avoids rate-limit spikes)
  const published: string[] = []
  const failed: string[] = []

  for (const item of toProcess) {
    const article = await generateArticle(item)
    if (!article) {
      failed.push(item.title)
      continue
    }

    const slug = slugify(article.title || item.title)
    const now = new Date().toISOString()

    const { error } = await sb.from('articles').insert({
      slug,
      title: article.title,
      title_ko: article.title,      // Korean title (same — generated in KO)
      subtitle: article.subtitle,
      subtitle_ko: article.subtitle,
      body_html: article.body_html,
      body_html_ko: article.body_html_ko,
      category: article.category || 'other',
      tags: article.tags ?? [],
      key_takeaways: article.key_takeaways ?? [],
      reading_time_min: article.reading_time_min ?? 6,
      author: 'TFF Editorial',
      status: 'published',
      language: 'en',
      has_ko: true,
      cover_gen_attempts: 0,
      published_at: now,
      created_at: now,
    })

    if (error) {
      console.error('[collect-news] Supabase insert error:', error)
      failed.push(slug)
    } else {
      published.push(slug)
    }
  }

  return NextResponse.json({
    published: published.length,
    slugs: published,
    failed: failed.length > 0 ? failed : undefined,
    timestamp: new Date().toISOString(),
  })
}
