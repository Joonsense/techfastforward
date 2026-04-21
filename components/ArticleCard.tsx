import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import CategoryBadge, { type Category } from "./CategoryBadge";

export interface ArticleCardData {
  slug: string;
  title: string;
  excerpt: string;
  category: Category | string;
  coverImage?: string;
  author?: string;
  date: string;
  readingTime?: number;
}

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: "default" | "featured" | "compact";
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return dateStr; }
}

const CATEGORY_COVER: Record<string, string> = {
  funding:        "from-emerald-100 to-emerald-50 dark:from-emerald-900/60 dark:to-[#07080e]",
  model_release:  "from-blue-100 to-blue-50 dark:from-blue-900/60 dark:to-[#07080e]",
  product_launch: "from-violet-100 to-violet-50 dark:from-violet-900/60 dark:to-[#07080e]",
  acquisition:    "from-red-100 to-red-50 dark:from-red-900/60 dark:to-[#07080e]",
  technology:     "from-orange-100 to-orange-50 dark:from-orange-900/60 dark:to-[#07080e]",
  regulation:     "from-yellow-100 to-yellow-50 dark:from-yellow-900/60 dark:to-[#07080e]",
  other:          "from-gray-100 to-gray-50 dark:from-gray-800/60 dark:to-[#07080e]",
};

function CoverPlaceholder({ category, className }: { category: string; className?: string }) {
  const grad = CATEGORY_COVER[category] ?? CATEGORY_COVER.other;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${grad} ${className ?? ""}`} />
  );
}

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/articles/${article.slug}`} className="group block w-full">
        <div
          className="relative w-full overflow-hidden rounded-2xl transition-shadow duration-200"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}
        >
          {/* Cover */}
          <div className="relative w-full h-72 sm:h-96 overflow-hidden">
            {article.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover opacity-90 dark:opacity-40" />
            ) : (
              <CoverPlaceholder category={article.category} className="h-full" />
            )}
            {/* Bottom fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent dark:from-[#07080e]/90" />
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-3">
                <CategoryBadge category={article.category} size="md" />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Featured</span>
              </div>
              <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2 group-hover:text-orange-200 transition-colors line-clamp-2">
                {article.title}
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
              <div className="flex items-center gap-4 text-white/50 text-xs">
                <span className="font-medium text-white/80">{article.author ?? "TFF Editorial"}</span>
                <span>{formatDate(article.date)}</span>
                {article.readingTime && (
                  <span className="flex items-center gap-1"><Clock size={10} />{article.readingTime} min</span>
                )}
                <ArrowUpRight size={14} className="ml-auto text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/articles/${article.slug}`}
        className="group flex items-start gap-3 py-3 border-b last:border-0 transition-colors"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Thumbnail */}
        <div
          className="flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          {article.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          ) : (
            <CoverPlaceholder category={article.category} className="h-full" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1">
            <CategoryBadge category={article.category} />
          </div>
          <h4
            className="text-xs font-semibold leading-tight line-clamp-2 transition-colors"
            style={{ color: "var(--text)" }}
          >
            {article.title}
          </h4>
          <p className="text-[10px] mt-1 font-mono" style={{ color: "var(--text-faint)" }}>{formatDate(article.date)}</p>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div
        className="rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* Cover */}
        <div className="relative w-full aspect-video overflow-hidden">
          {article.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
          ) : (
            <CoverPlaceholder category={article.category} className="h-full" />
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2.5">
            <CategoryBadge category={article.category} />
            {article.readingTime && (
              <span className="flex items-center gap-1 text-[10px] font-mono" style={{ color: "var(--text-faint)" }}>
                <Clock size={9} /> {article.readingTime} min
              </span>
            )}
          </div>

          <h3
            className="font-semibold text-sm leading-snug mb-1.5 line-clamp-2 transition-colors"
            style={{ color: "var(--text)" }}
          >
            {article.title}
          </h3>

          <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--text-muted)" }}>
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--text-faint)" }}>
            <span className="font-medium">{article.author ?? "TFF Editorial"}</span>
            <span className="font-mono">{formatDate(article.date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
