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
  featured?: boolean;
}

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: "default" | "featured" | "compact";
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Default cover gradient patterns per category
const COVER_GRADIENTS: Record<string, string> = {
  funding: "from-emerald-900/80 via-[#07080e] to-[#07080e]",
  model_release: "from-blue-900/80 via-[#07080e] to-[#07080e]",
  product_launch: "from-purple-900/80 via-[#07080e] to-[#07080e]",
  acquisition: "from-red-900/80 via-[#07080e] to-[#07080e]",
  technology: "from-orange-900/80 via-[#07080e] to-[#07080e]",
  other: "from-gray-800/80 via-[#07080e] to-[#07080e]",
};

export default function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const gradientClass = COVER_GRADIENTS[article.category] ?? COVER_GRADIENTS.other;

  if (variant === "featured") {
    return (
      <Link href={`/articles/${article.slug}`} className="group block w-full">
        <div className="relative w-full overflow-hidden rounded-xl border border-white/8 bg-[#0d0e15]">
          {/* Cover image / gradient */}
          <div className={`relative w-full h-72 sm:h-96 bg-gradient-to-br ${gradientClass}`}>
            {article.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.coverImage}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
            )}
            {/* Ambient orb */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#f97316]/10 rounded-full blur-3xl" />
            {/* Overlay gradient bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-[#0d0e15]/40 to-transparent" />
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3">
                <CategoryBadge category={article.category} size="md" />
                <span className="text-[#f97316] text-xs font-semibold uppercase tracking-wider">Featured</span>
              </div>
              <h2 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-3 group-hover:text-[#f97316] transition-colors line-clamp-2">
                {article.title}
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-4 text-white/40 text-xs">
                <span className="font-medium text-white/60">{article.author ?? "TFF Editorial"}</span>
                <span>{formatDate(article.date)}</span>
                {article.readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {article.readingTime} min read
                  </span>
                )}
                <ArrowUpRight size={14} className="ml-auto text-[#f97316] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/articles/${article.slug}`} className="group flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
        <div className={`flex-shrink-0 w-16 h-12 rounded bg-gradient-to-br ${gradientClass} overflow-hidden`}>
          {article.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover opacity-50" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1">
            <CategoryBadge category={article.category} />
          </div>
          <h4 className="text-white/90 text-xs font-semibold leading-tight group-hover:text-[#f97316] transition-colors line-clamp-2">
            {article.title}
          </h4>
          <p className="text-white/35 text-[10px] mt-1">{formatDate(article.date)}</p>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="rounded-xl border border-white/8 bg-[#0d0e15] overflow-hidden hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200">
        {/* Cover image */}
        <div className={`relative w-full aspect-video bg-gradient-to-br ${gradientClass} overflow-hidden`}>
          {article.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.coverImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15]/60 to-transparent" />
          {/* Top-right ambient orb */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#f97316]/10 rounded-full blur-2xl" />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2.5">
            <CategoryBadge category={article.category} />
            {article.readingTime && (
              <span className="flex items-center gap-1 text-white/30 text-[10px]">
                <Clock size={9} />
                {article.readingTime} min
              </span>
            )}
          </div>

          <h3 className="text-white/90 font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
            {article.title}
          </h3>

          <p className="text-white/45 text-xs leading-relaxed line-clamp-2 mb-3">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between text-[10px] text-white/30">
            <span className="font-medium">{article.author ?? "TFF Editorial"}</span>
            <span>{formatDate(article.date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
