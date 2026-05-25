// Service categories shown to users, grouped into Pet / Equine / Farm.
// Each has a slug, label, search query, emoji, and group key.

export type ServiceGroupKey = "pet" | "equine" | "farm";

export interface ServiceGroup {
  key: ServiceGroupKey;
  label: string;
  emoji: string;
  blurb: string;
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    key: "pet",
    label: "Pet care",
    emoji: "🐾",
    blurb: "Pet sitters, dog walkers, catteries and groomers near you",
  },
  {
    key: "equine",
    label: "Equine services",
    emoji: "🐎",
    blurb: "Farriers, instructors, livery, vets and equine specialists",
  },
  {
    key: "farm",
    label: "Farm & countryside",
    emoji: "🚜",
    blurb: "Farm hands, agricultural contractors and rural trades",
  },
];

export interface ServiceCategory {
  slug: string;
  label: string;
  query: string;
  emoji: string;
  group: ServiceGroupKey;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // --- Pet care ---
  { slug: "dog-walker", label: "Dog walkers", query: "dog walker", emoji: "🐕", group: "pet" },
  { slug: "pet-sitter", label: "Pet sitters", query: "pet sitter", emoji: "🏠", group: "pet" },
  { slug: "cattery", label: "Catteries", query: "cattery", emoji: "🐈", group: "pet" },
  { slug: "dog-boarder", label: "Dog boarders", query: "dog boarding kennels", emoji: "🛏️", group: "pet" },
  { slug: "groomer", label: "Pet groomers", query: "pet groomer", emoji: "✂️", group: "pet" },
  { slug: "day-care", label: "Doggy day care", query: "doggy day care", emoji: "🎾", group: "pet" },
  { slug: "pet-taxi", label: "Pet taxi", query: "pet taxi", emoji: "🚗", group: "pet" },

  // --- Equine services ---
  { slug: "riding-instructor", label: "Riding instructors", query: "horse riding instructor", emoji: "🏇", group: "equine" },
  { slug: "farrier", label: "Farriers", query: "farrier", emoji: "🐴", group: "equine" },
  { slug: "equine-vet", label: "Equine vets", query: "equine vet", emoji: "🩺", group: "equine" },
  { slug: "livery-yard", label: "Livery yards", query: "livery yard", emoji: "🏚️", group: "equine" },
  { slug: "horse-trainer", label: "Horse trainers", query: "horse trainer", emoji: "🎯", group: "equine" },
  { slug: "saddle-fitter", label: "Saddle fitters", query: "saddle fitter", emoji: "🪑", group: "equine" },
  { slug: "equine-dentist", label: "Equine dentists", query: "equine dentist", emoji: "🦷", group: "equine" },
  { slug: "horse-transport", label: "Horse transport", query: "horse transport", emoji: "🚚", group: "equine" },
  { slug: "stable-hand", label: "Grooms & stable hands", query: "equestrian groom stable hand", emoji: "🥾", group: "equine" },
  { slug: "equine-physio", label: "Equine physios", query: "equine physiotherapy", emoji: "💪", group: "equine" },

  // --- Farm & countryside ---
  { slug: "farm-hand", label: "Farm hands", query: "farm hand", emoji: "👨‍🌾", group: "farm" },
  { slug: "ag-contractor", label: "Agricultural contractors", query: "agricultural contractor", emoji: "🚜", group: "farm" },
  { slug: "shepherd", label: "Shepherds", query: "shepherd contract sheep services", emoji: "🐑", group: "farm" },
  { slug: "stockman", label: "Stockmen", query: "stockman cattle livestock services", emoji: "🐄", group: "farm" },
  { slug: "hedge-cutting", label: "Hedge cutting", query: "hedge cutting contractor", emoji: "🌳", group: "farm" },
  { slug: "fencing", label: "Fencing contractors", query: "agricultural fencing contractor", emoji: "🪵", group: "farm" },
  { slug: "lambing-help", label: "Lambing help", query: "lambing contract help", emoji: "🐏", group: "farm" },
];

export const DEFAULT_SERVICE = SERVICE_CATEGORIES[0];

export function getServiceBySlug(slug: string | null | undefined): ServiceCategory {
  if (!slug) return DEFAULT_SERVICE;
  return SERVICE_CATEGORIES.find((s) => s.slug === slug) ?? DEFAULT_SERVICE;
}

export function getServicesByGroup(group: ServiceGroupKey): ServiceCategory[] {
  return SERVICE_CATEGORIES.filter((s) => s.group === group);
}
