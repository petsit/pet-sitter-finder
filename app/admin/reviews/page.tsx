import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { db } from "@/db";
import { herdReviews } from "@/db/schema";
import { desc } from "drizzle-orm";
import AdminReviewsTable from "@/components/AdminReviewsTable";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  let rows;
  try {
    rows = await db
      .select()
      .from(herdReviews)
      .orderBy(desc(herdReviews.createdAt))
      .limit(200);
  } catch (err: any) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold mb-3">Database not reachable</h1>
        <pre className="text-sm bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto">
          {err?.message ?? "Unknown error"}
        </pre>
      </div>
    );
  }

  const queued = rows.filter((r) => r.status === "verified");
  const pending = rows.filter((r) => r.status === "pending");
  const decided = rows.filter(
    (r) => r.status === "approved" || r.status === "rejected"
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-slate-900">HERD reviews</h1>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/admin" className="text-slate-500 hover:text-slate-900">
            Claims
          </Link>
          <span className="text-slate-700 font-medium">Reviews</span>
          <form action="/api/admin/logout" method="post" className="flex">
            <button
              type="submit"
              className="text-slate-500 hover:text-slate-900"
            >
              Sign out
            </button>
          </form>
        </nav>
      </header>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Awaiting moderation ({queued.length})
        </h2>
        <p className="text-sm text-slate-500 mb-3">
          These reviewers have confirmed their email. Approve or reject before
          publishing.
        </p>
        <AdminReviewsTable rows={queued} kind="queued" />
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Awaiting email verification ({pending.length})
        </h2>
        <p className="text-sm text-slate-500 mb-3">
          The reviewer hasn&apos;t clicked their email confirmation yet.
        </p>
        <AdminReviewsTable rows={pending} kind="pending" />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">
          Decided ({decided.length})
        </h2>
        <AdminReviewsTable rows={decided} kind="decided" />
      </section>
    </div>
  );
}
