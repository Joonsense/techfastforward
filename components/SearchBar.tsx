"use client";

import { useRef, useCallback } from "react";
import { Search } from "lucide-react";
import { type ArticleCardData } from "./ArticleCard";

interface SearchBarProps {
  articles: ArticleCardData[];
  onResults: (filtered: ArticleCardData[]) => void;
  placeholder?: string;
}

export default function SearchBar({ articles, onResults, placeholder = "Search articles..." }: SearchBarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;

      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        const q = query.trim().toLowerCase();
        if (!q) {
          onResults(articles);
          return;
        }
        const filtered = articles.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            (a.excerpt ?? "").toLowerCase().includes(q)
        );
        onResults(filtered);
      }, 200);
    },
    [articles, onResults]
  );

  return (
    <div
      className="flex items-center gap-2 px-3 rounded-lg"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        height: "34px",
      }}
    >
      <Search size={13} style={{ color: "var(--text-faint)", flexShrink: 0 }} />
      <input
        type="search"
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-xs min-w-0"
        style={{ color: "var(--text)", caretColor: "var(--accent)" }}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
      />
    </div>
  );
}
