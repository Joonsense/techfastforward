"use client";

export type Category =
  | "funding"
  | "model_release"
  | "product_launch"
  | "acquisition"
  | "technology"
  | "other";

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; className: string }
> = {
  funding: {
    label: "Funding",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  model_release: {
    label: "Model Release",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  },
  product_launch: {
    label: "Product Launch",
    className: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  },
  acquisition: {
    label: "Acquisition",
    className: "bg-red-500/15 text-red-400 border-red-500/20",
  },
  technology: {
    label: "Technology",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  },
  other: {
    label: "Analysis",
    className: "bg-white/5 text-gray-400 border-white/10",
  },
};

interface CategoryBadgeProps {
  category: Category | string;
  size?: "sm" | "md";
}

export default function CategoryBadge({
  category,
  size = "sm",
}: CategoryBadgeProps) {
  const key = (category as Category) in CATEGORY_CONFIG
    ? (category as Category)
    : "other";
  const config = CATEGORY_CONFIG[key];

  const sizeClass = size === "md"
    ? "px-3 py-1 text-xs"
    : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center font-semibold uppercase tracking-wider rounded-full border ${config.className} ${sizeClass}`}
    >
      {config.label}
    </span>
  );
}
