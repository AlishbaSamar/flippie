import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "FAQ — flippie",
  description: "Answers to common questions about selling to flippie and buying refurbished devices.",
  alternates: { canonical: "/faq" },
};

const FAQS: { question: string; answer: string }[] = [
  {
    question: "How is flippie different from a marketplace like eBay or OLX?",
    answer:
      "We're not a marketplace connecting individual buyers and sellers. flippie buys your device directly from you, checks and grades it ourselves, and resells it through our own store. When you sell to us, you're dealing with flippie the whole way through — not a stranger.",
  },
  {
    question: "How is my instant offer calculated?",
    answer:
      "Your offer is based on the exact model, storage size, and the condition details you provide — whether it powers on normally, the screen and body condition, and battery health. Better condition and higher storage mean a higher offer.",
  },
  {
    question: "Is the offer I see really what I'll get paid?",
    answer:
      "Your offer is based on the condition you describe. Once we receive your device, we double-check that it matches — if everything checks out, you're paid the full offer amount. If there's a mismatch (for example, a crack you didn't mention), we'll always contact you with a revised offer before doing anything else — we never just pay less without asking.",
  },
  {
    question: "How do I send my device to you?",
    answer:
      "After accepting your offer, you'll receive a free shipping label by email. Pack your device securely, attach the label, and drop it off — no cost to you.",
  },
  {
    question: "When do I get paid?",
    answer: "As soon as your device arrives and passes our check, typically within a couple of business days.",
  },
  {
    question: "What if I change my mind about my offer?",
    answer: "No problem — your offer isn't binding until you ship your device. You're free to walk away any time before that.",
  },
  {
    question: "Are the devices you sell actually tested?",
    answer:
      "Yes. Every device we resell was bought and inspected by us first — we grade its real condition (Excellent, Good, or Fair) so what you see listed is what you get.",
  },
  {
    question: "Is checkout secure?",
    answer: "Payments are processed by Stripe, one of the world's most widely used payment providers — we never see or store your card details.",
  },
  {
    question: "Do you ship across all of Europe?",
    answer: "Yes — flippie buys from and sells to customers across the EU.",
  },
];

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <h1 className="text-3xl font-semibold text-ink">Frequently asked questions</h1>
      <p className="mt-2 text-muted">
        Can&apos;t find what you&apos;re looking for?{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:text-primary-dark">
          Get in touch
        </a>
        .
      </p>

      <div className="mt-8 space-y-3">
        {FAQS.map((item) => (
          <details key={item.question} className="group rounded-2xl border border-border bg-white p-5 open:pb-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
              {item.question}
              <span className="shrink-0 text-muted transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted">{item.answer}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface-alt p-6 text-center">
        <p className="font-semibold text-ink">Still have questions?</p>
        <p className="mt-1 text-sm text-muted">We&apos;re happy to help before you sell or buy.</p>
        <Link
          href="/sell"
          className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Get your instant quote
        </Link>
      </div>
    </main>
  );
}
