import { BadgeCheck } from "lucide-react";
import RatingStars from "./RatingStars";
import type { HerdReview } from "@/db/schema";

interface Props {
  review: HerdReview;
}

export default function HerdReviewCard({ review }: Props) {
  const dateStr = review.reviewedAt
    ? new Date(review.reviewedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <header className="flex items-start gap-3 mb-3">
        <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
          {review.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-slate-900">{review.authorName}</p>
            <span
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full"
              title="Posted directly on HERD and verified by email"
            >
              <BadgeCheck className="w-3 h-3" /> HERD verified
            </span>
          </div>
          <p className="text-xs text-slate-500">{dateStr}</p>
        </div>
        <RatingStars rating={Number(review.rating)} showNumber={false} size="sm" />
      </header>

      {review.title && (
        <h4 className="font-semibold text-slate-900 mb-1">{review.title}</h4>
      )}

      <p className="text-slate-700 whitespace-pre-line leading-relaxed">
        {review.body}
      </p>

      {review.serviceUsed && (
        <p className="text-xs text-slate-500 mt-3">
          Service used: <strong>{review.serviceUsed}</strong>
        </p>
      )}
    </article>
  );
}
