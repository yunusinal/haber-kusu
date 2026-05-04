import Link from "next/link";
import Image from "next/image";
import { getArticles } from "../lib/api";

interface Props {
  categorySlug: string;
  currentArticleId: number;
}

function formatRelativeDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "Az önce";
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} gün önce`;
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default async function RelatedArticles({ categorySlug, currentArticleId }: Props) {
  let articles: Awaited<ReturnType<typeof getArticles>>["items"] = [];
  try {
    const data = await getArticles({ page: 1, page_size: 10, category: categorySlug });
    articles = data.items.filter((a) => a.id !== currentArticleId).slice(0, 7);
  } catch {
    return null;
  }

  if (articles.length === 0) return null;

  return (
    <aside className="hidden xl:flex flex-col w-72 shrink-0 sticky top-20 self-start max-h-[calc(100vh-5.5rem)] overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-1">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1 h-4 rounded-full bg-brand" aria-hidden="true" />
          <h2 className="text-[11px] font-display font-bold text-[var(--muted)] uppercase tracking-widest">
            Benzer Haberler
          </h2>
        </div>

        {/* Article list */}
        <div className="flex flex-col">
          {articles.map((article, i) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className={`flex gap-3 py-3 cursor-pointer group ${
                i < articles.length - 1 ? "border-b border-[var(--border)]" : ""
              }`}
            >
              {article.image_url && (
                <div className="relative w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-[var(--surface-2)]">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover transition-opacity duration-200 group-hover:opacity-75"
                    sizes="64px"
                  />
                </div>
              )}
              <div className="flex flex-col gap-1 min-w-0 justify-center">
                <p className="text-[13px] font-sans font-medium text-[var(--foreground)] line-clamp-3 leading-snug group-hover:text-brand transition-colors duration-200">
                  {article.title}
                </p>
                <span className="text-[11px] font-sans text-[var(--muted)]">
                  {formatRelativeDate(article.published_at ?? article.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
