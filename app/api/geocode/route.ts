import { NextRequest, NextResponse } from "next/server";
import { geocode } from "@/lib/geocode";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q || !q.trim()) {
    return NextResponse.json({ error: "q is required" }, { status: 400 });
  }

  try {
    const result = await geocode(q);
    if (!result) {
      return NextResponse.json(
        { error: "Could not find that location" },
        { status: 404 }
      );
    }
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[geocode] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Geocoding failed" },
      { status: 500 }
    );
  }
}
