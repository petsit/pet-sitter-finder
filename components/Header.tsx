import Link from "next/link";
import { LogOut } from "lucide-react";
import { getSessionEmail } from "@/lib/auth";

export default async function Header() {
  const sessionEmail = await getSessionEmail();
  const signedIn = Boolean(sessionEmail);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white font-bold text-base">
            H
          </span>
          <span className="tracking-wide">HERD</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900">
            Search
          </Link>

          {signedIn ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-block hover:text-slate-900"
              >
                My listings
              </Link>
              <form action="/api/auth/logout" method="post" className="flex">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/for-providers"
                className="hidden sm:inline-block hover:text-slate-900"
              >
                For service providers
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm font-medium"
              >
                Sign in
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
