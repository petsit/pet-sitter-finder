import Link from "next/link";
import {
  BadgeCheck,
  Check,
  Star,
  Sparkles,
  Search,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "Pricing — HERD",
  description:
    "Free for every UK pet, equine and rural pro. Optional Pro and Featured tiers unlock verified trust signals and priority placement.",
};

const TIERS = [
  {
    name: "Listed",
    tagline: "Every UK business already has this",
    monthly: 0,
    annual: 0,
    cta: { label: "Already done — for everyone", href: "/" },
    ctaStyle: "muted",
    features: [
      "Your business auto-imported from Google",
      "Customers can find you in postcode-based search",
      "Google rating, address, phone number visible",
      "Linked to your website",
    ],
    icon: Search,
    accent: "slate",
    available: true,
    badge: null,
  },
  {
    name: "Verified",
    tagline: "Owner-managed, free forever",
    monthly: 0,
    annual: 0,
    cta: { label: "Claim your listing", href: "/find" },
    ctaStyle: "primary",
    features: [
      "Everything in Listed",
      "Verified by owner badge next to your rating",
      "Custom About, Services and Pricing text",
      "Up to 10 photos (URL paste)",
      "Manage from your dashboard at any time",
      "Free for life — no card required",
    ],
    icon: BadgeCheck,
    accent: "teal",
    available: true,
    badge: "Recommended",
  },
  {
    name: "Pro",
    tagline: "Trust signals customers actually look for",
    monthly: 12,
    annual: 120,
    cta: { label: "Coming soon — claim a free listing first", href: "/find" },
    ctaStyle: "outline",
    features: [
      "Everything in Verified",
      "Insurance certificate uploaded and verified",
      "DBS check verified (where applicable)",
      "Gold Pro badge — stands out in search",
      "Above all free listings in results",
      "Up to 25 photos with real file upload",
      "Listing analytics — views, calls, contact clicks",
      "Email notifications when someone contacts you",
      "Quote request form (vs. just phone)",
      "Cover up to 3 service areas",
      "Priority email support (48h response)",
    ],
    icon: Star,
    accent: "amber",
    available: false,
    badge: "Coming Q2 2026",
  },
  {
    name: "Featured",
    tagline: "Top of search, every relevant local query",
    monthly: 35,
    annual: 350,
    cta: { label: "Coming soon", href: "/find" },
    ctaStyle: "outline",
    features: [
      "Everything in Pro",
      "Top placement in every relevant search",
      "Highlighted card design — bigger photos, teal border",
      "Featured this week carousel on the home page",
      "Vanity URL: joinherd.uk/your-business",
      "Unlimited photos and service areas",
      "Monthly social media spot on HERD's accounts",
      "Inclusion in customer email newsletter",
      "Priority support (24h response)",
    ],
    icon: Sparkles,
    accent: "violet",
    available: false,
    badge: "Coming Q3 2026",
  },
];

const ACCENT_STYLES: Record<
  string,
  { iconBg: string; iconText: string; cardRing: string; badge: string }
> = {
  slate: {
    iconBg: "bg-slate-100",
    iconText: "text-slate-700",
    cardRing: "ring-slate-200",
    badge: "bg-slate-100 text-slate-700",
  },
  teal: {
    iconBg: "bg-teal-100",
    iconText: "text-teal-700",
    cardRing: "ring-teal-500",
    badge: "bg-teal-600 text-white",
  },
  amber: {
    iconBg: "bg-amber-100",
    iconText: "text-amber-700",
    cardRing: "ring-slate-200",
    badge: "bg-amber-100 text-amber-800",
  },
  violet: {
    iconBg: "bg-violet-100",
    iconText: "text-violet-700",
    cardRing: "ring-slate-200",
    badge: "bg-violet-100 text-violet-800",
  },
};

const COMPARISON = [
  { feature: "Curated to pet, equine & rural — no clutter", herd: true, google: false },
  { feature: "Owner-verified About, services and pricing", herd: true, google: "Partial" },
  { feature: "Insurance certificate verified (Pro+)", herd: true, google: false },
  { feature: "DBS check verified (Pro+)", herd: true, google: false },
  { feature: "Filter by min rating, min reviews, has website", herd: true, google: "Limited" },
  { feature: "Strict distance radius enforced", herd: true, google: false },
  { feature: "No paid Google Ads above results", herd: true, google: false },
  { feature: "Multi-category search (e.g. all rural services near me)", herd: true, google: false },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-teal-50/60 via-white to-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-3">
            Pricing
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Free to start. Cheaper than Google Ads when you upgrade.
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Every UK pet, equine and rural business is already on HERD —
            auto-imported from Google. Claim yours free. Upgrade only when
            you want to stand out.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            Annual plans save ~17%. Cancel any time. No setup fees.
          </p>
        </div>
      </section>

      {/* Tier cards */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TIERS.map((tier) => {
            const acc = ACCENT_STYLES[tier.accent];
            const recommended = tier.badge === "Recommended";
            return (
              <div
                key={tier.name}
                className={`relative rounded-2xl bg-white p-6 ring-1 ${
                  recommended ? "ring-2 ring-teal-500 shadow-lg" : acc.cardRing
                }`}
              >
                {tier.badge && (
                  <span
                    className={`absolute -top-3 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${acc.badge}`}
                  >
                    {tier.badge}
                  </span>
                )}
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${acc.iconBg} ${acc.iconText} mb-3`}
                >
                  <tier.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {tier.name}
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{tier.tagline}</p>

                <div className="mt-5 mb-5">
                  {tier.monthly === 0 ? (
                    <p className="text-3xl font-bold text-slate-900">Free</p>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-slate-900">
                        £{tier.monthly}
                        <span className="text-base font-normal text-slate-500">
                          /mo
                        </span>
                      </p>
                      <p className="text-sm text-slate-500">
                        or £{tier.annual}/year
                      </p>
                    </>
                  )}
                </div>

                <Link
                  href={tier.cta.href}
                  className={`block w-full text-center font-medium px-4 py-2.5 rounded-xl transition ${
                    tier.ctaStyle === "primary"
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : tier.ctaStyle === "outline"
                      ? "border border-slate-200 hover:border-slate-300 text-slate-700"
                      : "bg-slate-100 text-slate-500 cursor-default"
                  }`}
                >
                  {tier.cta.label}
                </Link>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          tier.available ? "text-teal-600" : "text-slate-400"
                        }`}
                      />
                      <span className="text-slate-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8 max-w-2xl mx-auto">
          <Lock className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
          <strong>Launch lock-in:</strong> anyone who upgrades to Pro or
          Featured during launch year keeps that price for as long as they
          stay subscribed. Future customers will pay more.
        </p>
      </section>

      {/* Why HERD vs Google */}
      <section className="bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
              Why HERD
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              What HERD gives customers that Google can&apos;t
            </h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Feature</th>
                  <th className="text-center px-5 py-3 font-semibold w-32">
                    HERD
                  </th>
                  <th className="text-center px-5 py-3 font-semibold w-32">
                    Google Maps
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-5 py-3 text-slate-800">{row.feature}</td>
                    <td className="px-5 py-3 text-center">
                      <Check className="w-5 h-5 text-teal-600 inline" />
                    </td>
                    <td className="px-5 py-3 text-center text-slate-500">
                      {row.google === true ? (
                        <Check className="w-5 h-5 text-slate-400 inline" />
                      ) : row.google === false ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        <span className="text-xs italic">{row.google}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-slate-500 mt-6 max-w-2xl mx-auto">
            HERD doesn&apos;t compete with Google Maps — it complements it.
            Your Google reviews still show. We just surface them inside a
            directory that&apos;s curated for animal services and lets you
            show customers what Google can&apos;t.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 mb-8 text-center">
          Common questions
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "What if my business isn't on Google Maps yet?",
              a: "Add it to Google Business Profile first (free, takes 5 minutes) — it'll appear on HERD automatically within a couple of days. HERD is read-only on top of Google's data, so we don't have a separate registration.",
            },
            {
              q: "Will my Google reviews still show on my HERD listing?",
              a: "Yes — every HERD listing shows your live Google reviews and rating. You don't lose them when you claim or upgrade. Pro and Featured providers also get verified trust signals on top.",
            },
            {
              q: "Can I cancel any time?",
              a: "Yes. Subscriptions are monthly or annual, no minimum term. If you cancel a paid plan, you drop back to the free Verified tier and keep your owner-managed content.",
            },
            {
              q: "Do you charge commission on bookings?",
              a: "No. HERD is a directory, not a booking platform. Customers contact you directly via phone, website or your custom quote form. You keep 100% of every booking.",
            },
            {
              q: "Is the launch lock-in price guarantee real?",
              a: "Yes. If you subscribe to Pro or Featured during launch year, you keep that monthly/annual price for as long as you stay subscribed — even if we raise prices for new customers later.",
            },
            {
              q: "What does 'verified insurance' actually mean?",
              a: "When you upgrade to Pro, you upload your liability insurance certificate. We manually check it's valid and current, then your listing shows an Insured badge. We re-verify annually.",
            },
          ].map((item) => (
            <div
              key={item.q}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <h3 className="font-semibold text-slate-900 mb-1">{item.q}</h3>
              <p className="text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-white to-teal-50/60 border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Ready to claim your free listing?
          </h2>
          <p className="text-slate-600 mt-3 max-w-xl mx-auto leading-relaxed">
            Takes 2 minutes. No card, no contract. Upgrade later only if
            you want to stand out.
          </p>
          <Link
            href="/find"
            className="inline-flex items-center justify-center gap-2 mt-6 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-xl"
          >
            <Search className="w-4 h-4" /> Find and claim your business
          </Link>
        </div>
      </section>
    </>
  );
}
