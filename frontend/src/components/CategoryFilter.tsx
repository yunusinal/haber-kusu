import Link from "next/link";
import type { Category } from "../lib/types";

interface Props {
  categories: Category[];
  active?: string;
}

export default function CategoryFilter({ categories, active }: Props) {
  return (
    <nav aria-label="Kategori filtresi" className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <Link
        href="/"
        className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-sans font-semibold transition-colors duration-200 cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
          !active
            ? "bg-brand text-white border-brand"
            : "border-[var(--border)] text-[var(--muted)] hover:border-brand hover:text-brand bg-transparent"
        }`}
        aria-current={!active ? "page" : undefined}
      >
        Tümü
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/?category=${cat.slug}`}
          className={`shrink-0 px-4 py-1.5 rounded-full text-[13px] font-sans font-semibold transition-colors duration-200 cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
            active === cat.slug
              ? "bg-brand text-white border-brand"
              : "border-[var(--border)] text-[var(--muted)] hover:border-brand hover:text-brand bg-transparent"
          }`}
          aria-current={active === cat.slug ? "page" : undefined}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}
