import Link from "next/link";
import { CartBadge } from "@/components/CartBadge";

const NAV_LINKS = [
  { href: "/sell", label: "Sell your device" },
  { href: "/shop", label: "Shop refurbished" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
            F
          </span>
          flippie
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink/80 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <CartBadge />
          <Link
            href="/sell"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            Get your quote
          </Link>
        </div>
      </div>
    </header>
  );
}
