import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail } from "@/lib/email";

export const runtime = "nodejs";

interface ClaimPayload {
  placeId: string;
  businessName: string;
  businessAddress?: string;
  claimantName: string;
  claimantRole: string;
  claimantEmail: string;
  claimantPhone?: string;
  message?: string;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  let data: ClaimPayload;
  try {
    data = (await req.json()) as ClaimPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate required fields
  const required: (keyof ClaimPayload)[] = [
    "placeId",
    "businessName",
    "claimantName",
    "claimantRole",
    "claimantEmail",
  ];
  for (const f of required) {
    if (!data[f] || typeof data[f] !== "string" || !(data[f] as string).trim()) {
      return NextResponse.json(
        { error: `Missing required field: ${f}` },
        { status: 400 }
      );
    }
  }

  // Basic email sanity check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.claimantEmail)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const adminTo =
    process.env.CLAIM_NOTIFICATION_EMAIL ?? "claims@petsit.example.com";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #0d9488; margin-bottom: 4px;">New listing claim</h2>
      <p style="color: #475569; margin-top: 0;">Someone wants to claim a listing on PetSit.</p>

      <h3 style="margin-top: 24px; margin-bottom: 4px; color: #0f172a;">Business</h3>
      <p style="margin: 0 0 4px;"><strong>${esc(data.businessName)}</strong></p>
      ${data.businessAddress ? `<p style="margin: 0 0 4px; color: #64748b;">${esc(data.businessAddress)}</p>` : ""}
      <p style="margin: 0 0 4px;"><a href="https://pet-sitter-finder-petsit-s-projects.vercel.app/provider/${esc(data.placeId)}">View listing →</a></p>

      <h3 style="margin-top: 24px; margin-bottom: 4px; color: #0f172a;">Claimant</h3>
      <p style="margin: 0 0 4px;"><strong>${esc(data.claimantName)}</strong> (${esc(data.claimantRole)})</p>
      <p style="margin: 0 0 4px;">Email: <a href="mailto:${esc(data.claimantEmail)}">${esc(data.claimantEmail)}</a></p>
      ${data.claimantPhone ? `<p style="margin: 0 0 4px;">Phone: <a href="tel:${esc(data.claimantPhone)}">${esc(data.claimantPhone)}</a></p>` : ""}

      ${
        data.message
          ? `<h3 style="margin-top: 24px; margin-bottom: 4px; color: #0f172a;">Message</h3>
             <p style="white-space: pre-line; color: #1e293b; background: #f8fafc; padding: 12px 14px; border-radius: 8px;">${esc(data.message)}</p>`
          : ""
      }

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;">
      <p style="color: #94a3b8; font-size: 12px;">Sent from petsit · Place ID: ${esc(data.placeId)}</p>
    </div>
  `;

  const result = await sendNotificationEmail({
    to: adminTo,
    subject: `[PetSit claim] ${data.businessName} — ${data.claimantName}`,
    html,
    replyTo: data.claimantEmail,
  });

  // Always log the claim too, even if email succeeded — gives a paper trail
  // in Vercel's Functions logs that survives any email delivery hiccup.
  console.log("[claim/received]", JSON.stringify({
    placeId: data.placeId,
    businessName: data.businessName,
    claimantName: data.claimantName,
    claimantRole: data.claimantRole,
    claimantEmail: data.claimantEmail,
    claimantPhone: data.claimantPhone ?? null,
    messageLength: data.message?.length ?? 0,
    emailDelivered: result.delivered,
    emailVia: result.via,
  }));

  return NextResponse.json({
    ok: true,
    deliveryVia: result.via,
  });
}
