import Link from "next/link";
import { Provider, LatLng } from "@/lib/types";
import { haversineMiles } from "@/lib/places";
import RatingStars from "./RatingStars";
import { placePhotoUrl } from "@/lib/places";
import { Phone, Globe, MapPin, PawPrint, BadgeCheck, Clock } from "lucide-react";
import { formatPrice, formatResponseTime } from "@/lib/formatting";

interface Props {
  provider: Provider;
  origin: LatLng;
  rank?: number;
}

export default function ProviderCard({ provider, origin, rank }: Props) {
  const distMiles = haversineMiles(origin, provider.location);

  return (
    <article
      className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md hover:border-teal-300 transition group"
      data-place-id={provider.id}
    >
      <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
        {provider.photoRef ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={placePhotoUrl(provider.photoRef, 400)}
            alt={provider.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <PawPrint className="w-10 h-10 text-slate-300" aria-hidden />
        )}
        {rank !== undefined && rank <= 3 && (
          <span className="absolute top-1.5 left-1.5 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full">
            #{rank}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-slate-900 truncate group-hover:text-teal-700">
              <Link href={`/provider/${provider.id}`} className="hover:underline">
                {provider.name}
              </Link>
            </h3>
            {provider.isVerified && (
              <span
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full shrink-0"
                title="The owner has claimed and verified this listing"
              >
                <BadgeCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
          <span className="shrink-0 text-sm text-slate-500">
            {distMiles.toFixed(1)} mi
          </span>
        </div>

        <div className="mt-1">
          <RatingStars
            rating={provider.rating}
            count={provider.reviewCount}
            size="lg"
          />
        </div>

        {/* Pricing + response time — only shown for claimed providers */}
        {(() => {
          const priceLabel = formatPrice(provider.priceFrom, provider.priceUnit);
          const responseLabel = formatResponseTime(provider.responseTimeHours);
          if (!priceLabel && !responseLabel) return null;
          return (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              {priceLabel && (
                <span className="font-semibold text-slate-900">{priceLabel}</span>
              )}
              {responseLabel && (
                <span className="inline-flex items-center gap-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5" /> {responseLabel}
                </span>
              )}
            </div>
          );
        })()}

        <p className="mt-1 flex items-start gap-1 text-sm text-slate-600 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {provider.address}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {provider.openNow !== undefined && (
            <span
              className={`inline-flex items-center gap-1 ${
                provider.openNow ? "text-emerald-700" : "text-slate-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  provider.openNow ? "bg-emerald-500" : "bg-slate-400"
                }`}
              />
              {provider.openNow ? "Open now" : "Closed now"}
            </span>
          )}
          {provider.phone && (
            <a
              href={`tel:${provider.phone}`}
              className="inline-flex items-center gap-1 text-teal-700 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
          )}
          {provider.website && (
            <a
              href={provider.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-teal-700 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-3.5 h-3.5" /> Website
            </a>
          )}
          <Link
            href={`/provider/${provider.id}`}
            className="ml-auto inline-flex items-center text-teal-700 hover:underline font-medium"
          >
            View profile →
          </Link>
        </div>
      </div>
    </article>
  );
}
