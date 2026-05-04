"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed.length < 2) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} role="search" className="flex gap-2">
      <label htmlFor="search-input" className="sr-only">
        Haberlerde ara
      </label>
      <input
        id="search-input"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Haberlerde ara..."
        autoComplete="off"
        className="w-full rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2 text-sm font-sans text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-brand transition-colors duration-200"
      />
      <button
        type="submit"
        aria-label="Ara"
        className="shrink-0 rounded-full bg-brand hover:bg-brand-hover active:scale-95 px-5 py-2 text-sm font-sans font-semibold text-white transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        Ara
      </button>
    </form>
  );
}
