import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { herdReviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendNotificationEmail } from "@/lib/email";

export const runtime = "nodejs";

interface ReportPayload {
  reason: string;
  details?: string;
  reporterEmail?: string;
}

const ALLOWED_REASONS = new Set([
  "defamatory",
  "personal-info",
  "spam",
  "off-topic",
  "offensive",
  "conflict",
  "other",
]);

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  let data: ReportPayload;
  try {
    data = (await req.json()) as ReportPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!data.reason || !ALLOWED_REASONS.has(data.reason)) {
    return NextResponse.json({ error: "Please pick a reason." }, { status: 400 });
  }

  // Look up the review so we can include details in the admin email
  let review;
  try {
    const [row] = await db
      .select()
      .from(herdReviews)
      .where(eq(herdReviews.id, id))
      .limit(1);
    review = row;
  } catch (err) {
    console.error("[reviews/report] lookup failed:", err);
    return NextResponse.json(
      { error: "Couldn't load the review. Please try again." },
      { status: 500 }
    );
  }
  if (!review) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 });
  }

  // Increment the reportedCount + stamp reportedAt.
  // reportedCount is text in the schema, so do the maths in JS.
  const newCount = (Number(review.reportedCount ?? "0") + 1).toString();
  try {
    await db
      .update(herdReviews)
      .set({ reportedCount: newCount, reportedAt: new Date() })
      .where(eq(herdReviews.id, id));
  } catch (err) {
    console.error("[reviews/report] update failed:", err);
    // Don't bail — still email admin
  }

  // Email admin with the report
  const adminTo =
    process.env.CLAIM_NOTIFICATION_EMAIL ?? "claims@herd.example.com";
  await sendNotificationEmail({
    to: adminTo,
    subject: `[HERD] Review reported — ${review.businessName}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #be123c;">Review reported</h2>
        <p>Someone has reported a HERD review. Total report count is now
          <strong>${newCount}</strong>.</p>

        <h3 style="margin-top: 24px; color: #0f172a;">Reason</h3>
        <p><strong>${esc(data.reason)}</strong></p>
        ${
          data.details
            ? `<p style="white-space: pre-line; color: #1e293b; background: #f8fafc; padding: 10px; border-radius: 8px;">${esc(data.details)}</p>`
            : ""
        }
        ${
          data.reporterEmail
            ? `<p style="margin-top: 8px;">Reporter contact: <a href="mailto:${esc(data.reporterEmail)}">${esc(data.reporterEmail)}</a></p>`
            : `<p style="margin-top: 8px; color: #64748b; font-size: 14px;">Reporter did not provide an email.</p>`
        }

        <h3 style="margin-top: 24px; color: #0f172a;">Reported review</h3>
        <p style="color: #475569;">
          <strong>${esc(review.authorName)}</strong> reviewed
          <strong>${esc(review.businessName)}</strong>
          on ${new Date(review.createdAt).toLocaleDateString("en-GB")}
        </p>
        ${review.title ? `<p><strong>${esc(review.title)}</strong></p>` : ""}
        <blockquote style="border-left: 3px solid #cbd5e1; padding-left: 12px; margin: 8px 0; color: #334155; white-space: pre-line;">
${esc(review.body)}
        </blockquote>

        <p style="margin-top: 28px;">
          <a href="/admin/reviews" style="color: #0d9488;">Open admin reviews →</a>
        </p>
        <p style="color: #94a3b8; font-size: 12px;">Review ID: ${esc(review.id)}</p>
      </div>
    `,
  });

  console.log("[reviews/report] received", {
    reviewId: review.id,
    reason: data.reason,
    totalReports: newCount,
  });

  return NextResponse.json({ ok: true });
}
