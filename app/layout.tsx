import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import HerdMark from "@/components/Logo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HERD — Find the best UK pet, equine and rural pros",
  description:
    "Helpers, Equine & Rural Directory. Search local, top-rated pet sitters, dog walkers, farriers, livery yards, farm hands, agricultural contractors and more across the UK. Real Google reviews, real ratings.",
  applicationName: "HERD",
  appleWebApp: {
    title: "HERD",
    capable: true,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 mt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <HerdMark className="w-6 h-6 rounded-[10px]" />
              <p className="font-bold tracking-[0.18em] text-slate-800">HERD</p>
            </div>
            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <a href="/for-providers" className="hover:text-slate-900">
                For providers
              </a>
              <a href="/pricing" className="hover:text-slate-900">
                Pricing
              </a>
              <a href="/community-guidelines" className="hover:text-slate-900">
                Guidelines
              </a>
              <a href="/terms" className="hover:text-slate-900">
                Terms
              </a>
              <a href="/privacy" className="hover:text-slate-900">
                Privacy
              </a>
            </nav>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6 text-xs text-slate-400">
            Helpers, Equine &amp; Rural Directory · Listings powered by Google ·
            © {new Date().getFullYear()} Turner Stores Ltd
          </div>
        </footer>
      </body>
    </html>
  );
}
