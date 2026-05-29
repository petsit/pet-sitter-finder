import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { herdReviews } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { SignJWT } from "jose";
import { sendNotificationEmail } from "@/lib/email";

export const runtime = "nodejs";

interface ReviewPayload {
  placeId: string;
  businessName: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  title?: string;
  body: string;
  serviceUsed?: string;
}

function originFromReq(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "localhost:3000";
  return `${proto}://${host}`;
}

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) throw new Error("AUTH_SECRET missing");
  return new TextEncoder().encode(s);
}

export async function POST(req: NextRequest) {
  let data: ReviewPayload;
  try {
    data = (await req.json()) as ReviewPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Basic validation
  if (
    !data.placeId ||
    !data.businessName ||
    !data.authorName?.trim() ||
    !data.authorEmail?.trim() ||
    !data.body?.trim() ||
    !data.rating
  ) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }
  const ratingNum = Number(data.rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return NextResponse.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 }
    );
  }
  if (data.body.trim().length < 20) {
    return NextResponse.json(
      { error: "Please write at least 20 characters." },
      { status: 400 }
    );
  }
  if (data.body.length > 2000) {
    return NextResponse.json(
      { error: "Review is too long (max 2000 characters)." },
      { status: 400 }
    );
  }
  const email = data.authorEmail.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // One review per email per place (prevents double-posting + dampens abuse)
  try {
    const existing = await db
      .select({ id: herdReviews.id })
      .from(herdReviews)
      .where(
        and(eq(herdReviews.authorEmail, email), eq(herdReviews.placeId, data.placeId))
      )
      .limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        {
          error:
            "You've already submitted a review for this business. Get in touch if you'd like to edit it.",
        },
        { status: 409 }
      );
    }
  } catch (err) {
    console.error("[reviews] dedup lookup failed:", err);
  }

  // Insert as pending (awaiting email verification)
  let reviewId: string | undefined;
  try {
    const [row] = await db
      .insert(herdReviews)
      .values({
        placeId: data.placeId,
        businessName: data.businessName,
        authorName: data.authorName.trim(),
        authorEmail: email,
        rating: String(ratingNum),
        title: data.title?.trim() || null,
        body: data.body.trim(),
        serviceUsed: data.serviceUsed?.trim() || null,
        status: "pending",
      })
      .returning({ id: herdReviews.id });
    reviewId = row?.id;
  } catch (err) {
    console.error("[reviews] insert failed:", err);
    return NextResponse.json(
      { error: "Couldn't save the review. Please try again." },
      { status: 500 }
    );
  }
  if (!reviewId) {
    return NextResponse.json({ error: "Unknown insert failure" }, { status: 500 });
  }

  // Send verification email
  const token = await new SignJWT({ reviewId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("48h")
    .setSubject("review-verify")
    .sign(secret());
  const origin = originFromReq(req);
  const verifyUrl = `${origin}/reviews/verify?token=${encodeURIComponent(token)}`;

  await sendNotificationEmail({
    to: email,
    subject: `Verify your HERD review of ${data.businessName}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #0d9488;">Confirm your HERD review</h2>
        <p>Thanks for reviewing <strong>${escape(data.businessName)}</strong>! To
          publish it, please confirm it's really you by clicking the button
          below.</p>
        <p style="margin: 24px 0;">
          <a href="${verifyUrl}" style="display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 500;">Confirm my review</a>
        </p>
        <p style="color: #475569; font-size: 14px;">After you confirm, an admin will
          check the review for spam and abuse before publishing — usually within
          2 working days. You'll get a second email once it's live on the listing.</p>
        <p style="color: #94a3b8; font-size: 12px;">If you didn't write a review,
          you can ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
