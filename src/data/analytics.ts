import { EU_COUNTRIES } from "@/data/countries";
import { ALL_DEVICES } from "@/data/devices";
import { mulberry32 } from "@/lib/seeded-random";
import { Country } from "@/types/commerce";
import { DeviceCategory, DeviceModel } from "@/types/device";

export interface CountryMonthStat {
  month: string;
  monthLabel: string;
  country: Country;
  category: DeviceCategory;
  salesRevenueEUR: number;
  salesUnits: number;
  purchaseRevenueEUR: number;
  purchaseUnits: number;
}

const MONTH_LABELS = ["Apr 2026", "May 2026", "Jun 2026", "Jul 2026", "Aug 2026", "Sep 2026"];
const MONTH_KEYS = ["2026-04", "2026-05", "2026-06", "2026-07", "2026-08", "2026-09"];

/** Monthly revenue baseline and month-over-month growth rate per country — tuned to tell a realistic story. */
const COUNTRY_PROFILES: Record<string, { base: number; growth: number }> = {
  DE: { base: 16000, growth: 0.09 },
  FR: { base: 14500, growth: -0.06 },
  NL: { base: 12000, growth: 0.03 },
  ES: { base: 10500, growth: -0.01 },
  IT: { base: 10000, growth: -0.04 },
  PL: { base: 6500, growth: 0.07 },
  BE: { base: 8000, growth: 0.02 },
  AT: { base: 6500, growth: 0.04 },
  SE: { base: 7500, growth: 0.01 },
  PT: { base: 4200, growth: -0.02 },
  IE: { base: 5500, growth: 0.05 },
  FI: { base: 3800, growth: 0 },
  DK: { base: 4800, growth: 0.02 },
};

const CATEGORY_SPLIT: Record<DeviceCategory, number> = {
  iphone: 0.5,
  "galaxy-s": 0.32,
  ipad: 0.18,
};

const CATEGORY_AVG_PRICE: Record<DeviceCategory, number> = {
  iphone: 420,
  "galaxy-s": 430,
  ipad: 260,
};

const PURCHASE_COST_RATIO = 0.74;

function buildMonthlyStats(): CountryMonthStat[] {
  const random = mulberry32(20260910);
  const rows: CountryMonthStat[] = [];

  for (const country of EU_COUNTRIES) {
    const profile = COUNTRY_PROFILES[country.code] ?? { base: 5000, growth: 0 };

    MONTH_KEYS.forEach((month, monthIndex) => {
      const monthsFromStart = monthIndex - (MONTH_KEYS.length - 1);
      const trend = profile.base * Math.pow(1 + profile.growth, monthsFromStart);
      const noise = 0.9 + random() * 0.2;
      const monthRevenue = trend * noise;

      (Object.keys(CATEGORY_SPLIT) as DeviceCategory[]).forEach((category) => {
        const categoryJitter = 0.85 + random() * 0.3;
        const salesRevenueEUR = Math.round(monthRevenue * CATEGORY_SPLIT[category] * categoryJitter);
        const salesUnits = Math.max(1, Math.round(salesRevenueEUR / CATEGORY_AVG_PRICE[category]));
        const purchaseRevenueEUR = Math.round(salesRevenueEUR * PURCHASE_COST_RATIO);
        const purchaseUnits = Math.max(1, Math.round(salesUnits * (0.9 + random() * 0.15)));

        rows.push({
          month,
          monthLabel: MONTH_LABELS[monthIndex],
          country,
          category,
          salesRevenueEUR,
          salesUnits,
          purchaseRevenueEUR,
          purchaseUnits,
        });
      });
    });
  }

  return rows;
}

export const MONTHLY_STATS: CountryMonthStat[] = buildMonthlyStats();
export const MONTHS = MONTH_KEYS.map((month, index) => ({ month, label: MONTH_LABELS[index] }));

export interface ModelPerformance {
  model: DeviceModel;
  unitsSold: number;
  revenueEUR: number;
}

function buildTopModels(): ModelPerformance[] {
  const random = mulberry32(70260910);

  const recentModels = ALL_DEVICES.filter((model) => model.releaseYear >= 2022);
  const rows = recentModels.map((model) => {
    const recencyWeight = 1 + (model.releaseYear - 2022) * 0.35;
    const unitsSold = Math.max(6, Math.round(40 * recencyWeight * (0.6 + random() * 0.8)));
    const revenueEUR = Math.round(unitsSold * model.basePriceEUR * 1.35);
    return { model, unitsSold, revenueEUR };
  });

  return rows.sort((a, b) => b.revenueEUR - a.revenueEUR).slice(0, 8);
}

export const TOP_MODELS: ModelPerformance[] = buildTopModels();
