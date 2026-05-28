"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, X, ExternalLink } from "lucide-react";
import type { Claim } from "@/db/schema";

interface Props {
  rows: Claim[];
  kind: "pending" | "decided";
}

export default function AdminClaimsTable({ rows, kind }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(id: string, status: "approved" | "rejected") {
    setError(null);
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/claims/${id}/decision`, {
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
        No {kind === "pending" ? "pending" : "decided"} claims.
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
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Business</th>
              <th className="text-left px-4 py-3 font-semibold">Claimant</th>
              <th className="text-left px-4 py-3 font-semibold">Submitted</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 align-top">
                  <a
                    href={`/provider/${r.placeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-slate-900 hover:text-teal-700 inline-flex items-center gap-1"
                  >
                    {r.businessName}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {r.businessAddress && (
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {r.businessAddress}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-slate-900">{r.claimantName}</p>
                  <p className="text-xs text-slate-500">{r.claimantRole}</p>
                  <p className="text-xs text-teal-700 mt-0.5">
                    <a href={`mailto:${r.claimantEmail}`} className="hover:underline">
                      {r.claimantEmail}
                    </a>
                  </p>
                  {r.claimantPhone && (
                    <p className="text-xs text-slate-500">{r.claimantPhone}</p>
                  )}
                  {r.message && (
                    <p className="text-xs text-slate-700 mt-1 italic line-clamp-2">
                      “{r.message}”
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-slate-600 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      r.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : r.status === "rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 align-top text-right">
                  {kind === "pending" ? (
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => decide(r.id, "approved")}
                        disabled={busyId === r.id || pending}
                        className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => decide(r.id, "rejected")}
                        disabled={busyId === r.id || pending}
                        className="inline-flex items-center gap-1 bg-white border border-slate-200 hover:border-rose-400 hover:text-rose-700 disabled:opacity-50 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg"
                      >
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-3">
                      <span className="text-xs text-slate-400">
                        {r.reviewedAt
                          ? new Date(r.reviewedAt).toLocaleDateString("en-GB")
                          : ""}
                      </span>
                      {r.status === "approved" && (
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Revoke verification for ${r.businessName}? Their custom content will be deleted and the listing reverts to Google-only data.`
                              )
                            ) {
                              decide(r.id, "rejected");
                            }
                          }}
                          disabled={busyId === r.id || pending}
                          className="inline-flex items-center gap-1 bg-white border border-rose-200 hover:border-rose-400 hover:text-rose-700 disabled:opacity-50 text-rose-600 text-xs font-medium px-3 py-1.5 rounded-lg"
                        >
                          <X className="w-3.5 h-3.5" /> Revoke
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
