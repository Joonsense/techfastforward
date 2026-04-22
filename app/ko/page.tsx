import { getArticles, type Article } from "@/lib/articles";
import ArticleCard, { type ArticleCardData } from "@/components/ArticleCard";
import BreakingTicker from "@/components/BreakingTicker";
import NewsletterForm from "@/components/NewsletterForm";
import Link from "next/link";
import { ArrowRight, TrendingUp, DollarSign, Cpu, Package, Handshake, Scale, Layers, Zap, Languages } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

const SITE_URL = "https://techfastforward.com";

export const metadata: Metadata = {
  title: "TechFastForward - AI 테크 인텔리전스",
  description:
    "AI 및 기술 뉴스 프리미엄 서비스. 펀딩 라운드, 모델 출시, 빅테크 동향, 제품 출시를 매일 추적·분석합니다.",
  keywords: [
    "AI 뉴스", "인공지능", "테크 펀딩", "LLM 출시", "스타트업 투자",
    "AI 모델", "벤처 캐피탈", "빅테크", "머신러닝", "기술 인텔리전스",
    "AI news Korea", "tech news Korean",
  ],
  alternates: {
    canonical: `${SITE_URL}/ko`,
    languages: {
      "en": SITE_URL,
      "ko": `${SITE_URL}/ko`,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    title: "TechFastForward - AI 테크 인텔리전스",
    description: "AI 및 기술 뉴스 프리미엄 서비스. 펀딩 라운드, 모델 출시, 빅테크 동향.",
    type: "website",
    url: `${SITE_URL}/ko`,
    siteName: "TechFastForward",
    locale: "ko_KR",
  },
};

const CATEGORY_SECTIONS = [
  { label: "펀딩 라운드",   tag: "funding",        icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "모델 출시",     tag: "model_release",  icon: Cpu,        color: "text-blue-600 dark:text-blue-400" },
  { label: "빅테크",        tag: "technology",     icon: TrendingUp, color: "text-orange-600 dark:text-orange-400" },
  { label: "제품 출시",     tag: "product_launch", icon: Package,    color: "text-violet-600 dark:text-violet-400" },
  { label: "M&A / 인수",    tag: "acquisition",    icon: Layers,     color: "text-red-600 dark:text-red-400" },
  { label: "파트너십",      tag: "partnership",    icon: Handshake,  color: "text-cyan-600 dark:text-cyan-400" },
  { label: "규제",          tag: "regulation",     icon: Scale,      color: "text-yellow-600 dark:text-yellow-500" },
];

function articleToCard(a: Article): ArticleCardData {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    coverImage: a.cover_image_url ?? undefined,
    author: a.author ?? "TFF Editorial",
    date: a.published_at ?? a.created_at,
    readingTime: a.reading_time_min ?? undefined,
  };
}

function SectionHeader({ label, icon: Icon, color, href }: { label: string; icon: React.ElementType; color: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={14} className={color} />
        <h3 className={`font-bold text-sm uppercase tracking-wider ${color}`}>{label}</h3>
      </div>
      <Link href={href} className="flex items-center gap-1 text-[10px] transition-colors" style={{ color: "var(--text-faint)" }}>
        더 보기 <ArrowRight size={10} />
      </Link>
    </div>
  );
}

export default async function KoHomePage() {
  const allArticles = await getArticles(50);
  const cards = allArticles.map(articleToCard);

  const featured = cards[0];
  const latestSix = cards.slice(1, 7);
  const sidebarLatest = cards.slice(0, 6);
  const activeSections = CATEGORY_SECTIONS.filter(({ tag }) =>
    cards.some((c) => c.category === tag)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Language banner */}
      <div
        className="mb-6 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <Languages size={13} style={{ color: "var(--text-faint)" }} />
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            한국어 번역이 순차적으로 제공됩니다. 현재 영어 콘텐츠로 표시됩니다.
          </p>
        </div>
        <Link
          href="/"
          className="text-[10px] font-medium px-2 py-1 rounded-md flex-shrink-0"
          style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-bdr)", color: "var(--accent)" }}
        >
          English
        </Link>
      </div>

      {/* Breaking Ticker */}
      <BreakingTicker items={cards.slice(0, 10).map((c) => ({ slug: c.slug, title: c.title, category: c.category }))} />

      {/* Hero */}
      {featured && (
        <section className="mb-10 fade-up fade-up-1">
          <ArticleCard article={featured} variant="featured" />
        </section>
      )}

      {/* Main 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 fade-up fade-up-2">
        <div>
          {/* Latest */}
          {latestSix.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-0.5 h-5 rounded-full" style={{ background: "var(--accent)" }} />
                  <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--text)" }}>최신</h2>
                </div>
                <Link href="/category/all" className="flex items-center gap-1 text-xs transition-colors" style={{ color: "var(--text-faint)" }}>
                  전체 보기 <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {latestSix.map((article) => (
                  <ArticleCard key={article.slug} article={article} variant="default" />
                ))}
              </div>
            </section>
          )}

          {/* Category sections */}
          {activeSections.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 fade-up fade-up-3">
              {activeSections.map(({ label, tag, icon, color }) => {
                const catPosts = cards.filter((c) => c.category === tag).slice(0, 4);
                return (
                  <section key={tag}>
                    <SectionHeader label={label} icon={icon} color={color} href={`/category/${tag}`} />
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
                      {catPosts.map((article) => (
                        <div key={article.slug} className="px-4">
                          <ArticleCard article={article} variant="compact" />
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-6 fade-up fade-up-2">
          <div className="rounded-xl p-4" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-faint)" }}>
              최근 기사
            </h3>
            {sidebarLatest.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>

          <div className="rounded-xl p-4" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-faint)" }}>
              카테고리
            </h3>
            <div className="flex flex-col gap-0.5">
              {CATEGORY_SECTIONS.map((cat) => (
                <Link
                  key={cat.tag}
                  href={`/category/${cat.tag}`}
                  className="flex items-center gap-2 text-xs px-2 py-1.5 rounded-md transition-colors hover:opacity-80"
                  style={{ color: "var(--text-muted)" }}
                >
                  <cat.icon size={12} className={cat.color} />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-bdr)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={12} style={{ color: "var(--accent)" }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>뉴스레터</span>
            </div>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              매일 AI 신호. 소음 없이.
            </p>
            <NewsletterForm compact />
          </div>
        </aside>
      </div>
    </div>
  );
}
