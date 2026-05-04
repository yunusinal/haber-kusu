import Link from "next/link";
import { getCategories } from "../lib/api";

interface Props {
  active?: string;
  /** Set to true when rendering from /sana-ozel page */
  sanaOzelActive?: boolean;
}

export default async function SidebarCategories({ active, sanaOzelActive }: Props) {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    categories = await getCategories();
  } catch {
    return null;
  }

  return (
    <aside className="hidden lg:flex flex-col w-48 shrink-0">
      <div className="sticky top-24 flex flex-col gap-1">
        {/* Header */}
        <div className="flex items-center gap-2 px-3 mb-3">
          <span className="w-1 h-4 rounded-full bg-brand" aria-hidden="true" />
          <span className="text-[11px] font-display font-bold text-[var(--muted)] uppercase tracking-widest">
            Kategoriler
          </span>
        </div>

        {/* Sana Özel — special personalized button */}
        <Link
          href="/sana-ozel"
          className={`relative overflow-hidden flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-sans font-bold mb-1 transition-all duration-200 cursor-pointer group ${
            sanaOzelActive
              ? "ring-1 ring-violet-400/50"
              : "hover:scale-[1.02]"
          }`}
          style={{
            background: sanaOzelActive
              ? "linear-gradient(135deg, #7c3aed, #2563eb)"
              : "linear-gradient(135deg, #6d28d9cc, #1d4ed8cc)",
          }}
          aria-current={sanaOzelActive ? "page" : undefined}
        >
          {/* subtle shimmer strip */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
            }}
            aria-hidden="true"
          />
          {/* sparkle icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3.5 h-3.5 text-violet-200 shrink-0"
            aria-hidden="true"
          >
            <path d="M12 2l2.09 6.41L20.5 10l-6.41 2.09L12 18.5l-2.09-6.41L3.5 10l6.41-2.09L12 2z" />
            <path d="M19 15.5l1.04 3.21L23.25 19.75l-3.21 1.04L19 24l-1.04-3.21L14.75 19.75l3.21-1.04L19 15.5z" opacity=".6" />
            <path d="M5 15.5l.78 2.41L8.19 18.72l-2.41.79L5 22l-.78-2.41-2.41-.79 2.41-.79L5 15.5z" opacity=".4" />
          </svg>
          <span className="text-white">Sana Özel</span>
        </Link>

        {/* Gündem / All */}
        <Link
          href="/"
          className={`px-3 py-2 rounded-lg text-[13px] font-sans font-semibold transition-colors duration-200 cursor-pointer ${
            !active
              ? "bg-brand text-white"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
          }`}
          aria-current={!active ? "page" : undefined}
        >
          Gündem
        </Link>

        {/* Category links */}
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/?category=${cat.slug}`}
            className={`px-3 py-2 rounded-lg text-[13px] font-sans font-semibold transition-colors duration-200 cursor-pointer ${
              active === cat.slug
                ? "bg-brand text-white"
                : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
            }`}
            aria-current={active === cat.slug ? "page" : undefined}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </aside>
  );
}
