import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { mapInventoryItem } from "@/lib/db-mappers";
import { prisma } from "@/lib/prisma";
import type { DeviceCategory } from "@/types/device";

export const metadata: Metadata = {
  title: "Shop refurbished devices — flippie",
  description: "Browse tested, certified refurbished iPhones, iPads, and Samsung Galaxy S phones.",
  alternates: { canonical: "/shop" },
};

export const dynamic = "force-dynamic";

const VALID_CATEGORIES: DeviceCategory[] = ["iphone", "ipad", "galaxy-s"];

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const initialCategory = VALID_CATEGORIES.find((category) => category === params.category);

  const rows = await prisma.inventoryItem.findMany({
    where: { status: "LISTED" },
    include: { model: true },
    orderBy: { createdAt: "desc" },
  });
  const items = rows.map(mapInventoryItem);

  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-semibold text-ink">Shop refurbished devices</h1>
      <p className="mt-2 max-w-xl text-muted">
        Every device is bought, tested, and graded by us before it&apos;s listed — no third-party sellers.
      </p>
      <div className="mt-8">
        <ShopBrowser items={items} initialCategory={initialCategory} />
      </div>
    </main>
  );
}
