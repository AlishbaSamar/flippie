import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/category-labels";
import { mapDeviceModel, toDbCategory } from "@/lib/db-mappers";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";
import type { DeviceCategory } from "@/types/device";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "flippie",
  url: SITE_URL,
  description:
    "flippie buys used iPhones, iPads, and Samsung Galaxy S phones directly from customers across Europe, then resells them as certified refurbished devices.",
  areaServed: "EU",
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "flippie",
  url: SITE_URL,
};

const CATEGORIES: DeviceCategory[] = ["iphone", "ipad", "galaxy-s"];

export const dynamic = "force-dynamic";

const TRUST_POINTS = [
  {
    title: "Certified & tested",
    body: "Every device we resell was bought and graded by us — no third-party sellers, no surprises.",
  },
  {
    title: "Fast, direct payment",
    body: "No waiting for a stranger to reply. You deal with flippie from offer to payout.",
  },
  {
    title: "Secure checkout",
    body: "Payments are processed by Stripe — your card details never touch our servers.",
  },
];

const STEPS = [
  {
    title: "Pick your device",
    body: "Tell us the model, storage, and condition. It takes under two minutes.",
  },
  {
    title: "Get an instant offer",
    body: "We calculate a fair price on the spot — no haggling, no waiting for a stranger to reply.",
  },
  {
    title: "Ship it, get paid",
    body: "Send it in with our free shipping label and get paid as soon as it's checked.",
  },
];

async function getStats() {
  const [devicesSold, countryRows] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ distinct: ["countryCode"], select: { countryCode: true } }),
  ]);
  return { devicesSold, countriesServed: countryRows.length };
}

export default async function Home() {
  const [categoryRanges, stats] = await Promise.all([
    Promise.all(
      CATEGORIES.map(async (category) => {
        const rows = await prisma.deviceModel.findMany({
          where: { category: toDbCategory(category) },
          orderBy: { releaseYear: "asc" },
        });
        const models = rows.map(mapDeviceModel);
        return { category, first: models[0], last: models[models.length - 1] };
      }),
    ),
    getStats(),
  ]);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
              Trusted across Europe
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              Sell your phone or tablet in minutes. Get paid fast.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">
              flippie buys your used iPhone, iPad, or Samsung Galaxy S device directly — then gives it a
              second life through our own certified refurbished store.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sell"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
              >
                Get your instant quote
              </Link>
              <Link
                href="/shop"
                className="rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
              >
                Shop refurbished devices
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-muted">Example instant offer</p>
            <p className="mt-4 text-3xl font-semibold text-ink">iPhone 14 · 128GB</p>
            <p className="mt-1 text-sm text-muted">Works perfectly · Flawless screen · Battery 90%+</p>
            <p className="mt-6 text-5xl font-bold text-primary">€312</p>
            <p className="mt-2 text-xs text-muted">Estimate — actual offers vary by condition and market.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 sm:grid-cols-3">
          <div className="text-center sm:text-left">
            <p className="text-3xl font-bold text-ink">{stats.devicesSold.toLocaleString("en-IE")}+</p>
            <p className="mt-1 text-sm text-muted">Devices bought & sold</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-3xl font-bold text-ink">{stats.countriesServed}+</p>
            <p className="mt-1 text-sm text-muted">Countries across Europe</p>
          </div>
          <div className="col-span-2 text-center sm:col-span-1 sm:text-left">
            <p className="text-3xl font-bold text-ink">100%</p>
            <p className="mt-1 text-sm text-muted">Checked & graded before resale</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-ink">How selling to flippie works</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step.title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-ink">What are you selling today?</h2>
        <p className="mt-2 text-muted">Choose a category to get your instant quote.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {categoryRanges.map(({ category, first, last }) => (
            <Link
              key={category}
              href={`/sell?category=${category}`}
              className="group rounded-2xl border border-border bg-white p-6 transition hover:border-primary hover:shadow-md"
            >
              <p className="text-lg font-semibold text-ink group-hover:text-primary">{CATEGORY_LABELS[category]}</p>
              <p className="mt-1 text-sm text-muted">
                {first.name} – {last.name}
              </p>
              <p className="mt-4 text-sm font-semibold text-primary">Get a quote →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-ink">Why flippie</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {TRUST_POINTS.map((point) => (
              <div key={point.title}>
                <h3 className="text-lg font-semibold text-ink">{point.title}</h3>
                <p className="mt-2 text-sm text-muted">{point.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-8">
            <p className="text-sm text-muted">Have questions before you get started?</p>
            <Link href="/faq" className="text-sm font-semibold text-primary hover:text-primary-dark">
              Read our FAQ →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
