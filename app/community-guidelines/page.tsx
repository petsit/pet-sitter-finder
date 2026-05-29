import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";

export const metadata = {
  title: "Community Guidelines — HERD",
  description:
    "What makes a good HERD review, what we don't allow, and how reports are handled.",
};

const ENCOURAGED = [
  "Reviews from a real personal experience with the provider",
  "Specific detail — what service did you use, how it went, what stood out",
  "Constructive feedback, including legitimate criticism",
  "Sharing context that helps other customers make a choice",
];

const NOT_ALLOWED = [
  "Defamatory or untrue claims about a provider",
  "Personal information — phone numbers, addresses, full names of staff who aren't the business owner",
  "Hate speech, harassment, threats or attacks on a person's character",
  "Reviews from someone with a conflict of interest (a competitor, former employee, family member)",
  "Spam, links, promotional content or anything not focused on your actual experience",
  "Fake or paid reviews",
  "Content that breaks UK law",
];

export default function CommunityGuidelinesPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
          Community guidelines
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          What good reviews look like on HERD
        </h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          HERD reviews matter because UK pet, equine and rural service
          customers need to trust the people they let into their lives and
          businesses. We keep the bar high so that trust is earned.
        </p>
      </header>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          What we encourage
        </h2>
        <ul className="space-y-2.5">
          {ENCOURAGED.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-slate-700">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          What we don&apos;t allow
        </h2>
        <ul className="space-y-2.5">
          {NOT_ALLOWED.map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-slate-700">
              <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          How moderation works
        </h2>
        <p className="text-slate-700 leading-relaxed">
          Every review is held until the reviewer confirms their email and
          an admin manually checks it against these guidelines. Reviews
          usually publish within 2 working days of submission.
        </p>
        <p className="text-slate-700 leading-relaxed">
          We may decline to publish a review at our discretion, or remove a
          published review if it breaches these guidelines. We will
          reasonably try to tell the reviewer why.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Reporting a review
        </h2>
        <p className="text-slate-700 leading-relaxed">
          Every published review has a <strong>Report</strong> link in its
          footer. Use it if you believe a review breaches these guidelines
          or UK law (including defamation). You can report anonymously, but
          including your contact email helps us follow up.
        </p>
        <p className="text-slate-700 leading-relaxed">
          We aim to acknowledge reports within 2 working days and act on
          legitimate ones promptly. If a review is removed, the reviewer
          will be told why.
        </p>
        <p className="text-sm text-slate-500">
          These guidelines complement our{" "}
          <Link href="/terms" className="text-teal-700 underline">
            Terms of Service
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
