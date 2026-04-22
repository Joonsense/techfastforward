"use client";

import { useState } from "react";
import { Languages } from "lucide-react";

interface ArticleBodyProps {
  bodyHtml: string | null;
  bodyHtmlKo: string | null;
  excerpt: string;
}

function sanitize(html: string): string {
  return html
    .replace(/—/g, ", ")
    .replace(/&mdash;/g, ", ")
    .replace(/–/g, " ")
    .replace(/&ndash;/g, " ")
    .replace(/ - /g, ", ");
}

export default function ArticleBody({ bodyHtml, bodyHtmlKo, excerpt }: ArticleBodyProps) {
  const [lang, setLang] = useState<"en" | "ko">("en");

  const hasKo = !!bodyHtmlKo;
  const raw = lang === "ko" && hasKo ? bodyHtmlKo : (bodyHtml ?? `<p>${excerpt}</p>`);
  const content = sanitize(raw);

  return (
    <div>
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
        className="article-body"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
