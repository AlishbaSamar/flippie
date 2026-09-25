import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/site-url";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "Browse refurbished devices", href: "/shop" },
      { label: "Sell your device", href: "/sell" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact us", href: `mailto:${CONTACT_EMAIL}` },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="text-lg font-semibold text-ink">flippie</p>
            <p className="mt-2 max-w-xs text-sm text-muted">
              We buy used iPhones, iPads, and Samsung Galaxy S phones directly from customers across Europe,
              then resell them as certified refurbished devices.
            </p>
          </div>
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold text-ink">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted transition hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} flippie. All rights reserved.</p>
          <p>Secure checkout powered by Stripe.</p>
        </div>
      </div>
    </footer>
  );
}
