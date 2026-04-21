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

export const metadata: Metadata = {
  title: "TechFastForward — AI & Tech Intelligence",
  description: "Premium AI and technology news. Funding rounds, model releases, big tech moves, and product launches — tracked and analyzed.",
  keywords: ["AI news", "tech funding", "LLM releases", "startup intelligence"],
  openGraph: {
    title: "TechFastForward",
    description: "Premium AI & tech intelligence magazine",
    type: "website",
    url: "https://techfastforward.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
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
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                  {new Date().getFullYear()} TechFastForward. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
