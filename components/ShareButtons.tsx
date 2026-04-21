"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

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
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium" style={{ color: "var(--text-faint)" }}>Share:</span>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={btnBase}
        className="hover:border-[#1DA1F2]/50 hover:text-[#1DA1F2]"
      >
        <Share2 size={12} />
        X / Twitter
      </a>

      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={btnBase}
        className="hover:border-[#0077B5]/50 hover:text-[#0077B5]"
      >
        <Share2 size={12} />
        LinkedIn
      </a>

      <button
        onClick={copyLink}
        style={{ ...btnBase, border: copied ? "1px solid #10b981" : btnBase.border, color: copied ? "#10b981" : "var(--text-muted)" }}
        className="transition-all"
      >
        {copied ? <Check size={12} /> : <Link2 size={12} />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}
