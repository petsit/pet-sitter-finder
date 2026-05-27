import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/db";
import { claims } from "@/db/schema";
import { desc } from "drizzle-orm";
import AdminClaimsTable from "@/components/AdminClaimsTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }

  let rows;
  try {
    rows = await db
      .select()
      .from(claims)
      .orderBy(desc(claims.createdAt))
      .limit(200);
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold mb-3">Database not reachable</h1>
        <pre className="text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto">
          {err?.message ?? "Unknown error"}
        </pre>
        <p className="mt-4 text-slate-600">
          Set <code>DATABASE_URL</code> (and the related Vercel Postgres
          env vars) and redeploy.
        </p>
      </div>
    );
  }

  const pending = rows.filter((r) => r.status === "pending");
  const decided = rows.filter((r) => r.status !== "pending");

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Listing claims</h1>
        </div>
        {/* Form POST (not a Link) so Next.js doesn't prefetch this
            endpoint on page render and accidentally sign the admin out.
            That bug ate hours of debug time — see commit 126e927-ish. */}
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Pending ({pending.length})
        </h2>
        <AdminClaimsTable rows={pending} kind="pending" />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Decided ({decided.length})
        </h2>
        <AdminClaimsTable rows={decided} kind="decided" />
      </section>
    </div>
  );
}
