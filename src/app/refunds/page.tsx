import type { Metadata } from "next";
import { LegalSection } from "@/components/legal/LegalSection";
import { CONTACT_EMAIL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Refund & Returns Policy — flippie",
  description: "Your right to return a device you've bought from flippie, and how trade-in refunds work.",
  alternates: { canonical: "/refunds" },
};

const LAST_UPDATED = "25 September 2026";

export default function RefundsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-3xl font-semibold text-ink">Refund &amp; Returns Policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <LegalSection title="Buying from flippie: your 14-day right to return">
        <p>
          As an EU consumer buying online, you have a legal right to withdraw from your purchase within{" "}
          <strong>14 days</strong> of receiving your device, without giving a reason, under the EU Consumer
          Rights Directive. To use this right, contact us within 14 days of delivery at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:text-primary-dark">
            {CONTACT_EMAIL}
          </a>{" "}
          and we&apos;ll confirm the return process.
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>The device should be returned in the same condition it was delivered in.</li>
          <li>Once we receive and check the returned device, we&apos;ll refund your payment to the original payment method, normally within 14 days.</li>
          <li>Return shipping cost is covered by the customer, unless the device arrived faulty or not as described.</li>
        </ul>
      </LegalSection>

      <LegalSection title="If a device arrives faulty or not as described">
        <p>
          Contact us straight away at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:text-primary-dark">
            {CONTACT_EMAIL}
          </a>{" "}
          with your order reference and a description of the issue. We&apos;ll arrange a free return and a full
          refund or replacement.
        </p>
      </LegalSection>

      <LegalSection title="Selling to flippie: what if I don't like my final offer?">
        <p>
          Your trade-in offer isn&apos;t final until we&apos;ve inspected your device. If our inspection turns
          up something you didn&apos;t mention and we need to revise the offer, we&apos;ll always contact you
          first — you&apos;re free to accept the revised offer or ask us to return your device to you at no
          cost.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          For any return, refund, or trade-in question:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:text-primary-dark">
            {CONTACT_EMAIL}
          </a>
        </p>
      </LegalSection>
    </main>
  );
}
