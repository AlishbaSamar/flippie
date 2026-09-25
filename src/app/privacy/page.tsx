import type { Metadata } from "next";
import { LegalSection } from "@/components/legal/LegalSection";
import { COMPANY_ADDRESS, COMPANY_LEGAL_NAME, COMPANY_REGISTRATION, CONTACT_EMAIL, SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Privacy Policy — flippie",
  description: "How flippie collects, uses, and protects your personal data.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "25 September 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold text-ink">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <p className="mt-6 text-sm text-muted">
        This policy explains how {COMPANY_LEGAL_NAME} (&quot;flippie&quot;, &quot;we&quot;, &quot;us&quot;)
        collects, uses, and protects personal data when you use {SITE_URL}, sell a device to us, or buy a
        device from us. We are the data controller for the personal data described below.
      </p>

      <LegalSection title="1. Who we are">
        <p>{COMPANY_LEGAL_NAME}</p>
        <p>{COMPANY_ADDRESS}</p>
        <p>Registration number: {COMPANY_REGISTRATION}</p>
        <p>
          Contact:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:text-primary-dark">
            {CONTACT_EMAIL}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="2. What data we collect">
        <p>We collect personal data you give us directly, including:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Name, email address, shipping address, and country, when you sell us a device or place an order</li>
          <li>Device details and condition information you submit when requesting a trade-in offer</li>
          <li>
            Payment information when you buy from us — this is collected and processed directly by Stripe, our
            payment provider; we never see or store your full card details
          </li>
          <li>Correspondence when you contact us for support</li>
        </ul>
        <p>
          We do not currently use analytics, advertising, or tracking cookies. Your shopping cart is stored
          locally in your browser (not on our servers) so it persists between visits.
        </p>
      </LegalSection>

      <LegalSection title="3. Why we use your data">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>To process a trade-in offer and pay you for a device you sell us</li>
          <li>To process and fulfil an order you place with us, including shipping and customer support</li>
          <li>To process payment via Stripe and prevent fraud</li>
          <li>To comply with our legal and tax obligations</li>
        </ul>
        <p>
          Our legal basis is performance of the contract between us (fulfilling your trade-in or order), and
          compliance with legal obligations (tax and accounting records).
        </p>
      </LegalSection>

      <LegalSection title="4. Who we share data with">
        <p>We share personal data only with the service providers needed to run flippie:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li><strong>Stripe</strong> — payment processing</li>
          <li><strong>Vercel</strong> — website hosting</li>
          <li><strong>Neon</strong> — database hosting (EU-based, Frankfurt)</li>
        </ul>
        <p>We do not sell your personal data to anyone.</p>
      </LegalSection>

      <LegalSection title="5. How long we keep your data">
        <p>
          We retain order and trade-in records for as long as required by applicable tax and accounting law.
          You can ask us to delete other personal data at any time, subject to those legal retention
          requirements.
        </p>
      </LegalSection>

      <LegalSection title="6. Your rights">
        <p>Under the GDPR, you have the right to:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data, where we&apos;re not required to keep it</li>
          <li>Object to or restrict certain processing</li>
          <li>Request a copy of your data in a portable format</li>
          <li>Lodge a complaint with your national data protection authority</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:text-primary-dark">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="7. Changes to this policy">
        <p>
          We may update this policy from time to time. We&apos;ll update the &quot;Last updated&quot; date
          above when we do.
        </p>
      </LegalSection>
    </main>
  );
}
