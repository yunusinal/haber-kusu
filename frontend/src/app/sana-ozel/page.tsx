import type { Metadata } from "next";
import SidebarCategories from "../../components/SidebarCategories";
import RecommendationFeed from "../../components/RecommendationFeed";

export const metadata: Metadata = {
  title: "Sana Özel",
  description: "Okuma geçmişine göre AI tarafından seçilmiş haberler.",
};

const PAGE_SIZE = 20;
const INTEREST_TAGS = ["Teknoloji", "Yapay Zeka", "Bilim", "Yazılım", "Donanım", "Siber Güvenlik"];

interface SearchParams {
  page?: string;
}

export default async function SanaOzelPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  return (
    <div className="flex gap-8 items-start">
      {/* Left sidebar */}
      <SidebarCategories sanaOzelActive />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col gap-8">

        {/* ── Hero banner ── */}
        <div
          className="relative overflow-hidden rounded-2xl px-8 py-10"
          style={{ background: "linear-gradient(135deg, #4c1d95 0%, #1e3a8a 60%, #0f172a 100%)" }}
        >
          <span
            className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-20 blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
            aria-hidden="true"
          />
          <span
            className="absolute -bottom-8 left-16 w-40 h-40 rounded-full opacity-15 blur-2xl pointer-events-none"
            style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-violet-300" aria-hidden="true">
                  <path d="M12 2l2.09 6.41L20.5 10l-6.41 2.09L12 18.5l-2.09-6.41L3.5 10l6.41-2.09L12 2z" />
                  <path d="M19 15.5l1.04 3.21L23.25 19.75l-3.21 1.04L19 24l-1.04-3.21L14.75 19.75l3.21-1.04L19 15.5z" opacity=".6" />
                </svg>
              </span>
              <h1 className="font-display text-2xl font-bold text-white tracking-tight">
                Sana Özel
              </h1>
              <span className="ml-1 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase bg-violet-500/30 text-violet-200 border border-violet-400/30">
                AI
              </span>
            </div>

            <p className="text-sm font-sans text-blue-200/80 max-w-lg leading-relaxed">
              Okuma geçmişin ve beğenilerine göre yapay zeka tarafından senin için seçildi.
              Ne kadar çok okursan, o kadar iyi hale gelir.
            </p>

            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-[11px] font-sans text-blue-300/60 self-center mr-1">
                İlgi alanların:
              </span>
              {INTEREST_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-[11px] font-sans font-semibold bg-white/10 text-blue-100 border border-white/10 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Kişiselleştirilmiş feed ── */}
        <RecommendationFeed page={page} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
}
