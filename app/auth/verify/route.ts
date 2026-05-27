import { NextRequest, NextResponse } from "next/server";
import { verifyMagicLinkToken, startSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing", req.url));
  }

  const email = await verifyMagicLinkToken(token);
  if (!email) {
    return NextResponse.redirect(new URL("/login?error=expired", req.url));
  }

  await startSession(email);
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
