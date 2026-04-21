import { getPosts } from "@/lib/ghost";
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
  const posts = await getPosts(100);

  const articleEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/articles/${post.slug}`,
    lastModified: new Date(post.published_at),
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
