// Shared TypeScript types for the Pet Sitter Finder app

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Provider {
  id: string; // Google Place ID
  name: string;
  address: string;
  location: LatLng;
  rating?: number; // 0-5
  reviewCount?: number;
  primaryType?: string;
  types?: string[];
  phone?: string;
  website?: string;
  googleMapsUri?: string;
  priceLevel?: string;
  photoRef?: string; // first photo reference for thumbnail
  openNow?: boolean;
}

export interface Review {
  authorName: string;
  authorPhoto?: string;
  rating: number;
  relativeTime: string;
  text: string;
  publishedAt?: string;
}

export interface ProviderDetails extends Provider {
  weekdayHours?: string[]; // formatted lines like "Monday: 9:00 AM – 5:00 PM"
  reviews?: Review[];
  photoRefs?: string[]; // multiple photos
}

export interface SearchParams {
  service: string; // free-text service query, e.g. "dog walker"
  serviceSlug?: string; // service slug, used to look up filter overrides
  includedType?: string; // optional Google Places primary type to bias toward
  allowTypes?: string[]; // types to keep even if they're in the universal blocklist
  lat: number;
  lng: number;
  radiusMeters: number;
  minRating?: number;
  sortBy?: "rating" | "distance";
}

export interface GeocodeResult {
  formattedAddress: string;
  location: LatLng;
}
