import { createClient } from '@supabase/supabase-js'

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return createClient(url, anon)
}

function isDemo() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export interface Article {
  id: string
  slug: string
  title: string
  subtitle: string | null
  body_html: string | null
  body_html_ko: string | null
  excerpt: string
  category: string
  cover_image_url: string | null
  status: string
  reading_time_min: number | null
  author: string | null
  tags: string[] | null
  key_takeaways: string[] | null
  published_at: string | null
  created_at: string
}

// Map Supabase article → consistent shape
function toArticle(row: Record<string, unknown>): Article {
  return {
    id: row.id as string,
    slug: row.slug as string,
    title: row.title as string,
    subtitle: (row.subtitle as string) || null,
    body_html: (row.body_html as string) || null,
    body_html_ko: (row.body_html_ko as string) || null,
    excerpt: (row.subtitle as string) || (row.title as string) || '',
    category: (row.category as string) || 'other',
    cover_image_url: (row.cover_image_url as string) || null,
    status: (row.status as string) || 'published',
    reading_time_min: (row.reading_time_min as number) || null,
    author: (row.author as string) || 'TFF Editorial',
    tags: (row.tags as string[]) || [],
    key_takeaways: (row.key_takeaways as string[]) || [],
    published_at: (row.published_at as string) || (row.created_at as string),
    created_at: row.created_at as string,
  }
}

export async function getArticles(limit = 20, category?: string): Promise<Article[]> {
  if (isDemo()) return getMockArticles(limit, category)

  try {
    const sb = getClient()
    let q = sb
      .from('articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (category && category !== 'all') {
      q = q.eq('category', category)
    }

    const { data, error } = await q
    if (error || !data || data.length === 0) return getMockArticles(limit, category)
    return data.map(toArticle)
  } catch {
    return getMockArticles(limit, category)
  }
}

export async function getArticle(slug: string): Promise<Article | null> {
  if (isDemo()) {
    return getMockArticles(20).find(a => a.slug === slug) ?? getMockArticles(1)[0]
  }

  try {
    const sb = getClient()
    const { data, error } = await sb
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) return getMockArticles(20).find(a => a.slug === slug) ?? null
    return toArticle(data)
  } catch {
    return null
  }
}

// ── Mock articles (shown when DB is empty or env not set) ──────────────────
function getMockArticles(limit: number, category?: string): Article[] {
  const all: Article[] = [
    {
      id: '1', slug: 'amazon-commits-25b-more-to-anthropic',
      title: 'Amazon Commits $25B More to Anthropic, Total Investment Hits $33B',
      subtitle: 'The AWS partnership deepens as Anthropic becomes one of the most capitalised AI labs in history.',
      body_html: '<p>Amazon has committed an additional $25 billion to Anthropic, bringing the total investment to $33 billion. The deal grants AWS exclusive cloud rights and deeply integrates Claude models across Amazon\'s consumer and enterprise products.</p><p>The scale of the commitment signals Amazon\'s intention to match Microsoft\'s OpenAI partnership in depth and exclusivity.</p>',
      body_html_ko: '<p>아마존이 앤트로픽에 250억 달러를 추가 투자해 총 투자액이 330억 달러에 달했습니다.</p>',
      excerpt: 'The AWS partnership deepens as Anthropic becomes one of the most capitalised AI labs in history.',
      category: 'funding', cover_image_url: null, status: 'published',
      reading_time_min: 5, author: 'TFF Editorial', tags: ['funding', 'anthropic', 'amazon'],
      key_takeaways: ['$33B total — largest single-lab investment in AI history', 'AWS gets exclusive cloud rights for Claude deployment', 'Signals Big Tech AI war entering a consolidation phase'],
      published_at: '2026-04-21T00:04:00.000Z', created_at: '2026-04-21T00:04:00.000Z',
    },
    {
      id: '2', slug: 'cursor-talks-2b-raise-50b-valuation',
      title: 'Cursor in Talks for $2B Raise at $50B+ Valuation',
      subtitle: 'The AI code editor reaches unicorn status 10x over as developer tools see record investment.',
      body_html: '<p>Cursor, the AI-powered code editor, is in advanced talks to raise $2 billion at a valuation exceeding $50 billion, according to sources familiar with the matter.</p>',
      body_html_ko: '<p>AI 코드 에디터 Cursor가 500억 달러 이상의 밸류에이션으로 20억 달러 투자 유치 협상 중입니다.</p>',
      excerpt: 'The AI code editor reaches unicorn status 10x over as developer tools see record investment.',
      category: 'funding', cover_image_url: null, status: 'published',
      reading_time_min: 4, author: 'TFF Editorial', tags: ['funding', 'developer-tools'],
      key_takeaways: ['$50B valuation for a dev tool — new benchmark for AI-native software', 'Signals enterprise shift toward AI-first coding environments', 'GitHub Copilot faces first serious valuation challenger'],
      published_at: '2026-04-20T08:00:00.000Z', created_at: '2026-04-20T08:00:00.000Z',
    },
    {
      id: '3', slug: 'openai-122b-852b-valuation-largest-round',
      title: 'OpenAI Raises $122B at $852B Valuation — Largest Funding Round in History',
      subtitle: 'The ChatGPT maker approaches trillion-dollar territory as AGI timelines compress.',
      body_html: '<p>OpenAI has closed a $122 billion funding round at an $852 billion valuation, making it the largest private funding round in history. The capital will accelerate compute buildout and AGI research timelines.</p>',
      body_html_ko: '<p>OpenAI가 8520억 달러 밸류에이션으로 1220억 달러를 유치했습니다.</p>',
      excerpt: 'The ChatGPT maker approaches trillion-dollar territory as AGI timelines compress.',
      category: 'funding', cover_image_url: null, status: 'published',
      reading_time_min: 6, author: 'TFF Editorial', tags: ['funding', 'openai'],
      key_takeaways: ['$852B valuation — OpenAI is now worth more than most Fortune 100 companies', 'Capital goes directly to compute and AGI research', 'Institutional pressure mounts to convert to for-profit structure'],
      published_at: '2026-04-19T10:00:00.000Z', created_at: '2026-04-19T10:00:00.000Z',
    },
    {
      id: '4', slug: 'anthropic-claude-opus-47-major-gains',
      title: 'Anthropic Releases Claude Opus 4.7 with Major Coding and Vision Gains',
      subtitle: 'The new flagship model posts state-of-the-art results on HumanEval and surpasses GPT-4o on vision benchmarks.',
      body_html: '<p>Anthropic has released Claude Opus 4.7, delivering significant improvements in coding accuracy, vision understanding, and long-context reasoning. The model achieves 94.3% on HumanEval and sets new benchmarks for multi-modal reasoning.</p>',
      body_html_ko: '<p>Anthropic이 코딩과 비전 성능이 대폭 향상된 Claude Opus 4.7을 출시했습니다.</p>',
      excerpt: 'The new flagship model posts state-of-the-art results on HumanEval and surpasses GPT-4o on vision benchmarks.',
      category: 'model_release', cover_image_url: null, status: 'published',
      reading_time_min: 5, author: 'TFF Editorial', tags: ['model_release', 'anthropic', 'claude'],
      key_takeaways: ['94.3% HumanEval — strongest coding performance of any frontier model', 'Vision improvements close the gap with GPT-4o significantly', 'Extended context window enables new enterprise document workflows'],
      published_at: '2026-04-18T14:00:00.000Z', created_at: '2026-04-18T14:00:00.000Z',
    },
    {
      id: '5', slug: 'alphabet-closes-32b-wiz-acquisition',
      title: 'Alphabet Closes Record $32B Wiz Acquisition, Reshapes Cloud Security',
      subtitle: 'The largest acquisition in Google history positions GCP as the dominant cloud security platform.',
      body_html: '<p>Alphabet has closed its $32 billion acquisition of Wiz, the cloud security company. The deal, the largest in Google\'s history, integrates Wiz\'s CNAPP platform across GCP, AWS, and Azure environments.</p>',
      body_html_ko: '<p>알파벳이 클라우드 보안 기업 Wiz를 320억 달러에 인수 완료했습니다.</p>',
      excerpt: 'The largest acquisition in Google history positions GCP as the dominant cloud security platform.',
      category: 'acquisition', cover_image_url: null, status: 'published',
      reading_time_min: 5, author: 'TFF Editorial', tags: ['acquisition', 'google', 'security'],
      key_takeaways: ['$32B — largest acquisition in Alphabet history', 'Wiz CNAPP now embedded across all three major cloud platforms', 'Palo Alto and CrowdStrike face new competition from hyperscaler-backed security'],
      published_at: '2026-04-17T09:00:00.000Z', created_at: '2026-04-17T09:00:00.000Z',
    },
    {
      id: '6', slug: 'nvidia-invests-5b-intel-ai-chip-partnership',
      title: 'NVIDIA Invests $5B in Intel for AI Chip Partnership',
      subtitle: 'The chipmaking giants unite to challenge TSMC dominance and accelerate domestic AI hardware production.',
      body_html: '<p>NVIDIA has announced a $5 billion investment in Intel, forming a deep manufacturing and design partnership aimed at diversifying chip production away from TSMC and strengthening U.S. domestic AI hardware capacity.</p>',
      body_html_ko: '<p>NVIDIA가 인텔에 50억 달러를 투자해 AI 칩 파트너십을 구축합니다.</p>',
      excerpt: 'The chipmaking giants unite to challenge TSMC dominance and accelerate domestic AI hardware production.',
      category: 'partnership', cover_image_url: null, status: 'published',
      reading_time_min: 4, author: 'TFF Editorial', tags: ['partnership', 'nvidia', 'intel'],
      key_takeaways: ['$5B investment diversifies NVIDIA away from TSMC single-source dependency', 'U.S. domestic AI chip capacity gets major institutional backing', 'AMD faces a newly unified competitor across design and manufacturing'],
      published_at: '2026-04-16T11:00:00.000Z', created_at: '2026-04-16T11:00:00.000Z',
    },
    {
      id: '7', slug: 'openai-anthropic-launch-cybersecurity-ai',
      title: 'OpenAI and Anthropic Launch Cybersecurity AI Products Simultaneously',
      subtitle: 'Both labs enter the $200B enterprise security market with autonomous threat detection models.',
      body_html: '<p>OpenAI and Anthropic simultaneously announced enterprise cybersecurity AI products, marking a coordinated push into the $200 billion security market. The products target SOC automation and autonomous threat response.</p>',
      body_html_ko: '<p>OpenAI와 Anthropic이 사이버보안 AI 제품을 동시에 출시했습니다.</p>',
      excerpt: 'Both labs enter the $200B enterprise security market with autonomous threat detection models.',
      category: 'product_launch', cover_image_url: null, status: 'published',
      reading_time_min: 4, author: 'TFF Editorial', tags: ['product_launch', 'cybersecurity'],
      key_takeaways: ['Simultaneous launch signals coordinated market entry strategy', 'SOC automation is the immediate beachhead for both products', 'CrowdStrike and Palo Alto face AI-native competition from model labs'],
      published_at: '2026-04-15T08:00:00.000Z', created_at: '2026-04-15T08:00:00.000Z',
    },
    {
      id: '8', slug: 'eu-ai-act-high-risk-enforcement-2026',
      title: 'EU AI Act High-Risk Enforcement Begins: Fines Up to €35M or 7% of Revenue',
      subtitle: 'Companies deploying AI in healthcare, finance and law enforcement now face mandatory compliance audits.',
      body_html: '<p>The EU AI Act has entered its high-risk enforcement phase. Companies deploying AI systems in healthcare, financial services, and law enforcement must now demonstrate compliance or face fines up to €35 million or 7% of annual global turnover.</p>',
      body_html_ko: '<p>EU AI법의 고위험 시스템 집행이 시작됐습니다. 최대 3,500만 유로 또는 연매출 7% 벌금이 부과됩니다.</p>',
      excerpt: 'Companies deploying AI in healthcare, finance and law enforcement now face mandatory compliance audits.',
      category: 'regulation', cover_image_url: null, status: 'published',
      reading_time_min: 5, author: 'TFF Editorial', tags: ['regulation', 'eu', 'compliance'],
      key_takeaways: ['Healthcare and fintech AI deployments require immediate compliance documentation', '€35M fine cap applies per violation — multiple violations multiply exposure', 'US tech giants face largest compliance burden given EU market scale'],
      published_at: '2026-04-14T07:00:00.000Z', created_at: '2026-04-14T07:00:00.000Z',
    },
  ]

  const filtered = category && category !== 'all'
    ? all.filter(a => a.category === category)
    : all

  return filtered.slice(0, limit)
}
