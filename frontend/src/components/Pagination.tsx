"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
}

export default function Pagination({ total, page, pageSize }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  const goTo = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(p));
      router.push(`${pathname}?${params}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [router, pathname, searchParams]
  );

  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav aria-label="Sayfa navigasyonu" className="flex items-center justify-center gap-1 flex-wrap">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        aria-label="Önceki sayfa"
        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--muted)] disabled:opacity-40 hover:border-brand hover:text-brand transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-[var(--muted)]">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            aria-label={`Sayfa ${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
              p === page
                ? "bg-brand text-white border-brand"
                : "border-[var(--border)] text-[var(--muted)] hover:border-brand hover:text-brand"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        aria-label="Sonraki sayfa"
        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--muted)] disabled:opacity-40 hover:border-brand hover:text-brand transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        ›
      </button>
    </nav>
  );
}
