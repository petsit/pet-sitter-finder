"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MapPin, Loader2, Search } from "lucide-react";
import { ServiceCategory } from "@/lib/services";

interface Props {
  service: ServiceCategory;
}

export default function LocationPrompt({ service }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function go(extra: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(extra).forEach(([k, v]) => params.set(k, v));
    if ("location" in extra) {
      params.delete("lat");
      params.delete("lng");
    } else if ("lat" in extra) {
      params.delete("location");
    }
    router.push(`/search?${params.toString()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!location.trim()) {
      setError("Please enter a postcode or town.");
      return;
    }
    go({ location: location.trim() });
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
        setBusy(false);
        go({
          lat: pos.coords.latitude.toString(),
          lng: pos.coords.longitude.toString(),
        });
      },
      (err) => {
        setBusy(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied — please enter a postcode below."
            : "Couldn't get your location. Please enter a postcode below."
        );
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 text-2xl mb-5">
          <span aria-hidden>{service.emoji}</span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
          {service.label}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-3">
          Find {service.label.toLowerCase()} near you
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Enter your postcode or use your current location to see top-rated
          providers in your area.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl bg-white shadow-lg ring-1 ring-slate-200 rounded-2xl p-3 sm:p-2 flex flex-col sm:flex-row gap-2 sm:gap-1"
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
            autoFocus
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-xl transition"
        >
          <Search className="w-4 h-4" /> Search
        </button>
      </form>

      <div className="mt-4 flex justify-center">
        <button
          onClick={useMyLocation}
          disabled={busy}
          className="inline-flex items-center gap-1.5 text-teal-700 hover:text-teal-800 disabled:opacity-50 text-sm"
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
        <p className="mt-3 text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-12 text-center text-sm text-slate-500">
        <p>
          Looking for something else?{" "}
          <a href="/" className="text-teal-700 hover:underline font-medium">
            Browse all services
          </a>
        </p>
      </div>
    </div>
  );
}
