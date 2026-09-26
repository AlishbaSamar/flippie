import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

/** Requires flippie.io to be a verified sending domain in Resend. */
export const EMAIL_FROM = "flippie <orders@flippie.io>";
