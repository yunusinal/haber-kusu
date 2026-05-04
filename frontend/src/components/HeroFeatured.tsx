import Image from "next/image";
import Link from "next/link";
import type { Article } from "../lib/types";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function HeroFeatured({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="group relative flex flex-col justify-end overflow-hidden rounded-2xl cursor-pointer
        min-h-[420px] sm:min-h-[520px]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      aria-label={`Öne çıkan haber: ${article.title}`}
    >
      {/* Background image */}
      {article.image_url ? (
        <Image
          src={article.image_url}
          alt=""
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 1280px"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {article.category && (
            <span className="bg-brand text-white text-[11px] font-display font-bold tracking-widest uppercase px-3 py-1 rounded-full">
              {article.category.name}
            </span>
          )}
          <span className="text-white/60 text-xs font-sans">
            {formatDate(article.published_at ?? article.created_at)}
          </span>
        </div>

        <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight text-balance
          group-hover:text-brand transition-colors duration-200 max-w-2xl">
          {article.title}
        </h2>

        {(article.summary ?? article.content) && (
          <p className="text-white/70 text-sm sm:text-base font-sans leading-relaxed line-clamp-2 max-w-xl">
            {(article.summary ?? article.content ?? "").slice(0, 180)}…
          </p>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-white/50 text-xs font-sans">{article.source.name}</span>
          <span className="flex items-center gap-1.5 text-brand text-sm font-sans font-semibold group-hover:gap-3 transition-all duration-200">
            Haberi Oku
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
