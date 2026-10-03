import type { Metadata } from "next";
import Link from "next/link";
import { InventoryList } from "@/app/admin/inventory/InventoryList";
import { mapCondition } from "@/lib/db-mappers";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Inventory — flippie",
};

export const dynamic = "force-dynamic";

const WORKING_STATUSES = ["PROCESSING", "WIPING_DATA", "REPAIR", "FINAL_QA", "RETURNED", "QUARANTINE"] as const;

export default async function AdminInventoryPage() {
  const [workingRows, listedCount, reservedCount, soldCount] = await Promise.all([
    prisma.inventoryItem.findMany({
      where: { status: { in: [...WORKING_STATUSES] } },
      include: { model: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.inventoryItem.count({ where: { status: "LISTED" } }),
    prisma.inventoryItem.count({ where: { status: "RESERVED" } }),
    prisma.inventoryItem.count({ where: { status: "SOLD" } }),
  ]);

  const items = workingRows.map((row) => ({
    id: row.id,
    status: row.status,
    modelName: row.model.name,
    storageLabel: row.storageLabel,
    listPriceEUR: row.listPriceEUR,
    imei: row.imei,
    condition: mapCondition(row.condition),
    createdAtLabel: row.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  }));

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Inventory</h1>
          <p className="mt-1 text-muted">Move devices through prep — wiping, repair, QA — before they&apos;re listed.</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-muted transition hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-muted">Listed</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{listedCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-muted">Reserved (in checkout)</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{reservedCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-white p-5">
          <p className="text-sm text-muted">Sold</p>
          <p className="mt-1 text-2xl font-semibold text-ink">{soldCount}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-ink">In prep ({items.length})</h2>
        <div className="mt-4">
          <InventoryList items={items} />
        </div>
      </div>
    </main>
  );
}
