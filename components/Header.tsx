import Link from "next/link";
import { PawPrint } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white">
            <PawPrint className="w-4 h-4" />
          </span>
          <span>
            Pet<span className="text-teal-600">Sit</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            Search
          </Link>
          <Link
            href="#"
            className="hidden sm:inline-block hover:text-slate-900"
          >
            For service providers
          </Link>
        </nav>
      </div>
    </header>
  );
}
