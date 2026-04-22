import { getArticles } from "@/lib/articles";
import type { MetadataRoute } from "next";

export const revalidate = 300;

const SITE_URL = "https://techfastforward.com";

const staticRoutes = [
  { path: "/",                    changeFrequency: "hourly" as const, priority: 1.0 },
  { path: "/category/funding",    changeFrequency: "daily"  as const, priority: 0.8 },
  { path: "/category/model_release", changeFrequency: "daily" as const, priority: 0.8 },
  { path: "/category/technology", changeFrequency: "daily"  as const, priority: 0.8 },
  { path: "/category/product_launch", changeFrequency: "daily" as const, priority: 0.8 },
  { path: "/category/acquisition", changeFrequency: "daily" as const, priority: 0.7 },
  { path: "/category/partnership", changeFrequency: "daily" as const, priority: 0.7 },
  { path: "/category/regulation", changeFrequency: "daily"  as const, priority: 0.7 },
  { path: "/category/other",      changeFrequency: "daily"  as const, priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles(200);
  const now = new Date();

  // Higher priority for articles published in the last 48 hours
  const recentCutoff = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => {
    const pubDate = new Date(a.published_at ?? a.created_at);
    const isRecent = pubDate >= recentCutoff;

    return {
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: pubDate,
      changeFrequency: isRecent ? "hourly" : "weekly",
      priority: isRecent ? 0.9 : 0.7,
    };
  });

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  return [...staticEntries, ...articleEntries];
}
