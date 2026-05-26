"use client";

import Link from "next/link";
import { SERVICE_GROUPS, getServicesByGroup } from "@/lib/services";

export default function ServiceGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 space-y-14">
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

      {SERVICE_GROUPS.map((group) => (
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
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-teal-400 hover:shadow-sm transition"
              >
                <span className="shrink-0 w-9 h-9 inline-flex items-center justify-center rounded-lg bg-slate-50 text-base group-hover:bg-teal-50 transition">
                  <span aria-hidden>{s.emoji}</span>
                </span>
                <span className="font-medium text-slate-800 group-hover:text-teal-700 truncate">
                  {s.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
