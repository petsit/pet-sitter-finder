// Server-side wrapper around Google Places API (New) v1.
// All calls happen on the server so the API key stays out of the browser bundle.

import { Provider, ProviderDetails, Review, LatLng, SearchParams } from "./types";

const PLACES_BASE = "https://places.googleapis.com/v1";

function getKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error(
      "GOOGLE_MAPS_API_KEY is not set. Add it to .env.local in the project root."
    );
  }
  return key;
}

// --- helpers ---

function metersToMiles(m: number): number {
  return m / 1609.344;
}

export function haversineMiles(a: LatLng, b: LatLng): number {
  const R = 3958.7613; // earth radius in miles
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Map a Google Places API v1 place object to our Provider type
function mapPlace(p: any): Provider {
  return {
    id: p.id,
    name: p.displayName?.text ?? "Unnamed provider",
    address: p.formattedAddress ?? "",
    location: {
      lat: p.location?.latitude ?? 0,
      lng: p.location?.longitude ?? 0,
    },
    rating: typeof p.rating === "number" ? p.rating : undefined,
    reviewCount:
      typeof p.userRatingCount === "number" ? p.userRatingCount : undefined,
    primaryType: p.primaryType,
    types: p.types,
    phone: p.nationalPhoneNumber ?? p.internationalPhoneNumber,
    website: p.websiteUri,
    googleMapsUri: p.googleMapsUri,
    priceLevel: p.priceLevel,
    photoRef: p.photos?.[0]?.name,
    openNow: p.regularOpeningHours?.openNow,
  };
}

// --- Text Search (Pro tier — gives us rating, review count, hours) ---

export async function searchPlaces(params: SearchParams): Promise<Provider[]> {
  const fieldMask = [
    "places.id",
    "places.displayName",
    "places.formattedAddress",
    "places.location",
    "places.rating",
    "places.userRatingCount",
    "places.primaryType",
    "places.types",
    "places.priceLevel",
    "places.photos",
    "places.regularOpeningHours.openNow",
    "places.businessStatus",
    // Contact fields — same Pro pricing tier as rating, so no extra cost.
    // Without these the "Has website" filter on the results page would
    // always match zero providers (they'd all look website-less).
    "places.websiteUri",
    "places.nationalPhoneNumber",
    "places.googleMapsUri",
  ].join(",");

  const body = {
    textQuery: params.service,
    // We use locationBias here (not locationRestriction) because the Text
    // Search API rejects a circular locationRestriction — only rectangles
    // are accepted for that field. The strict radius enforcement is done
    // in the haversine filter below, which gives us a proper circle.
    locationBias: {
      circle: {
        center: { latitude: params.lat, longitude: params.lng },
        radius: params.radiusMeters,
      },
    },
    maxResultCount: 20,
    regionCode: "GB",
  };

  const res = await fetch(`${PLACES_BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getKey(),
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify(body),
    // Server-side cache for 5 minutes — saves redundant API calls during dev
    // and within a single user session. Does NOT violate Google's caching ToS
    // because we are not persisting place data beyond a short session window.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Places searchText failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const places: any[] = data.places ?? [];

  // Filter out permanently closed places
  const active = places.filter(
    (p) => !p.businessStatus || p.businessStatus === "OPERATIONAL"
  );

  let providers = active.map(mapPlace);

  // Strict radius enforcement. locationBias only *suggests* a region to
  // Google, so without this filter we'd get results well outside the
  // user's chosen radius (e.g. "Within 2 mi" returning 3.6 mi results).
  const origin: LatLng = { lat: params.lat, lng: params.lng };
  const radiusMiles = params.radiusMeters / 1609.344;
  providers = providers.filter(
    (p) => haversineMiles(origin, p.location) <= radiusMiles
  );

  // Optional rating filter
  if (params.minRating !== undefined) {
    providers = providers.filter(
      (p) => (p.rating ?? 0) >= (params.minRating as number)
    );
  }

  // Sort
  const sortBy = params.sortBy ?? "rating";
  providers.sort((a, b) => {
    if (sortBy === "rating") {
      const ra = a.rating ?? 0;
      const rb = b.rating ?? 0;
      if (rb !== ra) return rb - ra;
      // tiebreaker: review count
      return (b.reviewCount ?? 0) - (a.reviewCount ?? 0);
    }
    // distance
    return haversineMiles(origin, a.location) - haversineMiles(origin, b.location);
  });

  return providers;
}

// --- Place Details (Enterprise tier — gives us reviews, photos, hours) ---

export async function getPlaceDetails(placeId: string): Promise<ProviderDetails> {
  const fieldMask = [
    "id",
    "displayName",
    "formattedAddress",
    "location",
    "rating",
    "userRatingCount",
    "primaryType",
    "types",
    "nationalPhoneNumber",
    "internationalPhoneNumber",
    "websiteUri",
    "googleMapsUri",
    "regularOpeningHours",
    "photos",
    "reviews",
    "businessStatus",
  ].join(",");

  const res = await fetch(
    `${PLACES_BASE}/places/${encodeURIComponent(placeId)}`,
    {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": getKey(),
        "X-Goog-FieldMask": fieldMask,
      },
      next: { revalidate: 600 }, // 10 min — same session caching rationale
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Places details failed: ${res.status} ${errText}`);
  }

  const p = await res.json();
  const base = mapPlace(p);

  const reviews: Review[] = (p.reviews ?? []).map((r: any) => ({
    authorName: r.authorAttribution?.displayName ?? "Anonymous",
    authorPhoto: r.authorAttribution?.photoUri,
    rating: r.rating ?? 0,
    relativeTime: r.relativePublishTimeDescription ?? "",
    text: r.text?.text ?? r.originalText?.text ?? "",
    publishedAt: r.publishTime,
  }));

  return {
    ...base,
    weekdayHours: p.regularOpeningHours?.weekdayDescriptions,
    reviews,
    photoRefs: (p.photos ?? []).slice(0, 10).map((ph: any) => ph.name),
  };
}

// --- Photo URL helper ---
// Photo references look like "places/{place_id}/photos/{photo_id}".
// We proxy them through our own route to keep the key off the client.

export function placePhotoUrl(photoRef: string, maxWidth = 800): string {
  return `/api/places/photo?ref=${encodeURIComponent(photoRef)}&w=${maxWidth}`;
}

// Server-side: fetch a place photo and return the binary
export async function fetchPlacePhoto(
  photoRef: string,
  maxWidth: number
): Promise<{ body: ArrayBuffer; contentType: string } | null> {
  const url = `${PLACES_BASE}/${photoRef}/media?maxWidthPx=${maxWidth}&key=${getKey()}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 1 day
  if (!res.ok) return null;
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const body = await res.arrayBuffer();
  return { body, contentType };
}

export { metersToMiles };
