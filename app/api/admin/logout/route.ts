import { NextResponse } from "next/server";
import { endAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  await endAdminSession();
  return NextResponse.redirect(new URL("/admin/login", "http://placeholder"), {
    status: 303,
  });
}
