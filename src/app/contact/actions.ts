"use server";

import { sendContactMessageEmail } from "@/lib/emails";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SubmitContactInput {
  name: string;
  email: string;
  message: string;
  /** Honeypot — real visitors never see or fill this field. If it's non-empty, silently drop the submission. */
  company?: string;
}

export async function submitContactMessage(input: SubmitContactInput): Promise<void> {
  if (input.company?.trim()) return;

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) throw new Error("Enter your name.");
  if (!EMAIL_RE.test(email)) throw new Error("Enter a valid email address.");
  if (message.length < 10) throw new Error("Tell us a bit more — at least 10 characters.");
  if (message.length > 5000) throw new Error("That message is too long — please keep it under 5000 characters.");

  await sendContactMessageEmail({ name, email, message });
}
