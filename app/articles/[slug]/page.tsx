import { getPost, getPosts } from "@/lib/ghost";
import ArticleCard, { type ArticleCardData } from "@/components/ArticleCard";
import CategoryBadge, { type Category } from "@/components/CategoryBadge";
import ShareButtons from "@/components/ShareButtons";
import ArticleShell from "@/components/ArticleShell";
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
  const canonicalUrl = `https://techfastforward.com/articles/${slug}`;
  const ogImages = post.feature_image ? [{ url: post.feature_image }] : [];
  return {
    title: `${post.title} — TechFastForward`,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      type: "article",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.feature_image ? [post.feature_image] : [],
    },
  };
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
  } catch { return dateStr; }
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

  const articleUrl = `https://techfastforward.com/articles/${slug}`;

  return (
    <ArticleShell>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: "var(--text-faint)" }}>
          <ArrowLeft size={12} />
          Back to feed
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* ─── Main ──────────────────────────────────────────── */}
        <article>
          {/* Hero cover */}
          <div
            className="relative w-full overflow-hidden rounded-2xl mb-8"
            style={{ border: "1px solid var(--border)", maxHeight: 480 }}
          >
            {post.feature_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.feature_image} alt={post.title} className="w-full object-cover" style={{ maxHeight: 480 }} />
            ) : (
              <div className="w-full h-64 flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
                <span className="font-black text-7xl select-none" style={{ color: "var(--border)" }}>TFF</span>
              </div>
            )}
          </div>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CategoryBadge category={category} size="md" />
            </div>

            <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4" style={{ color: "var(--text)" }}>
              {post.title}
            </h1>

            <p className="text-base leading-relaxed mb-5 border-l-2 pl-4" style={{ color: "var(--text-muted)", borderColor: "var(--accent)" }}>
              {post.excerpt}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-xs pb-5 mb-5" style={{ borderBottom: "1px solid var(--border)", color: "var(--text-faint)" }}>
              <div className="flex items-center gap-1.5">
                <User size={11} />
                <span className="font-medium" style={{ color: "var(--text-muted)" }}>{post.primary_author?.name ?? "TFF Editorial"}</span>
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
                    <Link key={tag.id} href={`/category/${tag.slug}`}
                      className="px-2 py-0.5 rounded-full text-[10px] transition-colors"
                      style={{ border: "1px solid var(--border)", color: "var(--text-faint)" }}>
                      {tag.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Share — top */}
            <ShareButtons title={post.title} url={articleUrl} />
          </header>

          {/* Body */}
          <div
            className="prose prose-sm sm:prose-base max-w-none
              prose-headings:font-bold
              prose-a:no-underline hover:prose-a:underline
              prose-code:px-1 prose-code:rounded
              prose-pre:border
              dark:prose-invert
              dark:prose-headings:text-white
              dark:prose-p:text-white/70
              dark:prose-a:text-orange-400
              dark:prose-strong:text-white
              dark:prose-code:text-orange-400
              dark:prose-code:bg-orange-400/10
              dark:prose-pre:bg-[#0d0e17]
              dark:prose-pre:border-white/10
              dark:prose-blockquote:border-orange-400
              dark:prose-hr:border-white/10
              dark:prose-li:text-white/70"
            style={{ color: "var(--text-2)" }}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* Share — bottom */}
          <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <ShareButtons title={post.title} url={articleUrl} />
          </div>
        </article>

        {/* ─── Sidebar ─────────────────────────────────────── */}
        <aside className="lg:sticky lg:top-20 h-fit space-y-4">
          {/* Related */}
          <div className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-faint)" }}>
              Related Articles
            </h3>
            {related.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>

          {/* Category nav */}
          <div className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-faint)" }}>
              Browse by Category
            </h3>
            <div className="flex flex-col gap-0.5">
              {[
                { label: "Funding",       slug: "funding" },
                { label: "Model Releases",slug: "model_release" },
                { label: "Big Tech",      slug: "technology" },
                { label: "Products",      slug: "product_launch" },
                { label: "M&A",           slug: "acquisition" },
                { label: "Partnerships",  slug: "partnership" },
                { label: "Regulation",    slug: "regulation" },
                { label: "Analysis",      slug: "other" },
              ].map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`}
                  className="text-xs px-2 py-1.5 rounded-md transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
    </ArticleShell>
  );
}
