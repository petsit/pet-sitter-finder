"use client";

import Link from "next/link";
import { SERVICE_GROUPS, getServicesByGroup } from "@/lib/services";

// Per-group colour treatment for the icon tile.  Same neutral text/label
// for all so the grid reads as one unit, but the icon tint shifts subtly
// from teal (pet) -> amber (equine) -> emerald (farm). Helps customers
// scan the three categories at a glance without making the grid noisy.
const GROUP_ICON_STYLES: Record<
  string,
  { bg: string; bgHover: string; text: string }
> = {
  pet: {
    bg: "bg-teal-50",
    bgHover: "group-hover:bg-teal-100",
    text: "text-teal-700",
  },
  equine: {
    bg: "bg-amber-50",
    bgHover: "group-hover:bg-amber-100",
    text: "text-amber-700",
  },
  farm: {
    bg: "bg-emerald-50",
    bgHover: "group-hover:bg-emerald-100",
    text: "text-emerald-700",
  },
};

export default function ServiceGrid() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 space-y-14">
      {/* Subtle dot-grid backdrop for visual continuity with the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(15 23 42 / 0.06) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
          Browse by service
        </p>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          What are you looking for?
        </h2>
        <p className="text-slate-600 mt-2 max-w-xl mx-auto">
          Pick what you need and we&apos;ll bring you back to enter your postcode.
        </p>
      </header>

      {SERVICE_GROUPS.map((group) => {
        const style = GROUP_ICON_STYLES[group.key];
        return (
          <div key={group.key}>
            <div className="mb-5 pb-3 border-b border-slate-200 flex items-baseline justify-between">
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                {group.label}
              </h3>
              <p className="text-sm text-slate-500 hidden sm:block">
                {group.blurb}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {getServicesByGroup(group.key).map((s) => (
                <Link
                  key={s.slug}
                  href={`/search?service=${s.slug}&radius=8`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-slate-300 hover:shadow-sm transition"
                >
                  <span
                    className={`shrink-0 w-10 h-10 inline-flex items-center justify-center rounded-lg ${style.bg} ${style.bgHover} ${style.text} transition`}
                  >
                    <s.Icon className="w-5 h-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-medium text-slate-800 group-hover:text-slate-900 truncate text-sm">
                    {s.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
