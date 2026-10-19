import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Contact us — flippie",
  description: "Get in touch with flippie about selling your device, an order, or anything else.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-2xl font-semibold text-ink">Contact us</h1>
      <p className="mt-1 text-muted">
        Questions about selling your device, an order, or anything else — send us a message and we&apos;ll reply by
        email. You can also reach us directly at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-primary hover:text-primary-dark">
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <ContactForm />
    </div>
  );
}
