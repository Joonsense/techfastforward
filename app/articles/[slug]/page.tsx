import { getPost, getPosts } from "@/lib/ghost";
import ArticleCard, { type ArticleCardData } from "@/components/ArticleCard";
import CategoryBadge, { type Category } from "@/components/CategoryBadge";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowLeft, User } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.title} — TechFastForward`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.feature_image ? [post.feature_image] : [],
    },
  };
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPost(slug), getPosts(6)]);

  if (!post) notFound();

  const category = (post.primary_tag?.slug ?? "other") as Category;

  const related: ArticleCardData[] = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: (p.primary_tag?.slug ?? "other") as Category,
      coverImage: p.feature_image ?? undefined,
      author: p.primary_author?.name ?? "TFF Editorial",
      date: p.published_at,
      readingTime: p.reading_time,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back nav */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft size={12} />
          Back to feed
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        {/* ─── Main Article ───────────────────────────────────── */}
        <article>
          {/* Hero cover image */}
          <div className="relative w-full overflow-hidden rounded-xl border border-white/8 mb-8" style={{ maxHeight: 500 }}>
            {post.feature_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.feature_image}
                alt={post.title}
                className="w-full object-cover"
                style={{ maxHeight: 500 }}
              />
            ) : (
              <div
                className="w-full bg-gradient-to-br from-[#f97316]/20 via-[#0d0e15] to-[#07080e] flex items-center justify-center"
                style={{ height: 320 }}
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#f97316]/10 rounded-full blur-3xl" />
                <span className="text-white/10 text-8xl font-black select-none">TFF</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080e]/80 to-transparent" />
          </div>

          {/* Article header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CategoryBadge category={category} size="md" />
            </div>

            <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-5">
              {post.title}
            </h1>

            <p className="text-white/60 text-base leading-relaxed mb-6 border-l-2 border-[#f97316]/40 pl-4">
              {post.excerpt}
            </p>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-4 text-white/40 text-xs pb-6 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <User size={11} />
                <span className="font-medium text-white/60">
                  {post.primary_author?.name ?? "TFF Editorial"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={11} />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={11} />
                <span>{post.reading_time} min read</span>
              </div>
              {post.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/category/${tag.slug}`}
                      className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-white/40 hover:text-white/70 hover:border-white/20 transition-all"
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Article body */}
          <div
            className="prose prose-invert prose-sm sm:prose-base max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-p:text-white/70 prose-p:leading-relaxed
              prose-a:text-[#f97316] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-code:text-[#f97316] prose-code:bg-[#f97316]/10 prose-code:px-1 prose-code:rounded
              prose-pre:bg-[#0d0e15] prose-pre:border prose-pre:border-white/10
              prose-blockquote:border-[#f97316] prose-blockquote:text-white/60
              prose-hr:border-white/10
              prose-li:text-white/70"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>

        {/* ─── Sidebar ─────────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-20 h-fit">
          <div className="rounded-xl border border-white/8 bg-[#0d0e15] p-5">
            <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-4">
              Related Articles
            </h3>
            <div className="flex flex-col gap-0">
              {related.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="compact" />
              ))}
            </div>
          </div>

          {/* Category nav */}
          <div className="mt-4 rounded-xl border border-white/8 bg-[#0d0e15] p-5">
            <h3 className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-3">
              Browse by Category
            </h3>
            <div className="flex flex-col gap-1">
              {[
                { label: "Funding", slug: "funding" },
                { label: "Model Releases", slug: "model_release" },
                { label: "Big Tech", slug: "technology" },
                { label: "Products", slug: "product_launch" },
                { label: "Acquisitions", slug: "acquisition" },
                { label: "Analysis", slug: "other" },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="text-xs text-white/40 hover:text-white/80 hover:bg-white/5 px-2 py-1.5 rounded transition-all"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
