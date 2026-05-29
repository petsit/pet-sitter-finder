"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ExternalLink, Star } from "lucide-react";
import type { HerdReview } from "@/db/schema";

interface Props {
  rows: HerdReview[];
  kind: "queued" | "pending" | "decided";
}

export default function AdminReviewsTable({ rows, kind }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(id: string, status: "approved" | "rejected") {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Failed (${res.status})`);
      }
      startTransition(() => router.refresh());
    } catch (e: any) {
      setError(e?.message ?? "Failed");
    } finally {
      setBusyId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">
        No {kind === "queued" ? "queued" : kind === "pending" ? "pending" : "decided"} reviews.
      </p>
    );
  }

  return (
    <>
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <header className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <a
                  href={`/provider/${r.placeId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-slate-900 hover:text-teal-700 inline-flex items-center gap-1 text-sm"
                >
                  {r.businessName}
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-xs text-slate-500 mt-0.5">
                  by <strong>{r.authorName}</strong> ·{" "}
                  <a href={`mailto:${r.authorEmail}`} className="hover:underline">
                    {r.authorEmail}
                  </a>{" "}
                  ·{" "}
                  {new Date(r.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="shrink-0 inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Number(r.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.status === "approved"
                      ? "bg-emerald-100 text-emerald-800"
                      : r.status === "rejected"
                      ? "bg-rose-100 text-rose-800"
                      : r.status === "verified"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            </header>

            {r.title && (
              <p className="font-medium text-slate-900 text-sm mt-2">
                {r.title}
              </p>
            )}
            <p className="text-sm text-slate-700 whitespace-pre-line mt-1">
              {r.body}
            </p>
            {r.serviceUsed && (
              <p className="text-xs text-slate-500 mt-2">
                Service used: <strong>{r.serviceUsed}</strong>
              </p>
            )}

            {kind === "queued" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => decide(r.id, "approved")}
                  disabled={busyId === r.id || pending}
                  className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                >
                  <Check className="w-3.5 h-3.5" /> Approve &amp; publish
                </button>
                <button
                  onClick={() => decide(r.id, "rejected")}
                  disabled={busyId === r.id || pending}
                  className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-rose-400 hover:text-rose-700 disabled:opacity-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            )}
            {kind === "decided" && r.status === "approved" && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Unpublish this review by ${r.authorName}? It will be hidden from the public listing.`
                      )
                    ) {
                      decide(r.id, "rejected");
                    }
                  }}
                  disabled={busyId === r.id || pending}
                  className="inline-flex items-center gap-1 bg-white border border-rose-200 hover:border-rose-400 hover:text-rose-700 disabled:opacity-50 text-rose-600 text-xs font-medium px-3 py-1.5 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" /> Unpublish
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
