import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { DeviceThumbnail } from "@/components/DeviceThumbnail";
import { Mascot } from "@/components/Mascot";
import { Reveal } from "@/components/Reveal";
import { CATEGORY_LABELS } from "@/lib/category-labels";
import { mapDeviceModel, toDbCategory } from "@/lib/db-mappers";
import { SHOP_ENABLED } from "@/lib/feature-flags";
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
  areaServed: { "@type": "Place", name: "Europe" },
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
  ...(SHOP_ENABLED
    ? [
        {
          title: "Secure checkout",
          body: "Payments are processed by Stripe — your card details never touch our servers.",
        },
      ]
    : [
        {
          title: "No third-party sellers",
          body: "You're dealing directly with flippie, not a stranger on a marketplace.",
        },
      ]),
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

const VALUE_POINTS: { label: string; icon: ReactNode }[] = [
  {
    label: "Certified before resale",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12.5l2.5 2.5 5-5" />
      </svg>
    ),
  },
  {
    label: "Direct from you, no middleman",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M7 7h10M7 7l3-3M7 7l3 3M17 17H7M17 17l-3-3M17 17l-3 3" />
      </svg>
    ),
  },
  {
    label: "Free shipping label included",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M21 8l-9-5-9 5 9 5 9-5Z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    label: "Buying and selling across Europe",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9Z" />
      </svg>
    ),
  },
];

export default async function Home() {
  const categoryRanges = await Promise.all(
    CATEGORIES.map(async (category) => {
      const rows = await prisma.deviceModel.findMany({
        where: { category: toDbCategory(category) },
        orderBy: { releaseYear: "asc" },
      });
      const models = rows.map(mapDeviceModel);
      return { category, first: models[0], last: models[models.length - 1] };
    }),
  );

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }} />

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="relative">
            <div className="flex items-center gap-3">
              <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
                Trusted across Europe
              </p>
              <Mascot size={40} className="hidden sm:block" />
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              Sell your phone or tablet in minutes. Get paid fast.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">
              flippie buys your used iPhone, iPad, or Samsung Galaxy S directly from you — no listings, no
              strangers, no waiting for a buyer. Get an instant offer, ship it with a free label, get paid.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sell"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
              >
                Get your instant quote
              </Link>
              {SHOP_ENABLED && (
                <Link
                  href="/shop"
                  className="rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
                >
                  Shop refurbished devices
                </Link>
              )}
            </div>
          </div>
          <div className="relative">
            <Image
              src="/images/hero-mascot.jpg"
              alt="A smiling flippie user holding up the flippie app on her phone, sitting next to the flippie mascot"
              width={1122}
              height={1402}
              priority
              sizes="(min-width: 768px) 540px, 100vw"
              className="w-full rounded-3xl border border-border object-cover shadow-sm"
            />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 p-4 shadow-md backdrop-blur-sm sm:right-auto sm:w-60">
              <p className="text-xs font-semibold text-muted">Example instant offer</p>
              <p className="mt-1 text-sm font-semibold text-ink">iPhone 14 · 128GB</p>
              <p className="mt-2 text-3xl font-bold text-primary">
                <AnimatedNumber value={312} format="currency" duration={1.1} />
              </p>
              <p className="mt-1 text-[11px] text-muted">Estimate — actual offers vary by condition and market.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-white py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {VALUE_POINTS.map((point, index) => (
              <Reveal key={point.label} delay={index * 0.08} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-alt text-primary">
                  {point.icon}
                </span>
                <span className="text-sm font-semibold text-ink">{point.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 border-b border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
            <h2 className="text-2xl font-semibold text-ink">How selling to flippie works</h2>
            <Reveal className="justify-self-center md:justify-self-end">
              <Image
                src="/images/offer-screen.jpg"
                alt="A phone screen showing the flippie app with an offer ready to accept"
                width={1122}
                height={1402}
                sizes="192px"
                className="w-40 rounded-2xl border border-border object-cover shadow-sm sm:w-48"
              />
            </Reveal>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="supported-devices" className="scroll-mt-24 mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-ink">What are you selling today?</h2>
        <p className="mt-2 text-muted">Choose a category to get your instant quote.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {categoryRanges.map(({ category, first, last }, index) => (
            <Reveal key={category} delay={index * 0.08}>
              <Link
                href={`/sell?category=${category}`}
                className="group block rounded-2xl border border-border bg-white p-6 transition hover:border-primary hover:shadow-md"
              >
                <DeviceThumbnail
                  category={category}
                  modelName={first.name}
                  releaseYear={first.releaseYear}
                  className="mb-4 h-32 w-full"
                />
                <p className="text-lg font-semibold text-ink group-hover:text-primary">{CATEGORY_LABELS[category]}</p>
                <p className="mt-1 text-sm text-muted">
                  {first.name} – {last.name}
                </p>
                <p className="mt-4 text-sm font-semibold text-primary">Get a quote →</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface-alt py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-10 md:grid-cols-[1fr_1.3fr] md:items-center">
            <Reveal>
              <Image
                src="/images/why-choose-friends.jpg"
                alt="Two friends smiling while looking at the flippie app together"
                width={1448}
                height={1086}
                sizes="(min-width: 768px) 470px, 100vw"
                className="w-full rounded-2xl border border-border object-cover shadow-sm"
              />
            </Reveal>
            <div>
              <h2 className="text-2xl font-semibold text-ink">Why choose flippie</h2>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {TRUST_POINTS.map((point, index) => (
                  <Reveal key={point.title} delay={index * 0.08}>
                    <h3 className="text-lg font-semibold text-ink">{point.title}</h3>
                    <p className="mt-2 text-sm text-muted">{point.body}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-8">
            <p className="text-sm text-muted">Have questions before you get started?</p>
            <Link href="/faq" className="text-sm font-semibold text-primary hover:text-primary-dark">
              Read our FAQ →
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
              <Mascot size={120} />
              <div>
                <h2 className="text-2xl font-semibold text-ink">Fewer new devices, longer device lives</h2>
                <p className="mt-3 max-w-xl text-muted">
                  Every phone or tablet we take in gets inspected, repaired where needed, and resold — instead
                  of sitting in a drawer or ending up in landfill. Buying refurbished and trading in your old
                  device are both small, concrete ways to cut down on electronic waste without giving up the
                  tech you rely on.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary to-primary-dark py-16 text-white">
        <Reveal className="mx-auto max-w-2xl px-6 text-center">
          <Image
            src="/images/cta-mascot.jpg"
            alt="The flippie mascot celebrating"
            width={1254}
            height={1254}
            sizes="128px"
            className="mx-auto h-28 w-28 rounded-2xl object-cover shadow-lg sm:h-32 sm:w-32"
          />
          <h2 className="mt-6 text-2xl font-semibold md:text-3xl">Ready to see what your device is worth?</h2>
          <p className="mt-3 text-white/80">
            Get an instant offer in under two minutes — no account, no obligation.
          </p>
          <Link
            href="/sell"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-surface"
          >
            Get your instant quote
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
