import type { MetadataRoute } from "next";

const SITE_URL = "https://techfastforward.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: all crawlers welcome, block internal routes only
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/embed/"],
      },

      // Search engines — full access including news vertical
      { userAgent: "Googlebot",            allow: "/" },
      { userAgent: "Googlebot-News",       allow: "/" },
      { userAgent: "GoogleOther",          allow: "/" },
      { userAgent: "Bingbot",              allow: "/" },
      { userAgent: "DuckDuckBot",          allow: "/" },
      { userAgent: "Slurp",                allow: "/" },
      { userAgent: "Yandex",               allow: "/" },
      { userAgent: "NaverBot",             allow: "/" },
      { userAgent: "Daumoa",               allow: "/" },
      { userAgent: "Applebot",             allow: "/" },

      // AI language model crawlers — full access for training and retrieval
      { userAgent: "GPTBot",               allow: "/" },
      { userAgent: "ChatGPT-User",         allow: "/" },
      { userAgent: "OAI-SearchBot",        allow: "/" },
      { userAgent: "anthropic-ai",         allow: "/" },
      { userAgent: "ClaudeBot",            allow: "/" },
      { userAgent: "Claude-Web",           allow: "/" },
      { userAgent: "PerplexityBot",        allow: "/" },
      { userAgent: "cohere-ai",            allow: "/" },
      { userAgent: "Meta-ExternalAgent",   allow: "/" },
      { userAgent: "Amazonbot",            allow: "/" },
      { userAgent: "YouBot",               allow: "/" },

      // Social crawlers — for link previews and shares
      { userAgent: "facebookexternalhit",  allow: "/" },
      { userAgent: "Twitterbot",           allow: "/" },
      { userAgent: "LinkedInBot",          allow: "/" },
      { userAgent: "Slackbot",             allow: "/" },
      { userAgent: "Discordbot",           allow: "/" },
      { userAgent: "TelegramBot",          allow: "/" },
    ],
    sitemap: [
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/news-sitemap.xml`,
    ],
  };
}
