import { NextRequest, NextResponse } from "next/server";

const LOCALE_COOKIE = "tff-locale";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only redirect the root path — never deep links
  if (pathname !== "/") return NextResponse.next();

  // Respect existing preference
  const saved = req.cookies.get(LOCALE_COOKIE)?.value;
  if (saved === "ko") {
    return NextResponse.redirect(new URL("/ko", req.url));
  }
  if (saved === "en") {
    return NextResponse.next();
  }

  // First visit: detect from Accept-Language
  const acceptLang = req.headers.get("accept-language") ?? "";
  const isKorean = /\bko\b/i.test(acceptLang);

  if (isKorean) {
    const res = NextResponse.redirect(new URL("/ko", req.url));
    res.cookies.set(LOCALE_COOKIE, "ko", {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
    return res;
  }

  const res = NextResponse.next();
  res.cookies.set(LOCALE_COOKIE, "en", {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });
  return res;
}

export const config = {
  matcher: ["/"],
};
