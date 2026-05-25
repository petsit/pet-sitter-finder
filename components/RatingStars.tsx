// Big, prominent star rating display — the headline element across the app.

interface Props {
  rating?: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

const sizeMap = {
  sm: { star: "w-3.5 h-3.5", text: "text-xs" },
  md: { star: "w-4 h-4", text: "text-sm" },
  lg: { star: "w-5 h-5", text: "text-base font-semibold" },
};

export default function RatingStars({
  rating,
  count,
  size = "md",
  showNumber = true,
}: Props) {
  if (rating === undefined) {
    return (
      <span className={`${sizeMap[size].text} text-slate-400 italic`}>
        No reviews yet
      </span>
    );
  }

  const full = Math.floor(rating);
  const half = rating - full >= 0.25 && rating - full < 0.75;
  const filled = half ? full : Math.round(rating);
  const showHalf = half;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const isFull = i < filled;
          const isHalf = i === filled && showHalf;
          return (
            <Star
              key={i}
              className={`${sizeMap[size].star} ${
                isFull || isHalf ? "text-amber-400" : "text-slate-200"
              }`}
              half={isHalf}
            />
          );
        })}
      </span>
      {showNumber && (
        <span className={`${sizeMap[size].text} text-slate-900`}>
          {rating.toFixed(1)}
          {count !== undefined && (
            <span className="text-slate-500 font-normal"> ({count})</span>
          )}
        </span>
      )}
    </span>
  );
}

function Star({ className, half }: { className: string; half?: boolean }) {
  if (half) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <defs>
          <linearGradient id="half-grad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        <path
          fill="url(#half-grad)"
          d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}
