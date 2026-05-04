import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "HaberKusu — Türkçe Haber Platformu",
    template: "%s | HaberKusu",
  },
  description:
    "Yapay zeka destekli Türkçe haber toplayıcı. Savunma sanayi, teknoloji ve daha fazlası.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)] min-h-screen font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
