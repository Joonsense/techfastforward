"use client";

export type Category =
  | "funding"
  | "model_release"
  | "product_launch"
  | "acquisition"
  | "technology"
  | "partnership"
  | "regulation"
  | "other";

const CATEGORY_CONFIG: Record<Category, { label: string; light: string; dark: string }> = {
  funding:       { label: "Funding",        light: "bg-emerald-50 text-emerald-700 border-emerald-200",   dark: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  model_release: { label: "Model Release",  light: "bg-blue-50 text-blue-700 border-blue-200",            dark: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  product_launch:{ label: "Product Launch", light: "bg-violet-50 text-violet-700 border-violet-200",      dark: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  acquisition:   { label: "M&A",            light: "bg-red-50 text-red-700 border-red-200",               dark: "bg-red-500/10 text-red-400 border-red-500/20" },
  technology:    { label: "Big Tech",       light: "bg-orange-50 text-orange-700 border-orange-200",      dark: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  partnership:   { label: "Partnership",    light: "bg-cyan-50 text-cyan-700 border-cyan-200",            dark: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  regulation:    { label: "Regulation",     light: "bg-yellow-50 text-yellow-700 border-yellow-200",      dark: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  other:         { label: "Analysis",       light: "bg-gray-100 text-gray-600 border-gray-200",           dark: "bg-white/5 text-gray-400 border-white/10" },
};

interface CategoryBadgeProps {
  category: Category | string;
  size?: "sm" | "md";
}

export default function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const key = (category as Category) in CATEGORY_CONFIG ? (category as Category) : "other";
  const config = CATEGORY_CONFIG[key];
  const sizeClass = size === "md" ? "px-2.5 py-1 text-[11px]" : "px-2 py-0.5 text-[10px]";

  return (
    <span className={`inline-flex items-center font-semibold uppercase tracking-wider rounded-md border ${config.light} dark:${config.dark} ${sizeClass} transition-none`}>
      {config.label}
    </span>
  );
}
