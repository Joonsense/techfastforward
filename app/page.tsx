import { getArticles, type Article } from "@/lib/articles";

export const revalidate = 60;
import ArticleCard, { type ArticleCardData } from "@/components/ArticleCard";
import BreakingTicker from "@/components/BreakingTicker";
import NewsletterForm from "@/components/NewsletterForm";
import SponsorCard from "@/components/SponsorCard";
import Link from "next/link";
import {
  ArrowRight, TrendingUp, DollarSign, Cpu, Package,
  Handshake, Scale, Layers, Zap,
} from "lucide-react";

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

const CATEGORY_SECTIONS = [
  { label: "Funding Rounds",   tag: "funding",        icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400" },
  { label: "Model Releases",   tag: "model_release",  icon: Cpu,        color: "text-blue-600 dark:text-blue-400" },
  { label: "Big Tech",         tag: "technology",     icon: TrendingUp, color: "text-orange-600 dark:text-orange-400" },
  { label: "Product Launches", tag: "product_launch", icon: Package,    color: "text-violet-600 dark:text-violet-400" },
  { label: "M&A / Deals",      tag: "acquisition",    icon: Layers,     color: "text-red-600 dark:text-red-400" },
  { label: "Partnerships",     tag: "partnership",    icon: Handshake,  color: "text-cyan-600 dark:text-cyan-400" },
  { label: "Regulation",       tag: "regulation",     icon: Scale,      color: "text-yellow-600 dark:text-yellow-500" },
];

function SectionHeader({ label, icon: Icon, color, href }: { label: string; icon: React.ElementType; color: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon size={14} className={color} />
        <h3 className={`font-bold text-sm uppercase tracking-wider ${color}`}>{label}</h3>
      </div>
      <Link href={href} className="flex items-center gap-1 text-[10px] transition-colors" style={{ color: "var(--text-faint)" }}>
        More <ArrowRight size={10} />
      </Link>
    </div>
  );
}

export default async function HomePage() {
  const allArticles = await getArticles(50);
  const cards = allArticles.map(articleToCard);

  const featured = cards[0];
  const latestSix = cards.slice(1, 7);
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sidebar: most recent 6 compact
  const sidebarLatest = cards.slice(0, 6);

  // Category sections: only those with articles
  const activeSections = CATEGORY_SECTIONS.filter(({ tag }) =>
    cards.some((c) => c.category === tag)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Demo banner */}
      {isDemoMode && (
        <div
          className="mb-6 flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-bdr)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full pulse-dot flex-shrink-0" style={{ background: "var(--accent)" }} />
          <p className="text-xs font-medium" style={{ color: "var(--accent)" }}>
            DEMO MODE — Add{" "}
            <code className="px-1 py-0.5 rounded text-[11px]" style={{ background: "var(--accent-bdr)" }}>NEXT_PUBLIC_SUPABASE_URL</code>
            {" "}to display live articles
          </p>
        </div>
      )}

      {/* ─── Breaking Ticker ─────────────────────────────── */}
      <BreakingTicker items={cards.slice(0, 10).map((c) => ({ slug: c.slug, title: c.title, category: c.category }))} />

      {/* ─── Hero ────────────────────────────────────────── */}
      {featured && (
        <section className="mb-10 fade-up fade-up-1">
          <ArticleCard article={featured} variant="featured" />
        </section>
      )}

      {/* ─── Main 2-col layout ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 fade-up fade-up-2">

        {/* Left — Latest + Category sections */}
        <div>
          {/* Latest */}
          {latestSix.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-0.5 h-5 rounded-full" style={{ background: "var(--accent)" }} />
                  <h2 className="font-bold text-sm uppercase tracking-wider" style={{ color: "var(--text)" }}>Latest</h2>
                </div>
                <Link href="/" className="flex items-center gap-1 text-xs transition-colors" style={{ color: "var(--text-faint)" }}>
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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

        {/* Right — Sidebar */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-6 fade-up fade-up-2">

          {/* Recent articles */}
          <div className="rounded-xl p-4" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-faint)" }}>
              Recent
            </h3>
            {sidebarLatest.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>

          {/* Browse by category */}
          <div className="rounded-xl p-4" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-faint)" }}>
              Browse
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

          {/* Newsletter mini */}
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-bdr)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={12} style={{ color: "var(--accent)" }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Newsletter</span>
            </div>
            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
              Daily AI signals. No noise.
            </p>
            <NewsletterForm compact />
          </div>

          {/* Sponsor */}
          <SponsorCard />
        </aside>
      </div>

    </div>
  );
}
