import Link from "next/link";

export const metadata = {
  title: "Terms of Service — HERD",
  description:
    "The terms you agree to when using HERD as a customer or service provider.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 prose prose-slate">
      <header className="mb-8 not-prose">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700 mb-2">
          Terms of Service
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          HERD Terms of Service
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          Last updated: 27 May 2026 · These terms are a plain-English starting
          point. A solicitor should review before final publication.
        </p>
      </header>

      <Section title="1. Who we are">
        <p>
          HERD is a directory and review platform for pet, equine and rural
          service providers in the United Kingdom (the <strong>&ldquo;Service&rdquo;</strong>).
          The Service is operated by Turner Stores Ltd (<strong>&ldquo;HERD&rdquo;</strong>,{" "}
          <strong>&ldquo;we&rdquo;</strong>, <strong>&ldquo;us&rdquo;</strong>).
          By using the Service you agree to these Terms.
        </p>
      </Section>

      <Section title="2. What HERD does and doesn't do">
        <p>
          HERD lists service providers using publicly available information
          from Google Maps, along with content submitted by providers who
          have claimed their listing. We do not provide any of the services
          listed. We are not party to any arrangement between a customer and
          a provider.
        </p>
        <p>
          We do not vet every provider. A &ldquo;Verified&rdquo; badge means
          the listing has been claimed and an admin has reviewed the claim;
          it is not a guarantee of quality, insurance or competence.
        </p>
      </Section>

      <Section title="3. Customer use of the Service">
        <p>
          You may use HERD to search for, contact, and review service
          providers. You are responsible for your own due diligence before
          engaging a provider — including verifying their insurance,
          qualifications and references.
        </p>
        <p>
          Any contract for services is between you and the provider directly.
          HERD is not a party to that contract.
        </p>
      </Section>

      <Section title="4. Provider use of the Service">
        <p>
          A provider may claim a listing if they own or are authorised by
          the owner of the business. Submitting false claim information is a
          breach of these Terms and may amount to fraud.
        </p>
        <p>
          Content you add to your listing (descriptions, services, prices,
          photos, response time) must be accurate, your own to publish, and
          not misleading. Photos must be your own or used with permission.
        </p>
        <p>
          Paid tiers (Pro, Featured) will be offered under separate
          subscription terms which apply in addition to these Terms.
        </p>
      </Section>

      <Section title="5. Reviews">
        <p>
          Reviews on HERD are subject to our{" "}
          <Link href="/community-guidelines" className="text-teal-700 underline">
            Community Guidelines
          </Link>
          . You may submit a review only if you have used the relevant
          service. Reviews must be honest, factual, and not defamatory.
        </p>
        <p>
          Reviews go through email verification and admin moderation before
          publication. We may decline to publish any review at our
          discretion. We may also remove a published review if it breaches
          these Terms or our Community Guidelines.
        </p>
        <p>
          You can report a published review using the Report link on the
          review. We will review reports within a reasonable time and act if
          appropriate.
        </p>
      </Section>

      <Section title="6. Accounts">
        <p>
          We use passwordless email links to sign providers in. You are
          responsible for keeping access to your email account secure.
          Notify us promptly if you believe someone else has used your
          account.
        </p>
      </Section>

      <Section title="7. Prohibited use">
        <p>You must not:</p>
        <ul className="list-disc pl-5">
          <li>scrape, crawl, or harvest data from HERD other than via
            normal browsing;</li>
          <li>submit false, defamatory, harassing, or unlawful content;</li>
          <li>impersonate another person or business;</li>
          <li>interfere with the operation of the Service;</li>
          <li>use the Service to send unsolicited marketing;</li>
          <li>use the Service in a way that breaches Google&apos;s
            Places API Terms of Service.</li>
        </ul>
      </Section>

      <Section title="8. Intellectual property">
        <p>
          HERD owns the Service, its design, brand and code. The data shown
          for each listing is sourced from Google Maps and from the
          provider who has claimed the listing. You grant HERD a worldwide,
          royalty-free licence to host, display and adapt content you submit
          for the purpose of operating the Service.
        </p>
      </Section>

      <Section title="9. Limitation of liability">
        <p>
          To the maximum extent permitted by law, HERD is provided
          &ldquo;as is&rdquo; without warranty of any kind. We do not
          warrant that listings are accurate, that providers will perform,
          or that the Service will be uninterrupted.
        </p>
        <p>
          We are not liable for any loss arising from your use of, or
          inability to use, the Service, or from any arrangement you make
          with a provider. Nothing in these Terms limits liability for
          death, personal injury, fraud, or anything else that cannot be
          excluded by law.
        </p>
      </Section>

      <Section title="10. Termination">
        <p>
          You can stop using HERD at any time. We may suspend or terminate
          access to the Service if you breach these Terms or our Community
          Guidelines.
        </p>
      </Section>

      <Section title="11. Changes to these Terms">
        <p>
          We may update these Terms from time to time. Material changes
          will be flagged on the Service. Continued use of HERD after
          changes means you accept the updated Terms.
        </p>
      </Section>

      <Section title="12. Governing law">
        <p>
          These Terms are governed by the laws of England and Wales, and
          the courts of England and Wales have exclusive jurisdiction over
          any dispute arising from them.
        </p>
      </Section>

      <Section title="13. Contact">
        <p>
          Get in touch about anything to do with these Terms by emailing{" "}
          <a className="text-teal-700 underline" href="mailto:hello@joinherd.uk">
            hello@joinherd.uk
          </a>
          .
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 not-prose">
      <h2 className="text-lg font-semibold text-slate-900 mb-2">{title}</h2>
      <div className="space-y-3 text-slate-700 leading-relaxed text-sm">
        {children}
      </div>
    </section>
  );
}
