// Helpers for fetching HERD reviews. Same graceful-degradation pattern
// as lib/overrides — if the DB is unavailable, we return empty arrays
// so the public listing keeps working with Google data alone.

import { db } from "@/db";
import { herdReviews, type HerdReview } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getApprovedReviews(
  placeId: string
): Promise<HerdReview[]> {
  try {
    return await db
      .select()
      .from(herdReviews)
      .where(
        and(eq(herdReviews.placeId, placeId), eq(herdReviews.status, "approved"))
      )
      .orderBy(desc(herdReviews.reviewedAt))
      .limit(50);
  } catch (err) {
    console.warn(
      "[reviews] DB lookup failed (continuing with Google reviews only):",
      (err as Error)?.message ?? err
    );
    return [];
  }
}

export function averageRating(reviews: HerdReview[]): number | undefined {
  if (reviews.length === 0) return undefined;
  const total = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
  return total / reviews.length;
}
