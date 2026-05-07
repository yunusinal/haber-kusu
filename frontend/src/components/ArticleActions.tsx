"use client";

import { useState, useEffect, useCallback } from "react";
import { trackInteraction } from "../lib/tracking";
import { getStoredUserId } from "../lib/useAnonymousUser";

interface Props {
  articleId: number;
  articleTitle: string;
  articleUrl: string;
  articleSummary?: string;
}

type Reaction = "like" | "dislike" | null;

function getStorageKey(id: number, type: string) {
  return `haberKusu_article_${id}_${type}`;
}

export default function ArticleActions({ articleId, articleTitle, articleUrl, articleSummary }: Props) {
  const [reaction, setReaction] = useState<Reaction>(null);
  const [saved, setSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const [showSummary, setShowSummary] = useState(false);

  // Restore persisted state + track view + dwell time
  useEffect(() => {
    try {
      const r = localStorage.getItem(getStorageKey(articleId, "reaction")) as Reaction;
      const s = localStorage.getItem(getStorageKey(articleId, "saved")) === "1";
      if (r) setReaction(r);
      setSaved(s);
    } catch {}

    // Makale görüntülendiğini kaydet
    trackInteraction(articleId, "view");

    // Sayfadan ayrılırken okuma süresini kaydet (>5 saniye ise)
    const startTime = Date.now();
    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    function handleUnload() {
      const dwellMs = Date.now() - startTime;
      if (dwellMs < 5000) return;
      const userId = getStoredUserId();
      if (!userId) return;
      const payload = JSON.stringify({
        user_id: userId,
        article_id: articleId,
        interaction_type: "dwell_time",
        dwell_time_ms: dwellMs,
      });
      navigator.sendBeacon(
        `${API_BASE}/api/interactions`,
        new Blob([payload], { type: "application/json" })
      );
    }

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [articleId]);

  const handleReaction = useCallback(
    (type: "like" | "dislike") => {
      setReaction((prev) => {
        const next = prev === type ? null : type;
        try {
          if (next) {
            localStorage.setItem(getStorageKey(articleId, "reaction"), next);
            trackInteraction(articleId, next);
          } else {
            localStorage.removeItem(getStorageKey(articleId, "reaction"));
          }
        } catch {}
        return next;
      });
    },
    [articleId]
  );

  const handleSave = useCallback(() => {
    setSaved((prev) => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem(getStorageKey(articleId, "saved"), "1");
          trackInteraction(articleId, "save");
        } else {
          localStorage.removeItem(getStorageKey(articleId, "saved"));
        }
      } catch {}
      return next;
    });
  }, [articleId]);

  const handleShare = useCallback(async () => {
    const shareData = { title: articleTitle, url: articleUrl };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(articleUrl);
        setShareStatus("copied");
        setTimeout(() => setShareStatus("idle"), 2000);
      }
    } catch {}
  }, [articleTitle, articleUrl]);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex items-center gap-2 flex-wrap"
        role="group"
        aria-label="Haber etkileşimleri"
      >
        {/* Like */}
        <button
          onClick={() => handleReaction("like")}
          aria-label={reaction === "like" ? "Beğeniyi geri al" : "Beğen"}
          aria-pressed={reaction === "like"}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-sans font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
            reaction === "like"
              ? "bg-brand border-brand text-white"
              : "border-[var(--border)] text-[var(--muted)] hover:border-brand hover:text-brand bg-transparent"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={reaction === "like" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Beğen
        </button>

        {/* Dislike */}
        <button
          onClick={() => handleReaction("dislike")}
          aria-label={reaction === "dislike" ? "Beğenmemeyi geri al" : "Beğenme"}
          aria-pressed={reaction === "dislike"}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-sans font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
            reaction === "dislike"
              ? "bg-[var(--surface-2)] border-[var(--muted)] text-[var(--foreground)]"
              : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)] hover:text-[var(--foreground)] bg-transparent"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 rotate-180" fill={reaction === "dislike" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
          </svg>
          Beğenme
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          aria-label="Haberi paylaş"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border)] text-[var(--muted)] hover:border-brand hover:text-brand text-sm font-sans font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] bg-transparent"
        >
          {shareStatus === "copied" ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">Kopyalandı</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Paylaş
            </>
          )}
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          aria-label={saved ? "Kaydedilenlerden kaldır" : "Haberi kaydet"}
          aria-pressed={saved}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-sans font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
            saved
              ? "bg-amber-500/10 border-amber-500/60 text-amber-400"
              : "border-[var(--border)] text-[var(--muted)] hover:border-amber-500/60 hover:text-amber-400 bg-transparent"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={saved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {saved ? "Kaydedildi" : "Kaydet"}
        </button>

        {/* AI Özet */}
        <button
          onClick={() => setShowSummary((v) => !v)}
          aria-label={showSummary ? "AI özetini kapat" : "AI özeti göster"}
          aria-pressed={showSummary}
          className={`relative overflow-hidden flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-sans font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${
            showSummary
              ? "text-white border-transparent"
              : "border-violet-500/40 text-violet-300 hover:border-violet-400 hover:text-violet-200 bg-transparent"
          }`}
          style={showSummary ? { background: "linear-gradient(135deg, #7c3aed, #2563eb)" } : {}}
        >
          {showSummary && (
            <span
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)" }}
              aria-hidden="true"
            />
          )}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
            <path d="M12 2l2.09 6.41L20.5 10l-6.41 2.09L12 18.5l-2.09-6.41L3.5 10l6.41-2.09L12 2z" />
            <path d="M19 15.5l1.04 3.21L23.25 19.75l-3.21 1.04L19 24l-1.04-3.21L14.75 19.75l3.21-1.04L19 15.5z" opacity=".6" />
          </svg>
          AI Özet
        </button>
      </div>

      {/* AI Summary panel */}
      {showSummary && (
        <div
          className="rounded-xl border p-4 flex flex-col gap-2"
          style={{
            background: "linear-gradient(135deg, rgba(109,40,217,0.08) 0%, rgba(37,99,235,0.08) 100%)",
            borderColor: "rgba(139,92,246,0.3)",
          }}
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-violet-400 shrink-0" aria-hidden="true">
              <path d="M12 2l2.09 6.41L20.5 10l-6.41 2.09L12 18.5l-2.09-6.41L3.5 10l6.41-2.09L12 2z" />
            </svg>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-violet-400">
              Yapay Zeka Özeti
            </span>
          </div>
          <p className="text-sm font-sans text-[var(--foreground)]/85 leading-relaxed">
            {articleSummary ?? "Bu haber için yapay zeka özeti henüz oluşturulmamıştır. Yakında otomatik olarak üretilecektir."}
          </p>
        </div>
      )}
    </div>
  );
}
