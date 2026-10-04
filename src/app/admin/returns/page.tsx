import type { Metadata } from "next";
import Link from "next/link";
import { ReturnQueue } from "@/app/admin/returns/ReturnQueue";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Returns — flippie",
};

export const dynamic = "force-dynamic";

const HISTORY_LIMIT = 30;

export default async function AdminReturnsPage() {
  const [pendingRows, historyRows] = await Promise.all([
    prisma.returnRequest.findMany({
      where: { status: { in: ["REQUESTED", "APPROVED", "RECEIVED"] } },
      include: { order: { include: { inventoryItem: { include: { model: true } } } } },
      orderBy: { createdAt: "asc" },
    }),
    prisma.returnRequest.findMany({
      where: { status: { in: ["REFUNDED", "REJECTED"] } },
      include: { order: { include: { inventoryItem: { include: { model: true } } } } },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
    }),
  ]);

  const mapItem = (row: (typeof pendingRows)[number]) => ({
    id: row.id,
    status: row.status,
    reason: row.reason,
    customerNote: row.customerNote,
    adminNote: row.adminNote,
    refundAmountEUR: row.refundAmountEUR,
    createdAtLabel: row.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    itemName: `${row.order.inventoryItem.model.name} (${row.order.inventoryItem.storageLabel})`,
    orderPriceEUR: row.order.priceEUR,
    customerName: row.order.customerName,
    customerEmail: row.order.customerEmail,
  });

  const pending = pendingRows.map(mapItem);
  const history = historyRows.map(mapItem);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Returns</h1>
          <p className="mt-1 text-muted">Review return requests, receive devices, and issue refunds.</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-muted transition hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <div className="mt-8">
        <ReturnQueue pending={pending} history={history} />
      </div>
    </main>
  );
}
