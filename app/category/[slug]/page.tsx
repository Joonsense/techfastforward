import { getPostsByTag } from "@/lib/ghost";
import ArticleCard, { type ArticleCardData } from "@/components/ArticleCard";
import { type Category } from "@/components/CategoryBadge";
import Link from "next/link";
import { ChevronRight, Home, DollarSign, Cpu, TrendingUp, Package, Layers, Handshake, Scale, LayoutGrid } from "lucide-react";

const CATEGORY_META: Record<string, { label: string; description: string; icon: React.ElementType; color: string }> = {
  funding:        { label: "Funding Rounds",   description: "VC deals, seed rounds, and late-stage raises shaping the AI economy.", icon: DollarSign, color: "text-emerald-600 dark:text-emerald-400" },
  model_release:  { label: "Model Releases",   description: "New foundation models, benchmarks, and capability breakthroughs.",      icon: Cpu,        color: "text-blue-600 dark:text-blue-400" },
  technology:     { label: "Big Tech",         description: "Strategic moves from the world's largest technology companies.",          icon: TrendingUp, color: "text-orange-600 dark:text-orange-400" },
  product_launch: { label: "Product Launches", description: "New AI-powered products and feature announcements.",                      icon: Package,    color: "text-violet-600 dark:text-violet-400" },
  acquisition:    { label: "M&A / Deals",      description: "Mergers, acquisitions, and strategic partnerships in AI.",               icon: Layers,     color: "text-red-600 dark:text-red-400" },
  partnership:    { label: "Partnerships",     description: "Cross-company collaborations and joint ventures.",                        icon: Handshake,  color: "text-cyan-600 dark:text-cyan-400" },
  regulation:     { label: "Regulation",       description: "Government policy, AI governance, and compliance news.",                  icon: Scale,      color: "text-yellow-600 dark:text-yellow-500" },
  other:          { label: "Analysis",         description: "In-depth analysis, opinion, and AI industry commentary.",                icon: LayoutGrid, color: "text-gray-600 dark:text-gray-400" },
};

function ghostToCard(post: Awaited<ReturnType<typeof getPostsByTag>>[number]): ArticleCardData {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: (post.primary_tag?.slug ?? "other") as Category,
    coverImage: post.feature_image ?? undefined,
    author: post.primary_author?.name ?? "TFF Editorial",
    date: post.published_at,
    readingTime: post.reading_time,
  };
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = CATEGORY_META[slug] ?? CATEGORY_META.other;
  const Icon = meta.icon;

  const posts = await getPostsByTag(slug, 50);
  const cards = posts.map(ghostToCard);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6 text-[11px] fade-up fade-up-1" style={{ color: "var(--text-faint)" }}>
        <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
          <Home size={11} />
          <span>Home</span>
        </Link>
        <ChevronRight size={10} />
        <span style={{ color: "var(--text-muted)" }}>{meta.label}</span>
      </nav>

      {/* Page header */}
      <div className="mb-10 fade-up fade-up-1">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
          >
            <Icon size={16} className={meta.color} />
          </div>
          <h1 className="font-bold text-2xl sm:text-3xl tracking-tight" style={{ color: "var(--text)" }}>
            {meta.label}
          </h1>
        </div>
        <p className="text-sm ml-12" style={{ color: "var(--text-muted)" }}>
          {meta.description}
        </p>
        <div className="flex items-center gap-2 ml-12 mt-3">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-bdr)", color: "var(--accent)" }}
          >
            {cards.length} {cards.length === 1 ? "article" : "articles"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-8" style={{ height: "1px", background: "var(--border)" }} />

      {/* Article grid */}
      {cards.length > 0 ? (
        <section className="fade-up fade-up-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="default" />
            ))}
          </div>
        </section>
      ) : (
        <div
          className="fade-up fade-up-2 flex flex-col items-center justify-center py-24 rounded-2xl"
          style={{ border: "1px dashed var(--border)", background: "var(--bg-secondary)" }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <Icon size={20} className={meta.color} />
          </div>
          <p className="font-semibold text-sm mb-1" style={{ color: "var(--text)" }}>No articles yet in this category</p>
          <p className="text-xs" style={{ color: "var(--text-faint)" }}>Check back soon — we publish daily.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-bdr)", color: "var(--accent)" }}
          >
            <Home size={12} /> Back to home
          </Link>
        </div>
      )}
    </div>
  );
}
