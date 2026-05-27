import { NextRequest, NextResponse } from "next/server";
import { signMagicLinkToken } from "@/lib/auth";
import { sendNotificationEmail } from "@/lib/email";
import { db } from "@/db";
import { claims } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

function originFromReq(req: NextRequest): string {
  // Honour the X-Forwarded-* headers Vercel sets so magic links work in
  // both local dev and production without needing an env var.
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // Only allow login for emails that have at least one approved claim.
  // This prevents random people from triggering magic-link emails to
  // arbitrary addresses (mild abuse-prevention).
  try {
    const approved = await db
      .select({ id: claims.id })
      .from(claims)
      .where(
        and(eq(claims.claimantEmail, email), eq(claims.status, "approved"))
      )
      .limit(1);

    if (approved.length === 0) {
      // Don't reveal whether the email exists; return a generic success
      // so it acts as a no-op for unknown emails.
      return NextResponse.json({ ok: true });
    }
  } catch (err: any) {
    console.error("[auth/login] DB lookup failed:", err);
    return NextResponse.json(
      { error: "Login is temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }

  const token = await signMagicLinkToken(email);
  const origin = originFromReq(req);
  const link = `${origin}/auth/verify?token=${encodeURIComponent(token)}`;

  await sendNotificationEmail({
    to: email,
    subject: "Sign in to PetSit",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #0d9488;">Your PetSit sign-in link</h2>
        <p style="color: #475569;">Tap the button below to sign in to your provider dashboard. This link expires in 15 minutes.</p>
        <p style="margin: 24px 0;">
          <a href="${link}" style="display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 500;">Sign in to PetSit</a>
        </p>
        <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, you can safely ignore it.</p>
        <p style="color: #94a3b8; font-size: 12px;">Or paste this URL into your browser:<br>${link}</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
