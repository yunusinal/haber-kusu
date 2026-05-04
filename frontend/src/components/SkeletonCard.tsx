export default function SkeletonCard() {
  return (
    <div
      className="flex flex-col bg-[var(--surface)] rounded-xl border border-[var(--border)] overflow-hidden animate-pulse"
      aria-hidden="true"
    >
      <div className="h-44 bg-[var(--surface-2)]" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 bg-[var(--surface-2)] rounded-full w-1/3" />
        <div className="space-y-2">
          <div className="h-4 bg-[var(--surface-2)] rounded w-full" />
          <div className="h-4 bg-[var(--surface-2)] rounded w-5/6" />
          <div className="h-4 bg-[var(--surface-2)] rounded w-4/6" />
        </div>
        <div className="h-3 bg-[var(--surface-2)] rounded w-2/5 mt-1" />
        <div className="mt-2 pt-3 border-t border-[var(--border)] flex justify-between">
          <div className="h-3 bg-[var(--surface-2)] rounded w-1/3" />
          <div className="h-3 bg-[var(--surface-2)] rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
