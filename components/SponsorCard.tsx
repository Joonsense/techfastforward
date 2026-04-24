"use client";

import Link from "next/link";

interface SponsorCardProps {
  name?: string;
  tagline?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export default function SponsorCard({ name, tagline, ctaText, ctaUrl }: SponsorCardProps) {
  const isDefault = !name && !tagline && !ctaText && !ctaUrl;

  return (
    <div
      className="rounded-xl p-4 relative"
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
    >
      {/* Sponsor label */}
      <div className="absolute top-4 right-4">
        <span
          className="text-[9px] uppercase tracking-wider font-semibold"
          style={{ color: "var(--text-faint)" }}
        >
          Sponsor
        </span>
      </div>

      {/* Content */}
      <div className="pr-12">
        {isDefault ? (
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                Become a Sponsor
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Reach 50k+ AI decision makers
              </p>
            </div>
            <Link
              href="mailto:sponsor@techfastforward.com"
              className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Get in touch
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div>
              {name && (
                <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                  {name}
                </p>
              )}
              {tagline && (
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {tagline}
                </p>
              )}
            </div>
            {(ctaText || ctaUrl) && (
              <Link
                href={ctaUrl || "#"}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {ctaText || "Learn more"}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
