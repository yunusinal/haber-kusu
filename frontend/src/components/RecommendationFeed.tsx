"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecommendations } from "../lib/api";
import { useAnonymousUser } from "../lib/useAnonymousUser";
import type { RecommendedArticle } from "../lib/types";
import NewsCard from "./NewsCard";
import SkeletonCard from "./SkeletonCard";

interface Props {
  page: number;
  pageSize: number;
}

export default function RecommendationFeed({ page, pageSize }: Props) {
  const userId = useAnonymousUser();
  const [articles, setArticles] = useState<RecommendedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(false);

    getRecommendations({ user_id: userId, page, page_size: pageSize })
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [userId, page, pageSize]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <section aria-label="Yükleniyor">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="text-center py-20 text-[var(--muted)]">
        <p className="text-lg font-sans">
          {error
            ? "Haberler yüklenemedi."
            : "Henüz öneri yok. Haberlere göz atarak başla!"}
        </p>
      </div>
    );
  }

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="flex flex-col gap-8">
      {/* ── Öne çıkan haber ── */}
      <section aria-label="Öne çıkan haber">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-1 h-5 rounded-full bg-violet-500" aria-hidden="true" />
          <h2 className="font-display text-sm font-bold text-[var(--foreground)] tracking-tight uppercase">
            Editörün Seçimi
          </h2>
        </div>
        <FeaturedCard article={featured} />
      </section>

      {/* ── Haber grid ── */}
      {rest.length > 0 && (
        <section aria-label="Senin için seçilenler">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-5 rounded-full bg-violet-500" aria-hidden="true" />
            <h2 className="font-display text-sm font-bold text-[var(--foreground)] tracking-tight uppercase">
              Senin İçin Seçilenler
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FeaturedCard({ article }: { article: RecommendedArticle }) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="group flex flex-col sm:flex-row bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden hover:border-violet-500/40 hover:shadow-[0_0_28px_rgba(124,58,237,0.1)] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
      aria-label={article.title}
    >
      <div className="relative sm:w-72 h-52 sm:h-auto shrink-0 bg-[var(--surface-2)]">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt=""
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, 288px"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-[var(--border)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:hidden" />
      </div>

      <div className="flex flex-col justify-between gap-4 p-6 flex-1">
        <div className="flex flex-col gap-3">
          {article.category && (
            <span
              className="w-fit px-3 py-1 rounded-full text-[10px] font-display font-bold tracking-widest uppercase text-violet-200 border border-violet-500/30"
              style={{ background: "rgba(109,40,217,0.3)" }}
            >
              {article.category.name}
            </span>
          )}
          <h2 className="font-display text-xl font-bold text-[var(--foreground)] leading-snug group-hover:text-violet-400 transition-colors duration-200 line-clamp-3">
            {article.title}
          </h2>
          {article.summary && (
            <p className="text-sm font-sans text-[var(--muted)] leading-relaxed line-clamp-2">
              {article.summary}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs font-sans text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">{article.source.name}</span>
          <span aria-hidden="true" className="text-[var(--border)]">·</span>
          <time dateTime={article.published_at ?? article.created_at}>
            {new Date(article.published_at ?? article.created_at).toLocaleDateString("tr-TR", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </time>
          <span className="ml-auto flex items-center gap-1 text-violet-400 font-semibold">
            Oku
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
