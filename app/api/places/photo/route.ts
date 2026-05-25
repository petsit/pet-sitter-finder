import { NextRequest } from "next/server";
import { fetchPlacePhoto } from "@/lib/places";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  const w = parseInt(req.nextUrl.searchParams.get("w") ?? "800", 10);

  if (!ref) {
    return new Response("ref is required", { status: 400 });
  }

  const result = await fetchPlacePhoto(ref, Math.min(Math.max(w, 100), 1600));
  if (!result) {
    return new Response("Photo not found", { status: 404 });
  }

  return new Response(result.body, {
    headers: {
      "Content-Type": result.contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
