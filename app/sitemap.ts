import { getArticles } from "@/lib/articles";
import type { MetadataRoute } from "next";

const siteUrl = "https://techfastforward.com";

const staticRoutes = [
  "/",
  "/category/funding",
  "/category/model_release",
  "/category/technology",
  "/category/product_launch",
  "/category/acquisition",
  "/category/partnership",
  "/category/regulation",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles(100);

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/articles/${a.slug}`,
    lastModified: new Date(a.published_at ?? a.created_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1.0 : 0.8,
  }));

  return [...staticEntries, ...articleEntries];
}
