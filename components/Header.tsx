"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Funding", href: "/category/funding" },
  { label: "Models", href: "/category/model_release" },
  { label: "Big Tech", href: "/category/technology" },
  { label: "Products", href: "/category/product_launch" },
  { label: "Analysis", href: "/category/other" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState<"EN" | "KO">("EN");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#07080e]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded bg-[#f97316]/10 border border-[#f97316]/30 flex items-center justify-center">
              <Zap size={12} className="text-[#f97316]" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight">
              TechFast<span className="text-[#f97316]">Forward</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-xs font-medium text-white/50 hover:text-white/90 rounded-md hover:bg-white/5 transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Live dot */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] pulse-dot" />
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Live</span>
            </div>

            {/* Lang toggle */}
            <button
              onClick={() => setLang(lang === "EN" ? "KO" : "EN")}
              className="flex items-center gap-0.5 px-2 py-1 rounded border border-white/10 text-[10px] font-semibold text-white/50 hover:text-white/80 hover:border-white/20 transition-all"
            >
              <span className={lang === "KO" ? "text-[#f97316]" : "text-white/40"}>KO</span>
              <span className="text-white/20 mx-0.5">/</span>
              <span className={lang === "EN" ? "text-[#f97316]" : "text-white/40"}>EN</span>
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-1.5 rounded text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/5 py-3 pb-4">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white rounded-md hover:bg-white/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
