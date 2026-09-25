import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { DeviceThumbnail } from "@/components/DeviceThumbnail";
import {
  BATTERY_LABELS,
  BODY_LABELS,
  conditionGrade,
  FUNCTIONAL_LABELS,
  GRADE_DESCRIPTIONS,
  SCREEN_LABELS,
} from "@/lib/condition";
import { mapInventoryItem } from "@/lib/db-mappers";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function loadItem(id: string) {
  const row = await prisma.inventoryItem.findUnique({ where: { id }, include: { model: true } });
  return row ? mapInventoryItem(row) : null;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await loadItem(id);
  if (!item) return {};
  const title = `${item.model.name} (${item.storage.label}) — flippie`;
  const description = `Certified refurbished ${item.model.name}, ${item.storage.label}, ${conditionGrade(item.condition)} condition. €${item.listPriceEUR}.`;
  return {
    title,
    description,
    alternates: { canonical: `/shop/${id}` },
    openGraph: { title, description, type: "website" },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const item = await loadItem(id);
  if (!item) notFound();

  const grade = conditionGrade(item.condition);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${item.model.name} (${item.storage.label})`,
    description: `Certified refurbished ${item.model.name}, ${item.storage.label}, ${grade} condition.`,
    brand: { "@type": "Brand", name: item.model.name.split(" ")[0] },
    itemCondition: "https://schema.org/RefurbishedCondition",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${item.id}`,
      priceCurrency: "EUR",
      price: item.listPriceEUR,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/RefurbishedCondition",
    },
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <Link href="/shop" className="text-sm font-semibold text-muted transition hover:text-ink">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <DeviceThumbnail
          category={item.model.category}
          modelName={item.model.name}
          releaseYear={item.model.releaseYear}
          className="h-96"
        />

        <div>
          <h1 className="text-3xl font-semibold text-ink">{item.model.name}</h1>
          <p className="mt-1 text-muted">{item.storage.label}</p>
          <p className="mt-6 text-4xl font-bold text-ink">€{item.listPriceEUR}</p>

          <div className="mt-6 rounded-2xl border border-border bg-white p-5">
            <p className="font-semibold text-ink">{grade} condition</p>
            <p className="mt-1 text-sm text-muted">{GRADE_DESCRIPTIONS[grade]}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink">
              <li>• {FUNCTIONAL_LABELS[item.condition.functional]}</li>
              <li>• {SCREEN_LABELS[item.condition.screen]}</li>
              <li>• {BODY_LABELS[item.condition.body]}</li>
              <li>• {BATTERY_LABELS[item.condition.battery]}</li>
            </ul>
          </div>

          <div className="mt-8">
            <AddToCartButton itemId={item.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
