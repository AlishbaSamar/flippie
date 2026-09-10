import { CATEGORY_LABELS } from "@/lib/category-labels";
import { prisma } from "@/lib/prisma";
import type { DeviceCategory as DbCategory } from "@/generated/prisma/client";
import type { Country } from "@/types/commerce";
import type { DeviceCategory } from "@/types/device";

const DB_TO_APP_CATEGORY: Record<DbCategory, DeviceCategory> = {
  IPHONE: "iphone",
  IPAD: "ipad",
  GALAXY_S: "galaxy-s",
};

interface MonthBucket {
  key: string;
  label: string;
  start: Date;
  end: Date;
}

function lastSixMonths(): MonthBucket[] {
  const now = new Date();
  const buckets: MonthBucket[] = [];
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    buckets.push({
      key: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
      label: start.toLocaleDateString("en-GB", { month: "short", year: "numeric" }),
      start,
      end,
    });
  }
  return buckets;
}

function monthKeyFor(date: Date, buckets: MonthBucket[]): string | null {
  const bucket = buckets.find((b) => date >= b.start && date < b.end);
  return bucket?.key ?? null;
}

export async function getKpis() {
  const [revenueAgg, salesCount, purchaseAgg, pendingOrders, listedInventory] = await Promise.all([
    prisma.order.aggregate({ _sum: { priceEUR: true } }),
    prisma.order.count(),
    prisma.purchase.aggregate({ _sum: { offerEUR: true }, _count: true }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.inventoryItem.count({ where: { status: "LISTED" } }),
  ]);

  return {
    totalRevenue: revenueAgg._sum.priceEUR ?? 0,
    totalSalesUnits: salesCount,
    totalPurchaseUnits: purchaseAgg._count,
    totalPurchaseSpend: purchaseAgg._sum.offerEUR ?? 0,
    pendingOrders,
    listedInventory,
  };
}

export async function getRevenueTrend() {
  const buckets = lastSixMonths();
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: buckets[0].start } },
    select: { priceEUR: true, createdAt: true },
  });

  return buckets.map((bucket) => ({
    month: bucket.key,
    label: bucket.label,
    revenue: orders
      .filter((order) => monthKeyFor(order.createdAt, buckets) === bucket.key)
      .reduce((sum, order) => sum + order.priceEUR, 0),
  }));
}

export async function getVolumeTrend() {
  const buckets = lastSixMonths();
  const [orders, purchases] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: buckets[0].start } },
      select: { createdAt: true },
    }),
    prisma.purchase.findMany({
      where: { createdAt: { gte: buckets[0].start } },
      select: { createdAt: true },
    }),
  ]);

  return buckets.map((bucket) => ({
    month: bucket.key,
    label: bucket.label,
    sales: orders.filter((o) => monthKeyFor(o.createdAt, buckets) === bucket.key).length,
    purchases: purchases.filter((p) => monthKeyFor(p.createdAt, buckets) === bucket.key).length,
  }));
}

export interface CountryPerformance {
  country: Country;
  revenue: number;
  salesUnits: number;
  purchaseUnits: number;
  growthPct: number;
}

export async function getCountryPerformance(): Promise<CountryPerformance[]> {
  const buckets = lastSixMonths();
  const currentBucket = buckets[buckets.length - 1];
  const previousBucket = buckets[buckets.length - 2];

  const [currentOrders, previousOrders, purchases] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: currentBucket.start, lt: currentBucket.end } },
      select: { priceEUR: true, countryCode: true, countryName: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: previousBucket.start, lt: previousBucket.end } },
      select: { priceEUR: true, countryCode: true },
    }),
    prisma.purchase.findMany({
      where: { createdAt: { gte: currentBucket.start, lt: currentBucket.end } },
      select: { countryCode: true },
    }),
  ]);

  const byCountry = new Map<string, CountryPerformance>();
  for (const order of currentOrders) {
    const existing = byCountry.get(order.countryCode);
    if (existing) {
      existing.revenue += order.priceEUR;
      existing.salesUnits += 1;
    } else {
      byCountry.set(order.countryCode, {
        country: { code: order.countryCode, name: order.countryName },
        revenue: order.priceEUR,
        salesUnits: 1,
        purchaseUnits: 0,
        growthPct: 0,
      });
    }
  }

  for (const purchase of purchases) {
    const entry = byCountry.get(purchase.countryCode);
    if (entry) entry.purchaseUnits += 1;
  }

  const previousRevenueByCountry = new Map<string, number>();
  for (const order of previousOrders) {
    previousRevenueByCountry.set(order.countryCode, (previousRevenueByCountry.get(order.countryCode) ?? 0) + order.priceEUR);
  }

  for (const entry of byCountry.values()) {
    const previous = previousRevenueByCountry.get(entry.country.code) ?? entry.revenue;
    entry.growthPct = previous === 0 ? 0 : ((entry.revenue - previous) / previous) * 100;
  }

  return Array.from(byCountry.values()).sort((a, b) => b.revenue - a.revenue);
}

export interface CategoryPerformance {
  category: DeviceCategory;
  label: string;
  revenue: number;
  units: number;
}

export async function getCategoryPerformance(): Promise<CategoryPerformance[]> {
  const buckets = lastSixMonths();
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: buckets[0].start } },
    select: { priceEUR: true, inventoryItem: { select: { model: { select: { category: true } } } } },
  });

  const byCategory = new Map<DeviceCategory, CategoryPerformance>();
  for (const order of orders) {
    const category = DB_TO_APP_CATEGORY[order.inventoryItem.model.category];
    const existing = byCategory.get(category);
    if (existing) {
      existing.revenue += order.priceEUR;
      existing.units += 1;
    } else {
      byCategory.set(category, { category, label: CATEGORY_LABELS[category], revenue: order.priceEUR, units: 1 });
    }
  }

  return Array.from(byCategory.values()).sort((a, b) => b.revenue - a.revenue);
}

export interface ModelPerformance {
  modelId: string;
  modelName: string;
  unitsSold: number;
  revenueEUR: number;
}

export async function getTopModels(limit = 8): Promise<ModelPerformance[]> {
  const buckets = lastSixMonths();
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: buckets[0].start } },
    select: { priceEUR: true, inventoryItem: { select: { model: { select: { id: true, name: true } } } } },
  });

  const byModel = new Map<string, ModelPerformance>();
  for (const order of orders) {
    const { id, name } = order.inventoryItem.model;
    const existing = byModel.get(id);
    if (existing) {
      existing.revenueEUR += order.priceEUR;
      existing.unitsSold += 1;
    } else {
      byModel.set(id, { modelId: id, modelName: name, revenueEUR: order.priceEUR, unitsSold: 1 });
    }
  }

  return Array.from(byModel.values())
    .sort((a, b) => b.revenueEUR - a.revenueEUR)
    .slice(0, limit);
}
