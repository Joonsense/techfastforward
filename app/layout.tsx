import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#07080e] text-gray-100 font-[family-name:var(--font-inter)]">
        <div className="grain-overlay" />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-white/5 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm tracking-tight">TechFast<span className="text-[#f97316]">Forward</span></span>
                <span className="text-white/20 text-xs">|</span>
                <span className="text-white/40 text-xs">AI & Tech Intelligence</span>
              </div>
              <p className="text-white/30 text-xs">
                {new Date().getFullYear()} TechFastForward. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
