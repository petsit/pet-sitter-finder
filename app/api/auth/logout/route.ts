import { NextRequest, NextResponse } from "next/server";
import { endSession } from "@/lib/auth";

export const runtime = "nodejs";

// POST only — a GET handler here would be prefetched by Next.js the
// moment any <Link href="/api/auth/logout"> rendered, which would
// silently sign the user out on every page load (same trap as
// /api/admin/logout). Always invoked via a <form method="post">.
export async function POST(req: NextRequest) {
  await endSession();
  return NextResponse.redirect(new URL("/", req.url), { status: 303 });
}
