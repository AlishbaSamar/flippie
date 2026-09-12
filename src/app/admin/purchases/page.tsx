import type { Metadata } from "next";
import Link from "next/link";
import { PurchaseQueue } from "@/app/admin/purchases/PurchaseQueue";
import { mapCondition, mapDeviceModel } from "@/lib/db-mappers";
import { prisma } from "@/lib/prisma";
import { estimateResalePrice } from "@/lib/valuation";

export const metadata: Metadata = {
  title: "Purchase queue — flippie",
};

export const dynamic = "force-dynamic";

const HISTORY_LIMIT = 30;

export default async function AdminPurchasesPage() {
  const [pendingRows, historyRows] = await Promise.all([
    prisma.purchase.findMany({
      where: { status: { in: ["SUBMITTED", "APPROVED"] } },
      include: { model: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.purchase.findMany({
      where: { status: { in: ["PAID", "REJECTED"] } },
      include: { model: true },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
    }),
  ]);

  const mapItem = (purchase: (typeof pendingRows)[number]) => {
    const condition = mapCondition(purchase.condition);
    const storage = { gb: purchase.storageGb, label: purchase.storageLabel };
    return {
      id: purchase.id,
      status: purchase.status,
      offerEUR: purchase.offerEUR,
      countryName: purchase.countryName,
      createdAtLabel: purchase.createdAt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      modelName: purchase.model.name,
      storageLabel: purchase.storageLabel,
      condition,
      suggestedListPriceEUR: estimateResalePrice(mapDeviceModel(purchase.model), storage, condition),
    };
  };

  const pending = pendingRows.map(mapItem);
  const history = historyRows.map(mapItem);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Purchase queue</h1>
          <p className="mt-1 text-muted">Review trade-in submissions and move approved devices into inventory.</p>
        </div>
        <Link href="/admin" className="text-sm font-semibold text-muted transition hover:text-ink">
          ← Dashboard
        </Link>
      </div>

      <div className="mt-8">
        <PurchaseQueue pending={pending} history={history} />
      </div>
    </main>
  );
}
