import Link from "next/link";
import SearchBox from "./SearchBox";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1.5 shrink-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          aria-label="HaberKusu ana sayfa"
        >
          {/* Bird icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-7 h-7 text-brand group-hover:scale-110 transition-transform duration-200"
            aria-hidden="true"
          >
            <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.817zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
          </svg>
          <span className="font-display text-xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-brand transition-colors duration-200">
            Haber<span className="text-brand">Kusu</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-lg">
          <SearchBox />
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="hidden sm:block px-4 py-2 rounded-full border border-[var(--border)] text-[var(--muted)] hover:border-brand hover:text-brand text-sm font-sans font-semibold transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            Giriş Yap
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-sans font-semibold transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            Üye Ol
          </button>
        </div>
      </div>
    </header>
  );
}
