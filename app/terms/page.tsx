import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "TechFastForward Terms of Service — rules governing your use of the site.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://techfastforward.com/terms",
    languages: { en: "https://techfastforward.com/terms", ko: "https://techfastforward.com/ko/terms" },
  },
};

const LAST_UPDATED = "April 24, 2026";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Legal</p>
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>Terms of Service</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using TechFastForward (&ldquo;the Site&rdquo;), you agree to be bound by these Terms of Service.
            If you do not agree, please discontinue use immediately. These terms are governed by the laws of the
            Republic of Korea.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>2. Content and Editorial</h2>
          <p>
            TechFastForward publishes editorial commentary and news summaries about technology and AI.
            Content is provided for informational purposes only and does not constitute financial, legal, or
            investment advice. We strive for accuracy but make no warranties regarding completeness or timeliness.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>3. Intellectual Property</h2>
          <p>
            All original content on TechFastForward — including articles, headlines, design, and branding — is
            owned by DeblockX Labs and protected by copyright. You may share individual articles with attribution
            and a link back to the original. Reproduction of substantial portions without written consent is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>4. AI-Generated Content</h2>
          <p>
            Some articles on TechFastForward are drafted with the assistance of AI tools and reviewed by our editorial
            team. We disclose this where applicable. AI-assisted content is held to the same factual accuracy
            standards as human-authored content.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>5. Newsletter Subscription</h2>
          <p>
            By subscribing to our newsletter, you consent to receive daily email digests. You may unsubscribe at
            any time using the link in every email. We will not use your address for any purpose other than
            sending the newsletter without your explicit consent.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>6. Prohibited Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Scrape or bulk-copy content for commercial redistribution.</li>
            <li>Use automated tools to overload our servers.</li>
            <li>Misrepresent TechFastForward content as your own.</li>
            <li>Use the site for unlawful purposes.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>7. Third-Party Links</h2>
          <p>
            The Site may contain links to external websites. TechFastForward is not responsible for the content,
            privacy practices, or accuracy of third-party sites.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>8. Disclaimer of Warranties</h2>
          <p>
            The Site is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee uninterrupted
            access or error-free operation. Use the Site at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, DeblockX Labs shall not be liable for any indirect, incidental,
            or consequential damages arising from your use of the Site or reliance on its content.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>10. Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the Site after changes constitutes acceptance.
            Material changes will be announced on our homepage.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>11. Contact</h2>
          <p>
            For questions about these terms, email{" "}
            <a href="mailto:legal@techfastforward.com" className="underline" style={{ color: "var(--accent)" }}>
              legal@techfastforward.com
            </a>{" "}
            or see our{" "}
            <Link href="/privacy" className="underline" style={{ color: "var(--accent)" }}>Privacy Policy</Link>.
          </p>
        </section>

      </div>
    </div>
  );
}
