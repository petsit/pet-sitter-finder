import { Suspense } from "react";
import Link from "next/link";
import SearchResultsClient from "@/components/SearchResultsClient";
import LocationPrompt from "@/components/LocationPrompt";
import { searchPlaces } from "@/lib/places";
import { geocode } from "@/lib/geocode";
import { getProviderEnrichmentMap } from "@/lib/overrides";
import { getServiceBySlug } from "@/lib/services";
import { LatLng } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{
    location?: string;
    lat?: string;
    lng?: string;
    service?: string;
    radius?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const service = getServiceBySlug(sp.service);
  const radiusMiles = parseFloat(sp.radius ?? "8");
  const radiusMeters = Math.round(radiusMiles * 1609.344);

  // Resolve the origin coordinates
  let origin: LatLng | null = null;
  let originLabel = "";

  if (sp.lat && sp.lng) {
    origin = { lat: parseFloat(sp.lat), lng: parseFloat(sp.lng) };
    originLabel = "your location";
  } else if (sp.location) {
    const result = await geocode(sp.location);
    if (result) {
      origin = result.location;
      originLabel = result.formattedAddress;
    } else {
      return (
        <ErrorState
          title="Couldn't find that location"
          message={`We couldn't find "${sp.location}" in the UK. Try a postcode or town name.`}
        />
      );
    }
  } else {
    // Service was chosen (or defaulted) but no location yet — show an inline
    // location prompt so the user can complete the search from this page.
    return (
      <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
        <LocationPrompt
          serviceLabel={service.label}
          serviceEmoji={service.emoji}
        />
      </Suspense>
    );
  }

  // Run the search
  let providers;
  try {
    providers = await searchPlaces({
      service: service.query,
      serviceSlug: service.slug,
      includedType: service.includedType,
      allowTypes: service.allowTypes,
      lat: origin.lat,
      lng: origin.lng,
      radiusMeters,
    });

    // Annotate each result with the owner-supplied enrichment (verified
    // flag, structured pricing, response time). One DB query for the whole
    // result set rather than N+1.
    const enrichmentMap = await getProviderEnrichmentMap(
      providers.map((p) => p.id)
    );
    providers = providers.map((p) => {
      const e = enrichmentMap.get(p.id);
      if (!e) return { ...p, isVerified: false };
      return {
        ...p,
        isVerified: e.isVerified,
        priceFrom: e.priceFrom,
        priceUnit: e.priceUnit,
        responseTimeHours: e.responseTimeHours,
      };
    });
  } catch (err: any) {
    return (
      <ErrorState
        title="Search failed"
        message={
          err?.message?.includes("API key")
            ? "The Google Maps API key isn't configured correctly. Check .env.local."
            : "Something went wrong fetching results. Please try again."
        }
        detail={err?.message}
      />
    );
  }

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
      <SearchResultsClient
        origin={origin}
        originLabel={originLabel}
        initialProviders={providers}
        initialService={service.slug}
        initialRadius={radiusMiles}
      />
    </Suspense>
  );
}

function ErrorState({
  title,
  message,
  detail,
}: {
  title: string;
  message: string;
  detail?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold text-slate-900 mb-3">{title}</h1>
      <p className="text-slate-600 mb-6">{message}</p>
      {detail && (
        <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-left text-xs text-slate-600 overflow-x-auto">
          {detail}
        </pre>
      )}
      <Link
        href="/"
        className="inline-block mt-6 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium"
      >
        Back to search
      </Link>
    </div>
  );
}
