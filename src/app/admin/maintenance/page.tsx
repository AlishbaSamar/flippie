import type { Metadata } from "next";
import Link from "next/link";
import { ClearDataPanel } from "@/app/admin/maintenance/ClearDataPanel";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Maintenance — flippie",
};

export const dynamic = "force-dynamic";

export default async function AdminMaintenancePage() {
  const [purchases, orders, inventoryItems, returnRequests] = await Promise.all([
    prisma.purchase.count(),
    prisma.order.count(),
    prisma.inventoryItem.count(),
    prisma.returnRequest.count(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Maintenance</h1>
          <p className="mt-1 text-muted">One-time data tools. Handle with care.</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-muted transition hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--viz-critical)]/30 bg-[var(--viz-critical)]/5 p-6">
        <p className="font-semibold text-ink">Clear test data</p>
        <p className="mt-1 text-sm text-muted">
          Permanently deletes every trade-in, order, inventory item, and return in the database. The device
          catalog (iPhone/iPad/Galaxy models) is not affected. This cannot be undone — only use this if you&apos;re
          certain no real customer data is mixed in.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Count label="Purchases" value={purchases} />
          <Count label="Orders" value={orders} />
          <Count label="Inventory items" value={inventoryItems} />
          <Count label="Returns" value={returnRequests} />
        </div>

        <div className="mt-6">
          <ClearDataPanel />
        </div>
      </div>
    </main>
  );
}

function Count({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink">{value.toLocaleString("en-IE")}</p>
    </div>
  );
}
