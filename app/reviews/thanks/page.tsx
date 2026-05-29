import Link from "next/link";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function ReviewThanksPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = sp.status ?? "ok";

  const states: Record<
    string,
    { icon: any; tint: string; title: string; body: string }
  > = {
    ok: {
      icon: CheckCircle2,
      tint: "text-emerald-600 bg-emerald-50",
      title: "Review confirmed",
      body:
        "Thanks for confirming your review. An admin will check it for spam and abuse, then publish it on the listing — usually within 2 working days. We'll email you the link once it's live.",
    },
    expired: {
      icon: Clock,
      tint: "text-amber-600 bg-amber-50",
      title: "This confirmation link has expired",
      body:
        "Confirmation links are valid for 48 hours. To leave a review again, go back to the business listing and tap the Review button.",
    },
    missing: {
      icon: AlertTriangle,
      tint: "text-rose-600 bg-rose-50",
      title: "Something's missing",
      body:
        "We couldn't find a valid token in this link. Try clicking the button in the email again, or submit a new review from the business page.",
    },
    error: {
      icon: AlertTriangle,
      tint: "text-rose-600 bg-rose-50",
      title: "Something went wrong",
      body:
        "We hit a technical problem confirming your review. Please try again in a few minutes — if it keeps failing, email us and we'll sort it out.",
    },
  };

  const cfg = states[status] ?? states.ok;
  const Icon = cfg.icon;

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div
        className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 ${cfg.tint}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-3">{cfg.title}</h1>
      <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
        {cfg.body}
      </p>
      <Link
        href="/"
        className="inline-block mt-6 text-teal-700 hover:underline font-medium"
      >
        ← Back to HERD
      </Link>
    </div>
  );
}
