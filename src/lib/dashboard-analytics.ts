import { CATEGORY_LABELS } from "@/data/devices";
import { MONTHLY_STATS, MONTHS } from "@/data/analytics";
import { INVENTORY } from "@/data/inventory";
import { Country } from "@/types/commerce";
import { DeviceCategory } from "@/types/device";

const LATEST_MONTH = MONTHS[MONTHS.length - 1].month;
const PREVIOUS_MONTH = MONTHS[MONTHS.length - 2].month;

export function getKpis() {
  const totalRevenue = sum(MONTHLY_STATS, (row) => row.salesRevenueEUR);
  const totalSalesUnits = sum(MONTHLY_STATS, (row) => row.salesUnits);
  const totalPurchaseUnits = sum(MONTHLY_STATS, (row) => row.purchaseUnits);
  const totalPurchaseSpend = sum(MONTHLY_STATS, (row) => row.purchaseRevenueEUR);

  const latestMonthSales = sum(
    MONTHLY_STATS.filter((row) => row.month === LATEST_MONTH),
    (row) => row.salesUnits,
  );
  const pendingOrders = Math.max(4, Math.round(latestMonthSales * 0.06));
  const listedInventory = INVENTORY.filter((item) => item.status === "listed").length;

  return {
    totalRevenue,
    totalSalesUnits,
    totalPurchaseUnits,
    totalPurchaseSpend,
    pendingOrders,
    listedInventory,
  };
}

export function getRevenueTrend() {
  return MONTHS.map(({ month, label }) => ({
    month,
    label,
    revenue: sum(
      MONTHLY_STATS.filter((row) => row.month === month),
      (row) => row.salesRevenueEUR,
    ),
  }));
}

export function getVolumeTrend() {
  return MONTHS.map(({ month, label }) => ({
    month,
    label,
    sales: sum(
      MONTHLY_STATS.filter((row) => row.month === month),
      (row) => row.salesUnits,
    ),
    purchases: sum(
      MONTHLY_STATS.filter((row) => row.month === month),
      (row) => row.purchaseUnits,
    ),
  }));
}

export interface CountryPerformance {
  country: Country;
  revenue: number;
  salesUnits: number;
  purchaseUnits: number;
  growthPct: number;
}

export function getCountryPerformance(): CountryPerformance[] {
  const byCountry = new Map<string, CountryPerformance>();

  for (const row of MONTHLY_STATS) {
    if (row.month !== LATEST_MONTH) continue;
    const existing = byCountry.get(row.country.code);
    if (existing) {
      existing.revenue += row.salesRevenueEUR;
      existing.salesUnits += row.salesUnits;
      existing.purchaseUnits += row.purchaseUnits;
    } else {
      byCountry.set(row.country.code, {
        country: row.country,
        revenue: row.salesRevenueEUR,
        salesUnits: row.salesUnits,
        purchaseUnits: row.purchaseUnits,
        growthPct: 0,
      });
    }
  }

  const previousRevenueByCountry = new Map<string, number>();
  for (const row of MONTHLY_STATS) {
    if (row.month !== PREVIOUS_MONTH) continue;
    previousRevenueByCountry.set(
      row.country.code,
      (previousRevenueByCountry.get(row.country.code) ?? 0) + row.salesRevenueEUR,
    );
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

export function getCategoryPerformance(): CategoryPerformance[] {
  const byCategory = new Map<DeviceCategory, CategoryPerformance>();

  for (const row of MONTHLY_STATS) {
    const existing = byCategory.get(row.category);
    if (existing) {
      existing.revenue += row.salesRevenueEUR;
      existing.units += row.salesUnits;
    } else {
      byCategory.set(row.category, {
        category: row.category,
        label: CATEGORY_LABELS[row.category],
        revenue: row.salesRevenueEUR,
        units: row.salesUnits,
      });
    }
  }

  return Array.from(byCategory.values()).sort((a, b) => b.revenue - a.revenue);
}

function sum<T>(rows: T[], select: (row: T) => number): number {
  return rows.reduce((total, row) => total + select(row), 0);
}
