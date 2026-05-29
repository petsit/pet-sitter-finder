export const metadata = {
  title: "Privacy Policy — HERD",
  description:
    "How HERD collects, uses, and protects your personal data — and the rights you have over it.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
          Privacy Policy
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          HERD Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: 27 May 2026 · Plain-English starting point. A
          solicitor should review before final publication.
        </p>
      </header>

      <Section title="1. Who we are">
        <p>
          HERD is operated by Turner Stores Ltd, the data controller for the
          purposes of UK GDPR and the Data Protection Act 2018. Get in touch
          via{" "}
          <a className="text-teal-700 underline" href="mailto:hello@joinherd.uk">
            hello@joinherd.uk
          </a>{" "}
          for anything privacy-related.
        </p>
      </Section>

      <Section title="2. What we collect">
        <p>We collect personal data only when you give it to us, including:</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Customers:</strong> nothing by default. If you submit a
            review, we store your name, email, the text of the review, and
            the service you used. If you report a review, we store the
            optional email you provide and the report reason.
          </li>
          <li>
            <strong>Service providers:</strong> when you claim a listing
            we store your name, role, email, optional phone number and an
            optional message. After approval, we store any content you add
            (description, services, pricing, photos, response time) plus
            your email-based session token.
          </li>
          <li>
            <strong>Analytics:</strong> standard server-side request logs
            (IP, browser, page accessed) retained for up to 30 days for
            security and operations.
          </li>
        </ul>
      </Section>

      <Section title="3. Why we use it">
        <p>We use your data only to:</p>
        <ul className="list-disc pl-5">
          <li>operate the Service (display listings, send sign-in links,
            verify reviews, moderate content);</li>
          <li>communicate with you about your account or content you have
            submitted;</li>
          <li>prevent fraud, spam and abuse;</li>
          <li>comply with our legal obligations.</li>
        </ul>
      </Section>

      <Section title="4. Legal bases">
        <p>We rely on:</p>
        <ul className="list-disc pl-5">
          <li><strong>Contract:</strong> to provide the Service to
            registered providers.</li>
          <li><strong>Legitimate interest:</strong> to operate the
            directory, send transactional emails, and maintain platform
            integrity.</li>
          <li><strong>Consent:</strong> where required, e.g. for non-
            essential cookies.</li>
        </ul>
      </Section>

      <Section title="5. Who we share with">
        <p>
          We use a small number of trusted third-party suppliers to operate
          HERD:
        </p>
        <ul className="list-disc pl-5">
          <li><strong>Vercel</strong> — hosting and serverless runtime.</li>
          <li><strong>Vercel Postgres (Neon)</strong> — the database that
            stores claims, profile overrides, and reviews.</li>
          <li><strong>Resend</strong> — transactional email delivery.</li>
          <li><strong>Google Maps Platform</strong> — the source of
            baseline listing data, displayed under their terms.</li>
        </ul>
        <p>
          We do not sell your data. We do not share it for advertising
          purposes.
        </p>
      </Section>

      <Section title="6. How long we keep it">
        <p>
          Account data is kept while your account is active and for a
          reasonable period after for accounting purposes. Reviews you
          submit may stay published indefinitely; you can request deletion
          at any time. Server logs are deleted after 30 days. Email
          verification tokens expire within 48 hours.
        </p>
      </Section>

      <Section title="7. Your rights">
        <p>You have the right to:</p>
        <ul className="list-disc pl-5">
          <li>access the personal data we hold about you;</li>
          <li>correct it if it&apos;s wrong;</li>
          <li>ask us to delete it (subject to our legal obligations);</li>
          <li>object to or restrict processing in certain cases;</li>
          <li>port your data elsewhere;</li>
          <li>complain to the UK Information Commissioner&apos;s Office at{" "}
            <a className="text-teal-700 underline" href="https://ico.org.uk/make-a-complaint/">
              ico.org.uk
            </a>{" "}
            if you&apos;re unhappy with how we handle your data.</li>
        </ul>
        <p>
          To exercise any of these rights, email{" "}
          <a className="text-teal-700 underline" href="mailto:hello@joinherd.uk">
            hello@joinherd.uk
          </a>{" "}
          and we&apos;ll respond within 30 days.
        </p>
      </Section>

      <Section title="8. International transfers">
        <p>
          Some of our suppliers operate servers outside the UK (e.g. in
          the EU and the US). Where data leaves the UK we rely on
          adequacy decisions or Standard Contractual Clauses to protect it.
        </p>
      </Section>

      <Section title="9. Cookies">
        <p>
          HERD uses a small number of strictly-necessary cookies for
          authentication and platform security. We don&apos;t use
          advertising cookies. If we ever introduce analytics cookies we
          will ask for your consent first.
        </p>
      </Section>

      <Section title="10. Children">
        <p>
          HERD is not directed at children under 13 and we do not knowingly
          collect data from them. If you believe a child has provided data
          to us, please contact us so we can remove it.
        </p>
      </Section>

      <Section title="11. Changes">
        <p>
          We may update this policy from time to time. Material changes
          will be flagged on the site. The &ldquo;Last updated&rdquo; date
          at the top of this page tells you when the policy was last
          revised.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
      <div className="space-y-3 text-slate-700 leading-relaxed text-sm">
        {children}
      </div>
    </section>
  );
}
