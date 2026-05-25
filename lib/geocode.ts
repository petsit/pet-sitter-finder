// Server-side Google Geocoding wrapper. Used to convert postcode/town
// strings into lat/lng coordinates for the Places search.

import { GeocodeResult } from "./types";

const GEOCODE_URL = "https://maps.googleapis.com/maps/api/geocode/json";

export async function geocode(query: string): Promise<GeocodeResult | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("GOOGLE_MAPS_API_KEY is not set");

  const url = new URL(GEOCODE_URL);
  url.searchParams.set("address", query);
  url.searchParams.set("region", "uk");
  url.searchParams.set("components", "country:GB");
  url.searchParams.set("key", key);

  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) return null;

  const data = await res.json();
  const first = data.results?.[0];
  if (!first) return null;

  return {
    formattedAddress: first.formatted_address,
    location: {
      lat: first.geometry.location.lat,
      lng: first.geometry.location.lng,
    },
  };
}
