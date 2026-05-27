// Helper to fetch the provider override for a given place, with
// graceful degradation when the database isn't reachable (e.g. local
// dev before DATABASE_URL is set). Returning null is treated as
// "no override" by the listing page, so the public site always works.

import { db } from "@/db";
import { providerOverrides, type ProviderOverride } from "@/db/schema";
import { eq } from "drizzle-orm";

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
