import { getArticle } from "@/lib/articles";
import { NextRequest } from "next/server";

const SITE_URL = "https://techfastforward.com";

const CATEGORY_COLOR: Record<string, string> = {
  funding:        "#10b981",
  model_release:  "#3b82f6",
  technology:     "#f97316",
  product_launch: "#8b5cf6",
  acquisition:    "#ef4444",
  partnership:    "#06b6d4",
  regulation:     "#eab308",
  other:          "#6b7280",
};

const CATEGORY_LABEL: Record<string, string> = {
  funding:        "Funding",
  model_release:  "Model Release",
  technology:     "Big Tech",
  product_launch: "Product Launch",
  acquisition:    "M&A",
  partnership:    "Partnership",
  regulation:     "Regulation",
  other:          "Analysis",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return new Response("<p>Article not found</p>", {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  const color = CATEGORY_COLOR[article.category] ?? "#6b7280";
  const label = CATEGORY_LABEL[article.category] ?? "News";
  const articleUrl = `${SITE_URL}/articles/${slug}`;
  const date = new Date(article.published_at ?? article.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${article.title} | TechFastForward</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #0d0e17;
    color: #e2e8f0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .card {
    background: #161825;
    border: 1px solid #2a2d3e;
    border-radius: 16px;
    padding: 24px;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 14px;
    border: 1px solid;
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  h1 {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.3;
    color: #f1f5f9;
    margin-bottom: 10px;
  }
  .excerpt {
    font-size: 13px;
    line-height: 1.6;
    color: #94a3b8;
    margin-bottom: 18px;
  }
  .meta {
    font-size: 11px;
    color: #64748b;
    margin-bottom: 18px;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    color: #fff;
    transition: opacity 0.15s;
  }
  .cta:hover { opacity: 0.85; }
  .footer {
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid #2a2d3e;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #64748b;
  }
  .brand span { color: ${color}; }
  .powered {
    font-size: 10px;
    color: #475569;
  }
</style>
</head>
<body>
<div class="card">
  <div class="badge" style="color:${color};border-color:${color}33;background:${color}11;">
    <div class="dot" style="background:${color};"></div>
    ${label}
  </div>
  <h1>${article.title}</h1>
  <p class="excerpt">${article.excerpt}</p>
  <div class="meta">${article.author ?? "TFF Editorial"} &nbsp;·&nbsp; ${date}</div>
  <a class="cta" href="${articleUrl}" target="_blank" rel="noopener" style="background:${color};">
    Read full article →
  </a>
  <div class="footer">
    <div class="brand">TechFast<span>Forward</span></div>
    <span class="powered">AI & Tech Intelligence</span>
  </div>
</div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Frame-Options": "ALLOWALL",
      "Content-Security-Policy": "frame-ancestors *",
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=60",
    },
  });
}
