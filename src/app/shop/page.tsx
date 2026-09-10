import type { Metadata } from "next";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { INVENTORY } from "@/data/inventory";

export const metadata: Metadata = {
  title: "Shop refurbished devices — flippie",
  description: "Browse tested, certified refurbished iPhones, iPads, and Samsung Galaxy S phones.",
};

export default function ShopPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-3xl font-semibold text-ink">Shop refurbished devices</h1>
      <p className="mt-2 max-w-xl text-muted">
        Every device is bought, tested, and graded by us before it&apos;s listed — no third-party sellers.
      </p>
      <div className="mt-8">
        <ShopBrowser items={INVENTORY} />
      </div>
    </main>
  );
}
