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
 * The Denmark company registration isn't finished yet, so this is an
 * explicit placeholder — update it here (one place) once the CVR number,
 * registered address, and legal name are final. Do not fill this in with
 * invented details; an honest placeholder is safer than a fabricated one.
 */
export const COMPANY_LEGAL_NAME = "flippie ApS (company registration pending)";
export const COMPANY_ADDRESS = "[Registered business address — to be added once Denmark company registration is complete]";
export const COMPANY_REGISTRATION = "[CVR registration number — to be added once available]";
