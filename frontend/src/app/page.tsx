import { Suspense } from "react";
import { getArticles, getCategories } from "../lib/api";
import NewsCard from "../components/NewsCard";
import HeroFeatured from "../components/HeroFeatured";
import LandingHero from "../components/LandingHero";
import CategoryFilter from "../components/CategoryFilter";
import Pagination from "../components/Pagination";
import SidebarCategories from "../components/SidebarCategories";

interface SearchParams {
  page?: string;
  category?: string;
}

const PAGE_SIZE = 18;

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const category = searchParams.category;

  const [categoriesResult, articlesResult] = await Promise.allSettled([
    getCategories(),
    getArticles({ page, page_size: PAGE_SIZE, category }),
  ]);

  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const data = articlesResult.status === "fulfilled" ? articlesResult.value : null;

  const isRoot = page === 1 && !category;
  const featuredArticle = isRoot && data && data.items.length > 0 ? data.items[0] : null;
  const gridArticles = featuredArticle ? data!.items.slice(1) : (data?.items ?? []);
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="flex gap-8 items-start">
      {/* ══════════════════════════════════════════
          LEFT SIDEBAR — category nav (desktop only)
      ══════════════════════════════════════════ */}
      <SidebarCategories active={category} />

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col gap-0">

      {/* ══════════════════════════════════════════
          LANDING HERO — only on root (no filter)
      ══════════════════════════════════════════ */}
      {isRoot && (
        <LandingHero
          stats={{
            sourceCount: 270,
            categoryCount: categories.length || 14,
          }}
        />
      )}

      {/* ══════════════════════════════════════════
          FEATURED ARTICLE — root page only
      ══════════════════════════════════════════ */}
      {featuredArticle && (
        <section aria-label="Öne çıkan haber" className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-1 h-6 rounded-full bg-brand" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[var(--foreground)] tracking-tight uppercase text-sm">
              Öne Çıkan
            </h2>
          </div>
          <HeroFeatured article={featuredArticle} />
        </section>
      )}

      {/* ══════════════════════════════════════════
          SECTION HEADER + CATEGORY FILTER
      ══════════════════════════════════════════ */}
      <section aria-label="Haber listesi">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-1 h-6 rounded-full bg-brand" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold text-[var(--foreground)] tracking-tight">
              {activeCategory
                ? activeCategory.name
                : isRoot
                ? "Son Haberler"
                : "Tüm Haberler"}
            </h2>
          </div>

          {/* Mobile-only horizontal filter (sidebar handles desktop) */}
          {categories.length > 0 && (
            <div className="lg:hidden">
              <CategoryFilter categories={categories} active={category} />
            </div>
          )}
        </div>

        {!data || gridArticles.length === 0 ? (
          <div className="text-center py-20 text-[var(--muted)]">
            <p className="text-lg font-sans">Haber bulunamadı.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gridArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            <div className="mt-8">
              <Suspense>
                <Pagination total={data.total} page={data.page} pageSize={data.page_size} />
              </Suspense>
            </div>
          </>
        )}
      </section>

      {/* ══════════════════════════════════════════
          FOOTER CTA — root page only
      ══════════════════════════════════════════ */}
      {isRoot && (
        <footer className="mt-16 py-12 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <span className="font-display font-black text-xl text-[var(--foreground)] tracking-tight">
                Haber<span className="text-brand">Kusu</span>
              </span>
              <span className="text-xs font-sans text-[var(--muted)]">
                Türkiye&apos;nin yapay zeka destekli haber platformu
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-sans text-[var(--muted)]">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
              Canlı güncelleme aktif
            </div>
          </div>
        </footer>
      )}
      </div>{/* end main content */}
    </div>
  );
}
