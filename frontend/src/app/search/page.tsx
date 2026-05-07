import { Suspense } from "react";
import type { Metadata } from "next";
import { searchArticles } from "../../lib/api";
import NewsCard from "../../components/NewsCard";
import Pagination from "../../components/Pagination";
import SearchBox from "../../components/SearchBox";

interface SearchParams {
  q?: string;
  page?: string;
}

export function generateMetadata({ searchParams }: { searchParams: SearchParams }): Metadata {
  return {
    title: searchParams.q ? `"${searchParams.q}" için arama sonuçları` : "Haber Ara",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const q = searchParams.q?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const PAGE_SIZE = 18;

  let data = null;
  let error = false;

  if (q.length >= 2) {
    try {
      data = await searchArticles({ q, page, page_size: PAGE_SIZE });
    } catch {
      error = true;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Haber Ara</h1>
        <div className="max-w-xl">
          <SearchBox defaultValue={q} />
        </div>
      </div>

      {q.length < 2 ? (
        <p className="text-gray-400 dark:text-gray-600">Aramak için en az 2 karakter girin.</p>
      ) : error ? (
        <p className="text-red-500">Arama sırasında hata oluştu. Lütfen tekrar deneyin.</p>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-gray-600">
          <p className="text-lg">
            <strong className="text-gray-600 dark:text-gray-400">&ldquo;{q}&rdquo;</strong> için sonuç bulunamadı.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <strong className="text-gray-700 dark:text-gray-200">&ldquo;{q}&rdquo;</strong> için{" "}
            {data.total.toLocaleString("tr-TR")} sonuç bulundu.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.items.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          <Suspense>
            <Pagination total={data.total} page={data.page} pageSize={data.page_size} />
          </Suspense>
        </>
      )}
    </div>
  );
}
