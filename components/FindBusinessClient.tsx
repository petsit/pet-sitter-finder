"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Loader2, MapPin } from "lucide-react";
import { Provider } from "@/lib/types";
import RatingStars from "./RatingStars";
import { placePhotoUrl } from "@/lib/places";

export default function FindBusinessClient() {
  const [name, setName] = useState("");
  const [postcode, setPostcode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Provider[] | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setResults(null);
    setSearched(false);
    try {
      const res = await fetch("/api/places/find-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          postcode: postcode.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Search failed");
      setResults(json.results ?? []);
      setSearched(true);
    } catch (e: any) {
      setError(e?.message ?? "Search failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg ring-1 ring-slate-200 rounded-2xl p-4 space-y-3"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Business name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Wavy Tails Huddersfield"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            autoFocus
            autoComplete="organization"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Postcode or town{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g. HD9 3TG — helps if multiple businesses share the name"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            autoComplete="postal-code"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl transition"
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Searching…
            </>
          ) : (
            <>
              <Search className="w-4 h-4" /> Search
            </>
          )}
        </button>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </form>

      {/* Results */}
      {searched && results !== null && (
        <section className="mt-8">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              <p className="text-lg font-medium text-slate-900 mb-1">
                No matches
              </p>
              <p>
                We couldn&apos;t find a business that name on HERD. Try
                shortening the name (e.g. &ldquo;Wavy Tails&rdquo; instead
                of &ldquo;Wavy Tails Pet Care Services Ltd&rdquo;), or
                add a postcode to narrow the search area.
              </p>
              <p className="mt-4 text-sm">
                If your business isn&apos;t on Google Maps,{" "}
                <a
                  href="https://www.google.com/business/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 hover:underline"
                >
                  add it to Google Business Profile
                </a>{" "}
                first — it&apos;ll appear on HERD automatically within
                a few days.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                {results.length} match{results.length === 1 ? "" : "es"}
              </h2>
              <ul className="space-y-3">
                {results.map((p) => (
                  <li
                    key={p.id}
                    className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:border-teal-300 transition"
                  >
                    <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
                      {p.photoRef ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={placePhotoUrl(p.photoRef, 300)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-2xl text-slate-300">🐾</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">
                        <Link
                          href={`/provider/${p.id}`}
                          className="hover:text-teal-700 hover:underline"
                        >
                          {p.name}
                        </Link>
                      </p>
                      <div className="mt-0.5">
                        <RatingStars
                          rating={p.rating}
                          count={p.reviewCount}
                          size="sm"
                        />
                      </div>
                      <p className="mt-1 flex items-start gap-1 text-sm text-slate-600 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {p.address}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm">
                        <Link
                          href={`/provider/${p.id}`}
                          className="text-teal-700 hover:underline font-medium"
                        >
                          View listing →
                        </Link>
                        <Link
                          href={`/provider/${p.id}/claim`}
                          className="text-slate-500 hover:text-slate-900"
                        >
                          Is this you? Claim it
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}
    </>
  );
}
