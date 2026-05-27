"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, X, Plus, Camera } from "lucide-react";

interface Props {
  placeId: string;
  initial: {
    description: string;
    servicesOffered: string;
    pricingNotes: string;
    customPhotos: string[];
  };
  googlePhotos: string[]; // for context; not edited here
}

const MAX_CUSTOM_PHOTOS = 10;

export default function EditListingForm({ placeId, initial }: Props) {
  const [description, setDescription] = useState(initial.description);
  const [servicesOffered, setServicesOffered] = useState(
    initial.servicesOffered
  );
  const [pricingNotes, setPricingNotes] = useState(initial.pricingNotes);
  const [customPhotos, setCustomPhotos] = useState<string[]>(
    initial.customPhotos
  );
  const [photoInput, setPhotoInput] = useState("");
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch(`/api/dashboard/listings/${placeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          servicesOffered,
          pricingNotes,
          customPhotos,
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
      {/* Custom photos */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <header className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Camera className="w-4 h-4 text-teal-600" /> Your photos
          </h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Add photos from your own website, Facebook, or Instagram by
            pasting their URLs. These show first on your listing, before
            the photos Google has. Up to {MAX_CUSTOM_PHOTOS}.
          </p>
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
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          Tip: right-click a photo on your own website or social profile,
          choose &quot;Copy image address&quot;, and paste it here. Don&apos;t
          link to a page — the URL should end in <code>.jpg</code>,{" "}
          <code>.png</code> or <code>.webp</code>.
        </p>
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
            Pricing notes{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={pricingNotes}
            onChange={(e) => setPricingNotes(e.target.value)}
            maxLength={500}
            placeholder={
              "e.g. Dog walks from £15/hour. Discounts for regular bookings."
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
