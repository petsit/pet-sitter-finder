import Link from "next/link";
import { getPlaceDetails, placePhotoUrl } from "@/lib/places";
import { getProviderOverride } from "@/lib/overrides";
import { getApprovedReviews } from "@/lib/reviews";
import RatingStars from "@/components/RatingStars";
import ReviewCard from "@/components/ReviewCard";
import HerdReviewCard from "@/components/HerdReviewCard";
import ReviewForm from "@/components/ReviewForm";
import ProviderMap from "@/components/ProviderMap";
import {
  Phone,
  Globe,
  MapPin,
  Clock,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";

interface PageProps {
  params: Promise<{ placeId: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProviderPage({ params }: PageProps) {
  const { placeId } = await params;

  let details;
  try {
    details = await getPlaceDetails(placeId);
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold mb-3">Couldn&apos;t load provider</h1>
        <p className="text-slate-600 mb-6">{err?.message ?? "Unknown error"}</p>
        <Link
          href="/"
          className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium"
        >
          Back to search
        </Link>
      </div>
    );
  }

  // Owner-supplied data, when the listing has been claimed and approved.
  const override = await getProviderOverride(placeId);
  const isVerified = !!override;

  // HERD-direct reviews (email-verified + admin-approved)
  const herdReviewList = await getApprovedReviews(placeId);
  const hasOwnerContent =
    !!override?.description ||
    !!override?.servicesOffered ||
    !!override?.pricingNotes;

  const reviews = details.reviews ?? [];

  // Build a unified photo list: owner-supplied URLs first (so the
  // provider's own photos lead the gallery), then Google photos.
  const ownerPhotoUrls = override?.customPhotos ?? [];
  const googlePhotoUrls = (details.photoRefs ?? []).map((ref) =>
    placePhotoUrl(ref, 1200)
  );
  const googlePhotoUrlsSmall = (details.photoRefs ?? []).map((ref) =>
    placePhotoUrl(ref, 400)
  );
  const photos: { src: string; smallSrc: string }[] = [
    ...ownerPhotoUrls.map((u) => ({ src: u, smallSrc: u })),
    ...googlePhotoUrls.map((u, i) => ({
      src: u,
      smallSrc: googlePhotoUrlsSmall[i] ?? u,
    })),
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Photo gallery */}
      {photos.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[0].src}
            alt={details.name}
            className="col-span-4 sm:col-span-2 row-span-2 w-full h-72 sm:h-96 object-cover"
            loading="eager"
          />
          {photos.slice(1, 5).map((p) => (
            <img
              key={p.src}
              // eslint-disable-next-line @next/next/no-img-element
              src={p.smallSrc}
              alt=""
              className="hidden sm:block w-full h-[11.5rem] object-cover"
              loading="lazy"
            />
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {details.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <RatingStars
              rating={details.rating}
              count={details.reviewCount}
              size="lg"
            />
            {isVerified && (
              <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified by owner
              </span>
            )}
            {details.openNow !== undefined && (
              <span
                className={`inline-flex items-center gap-1.5 text-sm ${
                  details.openNow ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    details.openNow ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {details.openNow ? "Open now" : "Closed now"}
              </span>
            )}
          </div>

          <p className="mt-3 flex items-start gap-2 text-slate-600">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            {details.address}
          </p>

          {/* Owner-supplied content */}
          {hasOwnerContent && (
            <section className="mt-8 space-y-6">
              {override?.description && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    About
                  </h2>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {override.description}
                  </p>
                </div>
              )}
              {override?.servicesOffered && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    Services offered
                  </h2>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {override.servicesOffered}
                  </p>
                </div>
              )}
              {override?.pricingNotes && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    Pricing
                  </h2>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                    {override.pricingNotes}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* HERD-direct reviews section */}
          <section className="mt-10">
            <header className="mb-5 flex items-end justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                  {herdReviewList.length === 0
                    ? "Reviews on HERD"
                    : `${herdReviewList.length} HERD review${herdReviewList.length === 1 ? "" : "s"}`}
                </h2>
                <p className="text-sm text-slate-500">
                  Email-verified reviews posted directly on HERD, alongside Google&apos;s.
                </p>
              </div>
            </header>

            {herdReviewList.length > 0 ? (
              <div className="space-y-3 mb-8">
                {herdReviewList.map((r) => (
                  <HerdReviewCard key={r.id} review={r} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center mb-8">
                <p className="text-slate-600">
                  No HERD reviews yet — be the first to leave one.
                </p>
              </div>
            )}

            <ReviewForm placeId={placeId} businessName={details.name} />
          </section>

          {/* Google reviews section */}
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-1">
              {details.reviewCount ?? 0} Google reviews
            </h2>
            {details.rating !== undefined && (
              <div className="mb-6">
                <RatingStars
                  rating={details.rating}
                  count={details.reviewCount}
                  size="lg"
                />
              </div>
            )}

            {reviews.length === 0 ? (
              <p className="text-slate-500 italic">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <ReviewCard key={i} review={r} />
                ))}
              </div>
            )}

            {details.googleMapsUri && (
              <p className="mt-6 text-sm text-slate-500">
                More reviews and full information available on{" "}
                <a
                  href={details.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 hover:underline inline-flex items-center gap-1"
                >
                  Google Maps <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h3 className="font-semibold text-slate-900">Get in touch</h3>
            {details.phone ? (
              <a
                href={`tel:${details.phone}`}
                className="flex items-center gap-2 w-full bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2.5 rounded-xl justify-center"
              >
                <Phone className="w-4 h-4" /> {details.phone}
              </a>
            ) : (
              <p className="text-sm text-slate-500 italic">No phone listed</p>
            )}
            {details.website && (
              <a
                href={details.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full border border-slate-200 hover:border-teal-400 text-slate-900 font-medium px-4 py-2.5 rounded-xl justify-center"
              >
                <Globe className="w-4 h-4" /> Visit website
              </a>
            )}
            {details.googleMapsUri && (
              <a
                href={details.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full border border-slate-200 hover:border-teal-400 text-slate-900 font-medium px-4 py-2.5 rounded-xl justify-center"
              >
                <MapPin className="w-4 h-4" /> Get directions
              </a>
            )}
          </div>

          {details.weekdayHours && details.weekdayHours.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4" /> Opening hours
              </h3>
              <ul className="space-y-1 text-sm text-slate-700">
                {details.weekdayHours.map((line, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span>{line.split(":")[0]}</span>
                    <span className="text-slate-600">
                      {line.split(":").slice(1).join(":").trim()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ProviderMap location={details.location} name={details.name} />

          {!isVerified && (
            <Link
              href={`/provider/${placeId}/claim`}
              className="block rounded-2xl border border-slate-200 bg-slate-50 p-5 hover:border-teal-400 hover:bg-white transition group"
            >
              <p className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-teal-700">
                Are you the owner?
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Claim this listing to add your services, pricing and photos.
                Verified profiles stand out in search results.
              </p>
              <p className="text-sm font-medium text-teal-700 mt-2 group-hover:underline">
                Claim this listing →
              </p>
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
