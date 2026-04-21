import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "TechFastForward";
  const category = searchParams.get("category") ?? "other";
  const excerpt = searchParams.get("excerpt") ?? "AI & Tech Intelligence";
  const accentColor = CATEGORY_COLOR[category] ?? CATEGORY_COLOR.other;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07080e",
          padding: "60px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: accentColor,
              borderRadius: "6px",
              padding: "4px 12px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {category.replace("_", " ")}
          </div>
          <span style={{ color: "#ffffff40", fontSize: "12px", fontWeight: 600 }}>
            TECHFASTFORWARD.COM
          </span>
        </div>

        {/* Title */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "16px" }}>
          <div
            style={{
              fontSize: title.length > 60 ? "36px" : "44px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#ffffff80",
              lineHeight: 1.5,
              maxWidth: "820px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "4px", height: "20px", background: accentColor, borderRadius: "2px" }} />
          <span style={{ color: "#ffffff60", fontSize: "14px", fontWeight: 600 }}>
            TechFast<span style={{ color: accentColor }}>Forward</span> — AI & Tech Intelligence
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
