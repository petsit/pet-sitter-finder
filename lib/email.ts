// Lightweight wrapper around Resend with graceful degradation.
// If RESEND_API_KEY is not configured (e.g. very first deploy), we log
// the message to the function output instead of throwing. You can read
// the log in Vercel's "Functions" tab. Once the key is added, real
// emails start flowing automatically — no code change needed.

import { Resend } from "resend";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendNotificationEmail(args: SendArgs): Promise<{
  delivered: boolean;
  via: "resend" | "log";
  error?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddr =
    process.env.NOTIFICATION_FROM_EMAIL ?? "PetSit <onboarding@resend.dev>";

  if (!apiKey) {
    // Fallback path: log the message, return success.
    console.log("[email/log-only]", JSON.stringify({
      from: fromAddr,
      to: args.to,
      subject: args.subject,
      replyTo: args.replyTo,
      html: args.html,
    }));
    return { delivered: true, via: "log" };
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromAddr,
      to: args.to,
      subject: args.subject,
      html: args.html,
      replyTo: args.replyTo,
    });
    if (result.error) {
      console.error("[email] Resend error:", result.error);
      return {
        delivered: false,
        via: "resend",
        error: result.error.message,
      };
    }
    return { delivered: true, via: "resend" };
  } catch (e: any) {
    console.error("[email] send failed:", e);
    return { delivered: false, via: "resend", error: e?.message };
  }
}
