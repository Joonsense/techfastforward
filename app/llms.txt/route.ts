import { getArticles } from "@/lib/articles";
import { NextResponse } from "next/server";

export const revalidate = 300;

const SITE_URL = "https://techfastforward.com";

export async function GET() {
  const articles = await getArticles(30);

  const articleLines = articles
    .map((a) => `- [${a.title}](${SITE_URL}/articles/${a.slug}): ${a.excerpt}`)
    .join("\n");

  const categories = [
    "Funding Rounds (/category/funding): VC deals, seed rounds, late-stage raises",
    "Model Releases (/category/model_release): Foundation models, benchmarks, capability breakthroughs",
    "Big Tech (/category/technology): Strategic moves from largest technology companies",
    "Product Launches (/category/product_launch): AI-native products, agentic systems, dev tools",
    "M&A (/category/acquisition): Acquisitions, mergers, exits",
    "Partnerships (/category/partnership): Strategic alliances between tech companies",
    "Regulation (/category/regulation): AI policy, government action, compliance",
    "Analysis (/category/other): Deep dives and editorial analysis",
  ].map((c) => `- ${c}`).join("\n");

  const text = `# TechFastForward

> Premium AI and technology intelligence publication. Covers the AI industry's most significant funding rounds, model releases, big tech strategy, M&A, regulation, and product launches.

## About

TechFastForward is a news intelligence platform tracking the AI and technology industry. Articles are written in English with Korean translations available. Content is published daily and covers breaking news plus analytical deep-dives.

Site URL: ${SITE_URL}
RSS Feed: ${SITE_URL}/rss.xml
Sitemap: ${SITE_URL}/sitemap.xml

## Categories

${categories}

## Recent Articles

${articleLines}

## Contact

For editorial inquiries: editorial@techfastforward.com
`;

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
