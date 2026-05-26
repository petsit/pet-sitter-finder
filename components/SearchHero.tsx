"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SERVICE_CATEGORIES,
  SERVICE_GROUPS,
  getServicesByGroup,
} from "@/lib/services";
import { MapPin, Loader2, Search, ChevronDown } from "lucide-react";

export default function SearchHero() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialService =
    searchParams.get("service") ?? SERVICE_CATEGORIES[0].slug;

  const [location, setLocation] = useState("");
  const [service, setService] = useState(initialService);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = searchParams.get("service");
    if (fromUrl && fromUrl !== service) {
      setService(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function go(qs: URLSearchParams) {
    router.push(`/search?${qs.toString()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!location.trim()) {
      setError("Please enter a postcode or town.");
      return;
    }
    const qs = new URLSearchParams({
      location: location.trim(),
      service,
      radius: "8",
    });
    go(qs);
  }

  function useMyLocation() {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError("Your browser doesn't support geolocation.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const qs = new URLSearchParams({
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString(),
          service,
          radius: "8",
        });
        setBusy(false);
        go(qs);
      },
      (err) => {
        setBusy(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied — please type a postcode instead."
            : "Couldn't get your location. Please enter a postcode."
        );
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-3">
          UK pet, equine &amp; rural directory
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
          Find trusted local pros,
          <br className="hidden sm:block" /> rated by real reviews
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Search local pet sitters, dog walkers, farriers, livery yards,
          farm hands and more — sorted by genuine Google reviews. Compare
          ratings and contact your favourite directly.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 mx-auto max-w-3xl bg-white shadow-lg ring-1 ring-slate-200 rounded-2xl p-3 sm:p-2 flex flex-col sm:flex-row gap-2 sm:gap-1"
        >
          <label className="flex-1 flex items-center gap-2 px-3 py-2 bg-white rounded-xl">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Postcode or town (e.g. LE17 4LL)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-900 outline-none"
              autoComplete="postal-code"
            />
          </label>

          <label className="relative flex items-center gap-2 px-3 py-2 sm:border-l sm:border-slate-200 bg-white rounded-xl">
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="appearance-none bg-transparent text-slate-900 outline-none font-medium pr-6 cursor-pointer"
              aria-label="Service"
            >
              {SERVICE_GROUPS.map((g) => (
                <optgroup key={g.key} label={g.label}>
                  {getServicesByGroup(g.key).map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-xl transition"
          >
            <Search className="w-4 h-4" /> Search
          </button>
        </form>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
          <button
            onClick={useMyLocation}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
            Use my current location
          </button>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
