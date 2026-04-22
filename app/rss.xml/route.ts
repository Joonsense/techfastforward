import { getArticles } from "@/lib/articles";
import { NextResponse } from "next/server";

export const revalidate = 300;

const SITE_URL = "https://techfastforward.com";

export async function GET() {
  const articles = await getArticles(50);

  const items = articles
    .map((a) => {
      const url = `${SITE_URL}/articles/${a.slug}`;
      const pubDate = new Date(a.published_at ?? a.created_at).toUTCString();
      const description = a.excerpt
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const title = a.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${a.author ?? "TFF Editorial"}</dc:creator>
      <category>${a.category}</category>
      ${a.tags?.map((t) => `<category>${t}</category>`).join("\n      ") ?? ""}
    </item>`;
    })
    .join("");

  const lastBuildDate = articles[0]
    ? new Date(articles[0].published_at ?? articles[0].created_at).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/modules/content/">
  <channel>
    <title>TechFastForward - AI &amp; Tech Intelligence</title>
    <link>${SITE_URL}</link>
    <description>Premium AI and technology news. Funding rounds, model releases, big tech moves, and product launches - tracked and analyzed.</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <copyright>2025 TechFastForward</copyright>
    <managingEditor>editorial@techfastforward.com (TFF Editorial)</managingEditor>
    <webMaster>editorial@techfastforward.com (TFF Editorial)</webMaster>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
