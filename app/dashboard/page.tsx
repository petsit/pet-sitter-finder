import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionEmail } from "@/lib/auth";
import { db } from "@/db";
import { claims, providerOverrides } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const email = await getSessionEmail();
  if (!email) redirect("/login");

  let rows;
  try {
    rows = await db
      .select({
        placeId: claims.placeId,
        businessName: claims.businessName,
        businessAddress: claims.businessAddress,
        status: claims.status,
        hasOverride: providerOverrides.placeId,
      })
      .from(claims)
      .leftJoin(providerOverrides, eq(claims.placeId, providerOverrides.placeId))
      .where(
        and(eq(claims.claimantEmail, email), eq(claims.status, "approved"))
      );
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold mb-3">Database not reachable</h1>
        <p className="text-slate-600">{err?.message ?? "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Your provider dashboard
          </p>
          <h1 className="text-3xl font-bold text-slate-900">My listings</h1>
          <p className="text-slate-600 text-sm mt-1">Signed in as {email}</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </form>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-700 mb-1 font-medium">
            No approved listings yet
          </p>
          <p className="text-slate-500 text-sm">
            If you&apos;ve submitted a claim, it should appear here once an
            admin approves it. Need help?{" "}
            <a
              href="mailto:hello@petsit.example"
              className="text-teal-700 hover:underline"
            >
              Email us.
            </a>
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.placeId}
              className="rounded-2xl border border-slate-200 bg-white p-5 flex flex-wrap items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{r.businessName}</p>
                {r.businessAddress && (
                  <p className="text-sm text-slate-500 truncate">
                    {r.businessAddress}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/provider/${r.placeId}`}
                  className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
                  target="_blank"
                >
                  View as visitor
                </Link>
                <Link
                  href={`/dashboard/listings/${r.placeId}`}
                  className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-xl"
                >
                  Edit listing →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
