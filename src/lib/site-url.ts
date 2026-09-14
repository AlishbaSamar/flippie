/**
 * Single source of truth for the canonical site origin, used by metadata,
 * the sitemap, robots.txt, and structured data. Swapping to the client's
 * real domain later is a one-line env var change, not a code change.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flippie-beta.vercel.app";
