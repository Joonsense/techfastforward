import { getArticles } from "@/lib/articles";
import { NextResponse } from "next/server";

export const revalidate = 300;

const SITE_URL = "https://techfastforward.com";

const CATEGORY_KEYWORDS: Record<string, string> = {
  funding:        "AI funding, venture capital, startup investment",
  model_release:  "AI model, machine learning, LLM release",
  technology:     "big tech, technology, artificial intelligence",
  product_launch: "AI product, product launch, software",
  acquisition:    "merger, acquisition, M&A, deal",
  partnership:    "partnership, collaboration, strategic alliance",
  regulation:     "AI regulation, policy, government, compliance",
  other:          "AI analysis, technology trends",
};

export async function GET() {
  const articles = await getArticles(50);

  // Google News only indexes articles published within the last 2 days for "breaking news"
  // but accepts up to 1000 recent articles — include last 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const recentArticles = articles.filter((a) => {
    const pub = new Date(a.published_at ?? a.created_at);
    return pub >= cutoff;
  });

  const urls = recentArticles
    .map((a) => {
      const pubDate = new Date(a.published_at ?? a.created_at).toISOString();
      const title = a.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const keywords = (a.tags?.join(", ") ?? "") + ", " + (CATEGORY_KEYWORDS[a.category] ?? "AI, technology");

      return `  <url>
    <loc>${SITE_URL}/articles/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>TechFastForward</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
      <news:keywords>${keywords}</news:keywords>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
