import Link from "next/link";

export function ShopComingSoon() {
  return (
    <div className="mt-8 rounded-3xl border border-border bg-white px-6 py-16 text-center">
      <p className="text-sm font-semibold tracking-wide text-primary uppercase">Coming soon</p>
      <h2 className="mt-3 text-2xl font-semibold text-ink">We&apos;re building up our stock</h2>
      <p className="mx-auto mt-3 max-w-md text-muted">
        We&apos;re currently buying devices from sellers across Europe. Once we&apos;ve tested and certified
        enough stock, we&apos;ll open the shop — check back soon.
      </p>
      <Link
        href="/sell"
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Sell your device instead
      </Link>
    </div>
  );
}
