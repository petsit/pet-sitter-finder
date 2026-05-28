"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";

interface Props {
  placeId: string;
  businessName: string;
}

export default function ReleaseListingButton({ placeId, businessName }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRelease() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(
        `/api/dashboard/listings/${placeId}/release`,
        { method: "POST" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to release listing");
      router.push("/dashboard");
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Release failed");
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6">
      <header className="flex items-start gap-3 mb-3">
        <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-700 shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">Release this listing</h3>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Stop managing <strong>{businessName}</strong> on HERD. Your
            description, services, pricing and custom photos will be
            permanently deleted. The listing will go back to showing only
            Google data and the Verified badge will disappear.
          </p>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            You can re-claim it any time via the &quot;Are you the
            owner?&quot; button on the public listing.
          </p>
        </div>
      </header>

      {error && (
        <p className="text-sm text-rose-700 bg-rose-100 border border-rose-200 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex items-center justify-center text-sm font-medium text-rose-700 bg-white border border-rose-300 hover:bg-rose-100 hover:border-rose-400 px-4 py-2 rounded-lg"
        >
          Release this listing
        </button>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleRelease}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 px-4 py-2 rounded-lg"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Releasing…
              </>
            ) : (
              "Yes, release this listing"
            )}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={busy}
            className="inline-flex items-center justify-center text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      )}
    </section>
  );
}
