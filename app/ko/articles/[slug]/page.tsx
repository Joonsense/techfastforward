import { getArticle, getArticles } from "@/lib/articles";
import ArticleCard, { type ArticleCardData } from "@/components/ArticleCard";
import CategoryBadge, { type Category } from "@/components/CategoryBadge";
import ShareButtons from "@/components/ShareButtons";
import ArticleShell from "@/components/ArticleShell";
import ArticleBody from "@/components/ArticleBody";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock, Calendar, ArrowLeft, User } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

const SITE_URL = "https://techfastforward.com";

const CATEGORY_SECTION: Record<string, string> = {
  funding:        "펀딩 라운드",
  model_release:  "모델 출시",
  technology:     "빅테크",
  product_launch: "제품 출시",
  acquisition:    "M&A",
  partnership:    "파트너십",
  regulation:     "규제",
  other:          "분석",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "기사를 찾을 수 없습니다" };

  const canonicalUrl = `${SITE_URL}/ko/articles/${slug}`;
  const enUrl = `${SITE_URL}/articles/${slug}`;
  const ogImageUrl = article.cover_image_url
    ? article.cover_image_url
    : `${SITE_URL}/og?title=${encodeURIComponent(article.title)}&category=${article.category}&excerpt=${encodeURIComponent(article.excerpt)}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": enUrl,
        "ko": canonicalUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      type: "article",
      siteName: "TechFastForward",
      locale: "ko_KR",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [{ url: ogImageUrl, alt: article.title }],
    },
  };
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("ko-KR", {
      year: "numeric", month: "long", day: "numeric",
    });
  } catch { return dateStr; }
}

export default async function KoArticlePage({ params }: Props) {
  const { slug } = await params;
  const [article, allArticles] = await Promise.all([getArticle(slug), getArticles(6)]);

  // No article → EN 404
  if (!article) redirect(`/articles/${slug}`);

  // No Korean translation → redirect to EN version
  if (!article.body_html_ko) {
    redirect(`/articles/${slug}`);
  }

  const category = article.category as Category;

  const related: ArticleCardData[] = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 3)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category as Category,
      coverImage: a.cover_image_url ?? undefined,
      author: a.author ?? "TFF Editorial",
      date: a.published_at ?? a.created_at,
      readingTime: a.reading_time_min ?? undefined,
    }));

  const articleUrl = `${SITE_URL}/ko/articles/${slug}`;
  const enUrl = `${SITE_URL}/articles/${slug}`;

  return (
    <ArticleShell>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/ko" className="inline-flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: "var(--text-faint)" }}>
          <ArrowLeft size={12} />
          피드로 돌아가기
        </Link>
        <Link href={enUrl} className="text-[10px] px-2 py-1 rounded-md"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-faint)" }}>
          English version
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        <article>
          {/* Hero cover */}
          <div
            className="relative w-full overflow-hidden rounded-2xl mb-8"
            style={{ border: "1px solid var(--border)", maxHeight: 480 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                article.cover_image_url ??
                `/og?${new URLSearchParams({ title: article.title, category: article.category, excerpt: article.excerpt }).toString()}`
              }
              alt={article.title}
              className="w-full object-cover"
              style={{ maxHeight: 480 }}
            />
          </div>

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <CategoryBadge category={category} size="md" />
            </div>

            <h1 id="article-headline" className="font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4" style={{ color: "var(--text)" }}>
              {article.title}
            </h1>

            <p id="article-excerpt" className="text-base leading-relaxed mb-5 border-l-2 pl-4" style={{ color: "var(--text-muted)", borderColor: "var(--accent)" }}>
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs pb-5 mb-5" style={{ borderBottom: "1px solid var(--border)", color: "var(--text-faint)" }}>
              <div className="flex items-center gap-1.5">
                <User size={11} />
                <span className="font-medium" style={{ color: "var(--text-muted)" }}>{article.author ?? "TFF Editorial"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={11} />
                <span>{formatDate(article.published_at ?? article.created_at)}</span>
              </div>
              {article.reading_time_min && (
                <div className="flex items-center gap-1.5">
                  <Clock size={11} />
                  <span>{article.reading_time_min}분 읽기</span>
                </div>
              )}
            </div>

            <ShareButtons title={article.title} url={articleUrl} />
          </header>

          {article.key_takeaways && article.key_takeaways.length > 0 && (
            <div className="mb-8 p-5 rounded-xl" style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-bdr)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--accent)" }}>핵심 요점</p>
              <ul className="space-y-1.5">
                {article.key_takeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ArticleBody
            bodyHtml={article.body_html}
            bodyHtmlKo={article.body_html_ko}
            excerpt={article.excerpt}
          />

          <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <ShareButtons title={article.title} url={articleUrl} />
          </div>
        </article>

        <aside className="lg:sticky lg:top-20 h-fit space-y-4">
          <div className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-faint)" }}>
              관련 기사
            </h3>
            {related.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>

          <div className="rounded-xl p-5" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-faint)" }}>
              카테고리별 탐색
            </h3>
            <div className="flex flex-col gap-0.5">
              {Object.entries(CATEGORY_SECTION).map(([slug, label]) => (
                <Link key={slug} href={`/category/${slug}`}
                  className="text-xs px-2 py-1.5 rounded-md transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  {label}
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
