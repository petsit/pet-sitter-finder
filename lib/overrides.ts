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
