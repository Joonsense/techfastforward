import { NextRequest, NextResponse } from "next/server";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "techfastforward";
const SITE_URL = "https://techfastforward.com";

// Called by deblockx-station when a new article is published
// POST /api/indexnow  body: { slug: string }
export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json() as { slug?: string };
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const url = `${SITE_URL}/articles/${slug}`;

    const payload = {
      host: "techfastforward.com",
      key: INDEXNOW_KEY,
      urlList: [url, `${SITE_URL}/sitemap.xml`],
    };

    // Ping Bing IndexNow
    await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    // Ping IndexNow.org (propagates to Yandex, Naver, Seznam)
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ ok: true, url });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// IndexNow key verification endpoint
export async function GET() {
  return new NextResponse(INDEXNOW_KEY, {
    headers: { "Content-Type": "text/plain" },
  });
}
