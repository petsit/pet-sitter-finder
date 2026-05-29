import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth";
import { db } from "@/db";
import { herdReviews } from "@/db/schema";
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
  if (!(await isAdminRequest(req))) {
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

  const [updated] = await db
    .update(herdReviews)
    .set({
      status: body.status,
      reviewedAt: new Date(),
    })
    .where(eq(herdReviews.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  // Email the reviewer with the decision
  const origin = originFromReq(req);
  if (body.status === "approved") {
    await sendNotificationEmail({
      to: updated.authorEmail,
      subject: `Your HERD review of ${updated.businessName} is live`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2 style="color: #0d9488;">Your review is published 🎉</h2>
          <p>Thanks ${escape(updated.authorName)} — your review of
            <strong>${escape(updated.businessName)}</strong> is now live for
            other customers to read.</p>
          <p style="margin: 24px 0;">
            <a href="${origin}/provider/${updated.placeId}" style="display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 500;">View the listing</a>
          </p>
        </div>
      `,
    });
  } else {
    await sendNotificationEmail({
      to: updated.authorEmail,
      subject: `Your HERD review of ${updated.businessName} wasn't published`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 520px; margin: 0 auto;">
          <h2 style="color: #0f172a;">Review not published</h2>
          <p>Hi ${escape(updated.authorName)},</p>
          <p>Thanks for taking the time to review
            <strong>${escape(updated.businessName)}</strong>. Unfortunately we
            weren&apos;t able to publish this one — it may have included
            personal information, language we don&apos;t allow, or details we
            can&apos;t verify.</p>
          <p>If you think this is a mistake, just reply to this email and
            we&apos;ll take another look.</p>
        </div>
      `,
    });
  }

  return NextResponse.json({ ok: true, status: body.status });
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
