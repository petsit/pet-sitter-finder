"use client";

import { useState } from "react";
import { Loader2, Flag, CheckCircle2 } from "lucide-react";

interface Props {
  reviewId: string;
  businessName: string;
}

const REASONS = [
  { value: "", label: "Choose a reason…" },
  { value: "defamatory", label: "Defamatory or untrue" },
  { value: "personal-info", label: "Contains personal information" },
  { value: "spam", label: "Spam or fake review" },
  { value: "off-topic", label: "Off-topic or irrelevant" },
  { value: "offensive", label: "Offensive or hateful language" },
  { value: "conflict", label: "Conflict of interest (competitor, ex-employee)" },
  { value: "other", label: "Something else" },
];

export default function ReportReviewButton({ reviewId, businessName }: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) {
      setError("Please pick a reason.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason,
          details: details.trim() || undefined,
          reporterEmail: reporterEmail.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Couldn't submit the report.");
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message ?? "Couldn't submit the report.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-700">
        <CheckCircle2 className="w-3.5 h-3.5" /> Reported. Thanks — we&apos;ll
        review it.
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600"
        aria-label="Report this review"
      >
        <Flag className="w-3 h-3" /> Report
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm space-y-3"
    >
      <p className="font-medium text-slate-800">
        Report this review of {businessName}
      </p>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          What&apos;s wrong with this review? <span className="text-rose-500">*</span>
        </label>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
        >
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          More detail <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <textarea
          rows={3}
          maxLength={500}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="If there's anything you want us to know — context, evidence, what specifically is wrong — please add it here."
          className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-y"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Your email <span className="text-slate-400 font-normal">(optional, for follow-up)</span>
        </label>
        <input
          type="email"
          value={reporterEmail}
          onChange={(e) => setReporterEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      {error && (
        <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2 py-1.5">
          {error}
        </p>
      )}

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy || !reason}
          className="inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
        >
          {busy ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" /> Sending…
            </>
          ) : (
            "Submit report"
          )}
        </button>
      </div>
    </form>
  );
}
