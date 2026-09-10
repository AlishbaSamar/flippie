import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { DeviceThumbnail } from "@/components/DeviceThumbnail";
import { findInventoryItem, INVENTORY } from "@/data/inventory";
import {
  BATTERY_LABELS,
  BODY_LABELS,
  conditionGrade,
  FUNCTIONAL_LABELS,
  GRADE_DESCRIPTIONS,
  SCREEN_LABELS,
} from "@/lib/condition";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = findInventoryItem(id);
  if (!item) return {};
  return {
    title: `${item.model.name} (${item.storage.label}) — flippie`,
    description: `Certified refurbished ${item.model.name}, ${item.storage.label}, ${conditionGrade(item.condition)} condition.`,
  };
}

export function generateStaticParams() {
  return INVENTORY.map((item) => ({ id: item.id }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const item = findInventoryItem(id);
  if (!item) notFound();

  const grade = conditionGrade(item.condition);

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <Link href="/shop" className="text-sm font-semibold text-muted transition hover:text-ink">
        ← Back to shop
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <DeviceThumbnail category={item.model.category} className="h-96" />

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
