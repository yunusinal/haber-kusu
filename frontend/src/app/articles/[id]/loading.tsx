export default function ArticleLoading() {
  return (
    <article className="max-w-3xl mx-auto animate-pulse">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="h-4 bg-[var(--border)] rounded w-16" />
          <div className="h-4 bg-[var(--border)] rounded w-4" />
          <div className="h-4 bg-[var(--border)] rounded w-24" />
        </div>
        <div className="h-6 bg-[var(--border)] rounded w-20" />
        <div className="space-y-2">
          <div className="h-8 bg-[var(--border)] rounded w-full" />
          <div className="h-8 bg-[var(--border)] rounded w-5/6" />
        </div>
        <div className="flex gap-3">
          <div className="h-4 bg-[var(--border)] rounded w-28" />
          <div className="h-4 bg-[var(--border)] rounded w-4" />
          <div className="h-4 bg-[var(--border)] rounded w-36" />
        </div>
      </div>
      <div className="aspect-video w-full bg-[var(--border)] rounded-xl mb-6" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-[var(--border)] rounded" style={{ width: `${85 + (i % 3) * 5}%` }} />
        ))}
      </div>
    </article>
  );
}
