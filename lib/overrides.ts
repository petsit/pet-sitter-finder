// Helpers to read provider overrides from the database with graceful
// degradation when the DB isn't reachable (e.g. local dev before
// DATABASE_URL is set). Returning null/empty is treated as "no
// override" by callers, so the public site always works.

import { db } from "@/db";
import { providerOverrides, type ProviderOverride } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function getProviderOverride(
  placeId: string
): Promise<ProviderOverride | null> {
  try {
    const [row] = await db
      .select()
      .from(providerOverrides)
      .where(eq(providerOverrides.placeId, placeId))
      .limit(1);
    return row ?? null;
  } catch (err) {
    console.warn(
      "[overrides] DB lookup failed (continuing with Google-only data):",
      (err as Error)?.message ?? err
    );
    return null;
  }
}

// Bulk lookup used by the search results page to mark each Google
// result with a verified flag. One round-trip rather than N.
export async function getVerifiedPlaceIds(
  placeIds: string[]
): Promise<Set<string>> {
  if (placeIds.length === 0) return new Set();
  try {
    const rows = await db
      .select({ placeId: providerOverrides.placeId })
      .from(providerOverrides)
      .where(inArray(providerOverrides.placeId, placeIds));
    return new Set(rows.map((r) => r.placeId));
  } catch (err) {
    console.warn(
      "[overrides] bulk lookup failed (treating all as unverified):",
      (err as Error)?.message ?? err
    );
    return new Set();
  }
}

export interface EnrichmentData {
  isVerified: boolean;
  priceFrom: number | null;
  priceUnit: string | null;
  responseTimeHours: number | null;
}

// Bulk fetch of structured pricing / response-time so search results
// can show 'From £X' on the card without N+1 queries.
export async function getProviderEnrichmentMap(
  placeIds: string[]
): Promise<Map<string, EnrichmentData>> {
  const map = new Map<string, EnrichmentData>();
  if (placeIds.length === 0) return map;
  try {
    const rows = await db
      .select({
        placeId: providerOverrides.placeId,
        priceFrom: providerOverrides.priceFrom,
        priceUnit: providerOverrides.priceUnit,
        responseTimeHours: providerOverrides.responseTimeHours,
      })
      .from(providerOverrides)
      .where(inArray(providerOverrides.placeId, placeIds));
    for (const row of rows) {
      map.set(row.placeId, {
        isVerified: true,
        priceFrom: row.priceFrom ? Number(row.priceFrom) : null,
        priceUnit: row.priceUnit ?? null,
        responseTimeHours: row.responseTimeHours
          ? Number(row.responseTimeHours)
          : null,
      });
    }
  } catch (err) {
    console.warn(
      "[overrides] enrichment lookup failed (continuing without):",
      (err as Error)?.message ?? err
    );
  }
  return map;
}
