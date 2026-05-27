import { NextRequest, NextResponse } from "next/server";
import { findPlacesByName } from "@/lib/places";
import { geocode } from "@/lib/geocode";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { name?: string; postcode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  if (!name || name.length < 2) {
    return NextResponse.json(
      { error: "Please enter at least 2 characters of the business name." },
      { status: 400 }
    );
  }

  let bias: { lat: number; lng: number; radiusMeters: number } | undefined;
  if (body.postcode?.trim()) {
    try {
      const g = await geocode(body.postcode.trim());
      if (g) {
        bias = {
          lat: g.location.lat,
          lng: g.location.lng,
          // ~30 mile soft bias — generous but anchors the search to
          // roughly the right region of the UK.
          radiusMeters: 50000,
        };
      }
    } catch {
      // Ignore geocoding failures — just do an unbiased UK search.
    }
  }

  try {
    const results = await findPlacesByName({ name, bias });
    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("[find-business] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Search failed" },
      { status: 500 }
    );
  }
}
