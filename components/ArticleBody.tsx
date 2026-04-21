"use client";

import { useState } from "react";
import { Languages } from "lucide-react";

interface ArticleBodyProps {
  bodyHtml: string | null;
  bodyHtmlKo: string | null;
  excerpt: string;
}

export default function ArticleBody({ bodyHtml, bodyHtmlKo, excerpt }: ArticleBodyProps) {
  const [lang, setLang] = useState<"en" | "ko">("en");

  const hasKo = !!bodyHtmlKo;
  const content = lang === "ko" && hasKo ? bodyHtmlKo : (bodyHtml ?? `<p>${excerpt}</p>`);

  return (
    <div>
      {/* Language toggle */}
      {hasKo && (
        <div className="flex items-center gap-2 mb-6">
          <Languages size={13} style={{ color: "var(--text-faint)" }} />
          <div
            className="flex rounded-lg overflow-hidden text-[11px] font-semibold"
            style={{ border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => setLang("en")}
              className="px-3 py-1.5 transition-colors"
              style={{
                background: lang === "en" ? "var(--accent)" : "var(--bg-card)",
                color: lang === "en" ? "#fff" : "var(--text-faint)",
              }}
            >
              EN
            </button>
            <button
              onClick={() => setLang("ko")}
              className="px-3 py-1.5 transition-colors"
              style={{
                background: lang === "ko" ? "var(--accent)" : "var(--bg-card)",
                color: lang === "ko" ? "#fff" : "var(--text-faint)",
              }}
            >
              한국어
            </button>
          </div>
        </div>
      )}

      <div
        className="prose prose-sm sm:prose-base max-w-none
          prose-headings:font-bold
          prose-a:no-underline hover:prose-a:underline
          prose-code:px-1 prose-code:rounded
          prose-pre:border
          dark:prose-invert
          dark:prose-headings:text-white
          dark:prose-p:text-white/70
          dark:prose-a:text-orange-400
          dark:prose-strong:text-white
          dark:prose-code:text-orange-400
          dark:prose-code:bg-orange-400/10
          dark:prose-pre:bg-[#0d0e17]
          dark:prose-pre:border-white/10
          dark:prose-blockquote:border-orange-400
          dark:prose-hr:border-white/10
          dark:prose-li:text-white/70"
        style={{ color: "var(--text-2)" }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
