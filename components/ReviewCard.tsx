import { Review } from "@/lib/types";
import RatingStars from "./RatingStars";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <header className="flex items-center gap-3 mb-3">
        {review.authorPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.authorPhoto}
            alt={review.authorName}
            className="w-10 h-10 rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-semibold">
            {review.authorName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-slate-900 truncate">
            {review.authorName}
          </p>
          <p className="text-xs text-slate-500">{review.relativeTime}</p>
        </div>
        <RatingStars rating={review.rating} showNumber={false} size="sm" />
      </header>
      <p className="text-slate-700 whitespace-pre-line leading-relaxed">
        {review.text || <span className="italic text-slate-400">No comment</span>}
      </p>
    </article>
  );
}
