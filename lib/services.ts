// Service categories shown to users, grouped into Pet / Equine / Farm.
// Each has a slug, label, search query, Lucide icon, emoji (kept as a
// fallback for the LocationPrompt header where a large illustrative
// element looks better than a small line icon), and group key.

import type { LucideIcon } from "lucide-react";
import {
  Dog,
  Home,
  Cat,
  Bed,
  Scissors,
  Sun,
  Car,
  GraduationCap,
  Hammer,
  Stethoscope,
  Warehouse,
  Target,
  Wrench,
  Smile,
  Truck,
  ShowerHead,
  Activity,
  HardHat,
  Tractor,
  Mountain,
  Wheat,
  TreePine,
  Fence,
  Sprout,
  Flower2,
  Shovel,
  BrickWall,
  Bug,
  Footprints,
  PawPrint,
} from "lucide-react";

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
  Icon: LucideIcon;
  group: ServiceGroupKey;
  /**
   * Optional Google Places primary type to bias toward.
   */
  includedType?: string;
  /**
   * Extra types to allow even if they're in the universal blocklist.
   */
  allowTypes?: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  // --- Pet care ---
  { slug: "dog-walker", label: "Dog walkers", query: "professional dog walking service", emoji: "🐕", Icon: Dog, group: "pet" },
  { slug: "pet-sitter", label: "Pet sitters", query: "professional pet sitting service", emoji: "🏠", Icon: Home, group: "pet" },
  { slug: "cattery", label: "Catteries", query: "cattery cat boarding", emoji: "🐈", Icon: Cat, group: "pet" },
  { slug: "dog-boarder", label: "Dog boarders", query: "dog boarding kennels", emoji: "🛏️", Icon: Bed, group: "pet" },
  { slug: "groomer", label: "Pet groomers", query: "dog grooming salon", emoji: "✂️", Icon: Scissors, group: "pet" },
  { slug: "day-care", label: "Doggy day care", query: "doggy day care", emoji: "🎾", Icon: Sun, group: "pet" },
  { slug: "pet-taxi", label: "Pet taxi", query: "pet taxi animal transport", emoji: "🚗", Icon: Car, group: "pet", allowTypes: ["taxi_stand"] },

  // --- Equine services ---
  { slug: "riding-instructor", label: "Riding instructors", query: "horse riding school equestrian lessons", emoji: "🏇", Icon: GraduationCap, group: "equine" },
  { slug: "farrier", label: "Farriers", query: "farrier horseshoeing service", emoji: "🐴", Icon: Hammer, group: "equine" },
  { slug: "equine-vet", label: "Equine vets", query: "equine veterinary practice", emoji: "🩺", Icon: Stethoscope, group: "equine", includedType: "veterinary_care" },
  { slug: "livery-yard", label: "Livery yards", query: "horse livery yard stables", emoji: "🏚️", Icon: Warehouse, group: "equine" },
  { slug: "horse-trainer", label: "Horse trainers", query: "horse training equestrian", emoji: "🎯", Icon: Target, group: "equine" },
  { slug: "saddle-fitter", label: "Saddle fitters", query: "saddle fitter saddlery", emoji: "🪑", Icon: Wrench, group: "equine" },
  { slug: "equine-dentist", label: "Equine dentists", query: "equine dental technician", emoji: "🦷", Icon: Smile, group: "equine" },
  { slug: "horse-transport", label: "Horse transport", query: "horse transport horsebox", emoji: "🚚", Icon: Truck, group: "equine" },
  { slug: "stable-hand", label: "Grooms & stable hands", query: "equestrian groom stable hand", emoji: "🥾", Icon: ShowerHead, group: "equine" },
  { slug: "equine-physio", label: "Equine physios", query: "equine physiotherapy", emoji: "💪", Icon: Activity, group: "equine" },

  // --- Farm & countryside ---
  { slug: "farm-hand", label: "Farm hands", query: "farm hand agricultural worker", emoji: "👨‍🌾", Icon: HardHat, group: "farm" },
  { slug: "ag-contractor", label: "Agricultural contractors", query: "agricultural contractor", emoji: "🚜", Icon: Tractor, group: "farm" },
  { slug: "shepherd", label: "Shepherds", query: "contract shepherd sheep services", emoji: "🐑", Icon: Mountain, group: "farm" },
  { slug: "stockman", label: "Stockmen", query: "stockman cattle livestock services", emoji: "🐄", Icon: Wheat, group: "farm" },
  { slug: "hedge-cutting", label: "Hedge cutting", query: "hedge cutting flailing contractor", emoji: "🌳", Icon: TreePine, group: "farm" },
  { slug: "fencing", label: "Fencing contractors", query: "agricultural fencing contractor", emoji: "🪵", Icon: Fence, group: "farm" },
  { slug: "lambing-help", label: "Lambing help", query: "contract lambing assistant", emoji: "🐏", Icon: Sprout, group: "farm" },
  { slug: "gardener", label: "Gardeners", query: "professional gardening service maintenance", emoji: "🌷", Icon: Flower2, group: "farm" },
  { slug: "landscaper", label: "Landscapers", query: "garden landscaper landscape designer", emoji: "🌿", Icon: Shovel, group: "farm" },
  { slug: "dry-stone-waller", label: "Dry stone wallers", query: "dry stone waller walling repair", emoji: "🧱", Icon: BrickWall, group: "farm" },
  { slug: "pest-control", label: "Pest control", query: "pest control rats wasps moles", emoji: "🐀", Icon: Bug, group: "farm" },
  { slug: "gamekeeper", label: "Gamekeepers", query: "gamekeeper game shoot estate management", emoji: "🦌", Icon: Footprints, group: "farm" },
];

export const DEFAULT_SERVICE = SERVICE_CATEGORIES[0];

export function getServiceBySlug(slug: string | null | undefined): ServiceCategory {
  if (!slug) return DEFAULT_SERVICE;
  return SERVICE_CATEGORIES.find((s) => s.slug === slug) ?? DEFAULT_SERVICE;
}

export function getServicesByGroup(group: ServiceGroupKey): ServiceCategory[] {
  return SERVICE_CATEGORIES.filter((s) => s.group === group);
}

// Re-export PawPrint so existing imports keep working
export { PawPrint };
