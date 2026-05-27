import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { db } from "@/db";
import { claims, providerOverrides } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendNotificationEmail } from "@/lib/email";

export const runtime = "nodejs";

function originFromReq(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host =
    req.headers.get("x-forwarded-host") ??
    req.headers.get("host") ??
    "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  // --- diagnostic logging ---
  const cookieNames = req.cookies.getAll().map((c) => c.name);
  const adminCookie = req.cookies.get("petsit_admin");
  const hasSecret = Boolean(process.env.AUTH_SECRET);
  console.log("[admin/decision] incoming", {
    cookies: cookieNames,
    hasAdminCookie: Boolean(adminCookie?.value),
    adminCookieLength: adminCookie?.value?.length ?? 0,
    hasAuthSecret: hasSecret,
    authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
  });

  if (!(await isAdminRequest(req))) {
    console.warn("[admin/decision] auth rejected — see warn above for verify failure");
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as {
    status?: "approved" | "rejected";
  };

  if (body.status !== "approved" && body.status !== "rejected") {
    return NextResponse.json(
      { error: "status must be 'approved' or 'rejected'" },
      { status: 400 }
    );
  }

  // Mark the claim
  const [updated] = await db
    .update(claims)
    .set({
      status: body.status,
      reviewedAt: new Date(),
    })
    .where(eq(claims.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  // On approval: create an empty override row so the provider has something
  // to edit on first sign-in. Use ON CONFLICT DO NOTHING semantics (skip
  // if a row already exists for this place — that can happen if the
  // listing was previously approved and re-claimed).
  if (body.status === "approved") {
    try {
      await db
        .insert(providerOverrides)
        .values({
          placeId: updated.placeId,
          ownerEmail: updated.claimantEmail,
        })
        .onConflictDoNothing();
    } catch (err) {
      console.error("[admin/decision] override insert failed:", err);
    }
  }

  // Notify the claimant
  const origin = originFromReq(req);
  const loginUrl = `${origin}/login`;
  const listingUrl = `${origin}/provider/${updated.placeId}`;

  if (body.status === "approved") {
    await sendNotificationEmail({
      to: updated.claimantEmail,
      subject: `Your PetSit claim for ${updated.businessName} has been approved`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2 style="color: #0d9488;">Welcome aboard 🎉</h2>
          <p>Good news, ${escape(updated.claimantName)} — your claim for
            <strong>${escape(updated.businessName)}</strong> has been approved.</p>
          <p>You can now sign in to manage your listing — add services, pricing, a custom description and more.</p>
          <p style="margin: 24px 0;">
            <a href="${loginUrl}" style="display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 500;">Sign in to PetSit</a>
          </p>
          <p style="color: #475569; font-size: 14px;">Or visit your listing as customers see it:<br><a href="${listingUrl}">${listingUrl}</a></p>
        </div>
      `,
    });
  } else {
    await sendNotificationEmail({
      to: updated.claimantEmail,
      subject: `Your PetSit claim for ${updated.businessName} wasn't approved`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Claim update</h2>
          <p>Hi ${escape(updated.claimantName)},</p>
          <p>Thanks for getting in touch about <strong>${escape(updated.businessName)}</strong>. Unfortunately we weren't able to verify your claim at this time.</p>
          <p>If you think this is a mistake, please reply to this email with any verification details (a business email at the same domain, a registration number, etc.) and we'll take another look.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true, status: body.status });
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
