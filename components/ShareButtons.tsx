"use client";

import { useState } from "react";
import { Link2, Check, Quote, X, Code } from "lucide-react";

function IconX() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.261 5.635zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconKakao() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.72 1.55 5.12 3.9 6.6l-.98 3.6 3.16-1.96c.93.27 1.91.42 2.92.42 5.523 0 10-3.477 10-7.8S17.523 3 12 3zm-1.12 10.28L9.04 11.4l-2.4 1.88 1.96-3.2-2.4-1.88h3l1.04-2.2.96 2.2h3l-2.4 1.88 1.96 3.2-2.88-1.92z" />
    </svg>
  );
}

interface ShareButtonsProps {
  title: string;
  url?: string;
  author?: string;
  date?: string;
}

export default function ShareButtons({ title, url, author, date }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [citeCopied, setCiteCopied] = useState(false);
  const [showCite, setShowCite] = useState(false);
  const [citeFormat, setCiteFormat] = useState<"apa" | "bibtex">("apa");

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const pubYear = date ? new Date(date).getFullYear() : new Date().getFullYear();
  const pubDateFull = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const authorName = author ?? "TFF Editorial";
  const slugKey = shareUrl.split("/").pop()?.replace(/-/g, "").slice(0, 12) ?? "tff";

  const apaText = `${authorName}. (${pubYear}). ${title}. TechFastForward. ${shareUrl}`;
  const bibtexText = `@article{tff${slugKey}${pubYear},
  author  = {${authorName}},
  title   = {${title}},
  journal = {TechFastForward},
  year    = {${pubYear}},
  url     = {${shareUrl}},
  urldate = {${new Date().toISOString().split("T")[0]}}
}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const copyCite = async () => {
    const text = citeFormat === "apa" ? apaText : bibtexText;
    try {
      await navigator.clipboard.writeText(text);
      setCiteCopied(true);
      setTimeout(() => setCiteCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title, url: shareUrl }); } catch { /* cancelled */ }
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const btn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 11px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 500,
    border: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    color: "var(--text-muted)",
    cursor: "pointer",
    textDecoration: "none",
    transition: "border-color 0.15s, color 0.15s, background 0.15s",
    lineHeight: "1",
  };

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-medium" style={{ color: "var(--text-faint)" }}>공유:</span>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={btn}
          className="hover:!border-white/20 hover:!bg-black hover:!text-white"
          title="X에서 공유"
        >
          <IconX />
          <span>X</span>
        </a>

        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={btn}
          className="hover:!border-[#0077B5]/40 hover:!bg-[#0077B5]/10 hover:!text-[#0077B5]"
          title="LinkedIn에서 공유"
        >
          <IconLinkedIn />
          <span>LinkedIn</span>
        </a>

        {hasNativeShare && (
          <button
            onClick={nativeShare}
            style={btn}
            className="hover:!border-[#FEE500]/40 hover:!bg-[#FEE500]/10 hover:!text-[#3C1E1E]"
            title="카카오톡으로 공유"
          >
            <IconKakao />
            <span>카카오</span>
          </button>
        )}

        <button
          onClick={copyLink}
          style={{
            ...btn,
            border: copied ? "1px solid #10b981" : String(btn.border),
            color: copied ? "#10b981" : "var(--text-muted)",
          }}
          title="링크 복사"
        >
          {copied ? <Check size={12} /> : <Link2 size={12} />}
          <span>{copied ? "복사됨" : "링크"}</span>
        </button>

        <button
          onClick={() => setShowCite(!showCite)}
          style={{
            ...btn,
            border: showCite ? "1px solid var(--accent)" : String(btn.border),
            color: showCite ? "var(--accent)" : "var(--text-muted)",
          }}
          title="인용 형식"
        >
          <Quote size={12} />
          <span>인용</span>
        </button>
      </div>

      {showCite && (
        <div
          className="mt-3 p-4 rounded-xl"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {(["apa", "bibtex"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCiteFormat(fmt)}
                  className="px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider transition-colors"
                  style={{
                    background: citeFormat === fmt ? "var(--accent)" : "transparent",
                    color: citeFormat === fmt ? "#fff" : "var(--text-faint)",
                  }}
                >
                  {fmt === "bibtex" ? "BibTeX" : "APA"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyCite}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors"
                style={{
                  background: citeCopied ? "#10b981" : "var(--bg-card)",
                  color: citeCopied ? "#fff" : "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                {citeCopied ? <Check size={10} /> : <Code size={10} />}
                {citeCopied ? "완료" : "복사"}
              </button>
              <button onClick={() => setShowCite(false)} style={{ color: "var(--text-faint)" }}>
                <X size={13} />
              </button>
            </div>
          </div>
          <pre
            className="text-[11px] leading-relaxed whitespace-pre-wrap break-all"
            style={{ color: "var(--text-muted)", fontFamily: "monospace" }}
          >
            {citeFormat === "apa" ? apaText : bibtexText}
          </pre>
        </div>
      )}
    </div>
  );
}
