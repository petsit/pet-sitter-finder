import Link from "next/link";
import { BadgeCheck, Search, Star, Wrench, PoundSterling } from "lucide-react";

export const metadata = {
  title: "For service providers — HERD",
  description:
    "Manage your HERD listing. Add services, prices, photos and a description that customers can see alongside your Google reviews.",
};

const PERKS = [
  {
    icon: BadgeCheck,
    title: "Verified by owner badge",
    body: "A teal badge next to your rating tells customers they're looking at an actively managed listing, not just a Google profile.",
  },
  {
    icon: Wrench,
    title: "Add services and detail",
    body: "Google shows reviews and hours. You add the bits that actually win bookings — what you offer, who you cover for, what makes you different.",
  },
  {
    icon: PoundSterling,
    title: "Show your pricing",
    body: "Save yourself a back-and-forth. Customers see your prices up front and only contact you when it's a fit.",
  },
  {
    icon: Star,
    title: "Stand out in search",
    body: "Verified profiles appear with richer cards, custom photos and full descriptions on the results page.",
  },
];

export default function ForProvidersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50/60 via-white to-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-3">
            For service providers
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Your business, on your terms
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            HERD lists every UK pet, equine and rural service from Google.
            Claim your listing to add the things Google can&apos;t — your
            services, your prices, your story — and become the obvious
            choice when customers search nearby.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-xl"
            >
              Sign in to your dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-teal-400 text-slate-900 font-medium px-6 py-3 rounded-xl"
            >
              <Search className="w-4 h-4" /> Find your business
            </Link>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            New here? Find your business in search and tap{" "}
            <em>&ldquo;Are you the owner?&rdquo;</em> on the listing.
          </p>
        </div>
      </section>

      {/* Perks grid */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 gap-6">
          {PERKS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-teal-100 text-teal-700 mb-4">
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {p.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
              How it works
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Three steps to a verified listing
            </h2>
          </div>
          <ol className="grid sm:grid-cols-3 gap-8 text-center">
            <li>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-teal-300 text-teal-700 font-bold mb-3">
                1
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Find your business
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Search for it on HERD just like a customer would, then tap{" "}
                <em>Are you the owner?</em>
              </p>
            </li>
            <li>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-teal-300 text-teal-700 font-bold mb-3">
                2
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Submit a quick claim
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your name, role and email. We&apos;ll verify and get back
                to you within 2 working days.
              </p>
            </li>
            <li>
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-teal-300 text-teal-700 font-bold mb-3">
                3
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Sign in and edit
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                One-tap email login, no password. Update your listing any
                time from any device.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Pricing reassurance */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 mb-2">
          Free during launch
        </h2>
        <p className="text-slate-600 leading-relaxed">
          Claiming and managing your listing is free while we&apos;re
          getting off the ground. We&apos;ll introduce paid Featured
          placement later for providers who want priority in search —
          existing listings will stay free.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center mt-6 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-xl"
        >
          Find your business now →
        </Link>
      </section>
    </>
  );
}
