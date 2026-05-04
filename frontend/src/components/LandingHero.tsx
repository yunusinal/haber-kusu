import Link from "next/link";

interface Stats {
  sourceCount: number;
  categoryCount: number;
}

function StatPill({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center sm:items-start gap-0.5">
      <span className="font-display text-3xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
        {value}
      </span>
      <span className="text-xs font-sans text-[var(--muted)] uppercase tracking-widest">{label}</span>
    </div>
  );
}

const FEATURES = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Sana Özel Feed",
    desc: "Beğendiğin haberleri okudukça sistem seni tanır, ilgi alanlarına göre akışını kişiselleştirir.",
    accent: "violet",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Özetleme",
    desc: "Uzun haberleri okumak zorunda değilsin. Yapay zeka her haber için sana yönelik kısa özet üretir.",
    accent: "blue",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Akıllı Öneri",
    desc: "Ne kadar çok okursan algoritma o kadar iyi hale gelir. Sana en alakalı içerikleri öne çıkarır.",
    accent: "amber",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Gerçek Zamanlı",
    desc: "Dakikalar içinde sisteme eklenen haberler, anlık güncellemeler ve canlı haber akışı.",
    accent: "brand",
  },
];

const ACCENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  violet: { bg: "rgba(109,40,217,0.12)", text: "#a78bfa", border: "rgba(139,92,246,0.25)" },
  blue:   { bg: "rgba(37,99,235,0.12)",  text: "#60a5fa", border: "rgba(96,165,250,0.25)" },
  amber:  { bg: "rgba(217,119,6,0.12)",  text: "#fbbf24", border: "rgba(251,191,36,0.25)" },
  brand:  { bg: "rgba(220,38,38,0.12)",  text: "#f87171", border: "rgba(239,68,68,0.25)" },
};

export default function LandingHero({ stats }: { stats: Stats }) {
  return (
    <section className="relative overflow-hidden pt-4 pb-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-brand/5 blur-3xl" aria-hidden="true" />

      <div className="relative flex flex-col gap-10">
        {/* ── Top: Headline + tagline ── */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-12">
          <div className="flex flex-col gap-5 max-w-2xl">
            {/* Label */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" aria-hidden="true" />
              <span className="text-xs font-sans font-semibold tracking-widest uppercase text-brand">
                Yapay Zeka Destekli Haber Platformu
              </span>
            </div>

            {/* Big headline */}
            <h1
              className="font-display font-black leading-[0.95] tracking-tight text-[var(--foreground)]"
              style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}
            >
              Türkiye&apos;nin<br />
              <span className="text-brand">Akıllı</span><br />
              Habercisi
            </h1>

            {/* Tagline */}
            <p className="text-base sm:text-lg font-sans text-[var(--muted)] max-w-md leading-relaxed">
              Beğenilerine göre kişiselleşen haber akışı, yapay zeka özetleri ve senin için seçilen içerikler — hepsi tek platformda.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-3 mt-1">
              <Link
                href="/sana-ozel"
                className="relative overflow-hidden inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-sans font-bold text-white transition-all duration-200 hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
              >
                {/* shimmer */}
                <span
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)" }}
                  aria-hidden="true"
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-violet-200 shrink-0" aria-hidden="true">
                  <path d="M12 2l2.09 6.41L20.5 10l-6.41 2.09L12 18.5l-2.09-6.41L3.5 10l6.41-2.09L12 2z" />
                  <path d="M19 15.5l1.04 3.21L23.25 19.75l-3.21 1.04L19 24l-1.04-3.21L14.75 19.75l3.21-1.04L19 15.5z" opacity=".6" />
                </svg>
                Sana Özel Haberlere Bak
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-row sm:flex-col gap-8 sm:gap-6 shrink-0">
            <StatPill value={String(stats.sourceCount) + "+"} label="Kaynak" />
            <StatPill value={String(stats.categoryCount)} label="Kategori" />
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" aria-hidden="true" />

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map((f) => {
            const colors = ACCENT_COLORS[f.accent];
            return (
              <div
                key={f.title}
                className="flex flex-col gap-2 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] cursor-default"
                style={{
                  background: colors.bg,
                  borderColor: colors.border,
                }}
              >
                <span style={{ color: colors.text }}>{f.icon}</span>
                <span className="font-display font-bold text-sm text-[var(--foreground)]">{f.title}</span>
                <span className="text-xs font-sans text-[var(--muted)] leading-relaxed">{f.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
