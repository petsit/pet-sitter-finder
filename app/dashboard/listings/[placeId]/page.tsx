import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSessionEmail } from "@/lib/auth";
import { db } from "@/db";
import { claims, providerOverrides } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import EditListingForm from "@/components/EditListingForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ placeId: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const email = await getSessionEmail();
  if (!email) redirect("/login");

  const { placeId } = await params;

  // Verify the user has an approved claim for this listing
  const claim = await db
    .select()
    .from(claims)
    .where(
      and(
        eq(claims.placeId, placeId),
        eq(claims.claimantEmail, email),
        eq(claims.status, "approved")
      )
    )
    .limit(1);

  if (claim.length === 0) notFound();

  const [existing] = await db
    .select()
    .from(providerOverrides)
    .where(eq(providerOverrides.placeId, placeId))
    .limit(1);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/dashboard"
        className="text-sm text-teal-700 hover:underline"
      >
        ← Back to my listings
      </Link>
      <header className="mt-3 mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
          Edit listing
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          {claim[0].businessName}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Anything you fill in here overrides the data from Google. Leave
          blank to keep using Google&apos;s information.
        </p>
      </header>

      <EditListingForm
        placeId={placeId}
        initial={{
          description: existing?.description ?? "",
          servicesOffered: existing?.servicesOffered ?? "",
          pricingNotes: existing?.pricingNotes ?? "",
        }}
      />
    </div>
  );
}
