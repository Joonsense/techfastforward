"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";

interface TickerItem {
  slug: string;
  title: string;
  category: string;
}

const CATEGORY_COLOR: Record<string, string> = {
  funding:        "#10b981",
  model_release:  "#3b82f6",
  product_launch: "#8b5cf6",
  acquisition:    "#ef4444",
  technology:     "#f97316",
  partnership:    "#06b6d4",
  regulation:     "#eab308",
  other:          "#6b7280",
};

export default function BreakingTicker({ items, locale }: { items: TickerItem[]; locale?: "ko" }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return;
    // Duplicate for seamless loop
    track.innerHTML += track.innerHTML;
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div
      className="w-full overflow-hidden flex items-center gap-0 mb-6 rounded-xl"
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", height: "36px" }}
    >
      {/* Label */}
      <div
        className="flex items-center gap-1.5 px-3 flex-shrink-0 h-full"
        style={{ background: "var(--accent)", borderRadius: "10px 0 0 10px" }}
      >
        <Radio size={10} color="#fff" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap">Live</span>
      </div>

      {/* Scrolling track */}
      <div className="overflow-hidden flex-1 relative h-full">
        <div
          ref={trackRef}
          className="flex items-center h-full gap-0 ticker-track"
          style={{ willChange: "transform" }}
        >
          {items.map((item, i) => (
            <Link
              key={i}
              href={locale ? `/${locale}/articles/${item.slug}` : `/articles/${item.slug}`}
              className="flex items-center gap-2 px-5 whitespace-nowrap text-xs hover:opacity-70 transition-opacity h-full flex-shrink-0"
              style={{ color: "var(--text-muted)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: CATEGORY_COLOR[item.category] ?? "#6b7280" }}
              />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
