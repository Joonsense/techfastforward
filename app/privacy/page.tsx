import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "TechFastForward Privacy Policy — how we collect, use, and protect your data.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://techfastforward.com/privacy",
    languages: { en: "https://techfastforward.com/privacy", ko: "https://techfastforward.com/ko/privacy" },
  },
};

const LAST_UPDATED = "April 24, 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>Legal</p>
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>Privacy Policy</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Last updated: {LAST_UPDATED}</p>
      </div>

      <div className="prose-style space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>1. Who We Are</h2>
          <p>
            TechFastForward (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is an AI and technology intelligence publication operated by DeblockX Labs.
            Our website is located at <strong>techfastforward.com</strong>.
            For privacy inquiries, contact us at{" "}
            <a href="mailto:privacy@techfastforward.com" className="underline" style={{ color: "var(--accent)" }}>
              privacy@techfastforward.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>2. Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Email address</strong> — when you subscribe to our newsletter.</li>
            <li><strong>Usage data</strong> — pages visited, referrer, browser type, and device, collected via Vercel Analytics (privacy-friendly, no cookies).</li>
            <li><strong>IP address</strong> — temporarily logged by our infrastructure for security purposes.</li>
          </ul>
          <p className="mt-3">We do not collect payment information, run third-party ad trackers, or sell your data.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>3. How We Use Your Data</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Send you the daily TechFastForward newsletter (if subscribed).</li>
            <li>Understand aggregate readership to improve editorial content.</li>
            <li>Detect and prevent abuse.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>4. Data Sharing</h2>
          <p>
            We share data only with essential service providers operating under strict data processing agreements:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Supabase</strong> — database (subscriber list). Hosted in the EU.</li>
            <li><strong>Vercel</strong> — hosting and analytics. EU-compliant.</li>
          </ul>
          <p className="mt-3">We do not sell, rent, or trade your personal data to any third party.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>5. Cookies</h2>
          <p>
            TechFastForward uses no advertising or tracking cookies. We store a single <code>theme</code> preference
            in your browser&apos;s <code>localStorage</code> (dark/light mode) — this never leaves your device.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>6. Your Rights</h2>
          <p>Under GDPR and CCPA you have the right to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Withdraw newsletter consent at any time (unsubscribe link in every email).</li>
            <li>Lodge a complaint with your local data protection authority.</li>
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email{" "}
            <a href="mailto:privacy@techfastforward.com" className="underline" style={{ color: "var(--accent)" }}>
              privacy@techfastforward.com
            </a>{" "}
            and we will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>7. Data Retention</h2>
          <p>
            Newsletter subscriber data is retained until you unsubscribe. Server logs are purged after 30 days.
            Analytics data is aggregated and anonymised — no individual records are stored.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>8. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. Material changes will be announced via a notice on our homepage.
            Continued use of the site after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>9. Contact</h2>
          <p>
            Questions or concerns? Email{" "}
            <a href="mailto:privacy@techfastforward.com" className="underline" style={{ color: "var(--accent)" }}>
              privacy@techfastforward.com
            </a>{" "}
            or visit our{" "}
            <Link href="/terms" className="underline" style={{ color: "var(--accent)" }}>Terms of Service</Link>.
          </p>
        </section>

      </div>
    </div>
  );
}
