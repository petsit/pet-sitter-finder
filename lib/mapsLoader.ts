// Shared Google Maps JS loader. Uses the new (v2) functional API.
// The legacy `Loader` class was removed in @googlemaps/js-api-loader 2.x.

import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let initialised = false;
let loadPromise: Promise<void> | null = null;

export function ensureMapsLoaded(): Promise<void> {
  if (loadPromise) return loadPromise;

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    return Promise.reject(
      new Error(
        "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Add it to .env.local."
      )
    );
  }

  if (!initialised) {
    setOptions({ key, v: "weekly" });
    initialised = true;
  }

  // Loading the "maps" library bootstraps the JS API and populates the
  // global google.maps namespace with Map, Marker, LatLngBounds, etc.
  loadPromise = importLibrary("maps").then(() => {
    return;
  });

  return loadPromise;
}
