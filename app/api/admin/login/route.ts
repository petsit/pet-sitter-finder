import { NextRequest, NextResponse } from "next/server";
import { checkAdminPassword, startAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.password || !checkAdminPassword(body.password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  await startAdminSession();
  return NextResponse.json({ ok: true });
}
