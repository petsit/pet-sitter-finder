import { NextRequest, NextResponse } from "next/server";
import { getPlaceDetails } from "@/lib/places";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("placeId");
  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  try {
    const details = await getPlaceDetails(placeId);
    return NextResponse.json({ details });
  } catch (err: any) {
    console.error("[places/details] error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to load provider" },
      { status: 500 }
    );
  }
}
