// HERD brand mark. Matches the favicon visually (gradient teal disc +
// amber sun accent + refined H) so the brand feels consistent across
// browser tab, home screen, header, footer, and email.
//
// Inline SVG instead of <img> so the mark scales without rasterising
// and so SSR doesn't ship an extra HTTP request for the header.

interface Props {
  className?: string;
}

export default function HerdMark({ className = "w-8 h-8" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
      role="img"
    >
      <defs>
        <linearGradient id="herd-mark-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="herd-mark-highlight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="herd-mark-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fcd34d" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background disc */}
      <rect width="64" height="64" rx="14" fill="url(#herd-mark-bg)" />
      {/* Subtle top highlight */}
      <rect width="64" height="64" rx="14" fill="url(#herd-mark-highlight)" />
      {/* Amber sun accent in top right */}
      <circle cx="51" cy="13" r="10" fill="url(#herd-mark-sun)" />

      {/* Refined H letterform — proportions scaled from the 512px master */}
      <g fill="#ffffff">
        <rect x="19.5" y="14" width="7" height="36" rx="0.75" />
        <rect x="37.5" y="14" width="7" height="36" rx="0.75" />
        <rect x="19.5" y="28.25" width="25" height="7.5" rx="0.75" />
      </g>
    </svg>
  );
}
