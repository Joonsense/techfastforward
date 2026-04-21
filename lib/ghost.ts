const GHOST_URL = process.env.GHOST_URL || '';
const GHOST_KEY = process.env.GHOST_CONTENT_KEY || '';

export interface GhostPost {
  id: string;
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  reading_time: number;
  tags: Array<{ id: string; name: string; slug: string }>;
  authors: Array<{ id: string; name: string; slug: string }>;
  primary_tag?: { name: string; slug: string } | null;
  primary_author?: { name: string; slug: string } | null;
}

export async function getPosts(limit = 10): Promise<GhostPost[]> {
  if (!GHOST_URL || !GHOST_KEY || GHOST_KEY === 'placeholder') {
    return getMockPosts(limit);
  }

  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&limit=${limit}&include=tags,authors&formats=html`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return getMockPosts(limit);
    const data = await res.json();
    return data.posts || [];
  } catch {
    return getMockPosts(limit);
  }
}

export async function getPost(slug: string): Promise<GhostPost | null> {
  if (!GHOST_URL || !GHOST_KEY || GHOST_KEY === 'placeholder') {
    return getMockPosts(20).find((p) => p.slug === slug) ?? getMockPosts(1)[0];
  }

  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/slug/${slug}/?key=${GHOST_KEY}&include=tags,authors&formats=html`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.posts?.[0] || null;
  } catch {
    return null;
  }
}

export async function getPostsByTag(tag: string, limit = 10): Promise<GhostPost[]> {
  if (!GHOST_URL || !GHOST_KEY || GHOST_KEY === 'placeholder') {
    return getMockPosts(limit).filter(
      (p) => p.primary_tag?.slug === tag || p.tags.some((t) => t.slug === tag)
    );
  }

  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&limit=${limit}&filter=tag:${tag}&include=tags,authors&formats=html`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch {
    return [];
  }
}

// ─── Mock data for demo mode ────────────────────────────────────────────────

function getMockPosts(limit: number): GhostPost[] {
  const posts: GhostPost[] = [
    {
      id: '1',
      slug: 'openai-raises-6b-series-c-at-157b-valuation',
      title: 'OpenAI Raises $6.6B Series C at $157B Valuation, Eyes AGI Timeline',
      html: '<p>OpenAI has closed a landmark funding round...</p>',
      excerpt: 'The ChatGPT maker secures one of the largest private funding rounds in history, with investors betting on an AGI breakthrough by 2027.',
      feature_image: null,
      published_at: '2026-04-20T09:00:00.000Z',
      reading_time: 5,
      tags: [{ id: '1', name: 'Funding', slug: 'funding' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Funding', slug: 'funding' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '2',
      slug: 'anthropic-claude-4-opus-benchmark-leak',
      title: 'Leaked Benchmarks Show Claude 4 Opus Outperforms GPT-5 on Reasoning',
      html: '<p>Internal benchmark scores obtained by TechFastForward...</p>',
      excerpt: 'Leaked internal evaluations suggest Anthropic\'s next flagship model achieves state-of-the-art results on MMLU, HumanEval, and MATH benchmarks.',
      feature_image: null,
      published_at: '2026-04-19T14:30:00.000Z',
      reading_time: 4,
      tags: [{ id: '2', name: 'Model Release', slug: 'model_release' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Model Release', slug: 'model_release' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '3',
      slug: 'google-deepmind-acquires-isomorphic-labs',
      title: 'Google DeepMind Acquires Isomorphic Labs for $3.1B to Accelerate Drug Discovery',
      html: '<p>In a move that consolidates Google\'s AI dominance...</p>',
      excerpt: 'The acquisition brings together AlphaFold\'s protein prediction capabilities with Isomorphic\'s drug design platform under one roof.',
      feature_image: null,
      published_at: '2026-04-18T11:00:00.000Z',
      reading_time: 6,
      tags: [{ id: '3', name: 'Acquisition', slug: 'acquisition' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Acquisition', slug: 'acquisition' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '4',
      slug: 'mistral-le-chat-enterprise-launch',
      title: 'Mistral Launches Le Chat Enterprise with Real-Time Web Search and Code Execution',
      html: '<p>French AI startup Mistral has officially launched...</p>',
      excerpt: 'The enterprise offering targets Fortune 500 companies with on-premise deployment, SOC 2 compliance, and a new 128K context window model.',
      feature_image: null,
      published_at: '2026-04-17T08:00:00.000Z',
      reading_time: 3,
      tags: [{ id: '4', name: 'Product Launch', slug: 'product_launch' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Product Launch', slug: 'product_launch' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '5',
      slug: 'nvidia-blackwell-ultra-announced-b300',
      title: 'Nvidia Announces Blackwell Ultra B300: 2x Performance Over H100 at Same Power',
      html: '<p>Jensen Huang unveiled the next generation...</p>',
      excerpt: 'The new B300 architecture promises a step-change in inference throughput, positioning Nvidia ahead of AMD and Intel in the AI accelerator race.',
      feature_image: null,
      published_at: '2026-04-16T16:45:00.000Z',
      reading_time: 5,
      tags: [{ id: '5', name: 'Technology', slug: 'technology' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Technology', slug: 'technology' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '6',
      slug: 'apple-intelligence-on-device-llm-expansion',
      title: 'Apple Intelligence Expands On-Device LLM to MacBook Air M4 — No Cloud Required',
      html: '<p>Apple has begun rolling out an expanded Apple Intelligence...</p>',
      excerpt: 'The new on-device model runs entirely locally with no data leaving the device, marking a major privacy-first milestone for consumer AI.',
      feature_image: null,
      published_at: '2026-04-15T10:00:00.000Z',
      reading_time: 4,
      tags: [{ id: '5', name: 'Technology', slug: 'technology' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Technology', slug: 'technology' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '7',
      slug: 'cohere-raises-500m-enterprise-ai',
      title: 'Cohere Closes $500M Round to Compete with OpenAI\'s Enterprise Offering',
      html: '<p>Cohere, the enterprise-focused AI company...</p>',
      excerpt: 'The funding will accelerate Cohere\'s Command R+ deployment across Fortune 100 clients, directly challenging OpenAI\'s rapidly growing enterprise segment.',
      feature_image: null,
      published_at: '2026-04-14T09:30:00.000Z',
      reading_time: 4,
      tags: [{ id: '1', name: 'Funding', slug: 'funding' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Funding', slug: 'funding' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '8',
      slug: 'meta-llama-4-maverick-open-source',
      title: 'Meta Releases Llama 4 Maverick: 400B MoE Model Goes Fully Open Source',
      html: '<p>Meta AI has released its most capable open-source model yet...</p>',
      excerpt: 'Llama 4 Maverick uses a 400B parameter mixture-of-experts architecture, outperforming GPT-4o on several key benchmarks while remaining free to use.',
      feature_image: null,
      published_at: '2026-04-13T12:00:00.000Z',
      reading_time: 6,
      tags: [{ id: '2', name: 'Model Release', slug: 'model_release' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Model Release', slug: 'model_release' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '9',
      slug: 'perplexity-launches-shopping-engine',
      title: 'Perplexity Launches AI Shopping Engine That Books, Compares, and Auto-Purchases',
      html: '<p>Perplexity AI announced its Shopping Engine feature...</p>',
      excerpt: 'The new feature uses agentic AI to compare prices across retailers, read reviews, and complete purchases — all within a single conversation.',
      feature_image: null,
      published_at: '2026-04-12T15:00:00.000Z',
      reading_time: 3,
      tags: [{ id: '4', name: 'Product Launch', slug: 'product_launch' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Product Launch', slug: 'product_launch' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '10',
      slug: 'eu-ai-act-enforcement-begins-high-risk',
      title: 'EU AI Act Enforcement Begins: High-Risk Systems Now Face €30M Fines',
      html: '<p>The European Union has officially begun enforcing...</p>',
      excerpt: 'Companies deploying AI in healthcare, finance, and law enforcement must now demonstrate compliance or face penalties up to 6% of annual global revenue.',
      feature_image: null,
      published_at: '2026-04-11T08:00:00.000Z',
      reading_time: 5,
      tags: [{ id: '6', name: 'Analysis', slug: 'other' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Analysis', slug: 'other' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
  ];

  return posts.slice(0, limit);
}
