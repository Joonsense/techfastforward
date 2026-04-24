import { getArticle, getArticles } from "@/lib/articles";
import ArticleCard, { type ArticleCardData } from "@/components/ArticleCard";
import CategoryBadge, { type Category } from "@/components/CategoryBadge";
import ShareButtons from "@/components/ShareButtons";
import ArticleShell from "@/components/ArticleShell";
import ArticleBody from "@/components/ArticleBody";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowLeft, User } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

const SITE_URL = "https://techfastforward.com";

const CATEGORY_SECTION: Record<string, string> = {
  funding:        "Funding Rounds",
  model_release:  "Model Releases",
  technology:     "Big Tech",
  product_launch: "Product Launches",
  acquisition:    "M&A",
  partnership:    "Partnerships",
  regulation:     "Regulation",
  other:          "Analysis",
};

function categoryMentions(category: string) {
  const categoryAbout: Record<string, object> = {
    funding: {
      about: { "@type": "Thing", "name": "Venture Capital & AI Funding", "sameAs": "https://en.wikipedia.org/wiki/Venture_capital" },
      mentions: [{ "@type": "Corporation", "name": "Artificial Intelligence Industry" }],
    },
    model_release: {
      about: { "@type": "Thing", "name": "Artificial Intelligence Models", "sameAs": "https://en.wikipedia.org/wiki/Large_language_model" },
      mentions: [{ "@type": "SoftwareApplication", "applicationCategory": "ArtificialIntelligence", "name": "AI Language Model" }],
    },
    technology: {
      about: { "@type": "Thing", "name": "Big Tech & AI Strategy", "sameAs": "https://en.wikipedia.org/wiki/Big_Tech" },
      mentions: [{ "@type": "Corporation", "name": "Technology Industry" }],
    },
    product_launch: {
      about: { "@type": "Thing", "name": "AI Product Innovation", "sameAs": "https://en.wikipedia.org/wiki/Artificial_intelligence" },
      mentions: [{ "@type": "SoftwareApplication", "applicationCategory": "ArtificialIntelligence", "name": "AI Software Product" }],
    },
    acquisition: {
      about: { "@type": "Thing", "name": "Mergers & Acquisitions in AI", "sameAs": "https://en.wikipedia.org/wiki/Mergers_and_acquisitions" },
      mentions: [{ "@type": "Corporation", "name": "AI Technology Company" }],
    },
    partnership: {
      about: { "@type": "Thing", "name": "AI Industry Partnerships", "sameAs": "https://en.wikipedia.org/wiki/Strategic_alliance" },
      mentions: [{ "@type": "Corporation", "name": "Technology Partnership" }],
    },
    regulation: {
      about: { "@type": "Thing", "name": "AI Regulation & Governance", "sameAs": "https://en.wikipedia.org/wiki/Regulation_of_artificial_intelligence" },
      mentions: [{ "@type": "GovernmentOrganization", "name": "AI Regulatory Body" }],
    },
    other: {
      about: { "@type": "Thing", "name": "Artificial Intelligence", "sameAs": "https://en.wikipedia.org/wiki/Artificial_intelligence" },
    },
  };
  return categoryAbout[category] ?? categoryAbout.other;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Article Not Found" };

  const canonicalUrl = `${SITE_URL}/articles/${slug}`;
  const ogImageUrl = article.cover_image_url
    ? article.cover_image_url
    : `${SITE_URL}/og?title=${encodeURIComponent(article.title)}&category=${article.category}&excerpt=${encodeURIComponent(article.excerpt)}`;
  const section = CATEGORY_SECTION[article.category] ?? "Technology";
  const keywords = [
    ...(article.tags ?? []),
    article.category,
    "AI news",
    "technology",
    section,
  ].filter(Boolean);

  return {
    title: article.title,
    description: article.excerpt,
    keywords,
    authors: [{ name: article.author ?? "TFF Editorial", url: SITE_URL }],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en": canonicalUrl,
        "ko": `${SITE_URL}/ko/articles/${slug}`,
        "x-default": canonicalUrl,
      },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      type: "article",
      siteName: "TechFastForward",
      publishedTime: article.published_at ?? article.created_at,
      modifiedTime: article.published_at ?? article.created_at,
      authors: [article.author ?? "TFF Editorial"],
      section,
      tags: article.tags ?? [],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [{ url: ogImageUrl, alt: article.title }],
      creator: "@techfastforward",
      site: "@techfastforward",
    },
    other: {
      "article:section": section,
      "article:author": article.author ?? "TFF Editorial",
      "news_keywords": keywords.join(", "),
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
  const [article, allArticles] = await Promise.all([getArticle(slug), getArticles(6)]);
  if (!article) notFound();

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

  const articleUrl = `${SITE_URL}/articles/${slug}`;
  const embedUrl = `${SITE_URL}/embed/${slug}`;
  const ogImageUrl = article.cover_image_url
    ? article.cover_image_url
    : `${SITE_URL}/og?title=${encodeURIComponent(article.title)}&category=${article.category}&excerpt=${encodeURIComponent(article.excerpt)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    datePublished: article.published_at ?? article.created_at,
    dateModified: article.published_at ?? article.created_at,
    author: {
      "@type": "Person",
      name: article.author ?? "TFF Editorial",
      url: SITE_URL,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: "TechFastForward",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
        width: 512,
        height: 512,
      },
    },
    image: {
      "@type": "ImageObject",
      url: ogImageUrl,
      width: 1200,
      height: 630,
    },
    keywords: article.tags?.join(", ") ?? article.category,
    articleSection: CATEGORY_SECTION[article.category] ?? "Technology",
    inLanguage: "en-US",
    ...(article.key_takeaways && article.key_takeaways.length > 0 && {
      abstract: article.key_takeaways.join(" "),
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#article-headline", "#article-excerpt"],
    },
    ...categoryMentions(article.category),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: CATEGORY_SECTION[article.category] ?? "Articles", item: `${SITE_URL}/category/${article.category}` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
    ],
  };

  return (
    <ArticleShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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

          {/* Header */}
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

            {/* Meta row */}
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
                  <span>{article.reading_time_min} min read</span>
                </div>
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Link key={tag} href={`/category/${tag}`}
                      className="px-2 py-0.5 rounded-full text-[10px] transition-colors"
                      style={{ border: "1px solid var(--border)", color: "var(--text-faint)" }}>
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Share — top */}
            <ShareButtons title={article.title} url={articleUrl} author={article.author ?? "TFF Editorial"} date={article.published_at ?? article.created_at} />
          </header>

          {/* Key Takeaways */}
          {article.key_takeaways && article.key_takeaways.length > 0 && (
            <div className="mb-8 p-5 rounded-xl" style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-bdr)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--accent)" }}>Key Takeaways</p>
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

          {/* Body */}
          <ArticleBody
            bodyHtml={article.body_html}
            bodyHtmlKo={article.body_html_ko}
            excerpt={article.excerpt}
          />

          {/* Korea Market Impact */}
          {article.korea_impact && article.korea_impact.length > 0 && (
            <div className="mt-10 p-5 rounded-xl" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base leading-none">🇰🇷</span>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>Korea Market Impact</p>
              </div>
              <ul className="space-y-2">
                {article.korea_impact.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--text-faint)" }} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Share — bottom */}
          <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <ShareButtons title={article.title} url={articleUrl} author={article.author ?? "TFF Editorial"} date={article.published_at ?? article.created_at} />
            <details className="mt-4 group">
              <summary
                className="cursor-pointer text-[10px] font-medium select-none list-none"
                style={{ color: "var(--text-faint)" }}
              >
                &lt;/&gt; Embed this article
              </summary>
              <div className="mt-2 p-3 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                <p className="text-[10px] mb-2" style={{ color: "var(--text-faint)" }}>Copy the iframe code below to embed on your site:</p>
                <code
                  className="block text-[10px] leading-relaxed break-all"
                  style={{ color: "var(--text-muted)", fontFamily: "monospace" }}
                >{`<iframe src="${embedUrl}" width="480" height="260" frameborder="0" style="border-radius:16px;max-width:100%;" loading="lazy"></iframe>`}</code>
              </div>
            </details>
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
