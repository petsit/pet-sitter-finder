import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSessionEmail } from "@/lib/auth";
import { db } from "@/db";
import { claims, providerOverrides } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { getPlaceDetails, placePhotoUrl } from "@/lib/places";
import EditListingForm from "@/components/EditListingForm";
import ReleaseListingButton from "@/components/ReleaseListingButton";
import RatingStars from "@/components/RatingStars";
import ReviewCard from "@/components/ReviewCard";
import { Phone, Globe, MapPin, Clock, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ placeId: string }>;
}

export default async function EditListingPage({ params }: Props) {
  const email = await getSessionEmail();
  if (!email) redirect("/login");

  const { placeId } = await params;

  // Confirm the signed-in user owns this listing
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

  // Pull current override (may be null on first edit)
  const [existing] = await db
    .select()
    .from(providerOverrides)
    .where(eq(providerOverrides.placeId, placeId))
    .limit(1);

  // Pull live Google data to render the "as customers see it" preview
  let details;
  try {
    details = await getPlaceDetails(placeId);
  } catch {
    details = null;
  }

  const googlePhotos = details?.photoRefs ?? [];
  const reviews = details?.reviews ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/dashboard"
        className="text-sm text-teal-700 hover:underline"
      >
        ← Back to my listings
      </Link>

      <header className="mt-3 mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
          Manage listing
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {claim[0].businessName}
        </h1>
        {details && (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-slate-600">
            <RatingStars
              rating={details.rating}
              count={details.reviewCount}
              size="lg"
            />
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-sm">
              <MapPin className="w-3.5 h-3.5" /> {details.address}
            </span>
          </div>
        )}
        <div className="mt-3">
          <Link
            href={`/provider/${placeId}`}
            target="_blank"
            className="text-sm text-teal-700 hover:underline inline-flex items-center gap-1"
          >
            View as customers see it{" "}
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        {/* MAIN EDIT COLUMN */}
        <div className="space-y-10">
          <EditListingForm
            placeId={placeId}
            initial={{
              description: existing?.description ?? "",
              servicesOffered: existing?.servicesOffered ?? "",
              pricingNotes: existing?.pricingNotes ?? "",
              customPhotos: existing?.customPhotos ?? [],
              priceFrom: existing?.priceFrom ? Number(existing.priceFrom) : null,
              priceUnit: existing?.priceUnit ?? null,
              responseTimeHours: existing?.responseTimeHours
                ? Number(existing.responseTimeHours)
                : null,
            }}
            googlePhotos={googlePhotos}
          />

          {/* Danger zone — release this listing */}
          <ReleaseListingButton
            placeId={placeId}
            businessName={claim[0].businessName}
          />

          {/* Reviews — read-only */}
          {reviews.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-1">
                Your Google reviews
              </h2>
              <p className="text-sm text-slate-500 mb-5">
                These come from Google and update automatically. To
                respond to a review, do it from Google Maps — your reply
                will appear here.
              </p>
              <div className="space-y-3">
                {reviews.slice(0, 5).map((r, i) => (
                  <ReviewCard key={i} review={r} />
                ))}
              </div>
              {reviews.length > 5 && (
                <p className="text-sm text-slate-500 mt-3">
                  + {reviews.length - 5} more on the public page.
                </p>
              )}
            </section>
          )}
        </div>

        {/* SIDEBAR — read-only Google info */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">
              From Google
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              These fields are pulled live from Google. To change them,
              update your Google Business Profile.
            </p>
            <dl className="space-y-2 text-sm">
              {details?.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                  <span className="text-slate-700">{details.phone}</span>
                </div>
              )}
              {details?.website && (
                <div className="flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                  <a
                    href={details.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:underline break-all"
                  >
                    {details.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              {details?.weekdayHours && details.weekdayHours.length > 0 && (
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 mt-1 shrink-0" />
                  <ul className="space-y-0.5 text-slate-700">
                    {details.weekdayHours.map((line, i) => (
                      <li key={i} className="text-xs">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </dl>
            {details?.googleMapsUri && (
              <a
                href={details.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-4 text-xs text-teal-700 hover:underline"
              >
                Manage on Google Maps{" "}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {googlePhotos.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 mb-3 text-sm">
                Google photos ({googlePhotos.length})
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {googlePhotos.slice(0, 6).map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p}
                    src={placePhotoUrl(p, 200)}
                    alt=""
                    className="w-full aspect-square object-cover rounded-md"
                    loading="lazy"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                These are from Google. Add your own photos in the editor
                to show them first on your listing.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
