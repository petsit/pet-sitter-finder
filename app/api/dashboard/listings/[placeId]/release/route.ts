import { NextRequest, NextResponse } from "next/server";
import { getSessionEmailFromReq } from "@/lib/auth";
import { db } from "@/db";
import { claims, providerOverrides } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { sendNotificationEmail } from "@/lib/email";

export const runtime = "nodejs";

// Provider voluntarily releases ownership of a listing. Effects:
//   1. provider_overrides row deleted → the public listing reverts to
//      Google-only data, badge disappears from search + detail page.
//   2. The matching claim is flipped from 'approved' to 'rejected' with
//      a reviewer_note flag so it shows in the admin panel as
//      Released-by-owner rather than admin-rejected.
//   3. An optional notification email goes to the admin so you know.
//
// Reversible: the provider can submit a new claim later via the
// "Are you the owner?" flow on the listing page.
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ placeId: string }> }
) {
  const email = await getSessionEmailFromReq(req);
  if (!email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const { placeId } = await ctx.params;

  // Confirm the user actually owns this listing
  const claim = await db
    .select()
    .from(claims)
    .where(
      and(
        eq(claims.placeId, placeId),
        eq(claims.claimantEmail, email),
        eq(claims.status, "approved")
      )
    )
    .limit(1);
  if (claim.length === 0) {
    return NextResponse.json(
      { error: "You don't have an approved claim for this listing." },
      { status: 403 }
    );
  }

  // Remove their override and downgrade the claim
  await db
    .delete(providerOverrides)
    .where(eq(providerOverrides.placeId, placeId));

  await db
    .update(claims)
    .set({
      status: "rejected",
      reviewedAt: new Date(),
      reviewerNote: "Released by owner",
    })
    .where(eq(claims.id, claim[0].id));

  // Heads-up to admin so you can spot patterns (mass releases? hostile
  // takeovers?). Best-effort; we don't fail the request if email fails.
  const adminTo =
    process.env.CLAIM_NOTIFICATION_EMAIL ?? "claims@herd.example.com";
  await sendNotificationEmail({
    to: adminTo,
    subject: `[HERD] Listing released — ${claim[0].businessName}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto;">
        <h2 style="color: #0f172a;">A provider released their listing</h2>
        <p><strong>${escape(claim[0].businessName)}</strong> has been
        released by <a href="mailto:${escape(email)}">${escape(email)}</a>.</p>
        <p>The override has been deleted and the claim moved to 'rejected'
        with reviewer note "Released by owner". They can re-claim later
        via the public listing if they change their mind.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
