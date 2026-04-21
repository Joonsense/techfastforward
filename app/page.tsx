import { getPosts } from "@/lib/ghost";
import ArticleCard, { type ArticleCardData } from "@/components/ArticleCard";
import { type Category } from "@/components/CategoryBadge";
import Link from "next/link";
import { ArrowRight, TrendingUp, DollarSign, Cpu, Package, BarChart2 } from "lucide-react";

function ghostToCard(post: Awaited<ReturnType<typeof getPosts>>[number]): ArticleCardData {
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

const CATEGORY_SECTIONS = [
  {
    label: "Funding Rounds",
    tag: "funding",
    icon: DollarSign,
    color: "text-emerald-400",
  },
  {
    label: "Model Releases",
    tag: "model_release",
    icon: Cpu,
    color: "text-blue-400",
  },
  {
    label: "Big Tech",
    tag: "technology",
    icon: TrendingUp,
    color: "text-orange-400",
  },
  {
    label: "Product Launches",
    tag: "product_launch",
    icon: Package,
    color: "text-purple-400",
  },
];

export default async function HomePage() {
  const allPosts = await getPosts(20);
  const cards = allPosts.map(ghostToCard);

  const featured = cards[0];
  const latestThree = cards.slice(1, 4);
  const remainingCards = cards.slice(4);

  const isDemoMode = !process.env.GHOST_CONTENT_KEY || process.env.GHOST_CONTENT_KEY === "placeholder";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Demo banner */}
      {isDemoMode && (
        <div className="mb-6 flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[#f97316]/20 bg-[#f97316]/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] pulse-dot flex-shrink-0" />
          <p className="text-[#f97316]/80 text-xs font-medium">
            DEMO MODE — Connect Ghost CMS via{" "}
            <code className="text-[#f97316] bg-[#f97316]/10 px-1 rounded">.env.local</code>
            {" "}to display live articles
          </p>
        </div>
      )}

      {/* ─── Hero Featured Article ─────────────────────────────────── */}
      {featured && (
        <section className="mb-10 fade-up fade-up-1">
          <ArticleCard article={featured} variant="featured" />
        </section>
      )}

      {/* ─── Latest Articles ───────────────────────────────────────── */}
      <section className="mb-12 fade-up fade-up-2">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-0.5 h-5 bg-[#f97316] rounded-full" />
            <h2 className="text-white font-bold text-base uppercase tracking-wider">Latest</h2>
          </div>
          <Link
            href="/category/all"
            className="flex items-center gap-1 text-xs text-white/40 hover:text-[#f97316] transition-colors font-medium"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestThree.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="default" />
          ))}
        </div>
      </section>

      {/* ─── Category Sections ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 fade-up fade-up-3">
        {CATEGORY_SECTIONS.map(({ label, tag, icon: Icon, color }) => {
          const catPosts = cards.filter((c) => c.category === tag).slice(0, 3);

          if (catPosts.length === 0) return null;

          return (
            <section key={tag}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon size={14} className={color} />
                  <h3 className={`font-bold text-sm uppercase tracking-wider ${color}`}>
                    {label}
                  </h3>
                </div>
                <Link
                  href={`/category/${tag}`}
                  className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors"
                >
                  More <ArrowRight size={10} />
                </Link>
              </div>

              <div className="rounded-xl border border-white/8 bg-[#0d0e15] divide-y divide-white/5 overflow-hidden">
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

      {/* ─── Analysis / Opinion strip ─────────────────────────────── */}
      {(() => {
        const analysisPosts = cards.filter((c) => c.category === "other").slice(0, 2);
        if (analysisPosts.length === 0) return null;
        return (
          <section className="mt-12 fade-up fade-up-4">
            <div className="flex items-center gap-2 mb-5">
              <BarChart2 size={14} className="text-white/50" />
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">Analysis</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysisPosts.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="default" />
              ))}
            </div>
          </section>
        );
      })()}
    </div>
  );
}
