import type { Metadata } from "next";
import { LegalSection } from "@/components/legal/LegalSection";
import { COMPANY_ADDRESS, COMPANY_LEGAL_NAME, COMPANY_REGISTRATION, CONTACT_EMAIL, SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Terms of Service — flippie",
  description: "The terms that apply when you sell a device to flippie or buy a device from flippie.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "25 September 2026";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold text-ink">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <p className="mt-6 text-sm text-muted">
        These terms apply whenever you use {SITE_URL}, sell a device to us, or buy a device from us. By using
        the site, you agree to them. flippie is operated by {COMPANY_LEGAL_NAME}, {COMPANY_ADDRESS}
        (registration number {COMPANY_REGISTRATION}).
      </p>

      <LegalSection title="1. What flippie is">
        <p>
          flippie buys used iPhones, iPads, and Samsung Galaxy S devices directly from customers, then resells
          them as certified refurbished devices through our own store. We are not a marketplace — every device
          listed for sale was bought and inspected by flippie, and every trade-in is bought directly by flippie,
          not a third party.
        </p>
      </LegalSection>

      <LegalSection title="2. Selling a device to flippie">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>Your instant offer is calculated from the model, storage, and condition details you provide.</li>
          <li>
            An offer isn&apos;t final until we&apos;ve received and inspected your device. If its actual
            condition doesn&apos;t match what was described, we&apos;ll contact you with a revised offer before
            taking any further action — we won&apos;t reduce your payout without asking first.
          </li>
          <li>You&apos;re free to decline a revised offer, in which case we&apos;ll return your device to you.</li>
          <li>You confirm that any device you sell us is yours to sell, and isn&apos;t stolen, lost, or subject to a financing agreement or activation lock.</li>
          <li>Payment is made once your device passes inspection.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Buying a device from flippie">
        <ul className="list-disc space-y-1.5 pl-5">
          <li>All prices are shown in euros (EUR) and include any applicable taxes unless stated otherwise.</li>
          <li>Payment is processed securely by Stripe at checkout.</li>
          <li>An order is confirmed once payment has been successfully processed.</li>
          <li>
            Devices are graded and described as accurately as possible (Excellent, Good, or Fair condition) based
            on our own inspection before listing.
          </li>
        </ul>
        <p>
          Your right to return a device you&apos;ve bought is set out in our{" "}
          <a href="/refunds" className="font-semibold text-primary hover:text-primary-dark">
            Refund &amp; Returns Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="4. Account &amp; eligibility">
        <p>
          To sell to or buy from flippie you must be at least 18 years old and able to enter into a legally
          binding contract, with a valid shipping address within the countries we serve.
        </p>
      </LegalSection>

      <LegalSection title="5. Limitation of liability">
        <p>
          flippie is not liable for indirect or consequential losses arising from use of the site. Nothing in
          these terms limits any liability that cannot be limited under applicable law, including liability for
          fraud or for death or personal injury caused by negligence.
        </p>
      </LegalSection>

      <LegalSection title="6. Changes to these terms">
        <p>
          We may update these terms from time to time. Continued use of the site after a change means you accept
          the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="7. Governing law">
        <p>
          These terms are governed by the laws of Denmark, without prejudice to any mandatory consumer
          protection rights you have under the law of the country where you live.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          Questions about these terms:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:text-primary-dark">
            {CONTACT_EMAIL}
          </a>
        </p>
      </LegalSection>
    </main>
  );
}
