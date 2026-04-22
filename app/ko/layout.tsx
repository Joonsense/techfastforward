import type { Metadata } from "next";

const SITE_URL = "https://techfastforward.com";

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE_URL}/ko`,
    languages: {
      "en": SITE_URL,
      "ko": `${SITE_URL}/ko`,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    locale: "ko_KR",
    alternateLocale: "en_US",
  },
};

export default function KoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
