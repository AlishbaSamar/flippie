/**
 * Single source of truth for the canonical site origin, used by metadata,
 * the sitemap, robots.txt, and structured data. Swapping to the client's
 * real domain later is a one-line env var change, not a code change.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flippie-beta.vercel.app";

/**
 * Support contact address shown in the footer and FAQ. Placeholder until the
 * client's domain and real mailbox are set up — update this one line then.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "support@flippie.com";

/**
 * Legal entity details for the Privacy Policy, Terms, and Refund Policy.
 * Registered with the Danish Business Authority (Erhvervsstyrelsen) on
 * 28 September 2026. The registered business address hasn't been provided
 * yet — update it here (one place) once available. Do not fill this in
 * with invented details; an honest placeholder is safer than a fabricated
 * one.
 */
export const COMPANY_LEGAL_NAME = "Flippie ApS";
export const COMPANY_ADDRESS = "[Registered business address — to be added]";
export const COMPANY_REGISTRATION = "CVR 46805348";
