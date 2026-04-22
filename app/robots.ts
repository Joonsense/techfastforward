import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // Explicitly allow major AI crawlers
      { userAgent: "GPTBot",          allow: "/" },
      { userAgent: "ChatGPT-User",    allow: "/" },
      { userAgent: "OAI-SearchBot",   allow: "/" },
      { userAgent: "anthropic-ai",    allow: "/" },
      { userAgent: "Claude-Web",      allow: "/" },
      { userAgent: "ClaudeBot",       allow: "/" },
      { userAgent: "PerplexityBot",   allow: "/" },
      { userAgent: "Applebot",        allow: "/" },
      { userAgent: "Googlebot",       allow: "/" },
      { userAgent: "Googlebot-News",  allow: "/" },
      { userAgent: "GoogleOther",     allow: "/" },
      { userAgent: "Bingbot",         allow: "/" },
      { userAgent: "DuckDuckBot",     allow: "/" },
      { userAgent: "Slurp",           allow: "/" },
      { userAgent: "facebookexternalhit", allow: "/" },
      { userAgent: "Twitterbot",      allow: "/" },
      { userAgent: "LinkedInBot",     allow: "/" },
    ],
    sitemap: [
      "https://techfastforward.com/sitemap.xml",
      "https://techfastforward.com/news-sitemap.xml",
    ],
  };
}
