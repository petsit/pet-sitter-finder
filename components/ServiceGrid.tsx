"use client";

import Link from "next/link";
import { SERVICE_GROUPS, getServicesByGroup } from "@/lib/services";

export default function ServiceGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <header>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-2">
          Browse by service
        </h2>
        <p className="text-slate-600">
          Choose what you need help with and add your location on the next page.
        </p>
      </header>

      {SERVICE_GROUPS.map((group) => (
        <div key={group.key}>
          <div className="mb-4 flex items-baseline gap-3">
            <h3 className="text-xl font-semibold text-slate-900">
              <span aria-hidden className="mr-2">
                {group.emoji}
              </span>
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
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left hover:border-teal-400 hover:shadow-md transition"
              >
                <span className="text-2xl shrink-0">{s.emoji}</span>
                <span className="font-medium text-slate-900 group-hover:text-teal-700 truncate">
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
