// Display helpers for the structured pricing and response-time fields.

const UNIT_LABELS: Record<string, string> = {
  walk: "walk",
  visit: "visit",
  hour: "hour",
  session: "session",
  night: "night",
  day: "day",
  week: "week",
  month: "month",
  job: "job",
  quote: "quote",
};

export function formatPrice(
  priceFrom: number | string | null | undefined,
  unit: string | null | undefined
): string | null {
  if (unit === "quote") return "Price on request";
  if (priceFrom == null || priceFrom === "") return null;
  const n = typeof priceFrom === "string" ? Number(priceFrom) : priceFrom;
  if (!Number.isFinite(n)) return null;
  if (!unit || !UNIT_LABELS[unit]) return `From £${n}`;
  return `From £${n} / ${UNIT_LABELS[unit]}`;
}

const RESPONSE_LABELS: Record<number, string> = {
  1: "Usually responds within an hour",
  4: "Usually responds within a few hours",
  24: "Usually responds within a day",
  48: "Usually responds within 2 days",
  72: "Usually responds within a few days",
};

export function formatResponseTime(
  hours: number | string | null | undefined
): string | null {
  if (hours == null) return null;
  const n = typeof hours === "string" ? Number(hours) : hours;
  if (!Number.isFinite(n) || n <= 0) return null;
  return RESPONSE_LABELS[n] ?? null;
}
