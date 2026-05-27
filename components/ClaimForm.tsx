"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

interface Props {
  placeId: string;
  businessName: string;
  businessAddress?: string;
}

const ROLES = [
  "Owner",
  "Manager",
  "Employee",
  "Marketing / agency on their behalf",
  "Other",
];

export default function ClaimForm({
  placeId,
  businessName,
  businessAddress,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      placeId,
      businessName,
      businessAddress,
      claimantName: String(data.get("name") ?? "").trim(),
      claimantRole: String(data.get("role") ?? "").trim(),
      claimantEmail: String(data.get("email") ?? "").trim(),
      claimantPhone: String(data.get("phone") ?? "").trim() || undefined,
      message: String(data.get("message") ?? "").trim() || undefined,
    };

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit");
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          Thanks — we&apos;ve got it
        </h2>
        <p className="text-slate-600 max-w-md mx-auto">
          We&apos;ll review your claim and get in touch within 2 working
          days at the email address you provided.
        </p>
        <a
          href={`/provider/${placeId}`}
          className="inline-block mt-4 text-teal-700 font-medium hover:underline"
        >
          ← Back to listing
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Your name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Your role at {businessName} <span className="text-red-500">*</span>
        </label>
        <select
          name="role"
          required
          defaultValue=""
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
        >
          <option value="" disabled>
            Select…
          </option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="07…"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Anything you&apos;d like us to know?{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="e.g. We've recently rebranded and the photos are out of date; we'd like to add our prices and a longer description."
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-y"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500 max-w-sm">
          By submitting you agree we may contact you about this listing.
          We&apos;ll never share your details with third parties.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl transition"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
            </>
          ) : (
            "Submit claim"
          )}
        </button>
      </div>
    </form>
  );
}
