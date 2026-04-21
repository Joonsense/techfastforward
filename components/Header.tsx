"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Zap, Menu, X, Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { label: "Funding",    href: "/category/funding" },
  { label: "Models",     href: "/category/model_release" },
  { label: "Big Tech",   href: "/category/technology" },
  { label: "Products",   href: "/category/product_launch" },
  { label: "M&A",        href: "/category/acquisition" },
  { label: "Regulation", href: "/category/regulation" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{ borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--bg) 94%, transparent)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "var(--accent-bg)", border: "1px solid var(--accent-bdr)" }}>
              <Zap size={12} style={{ color: "var(--accent)" }} />
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>
              TechFast<span style={{ color: "var(--accent)" }}>Forward</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent)" }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-faint)" }}>Live</span>
            </div>
            <ThemeToggle />
            <button
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden py-3 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium rounded-md"
                  style={{ color: "var(--text-muted)" }}
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
