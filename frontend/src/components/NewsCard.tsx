"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import type { Article } from "../lib/types";
import { trackInteraction } from "../lib/tracking";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getStorageKey(id: number) {
  return `haberKusu_saved_${id}`;
}

// Placeholder AI summary — replace with real DB fetch later
function getPlaceholderSummary(article: Article): string {
  return (
    article.summary ??
    (article.content
      ? article.content.slice(0, 220).trimEnd() + "…"
      : "Bu haber için yapay zeka özeti henüz oluşturulmamıştır. Yakında veritabanından otomatik olarak çekilecektir.")
  );
}

export default function NewsCard({ article }: { article: Article }) {
  const [saved, setSaved] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    try {
      setSaved(localStorage.getItem(getStorageKey(article.id)) === "1");
    } catch {}
  }, [article.id]);

  const toggleSave = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setSaved((prev) => {
        const next = !prev;
        try {
          if (next) {
            localStorage.setItem(getStorageKey(article.id), "1");
            trackInteraction(article.id, "save");
          } else {
            localStorage.removeItem(getStorageKey(article.id));
          }
        } catch {}
        return next;
      });
    },
    [article.id]
  );

  const toggleSummary = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSummaryOpen((v) => !v);
  }, []);

  return (
    <div className="group flex flex-col bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden
      hover:border-brand/40 hover:shadow-[0_0_20px_rgba(220,38,38,0.07)]
      transition-all duration-200 ease-out">

      {/* Clickable area — image + title */}
      <Link
        href={`/articles/${article.id}`}
        className="flex flex-col flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
        aria-label={article.title}
        onClick={() => trackInteraction(article.id, "view")}
      >
        {/* Thumbnail */}
        <div className="relative h-44 bg-[var(--surface-2)] shrink-0 overflow-hidden">
          {article.image_url ? (
            <Image
              src={article.image_url}
              alt=""
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 text-[var(--border)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Category badge */}
          {article.category && (
            <span className="absolute top-2.5 left-2.5 bg-brand text-white text-[10px] font-display font-bold tracking-widest uppercase px-2.5 py-1 rounded-full leading-none pointer-events-none">
              {article.category.name}
            </span>
          )}

          {/* Save button overlay */}
          <button
            onClick={toggleSave}
            aria-label={saved ? "Kaydedilenlerden kaldır" : "Haberi kaydet"}
            aria-pressed={saved}
            className={`absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand
              ${saved
                ? "bg-amber-500 border-amber-500 text-white shadow-lg"
                : "bg-black/50 border-white/20 text-white hover:bg-amber-500 hover:border-amber-500"
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-2 p-4 flex-1">
          <h2 className="font-display text-[0.95rem] font-semibold text-[var(--foreground)] leading-snug
            group-hover:text-brand transition-colors duration-200 line-clamp-3">
            {article.title}
          </h2>

          <div className="mt-auto pt-3 border-t border-[var(--border)] flex items-center justify-between gap-2 text-xs font-sans text-[var(--muted)]">
            <span className="font-medium truncate max-w-[60%]">{article.source.name}</span>
            <time dateTime={article.published_at ?? article.created_at} className="shrink-0">
              {formatDate(article.published_at ?? article.created_at)}
            </time>
          </div>
        </div>
      </Link>

      {/* ── AI Summary section (outside the Link) ── */}
      <div className="px-4 pb-4 -mt-1">
        <button
          onClick={toggleSummary}
          aria-expanded={summaryOpen}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-[var(--border)] hover:border-brand/50 bg-[var(--surface-2)] hover:bg-brand/5 text-xs font-sans font-semibold text-[var(--muted)] hover:text-brand transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span className="flex items-center gap-1.5">
            {/* Sparkle icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-brand" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
            </svg>
            AI Özet
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-3.5 h-3.5 transition-transform duration-200 ${summaryOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {summaryOpen && (
          <div className="mt-2 p-3 rounded-lg bg-brand/5 border border-brand/20 text-xs font-sans text-[var(--foreground)]/80 leading-relaxed animate-fade-in">
            <div className="flex items-center gap-1.5 mb-2 text-brand font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
              </svg>
              Yapay Zeka Özeti
            </div>
            {getPlaceholderSummary(article)}
          </div>
        )}
      </div>
    </div>
  );
}
