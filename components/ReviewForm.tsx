"use client";

import { useState } from "react";
import { Loader2, Star, CheckCircle2 } from "lucide-react";

interface Props {
  placeId: string;
  businessName: string;
}

export default function ReviewForm({ placeId, businessName }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceUsed, setServiceUsed] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating < 1) {
      setError("Please pick a star rating.");
      return;
    }
    if (body.trim().length < 20) {
      setError("Please write at least 20 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placeId,
          businessName,
          authorName: name.trim(),
          authorEmail: email.trim(),
          rating,
          title: title.trim() || undefined,
          body: body.trim(),
          serviceUsed: serviceUsed.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Couldn't submit your review");
      setSubmitted(true);
    } catch (e: any) {
      setError(e?.message ?? "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-900 mb-1">
          Check your inbox
        </h3>
        <p className="text-slate-600 max-w-md mx-auto">
          We&apos;ve emailed <strong>{email}</strong> with a link to confirm
          your review. Once you confirm, we&apos;ll publish it within 2
          working days.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="text-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-medium px-5 py-2.5 rounded-xl"
        >
          <Star className="w-4 h-4" /> Write a review
        </button>
        <p className="text-xs text-slate-500 mt-2">
          Reviews are verified by email and checked for spam before publishing.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
    >
      <header className="mb-2">
        <h3 className="text-lg font-semibold text-slate-900">
          Review {businessName}
        </h3>
        <p className="text-sm text-slate-500">
          Your honest experience helps other customers choose.
        </p>
      </header>

      {/* Stars */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your rating <span className="text-rose-500">*</span>
        </label>
        <div
          className="inline-flex gap-1"
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hoverRating || rating) >= n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                className="p-1"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
              >
                <Star
                  className={`w-7 h-7 transition ${
                    active
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Short headline <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          maxLength={80}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Friendly, reliable and great with my dog"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Your review <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          rows={5}
          minLength={20}
          maxLength={2000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tell other customers what your experience was like. What service did you use? How did the provider compare to expectations?"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-y"
        />
        <p className="text-xs text-slate-500 mt-1">
          {body.length}/2000 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Service you used <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          maxLength={120}
          value={serviceUsed}
          onChange={(e) => setServiceUsed(e.target.value)}
          placeholder="e.g. Weekly dog walks, holiday boarding, hoof trim"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          <p className="text-xs text-slate-500 mt-1">Shown publicly.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Your email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          <p className="text-xs text-slate-500 mt-1">
            Private — used to verify it&apos;s really you.
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <p className="text-xs text-slate-500 max-w-sm">
          By submitting you agree to our community guidelines: honest, factual,
          no personal attacks. We&apos;ll check before publishing.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl"
          >
            {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
              </>
            ) : (
              "Submit for review"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
