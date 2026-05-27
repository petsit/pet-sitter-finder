import { NextRequest, NextResponse } from "next/server";
import { endAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

// IMPORTANT: POST only. A GET handler here would be prefetched by Next.js
// the moment any <Link href="/api/admin/logout"> rendered, which would
// silently sign the admin out on every page load.
export async function POST(req: NextRequest) {
  await endAdminSession();
  return NextResponse.redirect(new URL("/admin/login", req.url), {
    status: 303,
  });
}
