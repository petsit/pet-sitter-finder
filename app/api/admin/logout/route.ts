import { NextRequest, NextResponse } from "next/server";
import { endAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  await endAdminSession();
  return NextResponse.redirect(new URL("/admin/login", req.url), {
    status: 303,
  });
}
