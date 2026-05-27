import Link from "next/link";
import { getPlaceDetails } from "@/lib/places";
import ClaimForm from "@/components/ClaimForm";

interface PageProps {
  params: Promise<{ placeId: string }>;
}

export const dynamic = "force-dynamic";

export default async function ClaimPage({ params }: PageProps) {
  const { placeId } = await params;

  let details;
  try {
    details = await getPlaceDetails(placeId);
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-3">Couldn&apos;t load that listing</h1>
        <Link
          href="/"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/provider/${placeId}`}
        className="text-sm text-teal-700 hover:underline"
      >
        ← Back to listing
      </Link>

      <header className="mt-4 mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-1">
          Claim this listing
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {details.name}
        </h1>
        {details.address && (
          <p className="text-slate-600 mt-1">{details.address}</p>
        )}
        <p className="mt-5 text-slate-600 leading-relaxed">
          Tell us who you are and how we can verify you. We&apos;ll review
          your details and get back to you within 2 working days. Once
          verified, you&apos;ll be able to add services, prices, photos and
          a description to your listing.
        </p>
      </header>

      <ClaimForm
        placeId={details.id}
        businessName={details.name}
        businessAddress={details.address}
      />
    </div>
  );
}
