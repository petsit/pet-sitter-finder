import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/places";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { service, lat, lng, radiusMeters, minRating, sortBy } = body;

    if (typeof lat !== "number" || typeof lng !== "number") {
      return NextResponse.json(
        { error: "lat and lng are required numbers" },
        { status: 400 }
      );
    }
    if (typeof service !== "string" || !service.trim()) {
      return NextResponse.json(
        { error: "service query is required" },
        { status: 400 }
      );
    }

    const providers = await searchPlaces({
      service,
      lat,
      lng,
      radiusMeters: Math.min(Math.max(radiusMeters ?? 8000, 500), 50000),
      minRating,
      sortBy,
    });

    return NextResponse.json({ providers });
  } catch (err: any) {
    console.error("[places/search] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Search failed" },
      { status: 500 }
    );
  }
}
