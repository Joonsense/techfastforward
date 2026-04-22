"use client";

import { useState } from "react";
import { Share2, Link2, Check, Quote, X, Code } from "lucide-react";

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
  const pubDateLong = date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const authorName = author ?? "TFF Editorial";
  const slugKey = shareUrl.split("/").pop()?.replace(/-/g, "") ?? "tff";

  const apaText = `${authorName}. (${pubYear}, ${pubDateLong.split(", ")[0]}). ${title}. *TechFastForward*. ${shareUrl}`;
  const bibtexText = `@article{tff${slugKey}${pubYear},
  author    = {${authorName}},
  title     = {${title}},
  journal   = {TechFastForward},
  year      = {${pubYear}},
  url       = {${shareUrl}},
  note      = {Accessed: ${new Date().toISOString().split("T")[0]}}
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
      try {
        await navigator.share({ title, url: shareUrl });
      } catch { /* user cancelled */ }
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 500,
    border: "1px solid var(--border)",
    background: "var(--bg-secondary)",
    color: "var(--text-muted)",
    cursor: "pointer",
    textDecoration: "none",
    transition: "border-color 0.15s, color 0.15s",
  };

  return (
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium" style={{ color: "var(--text-faint)" }}>Share:</span>

        <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={btnBase}
          className="hover:border-[#1DA1F2]/50 hover:text-[#1DA1F2]">
          <Share2 size={12} />
          X / Twitter
        </a>

        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={btnBase}
          className="hover:border-[#0077B5]/50 hover:text-[#0077B5]">
          <Share2 size={12} />
          LinkedIn
        </a>

        {/* KakaoTalk via Web Share API — shows on mobile where navigator.share is available */}
        {hasNativeShare && (
          <button onClick={nativeShare} style={{ ...btnBase }}
            className="hover:border-[#FEE500]/50 hover:text-[#FEE500]">
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "-0.02em" }}>카카오</span>
            공유
          </button>
        )}

        <button
          onClick={copyLink}
          style={{
            ...btnBase,
            border: copied ? "1px solid #10b981" : String(btnBase.border),
            color: copied ? "#10b981" : "var(--text-muted)",
          }}
        >
          {copied ? <Check size={12} /> : <Link2 size={12} />}
          {copied ? "Copied!" : "Copy link"}
        </button>

        <button
          onClick={() => setShowCite(!showCite)}
          style={{
            ...btnBase,
            border: showCite ? "1px solid var(--accent)" : String(btnBase.border),
            color: showCite ? "var(--accent)" : "var(--text-muted)",
          }}
        >
          <Quote size={12} />
          Cite
        </button>
      </div>

      {/* Citation panel */}
      {showCite && (
        <div
          className="mt-3 p-4 rounded-xl text-xs"
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
            <div className="flex items-center gap-1">
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
                {citeCopied ? "Copied!" : "Copy"}
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
