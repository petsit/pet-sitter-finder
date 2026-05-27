"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Couldn't send login email");
      setSent(true);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 mb-3">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Service provider sign in
          </h1>
          <p className="text-slate-600 text-sm">
            We&apos;ll email you a one-tap login link — no password needed.
          </p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-slate-700 mb-2">
              <strong>Check your inbox.</strong>
            </p>
            <p className="text-slate-600 text-sm">
              We sent a sign-in link to <strong>{email}</strong>. Tap it from
              the same device to manage your listings.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              The link is valid for 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Your email
              </label>
              <input
                type="email"
                required
                autoFocus
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
              <p className="text-xs text-slate-500 mt-1">
                Use the email you submitted when claiming your listing.
              </p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-xl transition"
            >
              {busy ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                </>
              ) : (
                "Email me a sign-in link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
