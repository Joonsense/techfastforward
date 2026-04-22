import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://techfastforward.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TechFastForward - AI & Tech Intelligence",
    template: "%s | TechFastForward",
  },
  description:
    "Premium AI and technology news. Funding rounds, model releases, big tech moves, and product launches - tracked and analyzed daily.",
  keywords: [
    "AI news", "artificial intelligence", "tech funding", "LLM releases",
    "startup investment", "AI models", "venture capital", "big tech",
    "machine learning", "technology intelligence",
  ],
  authors: [{ name: "TechFastForward Editorial", url: SITE_URL }],
  creator: "TechFastForward",
  publisher: "TechFastForward",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "TechFastForward - AI & Tech Intelligence",
    description: "Premium AI and technology news. Funding rounds, model releases, big tech moves.",
    type: "website",
    url: SITE_URL,
    siteName: "TechFastForward",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechFastForward - AI & Tech Intelligence",
    description: "Premium AI and technology news. Funding rounds, model releases, big tech moves.",
    creator: "@techfastforward",
    site: "@techfastforward",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": SITE_URL,
      "ko": `${SITE_URL}/ko`,
      "x-default": SITE_URL,
    },
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
    },
  },
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TechFastForward",
  url: SITE_URL,
  description: "Premium AI and technology intelligence publication",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TechFastForward",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/icon.png`,
    width: 512,
    height: 512,
  },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "editorial@techfastforward.com",
    contactType: "editorial",
  },
};

const publicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NewsMediaOrganization",
  name: "TechFastForward",
  url: SITE_URL,
  foundingDate: "2025",
  masthead: `${SITE_URL}/about`,
  publishingPrinciples: `${SITE_URL}/about`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="TechFastForward RSS Feed" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="TechFastForward Feed" href="/rss.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(publicationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        <ThemeProvider>
          <div className="grain-overlay" />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Analytics />
          <footer className="border-t mt-20" style={{ borderColor: "var(--border)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>
                    TechFast<span style={{ color: "var(--accent)" }}>Forward</span>
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>|</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>AI & Tech Intelligence</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href="/rss.xml" className="text-xs transition-colors" style={{ color: "var(--text-muted)" }} title="RSS Feed">RSS</a>
                  <a href="/llms.txt" className="text-xs transition-colors" style={{ color: "var(--text-muted)" }} title="LLMs.txt">llms.txt</a>
                  <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                    {new Date().getFullYear()} TechFastForward
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
