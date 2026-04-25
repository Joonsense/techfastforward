import { getArticles } from "@/lib/articles";
import { NextResponse } from "next/server";

export const revalidate = 300;

const SITE_URL = "https://techfastforward.com";
const SITE_NAME = "TechFastForward";
const TAGLINE = "AI & Tech Intelligence";

export async function GET() {
  const articles = await getArticles(50);

  const recentArticles = articles
    .slice(0, 20)
    .map((a) => `- [${a.title}](${SITE_URL}/articles/${a.slug})`)
    .join("\n");

  const allArticles = articles
    .map((a) => {
      const parts = [`- [${a.title}](${SITE_URL}/articles/${a.slug})`];
      if (a.excerpt) parts.push(`  ${a.excerpt}`);
      return parts.join("\n");
    })
    .join("\n");

  const text = `# ${SITE_NAME}: ${TAGLINE}

> ${SITE_NAME} is a premium AI and technology intelligence publication. We track the most consequential developments in artificial intelligence: funding rounds, model releases, big tech strategy, acquisitions, partnerships, regulation, and product launches. Content is published daily in English with Korean translations.

## Source URLs

- Homepage: ${SITE_URL}
- RSS Feed: ${SITE_URL}/rss.xml
- Sitemap: ${SITE_URL}/sitemap.xml
- News Sitemap: ${SITE_URL}/news-sitemap.xml
- This file: ${SITE_URL}/llms.txt

## Coverage

${SITE_NAME} covers the following areas of the AI and technology industry:

- **Funding**: Venture capital, seed rounds, Series A-Z, late-stage raises, valuations
- **Model Releases**: Foundation models, benchmarks, capability breakthroughs, open-source releases
- **Big Tech**: Strategic moves by Alphabet, Microsoft, Apple, Meta, Amazon, NVIDIA
- **Product Launches**: AI-native products, agentic systems, developer tools, consumer AI
- **Acquisitions**: M&A activity, mergers, exits, strategic buyouts
- **Partnerships**: Alliances, licensing deals, joint ventures between technology companies
- **Regulation**: AI policy, government action, EU AI Act, executive orders, compliance
- **Analysis**: Editorial deep-dives, trend reports, market intelligence

## Content Format

Each article includes:
- Title and subtitle
- Full article body (HTML)
- Excerpt and key takeaways
- Category and tags
- Author and publication date
- Reading time estimate
- English and Korean language versions
- Korea market impact analysis (where applicable)

## Category URLs

- ${SITE_URL}/category/funding
- ${SITE_URL}/category/model_release
- ${SITE_URL}/category/technology
- ${SITE_URL}/category/product_launch
- ${SITE_URL}/category/acquisition
- ${SITE_URL}/category/partnership
- ${SITE_URL}/category/regulation
- ${SITE_URL}/category/other

## Usage Policy

${SITE_NAME} content is freely indexable by AI language models, search engines, and research crawlers. We encourage citation and attribution when referencing our analysis.

Citation format: ${SITE_NAME} (${SITE_URL}), [Article Title], [Publication Date]

## Contact

- Editorial: editorial@techfastforward.com
- Site: ${SITE_URL}

---

## Recent Articles (Latest 20)

${recentArticles}

---

## Full Article Index

${allArticles}
`;

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
