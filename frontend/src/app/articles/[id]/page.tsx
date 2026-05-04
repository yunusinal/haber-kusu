import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticle } from "../../../lib/api";
import ArticleActions from "../../../components/ArticleActions";
import RelatedArticles from "../../../components/RelatedArticles";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const article = await getArticle(parseInt(params.id, 10));
    return {
      title: article.title,
      description: article.summary ?? article.content?.slice(0, 160) ?? undefined,
      openGraph: {
        title: article.title,
        images: article.image_url ? [article.image_url] : [],
      },
    };
  } catch {
    return { title: "Haber bulunamadı" };
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ArticlePage({ params }: Props) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  let article;
  try {
    article = await getArticle(id);
  } catch {
    notFound();
  }

  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/articles/${id}`;

  return (
    <div className="flex gap-10 items-start">
    <article className="flex-1 min-w-0 max-w-3xl animate-fade-in">
      {/* Breadcrumb */}
      <nav aria-label="İçerik yolu" className="flex items-center gap-2 text-sm font-sans text-[var(--muted)] mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand transition-colors duration-200 cursor-pointer">
          Ana Sayfa
        </Link>
        {article.category && (
          <>
            <span aria-hidden="true" className="text-[var(--border)]">/</span>
            <Link
              href={`/?category=${article.category.slug}`}
              className="hover:text-brand transition-colors duration-200 cursor-pointer"
            >
              {article.category.name}
            </Link>
          </>
        )}
        <span aria-hidden="true" className="text-[var(--border)]">/</span>
        <span className="text-[var(--foreground)] truncate max-w-[200px]">
          {article.title.slice(0, 40)}{article.title.length > 40 ? "…" : ""}
        </span>
      </nav>

      {/* Header */}
      <header className="mb-6 flex flex-col gap-4">
        {article.category && (
          <Link
            href={`/?category=${article.category.slug}`}
            className="w-fit bg-brand hover:bg-brand-hover text-white text-[11px] font-display font-bold tracking-widest uppercase px-3 py-1.5 rounded-full transition-colors duration-200 cursor-pointer"
          >
            {article.category.name}
          </Link>
        )}

        <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)] leading-tight text-balance tracking-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 text-sm font-sans text-[var(--muted)]">
          <span className="font-semibold text-[var(--foreground)]">{article.source.name}</span>
          <span aria-hidden="true" className="text-[var(--border)]">·</span>
          <time dateTime={article.published_at ?? article.created_at}>
            {formatDate(article.published_at ?? article.created_at)}
          </time>
        </div>
      </header>

      {/* Hero image */}
      {article.image_url && (
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-[var(--surface-2)]">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Reaction bar — top */}
      <div className="mb-8 pb-6 border-b border-[var(--border)]">
        <ArticleActions
          articleId={article.id}
          articleTitle={article.title}
          articleUrl={canonicalUrl}
          articleSummary={article.summary ?? undefined}
        />
      </div>

      {/* Summary block */}
      {article.summary && (
        <p className="font-serif text-lg italic text-[var(--foreground)] mb-8 pl-5 border-l-4 border-brand py-2 leading-relaxed opacity-90">
          {article.summary}
        </p>
      )}

      {/* Body */}
      {article.content ? (
        <div className="font-sans text-[1rem] text-[var(--foreground)] leading-[1.85] space-y-5 max-w-prose">
          {article.content.split("\n").filter(Boolean).map((para, i) => (
            <p key={i} className="text-[var(--foreground)]/90">{para}</p>
          ))}
        </div>
      ) : (
        <p className="font-sans text-[var(--muted)] italic">İçerik mevcut değil.</p>
      )}

      {/* Footer CTA + reaction bar */}
      <footer className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col gap-6">
        <ArticleActions
          articleId={article.id}
          articleTitle={article.title}
          articleUrl={canonicalUrl}
          articleSummary={article.summary ?? undefined}
        />

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover active:scale-95 text-white px-5 py-2.5 rounded-full text-sm font-sans font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            Kaynağa Git
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border border-[var(--border)] hover:border-brand text-[var(--muted)] hover:text-brand px-5 py-2.5 rounded-full text-sm font-sans font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            ← Tüm Haberler
          </Link>
        </div>
      </footer>
    </article>

    {/* Related articles right sidebar */}
    {article.category && (
      <RelatedArticles
        categorySlug={article.category.slug}
        currentArticleId={article.id}
      />
    )}
    </div>
  );
}
