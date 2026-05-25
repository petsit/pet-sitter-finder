"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Provider, LatLng } from "@/lib/types";
import {
  SERVICE_GROUPS,
  getServiceBySlug,
  getServicesByGroup,
} from "@/lib/services";
import ProviderCard from "./ProviderCard";
import ResultsMap from "./ResultsMap";
import { haversineMiles } from "@/lib/places";
import { X, SlidersHorizontal } from "lucide-react";

interface Props {
  origin: LatLng;
  originLabel: string;
  initialProviders: Provider[];
  initialService: string;
  initialRadius: number;
}

type SortKey = "rating" | "distance" | "reviews";

interface ToggleFilters {
  openNow: boolean;
  hasPhotos: boolean;
  hasWebsite: boolean;
}

const DEFAULT_TOGGLES: ToggleFilters = {
  openNow: false,
  hasPhotos: false,
  hasWebsite: false,
};

export default function SearchResultsClient({
  origin,
  originLabel,
  initialProviders,
  initialService,
  initialRadius,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState<SortKey>("rating");
  const [minRating, setMinRating] = useState<number>(0);
  const [minReviews, setMinReviews] = useState<number>(0);
  const [toggles, setToggles] = useState<ToggleFilters>(DEFAULT_TOGGLES);
  const [activeId, setActiveId] = useState<string | undefined>();

  const filtered = useMemo(() => {
    let list = initialProviders.filter((p) => {
      if ((p.rating ?? 0) < minRating) return false;
      if ((p.reviewCount ?? 0) < minReviews) return false;
      if (toggles.openNow && !p.openNow) return false;
      if (toggles.hasPhotos && !p.photoRef) return false;
      if (toggles.hasWebsite && !p.website) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "rating") {
        const ra = a.rating ?? 0;
        const rb = b.rating ?? 0;
        if (rb !== ra) return rb - ra;
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      }
      if (sortBy === "reviews") {
        return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
      }
      return (
        haversineMiles(origin, a.location) - haversineMiles(origin, b.location)
      );
    });
    return list;
  }, [initialProviders, minRating, minReviews, toggles, sortBy, origin]);

  function updateUrl(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/search?${params.toString()}`);
  }

  function toggle(key: keyof ToggleFilters) {
    setToggles((t) => ({ ...t, [key]: !t[key] }));
  }

  function clearAll() {
    setMinRating(0);
    setMinReviews(0);
    setToggles(DEFAULT_TOGGLES);
    setSortBy("rating");
  }

  const activeFilterCount =
    (minRating > 0 ? 1 : 0) +
    (minReviews > 0 ? 1 : 0) +
    (toggles.openNow ? 1 : 0) +
    (toggles.hasPhotos ? 1 : 0) +
    (toggles.hasWebsite ? 1 : 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          {getServiceBySlug(initialService).label} near {originLabel}
        </h1>
        <p className="text-slate-600 mt-1">
          Showing <span className="font-medium">{filtered.length}</span> of{" "}
          {initialProviders.length} results within {initialRadius} miles
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-6 space-y-3">
        {/* Row 1: dropdown selectors */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <span className="text-slate-500">Service:</span>
            <select
              value={initialService}
              onChange={(e) => updateUrl("service", e.target.value)}
              className="bg-transparent font-medium outline-none"
            >
              {SERVICE_GROUPS.map((g) => (
                <optgroup key={g.key} label={`${g.emoji} ${g.label}`}>
                  {getServicesByGroup(g.key).map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <span className="text-slate-500">Within:</span>
            <select
              value={initialRadius}
              onChange={(e) => updateUrl("radius", e.target.value)}
              className="bg-transparent font-medium outline-none"
            >
              {[2, 5, 8, 15, 25].map((r) => (
                <option key={r} value={r}>
                  {r} mi
                </option>
              ))}
            </select>
          </label>
          <label className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <span className="text-slate-500">Min rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="bg-transparent font-medium outline-none"
            >
              <option value="0">Any</option>
              <option value="3">3+ ★</option>
              <option value="4">4+ ★</option>
              <option value="4.5">4.5+ ★</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <span className="text-slate-500">Min reviews:</span>
            <select
              value={minReviews}
              onChange={(e) => setMinReviews(parseInt(e.target.value, 10))}
              className="bg-transparent font-medium outline-none"
            >
              <option value="0">Any</option>
              <option value="3">3+</option>
              <option value="5">5+</option>
              <option value="10">10+</option>
              <option value="25">25+</option>
              <option value="50">50+</option>
            </select>
          </label>
          <label className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <span className="text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-transparent font-medium outline-none"
            >
              <option value="rating">Best rated</option>
              <option value="reviews">Most reviewed</option>
              <option value="distance">Closest</option>
            </select>
          </label>
        </div>

        {/* Row 2: toggle pills */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 text-slate-500 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Quick filters:
          </span>
          <TogglePill
            label="Open now"
            emoji="🟢"
            active={toggles.openNow}
            onClick={() => toggle("openNow")}
          />
          <TogglePill
            label="Has photos"
            emoji="📷"
            active={toggles.hasPhotos}
            onClick={() => toggle("hasPhotos")}
          />
          <TogglePill
            label="Has website"
            emoji="🌐"
            active={toggles.hasWebsite}
            onClick={() => toggle("hasWebsite")}
          />
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium ml-2"
            >
              <X className="w-3.5 h-3.5" />
              Clear {activeFilterCount} filter{activeFilterCount === 1 ? "" : "s"}
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_500px] gap-6">
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              <p className="text-lg font-medium mb-1">No results match your filters</p>
              <p>Try clearing some filters or widening the search radius.</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="mt-4 inline-flex items-center gap-1 text-teal-700 hover:text-teal-800 font-medium"
                >
                  <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
              )}
            </div>
          )}
          {filtered.map((p, i) => (
            <div
              key={p.id}
              onMouseEnter={() => setActiveId(p.id)}
              onMouseLeave={() => setActiveId(undefined)}
            >
              <ProviderCard provider={p} origin={origin} rank={i + 1} />
            </div>
          ))}
        </div>

        <div className="hidden lg:block lg:sticky lg:top-20 lg:self-start lg:h-[calc(100vh-6rem)]">
          <ResultsMap
            origin={origin}
            providers={filtered}
            activeId={activeId}
            onMarkerClick={(id) => {
              const el = document.querySelector(`[data-place-id="${id}"]`);
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
              setActiveId(id);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function TogglePill({
  label,
  emoji,
  active,
  onClick,
}: {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 border transition ${
        active
          ? "bg-teal-600 border-teal-600 text-white hover:bg-teal-700"
          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
      }`}
    >
      <span aria-hidden>{emoji}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
