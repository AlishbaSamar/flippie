"use client";

import { useState, useTransition, type FormEvent } from "react";
import { submitContactMessage } from "@/app/contact/actions";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot — real visitors never see or fill this
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await submitContactMessage({ name, email, message, company });
        setSent(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  if (sent) {
    return (
      <div className="mt-8 rounded-3xl border border-border bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">Sent</p>
        <h2 className="mt-2 text-xl font-semibold text-ink">We&apos;ve got your message</h2>
        <p className="mt-3 text-sm text-muted">We&apos;ll get back to you by email as soon as we can.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-border bg-white p-8 shadow-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="text-xs font-semibold tracking-wide text-muted uppercase">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            autoComplete="name"
            required
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-xs font-semibold tracking-wide text-muted uppercase">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="text-xs font-semibold tracking-wide text-muted uppercase">
            Message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            placeholder="How can we help?"
            required
            minLength={10}
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
          />
        </div>

        {/* Honeypot: visually hidden from real visitors, but a plain form field bots tend to fill in. */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </div>

        {error && <p className="text-sm font-medium text-[var(--viz-critical)]">{error}</p>}
        <button
          type="submit"
          disabled={isPending || !name.trim() || !email.trim() || !message.trim()}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
