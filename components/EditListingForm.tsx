"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  placeId: string;
  initial: {
    description: string;
    servicesOffered: string;
    pricingNotes: string;
  };
}

export default function EditListingForm({ placeId, initial }: Props) {
  const [description, setDescription] = useState(initial.description);
  const [servicesOffered, setServicesOffered] = useState(initial.servicesOffered);
  const [pricingNotes, setPricingNotes] = useState(initial.pricingNotes);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/dashboard/listings/${placeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, servicesOffered, pricingNotes }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setSaved(true);
    } catch (e: any) {
      setError(e?.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          About your business
        </label>
        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1500}
          placeholder="Tell potential customers about your business — what makes you different, how long you've been doing this, what areas you cover…"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-y"
        />
        <p className="text-xs text-slate-500 mt-1">
          {description.length}/1500 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Services you offer
        </label>
        <textarea
          rows={4}
          value={servicesOffered}
          onChange={(e) => setServicesOffered(e.target.value)}
          maxLength={800}
          placeholder={
            "e.g.\n• 30-minute dog walks\n• Pop-in visits for cats\n• Overnight pet sitting in your home"
          }
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-y font-sans"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Pricing notes{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          value={pricingNotes}
          onChange={(e) => setPricingNotes(e.target.value)}
          maxLength={500}
          placeholder={"e.g. Dog walks from £15/hour. Discounts for regular bookings."}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-y"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {saved && !busy && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4" /> Saved. Visitors will see the
          updates immediately.
        </div>
      )}

      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl transition"
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving…
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}
