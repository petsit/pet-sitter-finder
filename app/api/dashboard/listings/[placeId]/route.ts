import { NextRequest, NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/auth";
import { db } from "@/db";
import { claims, providerOverrides } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";

interface Payload {
  description?: string;
  servicesOffered?: string;
  pricingNotes?: string;
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ placeId: string }> }
) {
  const email = await getSessionEmail();
  if (!email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const { placeId } = await ctx.params;

  // Confirm the signed-in user has an approved claim for this place
  const ownCheck = await db
    .select({ id: claims.id })
    .from(claims)
    .where(
      and(
        eq(claims.placeId, placeId),
        eq(claims.claimantEmail, email),
        eq(claims.status, "approved")
      )
    )
    .limit(1);
  if (ownCheck.length === 0) {
    return NextResponse.json(
      { error: "You don't have permission to edit this listing." },
      { status: 403 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as Payload;
  const description = body.description?.slice(0, 1500) ?? null;
  const servicesOffered = body.servicesOffered?.slice(0, 800) ?? null;
  const pricingNotes = body.pricingNotes?.slice(0, 500) ?? null;

  // Upsert
  await db
    .insert(providerOverrides)
    .values({
      placeId,
      ownerEmail: email,
      description,
      servicesOffered,
      pricingNotes,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: providerOverrides.placeId,
      set: {
        description,
        servicesOffered,
        pricingNotes,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}
