"use client";

import { useMemo, useState } from "react";
import {
  Loader2,
  CheckCircle2,
  X,
  Plus,
  Camera,
  PoundSterling,
  Clock,
  Sparkles,
} from "lucide-react";

interface Props {
  placeId: string;
  initial: {
    description: string;
    servicesOffered: string;
    pricingNotes: string;
    customPhotos: string[];
    priceFrom?: number | null;
    priceUnit?: string | null;
    responseTimeHours?: number | null;
  };
  googlePhotos: string[]; // for context; not edited here
}

const MAX_CUSTOM_PHOTOS = 10;

const PRICE_UNITS = [
  { value: "", label: "Choose a unit…" },
  { value: "walk", label: "per walk" },
  { value: "visit", label: "per visit" },
  { value: "hour", label: "per hour" },
  { value: "session", label: "per session" },
  { value: "night", label: "per night" },
  { value: "day", label: "per day" },
  { value: "week", label: "per week" },
  { value: "month", label: "per month" },
  { value: "job", label: "per job" },
  { value: "quote", label: "on request / quote" },
];

const RESPONSE_TIMES = [
  { value: 0, label: "Not specified" },
  { value: 1, label: "Within an hour" },
  { value: 4, label: "Within a few hours" },
  { value: 24, label: "Within a day" },
  { value: 48, label: "Within 2 days" },
  { value: 72, label: "Within a few days" },
];

export default function EditListingForm({ placeId, initial }: Props) {
  const [description, setDescription] = useState(initial.description);
  const [servicesOffered, setServicesOffered] = useState(initial.servicesOffered);
  const [pricingNotes, setPricingNotes] = useState(initial.pricingNotes);
  const [customPhotos, setCustomPhotos] = useState<string[]>(
    initial.customPhotos
  );
  const [priceFrom, setPriceFrom] = useState<string>(
    initial.priceFrom != null ? String(initial.priceFrom) : ""
  );
  const [priceUnit, setPriceUnit] = useState<string>(initial.priceUnit ?? "");
  const [responseTimeHours, setResponseTimeHours] = useState<number>(
    initial.responseTimeHours ?? 0
  );

  const [photoInput, setPhotoInput] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile completeness — counts non-empty fields out of 7 possible.
  const completeness = useMemo(() => {
    const checks = [
      description.trim().length >= 50,
      servicesOffered.trim().length > 0,
      Boolean(priceFrom) && Boolean(priceUnit),
      pricingNotes.trim().length > 0,
      customPhotos.length >= 1,
      customPhotos.length >= 3,
      responseTimeHours > 0,
    ];
    const filled = checks.filter(Boolean).length;
    return { pct: Math.round((filled / checks.length) * 100), filled, total: checks.length };
  }, [
    description,
    servicesOffered,
    priceFrom,
    priceUnit,
    pricingNotes,
    customPhotos,
    responseTimeHours,
  ]);

  function tryAddPhoto() {
    setPhotoError(null);
    const url = photoInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      setPhotoError("Please paste a full URL starting with https://");
      return;
    }
    if (customPhotos.includes(url)) {
      setPhotoError("That photo is already in your list.");
      return;
    }
    if (customPhotos.length >= MAX_CUSTOM_PHOTOS) {
      setPhotoError(`You can add up to ${MAX_CUSTOM_PHOTOS} photos.`);
      return;
    }
    setCustomPhotos([...customPhotos, url]);
    setPhotoInput("");
  }

  function removePhoto(url: string) {
    setCustomPhotos(customPhotos.filter((p) => p !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    setSaved(false);
    try {
      const priceFromNum = priceFrom.trim() ? Number(priceFrom.trim()) : null;
      if (
        priceFromNum !== null &&
        (!Number.isFinite(priceFromNum) || priceFromNum < 0)
      ) {
        throw new Error("Price must be a positive number.");
      }
      const res = await fetch(`/api/dashboard/listings/${placeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          servicesOffered,
          pricingNotes,
          customPhotos,
          priceFrom: priceFromNum,
          priceUnit: priceUnit || null,
          responseTimeHours: responseTimeHours || null,
        }),
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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile completeness bar */}
      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-teal-50 to-white p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" /> Profile completeness
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {completeness.pct === 100
                ? "Excellent — your profile is fully set up."
                : completeness.pct >= 70
                ? "Great progress. Filled-in listings get more bookings."
                : "Customers contact richer profiles 3× more often. Fill in the prompts below."}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-teal-700 leading-none">
              {completeness.pct}%
            </p>
            <p className="text-xs text-slate-500">{completeness.filled}/{completeness.total} done</p>
          </div>
        </div>
        <div className="h-2 w-full bg-white rounded-full overflow-hidden ring-1 ring-slate-200">
          <div
            className="h-full bg-teal-500 transition-all"
            style={{ width: `${completeness.pct}%` }}
          />
        </div>
      </section>

      {/* Pricing & response time */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        <header>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <PoundSterling className="w-4 h-4 text-teal-600" /> Pricing &amp; responsiveness
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Customers heavily favour providers who publish a starting price and
            respond quickly. Both appear right on your card in search results.
          </p>
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Starting price <span className="text-slate-400 font-normal">(£)</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                £
              </span>
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                placeholder="15"
                className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Shown as &ldquo;From £X / [unit]&rdquo;.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Price unit
            </label>
            <select
              value={priceUnit}
              onChange={(e) => setPriceUnit(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
            >
              {PRICE_UNITS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            <Clock className="w-3.5 h-3.5 inline -mt-0.5 text-slate-500" />{" "}
            Typical response time
          </label>
          <select
            value={responseTimeHours}
            onChange={(e) => setResponseTimeHours(Number(e.target.value))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
          >
            {RESPONSE_TIMES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            How quickly do you usually reply to enquiries during normal hours?
            Be honest — customers value reliability over speed.
          </p>
        </div>
      </section>

      {/* Custom photos */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-teal-600" /> Your photos
          </h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Add photos from your own website, Facebook, or Instagram by
            pasting their URLs. These show first on your listing, before
            Google&apos;s photos. Up to {MAX_CUSTOM_PHOTOS}.
          </p>
          {customPhotos.length === 0 && (
            <p className="text-xs text-teal-700 mt-2 font-medium">
              💡 Profiles with at least 3 photos get viewed twice as often.
            </p>
          )}
        </header>

        {customPhotos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
            {customPhotos.map((url) => (
              <div
                key={url}
                className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "0.3";
                  }}
                />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute top-1 right-1 w-6 h-6 inline-flex items-center justify-center bg-white/95 hover:bg-white rounded-full shadow text-slate-700 hover:text-rose-600"
                  aria-label="Remove photo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={photoInput}
            onChange={(e) => setPhotoInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                tryAddPhoto();
              }
            }}
            placeholder="https://example.com/path/to/photo.jpg"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
          <button
            type="button"
            onClick={tryAddPhoto}
            disabled={!photoInput.trim() || customPhotos.length >= MAX_CUSTOM_PHOTOS}
            className="inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add photo
          </button>
        </div>

        {photoError && (
          <p className="mt-2 text-sm text-rose-600">{photoError}</p>
        )}
      </section>

      {/* Text content */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        <header>
          <h2 className="text-lg font-semibold text-slate-900">
            About your business
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            What customers see on your listing in addition to your Google
            reviews. Leave any field blank to hide that section.
          </p>
        </header>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
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
            {description.length < 50 && description.length > 0 && (
              <span className="text-amber-700">
                {" "}
                · Aim for 50+ characters — customers skim short descriptions.
              </span>
            )}
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
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Pricing detail{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={pricingNotes}
            onChange={(e) => setPricingNotes(e.target.value)}
            maxLength={500}
            placeholder={
              "Detail beyond the headline 'From £X / [unit]' above — e.g. multi-dog discount, holiday surcharges, free meet-and-greet."
            }
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 resize-y"
          />
        </div>
      </section>

      {/* Save controls */}
      <div className="sticky bottom-4 z-10 bg-white/95 backdrop-blur border border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
        <div className="text-sm">
          {error && <span className="text-rose-600">{error}</span>}
          {saved && !error && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Saved. Live on your listing.
            </span>
          )}
          {!error && !saved && (
            <span className="text-slate-500">
              Changes appear on your public listing the moment you save.
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl transition"
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
