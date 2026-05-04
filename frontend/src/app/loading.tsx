import SkeletonCard from "../components/SkeletonCard";

export default function Loading() {
  return (
    <div className="flex flex-col gap-0">
      {/* Landing hero skeleton */}
      <div className="pt-4 pb-10 flex flex-col gap-10 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-12">
          <div className="flex flex-col gap-3 max-w-2xl">
            <div className="h-4 bg-[var(--surface)] rounded w-48" />
            <div className="flex flex-col gap-2">
              <div className="h-16 bg-[var(--surface)] rounded w-72" />
              <div className="h-16 bg-[var(--surface)] rounded w-48" />
              <div className="h-16 bg-[var(--surface)] rounded w-64" />
            </div>
            <div className="h-4 bg-[var(--surface)] rounded w-96 max-w-full" />
          </div>
          <div className="flex flex-row sm:flex-col gap-8 sm:gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="flex flex-col gap-1">
                <div className="h-10 w-20 bg-[var(--surface)] rounded" />
                <div className="h-3 w-14 bg-[var(--surface)] rounded" />
              </div>
            ))}
          </div>
        </div>
        <div className="h-px bg-[var(--border)]" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-28 bg-[var(--surface)] rounded-xl" />
          ))}
        </div>
      </div>

      {/* Featured hero skeleton */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-brand/30 rounded-full" />
          <div className="h-4 w-24 bg-[var(--surface)] rounded animate-pulse" />
        </div>
        <div className="h-[420px] sm:h-[520px] bg-[var(--surface)] rounded-2xl animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-[var(--surface)] rounded w-32 animate-pulse" />
          <div className="h-4 bg-[var(--surface)] rounded w-20 animate-pulse" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-20 shrink-0 bg-[var(--surface)] rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
