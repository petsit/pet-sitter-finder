import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/db";
import { herdReviews } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET missing");
  return new TextEncoder().encode(s);
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(
      new URL("/reviews/thanks?status=missing", req.url)
    );
  }

  let reviewId: string | undefined;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      subject: "review-verify",
    });
    reviewId = typeof payload.reviewId === "string" ? payload.reviewId : undefined;
  } catch {
    return NextResponse.redirect(
      new URL("/reviews/thanks?status=expired", req.url)
    );
  }

  if (!reviewId) {
    return NextResponse.redirect(
      new URL("/reviews/thanks?status=missing", req.url)
    );
  }

  try {
    await db
      .update(herdReviews)
      .set({ status: "verified", verifiedAt: new Date() })
      .where(eq(herdReviews.id, reviewId));
  } catch (err) {
    console.error("[reviews/verify] update failed:", err);
    return NextResponse.redirect(
      new URL("/reviews/thanks?status=error", req.url)
    );
  }

  return NextResponse.redirect(new URL("/reviews/thanks?status=ok", req.url));
}
