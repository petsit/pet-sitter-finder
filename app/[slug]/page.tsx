import { notFound } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Search } from "lucide-react";
import {
  SERVICE_CATEGORIES,
  type ServiceCategory,
} from "@/lib/services";
import { getTownBySlug, UK_TOWNS, type UkTown } from "@/lib/uk-towns";
import { searchPlaces } from "@/lib/places";
import { getProviderEnrichmentMap } from "@/lib/overrides";
import SearchResultsClient from "@/components/SearchResultsClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

function parseSlug(
  slug: string
): { service: ServiceCategory; town: UkTown } | null {
  // Slugs look like `dog-walkers-in-holmfirth` — split on the last `-in-`
  // so multi-hyphen towns (chipping-norton, market-harborough) work too.
  const marker = "-in-";
  // We want the LAST occurrence so a town like "stoke-on-trent" doesn't
  // confuse the parser. But the service-slug itself can contain hyphens,
  // and so can the town. Strategy: walk candidates, pick the one where
  // both sides are valid.
  let idx = slug.indexOf(marker);
  while (idx !== -1) {
    const serviceSlug = slug.slice(0, idx);
    const townSlug = slug.slice(idx + marker.length);
    const svc = SERVICE_CATEGORIES.find((s) => s.slug === serviceSlug);
    const town = getTownBySlug(townSlug);
    if (svc && town) return { service: svc, town };
    idx = slug.indexOf(marker, idx + 1);
  }
  return null;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Not found — HERD" };
  const { service, town } = parsed;
  const label = service.label.toLowerCase();
  return {
    title: `${service.label} in ${town.name} | HERD`,
    description: `Find local ${label} in ${town.name}, ${town.county}. Verified profiles, owner-managed listings and real Google reviews — all in one curated directory.`,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: `${service.label} in ${town.name} | HERD`,
      description: `Local ${label} in ${town.name}, ${town.county} — rated, verified and easy to contact.`,
      type: "website",
    },
  };
}

export default async function ProgrammaticSeoPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const { service, town } = parsed;
  const radiusMiles = 10;
  const radiusMeters = Math.round(radiusMiles * 1609.344);

  // Pull results with the existing search pipeline — same filters, same
  // relevance blocklist, same verified enrichment.
  let providers;
  try {
    providers = await searchPlaces({
      service: service.query,
      serviceSlug: service.slug,
      includedType: service.includedType,
      allowTypes: service.allowTypes,
      lat: town.lat,
      lng: town.lng,
      radiusMeters,
    });
    const enrichment = await getProviderEnrichmentMap(
      providers.map((p) => p.id)
    );
    providers = providers.map((p) => {
      const e = enrichment.get(p.id);
      if (!e) return { ...p, isVerified: false };
      return {
        ...p,
        isVerified: e.isVerified,
        priceFrom: e.priceFrom,
        priceUnit: e.priceUnit,
        responseTimeHours: e.responseTimeHours,
      };
    });
  } catch (err) {
    console.error("[seo-page] search failed:", err);
    providers = [];
  }

  const label = service.label.toLowerCase();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* SEO-rich intro section */}
      <header className="max-w-3xl mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
          {town.name} · {town.county}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {service.label} in {town.name}
        </h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          {providers.length === 0
            ? `No ${label} are showing on HERD within 10 miles of ${town.name} at the moment. Try widening the radius below or browsing nearby towns.`
            : `Find ${providers.length} local ${label} within 10 miles of ${town.name}, ${town.county}. Compare star ratings, opening hours, and contact details — and see verified profiles where the owner has added their services and pricing directly.`}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/search?location=${encodeURIComponent(town.name)}&service=${service.slug}&radius=15`}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-4 py-2 rounded-xl text-sm"
          >
            <Search className="w-4 h-4" /> Open full search
          </Link>
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 underline"
          >
            Search a different area
          </Link>
        </div>
      </header>

      <Suspense fallback={<div className="p-8 text-center">Loading…</div>}>
        <SearchResultsClient
          origin={{ lat: town.lat, lng: town.lng }}
          originLabel={`${town.name}, ${town.county}`}
          initialProviders={providers}
          initialService={service.slug}
          initialRadius={radiusMiles}
        />
      </Suspense>

      {/* SEO outro: related links to other services in same town + same service in nearby towns */}
      <aside className="mt-12 grid sm:grid-cols-2 gap-6 text-sm">
        <div>
          <h2 className="font-semibold text-slate-900 mb-3">
            Other services in {town.name}
          </h2>
          <ul className="space-y-1.5">
            {SERVICE_CATEGORIES.filter((s) => s.slug !== service.slug)
              .slice(0, 6)
              .map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/${s.slug}-in-${town.slug}`}
                    className="text-teal-700 hover:underline"
                  >
                    {s.label} in {town.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 mb-3">
            {service.label} in nearby areas
          </h2>
          <ul className="space-y-1.5">
            {getNearbyTowns(town, 6).map((nearby) => (
              <li key={nearby.slug}>
                <Link
                  href={`/${service.slug}-in-${nearby.slug}`}
                  className="text-teal-700 hover:underline"
                >
                  {service.label} in {nearby.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

// Cheap proximity sort — sorted-by-nearest list of towns, excluding the
// origin.  We use a typed local interface so the distance field doesn't
// leak into the UkTown return type (which caused the prod build to fail).
interface NearbyEntry {
  slug: string;
  name: string;
  county: string;
  distance: number;
}

function getNearbyTowns(origin: UkTown, limit: number): NearbyEntry[] {
  const out: NearbyEntry[] = [];
  for (const t of UK_TOWNS) {
    if (t.slug === origin.slug) continue;
    out.push({
      slug: t.slug,
      name: t.name,
      county: t.county,
      distance: Math.hypot(t.lat - origin.lat, t.lng - origin.lng),
    });
  }
  out.sort((a, b) => a.distance - b.distance);
  return out.slice(0, limit);
}
