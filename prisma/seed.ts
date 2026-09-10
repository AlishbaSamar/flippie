import "dotenv/config";
import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Deterministic PRNG so re-running the seed produces the same data. */
function mulberry32(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const random = mulberry32(20260910);

type Category = "IPHONE" | "IPAD" | "GALAXY_S";
type Storage = { gb: number; label: string };

const storages = (...gbList: number[]): Storage[] =>
  gbList.map((gb) => ({ gb, label: gb >= 1000 ? `${gb / 1000}TB` : `${gb}GB` }));

interface ModelSeed {
  id: string;
  category: Category;
  name: string;
  releaseYear: number;
  storageOptions: Storage[];
  basePriceEUR: number;
}

const MODELS: ModelSeed[] = [
  { id: "iphone-11", category: "IPHONE", name: "iPhone 11", releaseYear: 2019, storageOptions: storages(64, 128, 256), basePriceEUR: 120 },
  { id: "iphone-12", category: "IPHONE", name: "iPhone 12", releaseYear: 2020, storageOptions: storages(64, 128, 256), basePriceEUR: 180 },
  { id: "iphone-13", category: "IPHONE", name: "iPhone 13", releaseYear: 2021, storageOptions: storages(128, 256, 512), basePriceEUR: 260 },
  { id: "iphone-14", category: "IPHONE", name: "iPhone 14", releaseYear: 2022, storageOptions: storages(128, 256, 512), basePriceEUR: 340 },
  { id: "iphone-15", category: "IPHONE", name: "iPhone 15", releaseYear: 2023, storageOptions: storages(128, 256, 512), basePriceEUR: 460 },
  { id: "iphone-16", category: "IPHONE", name: "iPhone 16", releaseYear: 2024, storageOptions: storages(128, 256, 512), basePriceEUR: 600 },
  { id: "iphone-17", category: "IPHONE", name: "iPhone 17", releaseYear: 2025, storageOptions: storages(256, 512, 1000), basePriceEUR: 780 },

  { id: "ipad-9th-generation", category: "IPAD", name: "iPad (9th generation)", releaseYear: 2021, storageOptions: storages(64, 256), basePriceEUR: 140 },
  { id: "ipad-10th-generation", category: "IPAD", name: "iPad (10th generation)", releaseYear: 2022, storageOptions: storages(64, 256), basePriceEUR: 220 },
  { id: "ipad-11th-generation", category: "IPAD", name: "iPad (11th generation)", releaseYear: 2025, storageOptions: storages(128, 256, 512), basePriceEUR: 320 },

  { id: "galaxy-s21", category: "GALAXY_S", name: "Galaxy S21", releaseYear: 2021, storageOptions: storages(128, 256), basePriceEUR: 110 },
  { id: "galaxy-s21+", category: "GALAXY_S", name: "Galaxy S21+", releaseYear: 2021, storageOptions: storages(128, 256), basePriceEUR: 140 },
  { id: "galaxy-s21-ultra", category: "GALAXY_S", name: "Galaxy S21 Ultra", releaseYear: 2021, storageOptions: storages(128, 256, 512), basePriceEUR: 190 },
  { id: "galaxy-s22", category: "GALAXY_S", name: "Galaxy S22", releaseYear: 2022, storageOptions: storages(128, 256), basePriceEUR: 160 },
  { id: "galaxy-s22+", category: "GALAXY_S", name: "Galaxy S22+", releaseYear: 2022, storageOptions: storages(128, 256), basePriceEUR: 200 },
  { id: "galaxy-s22-ultra", category: "GALAXY_S", name: "Galaxy S22 Ultra", releaseYear: 2022, storageOptions: storages(128, 256, 512), basePriceEUR: 260 },
  { id: "galaxy-s23", category: "GALAXY_S", name: "Galaxy S23", releaseYear: 2023, storageOptions: storages(128, 256), basePriceEUR: 240 },
  { id: "galaxy-s23+", category: "GALAXY_S", name: "Galaxy S23+", releaseYear: 2023, storageOptions: storages(256, 512), basePriceEUR: 290 },
  { id: "galaxy-s23-ultra", category: "GALAXY_S", name: "Galaxy S23 Ultra", releaseYear: 2023, storageOptions: storages(256, 512, 1000), basePriceEUR: 380 },
  { id: "galaxy-s24", category: "GALAXY_S", name: "Galaxy S24", releaseYear: 2024, storageOptions: storages(128, 256), basePriceEUR: 340 },
  { id: "galaxy-s24+", category: "GALAXY_S", name: "Galaxy S24+", releaseYear: 2024, storageOptions: storages(256, 512), basePriceEUR: 410 },
  { id: "galaxy-s24-ultra", category: "GALAXY_S", name: "Galaxy S24 Ultra", releaseYear: 2024, storageOptions: storages(256, 512, 1000), basePriceEUR: 520 },
  { id: "galaxy-s25", category: "GALAXY_S", name: "Galaxy S25", releaseYear: 2025, storageOptions: storages(128, 256), basePriceEUR: 460 },
  { id: "galaxy-s25+", category: "GALAXY_S", name: "Galaxy S25+", releaseYear: 2025, storageOptions: storages(256, 512), basePriceEUR: 540 },
  { id: "galaxy-s25-ultra", category: "GALAXY_S", name: "Galaxy S25 Ultra", releaseYear: 2025, storageOptions: storages(256, 512, 1000), basePriceEUR: 660 },
];

function findModel(id: string): ModelSeed {
  const model = MODELS.find((m) => m.id === id);
  if (!model) throw new Error(`Unknown seed model: ${id}`);
  return model;
}

const EXCELLENT = { functional: "works-perfectly", screen: "flawless", body: "flawless", battery: "90-100" };
const GOOD = { functional: "works-perfectly", screen: "light-wear", body: "light-wear", battery: "80-89" };
const FAIR = { functional: "minor-issues", screen: "light-wear", body: "light-wear", battery: "below-80" };

interface LiveItemSeed {
  modelId: string;
  gb: number;
  condition: typeof EXCELLENT;
  listPriceEUR: number;
}

function resaleEUR(model: ModelSeed, gb: number, gradeMultiplier: number): number {
  const storageIndex = model.storageOptions.findIndex((s) => s.gb === gb);
  const storageMultiplier = 1 + Math.max(storageIndex, 0) * 0.06;
  const offer = Math.max(Math.round((model.basePriceEUR * storageMultiplier * gradeMultiplier) / 5) * 5, 10);
  return Math.round((offer * 1.35) / 5) * 5 - 1;
}

const LIVE_ITEMS: LiveItemSeed[] = [
  { modelId: "iphone-11", gb: 64, condition: FAIR, listPriceEUR: 0 },
  { modelId: "iphone-12", gb: 64, condition: GOOD, listPriceEUR: 0 },
  { modelId: "iphone-13", gb: 128, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "iphone-14", gb: 128, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "iphone-14", gb: 256, condition: GOOD, listPriceEUR: 0 },
  { modelId: "iphone-15", gb: 128, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "iphone-15", gb: 256, condition: GOOD, listPriceEUR: 0 },
  { modelId: "iphone-16", gb: 128, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "iphone-17", gb: 256, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "ipad-9th-generation", gb: 64, condition: GOOD, listPriceEUR: 0 },
  { modelId: "ipad-10th-generation", gb: 256, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "ipad-11th-generation", gb: 128, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "galaxy-s21", gb: 128, condition: GOOD, listPriceEUR: 0 },
  { modelId: "galaxy-s22", gb: 128, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "galaxy-s23", gb: 256, condition: GOOD, listPriceEUR: 0 },
  { modelId: "galaxy-s23-ultra", gb: 256, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "galaxy-s24", gb: 256, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "galaxy-s24-ultra", gb: 512, condition: EXCELLENT, listPriceEUR: 0 },
  { modelId: "galaxy-s25", gb: 128, condition: EXCELLENT, listPriceEUR: 0 },
];

const COUNTRIES: { code: string; name: string; base: number; growth: number }[] = [
  { code: "DE", name: "Germany", base: 5300, growth: 0.09 },
  { code: "FR", name: "France", base: 4800, growth: -0.06 },
  { code: "NL", name: "Netherlands", base: 4000, growth: 0.03 },
  { code: "ES", name: "Spain", base: 3500, growth: -0.01 },
  { code: "IT", name: "Italy", base: 3300, growth: -0.04 },
  { code: "PL", name: "Poland", base: 2200, growth: 0.07 },
  { code: "BE", name: "Belgium", base: 2700, growth: 0.02 },
  { code: "AT", name: "Austria", base: 2200, growth: 0.04 },
  { code: "SE", name: "Sweden", base: 2500, growth: 0.01 },
  { code: "PT", name: "Portugal", base: 1400, growth: -0.02 },
  { code: "IE", name: "Ireland", base: 1800, growth: 0.05 },
  { code: "FI", name: "Finland", base: 1300, growth: 0 },
  { code: "DK", name: "Denmark", base: 1600, growth: 0.02 },
];

const CATEGORY_SPLIT: Record<Category, number> = { IPHONE: 0.5, GALAXY_S: 0.32, IPAD: 0.18 };
const CATEGORY_AVG_PRICE: Record<Category, number> = { IPHONE: 420, GALAXY_S: 430, IPAD: 260 };
const CATEGORY_MODELS: Record<Category, string[]> = {
  IPHONE: MODELS.filter((m) => m.category === "IPHONE").map((m) => m.id),
  IPAD: MODELS.filter((m) => m.category === "IPAD").map((m) => m.id),
  GALAXY_S: MODELS.filter((m) => m.category === "GALAXY_S").map((m) => m.id),
};

function lastSixMonthKeys(): string[] {
  const now = new Date();
  const keys: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return keys;
}

const MONTHS = lastSixMonthKeys();
const CONDITIONS = [EXCELLENT, GOOD, FAIR];

/** Historical rows must never land today or in the future, so cap the current month's range. */
function randomDateInMonth(month: string): Date {
  const [year, mon] = month.split("-").map(Number);
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && mon === now.getMonth() + 1;
  const maxDay = isCurrentMonth ? Math.max(1, now.getDate() - 1) : 27;
  const day = 1 + Math.floor(random() * maxDay);
  const hour = Math.floor(random() * 24);
  return new Date(year, mon - 1, day, hour);
}

function pickModel(category: Category): ModelSeed {
  const ids = CATEGORY_MODELS[category];
  return findModel(ids[Math.floor(random() * ids.length)]);
}

async function main() {
  console.log("Clearing existing seed data...");
  await prisma.order.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.deviceModel.deleteMany();

  console.log("Seeding device catalog...");
  await prisma.deviceModel.createMany({
    data: MODELS.map((m) => ({
      id: m.id,
      category: m.category,
      name: m.name,
      releaseYear: m.releaseYear,
      basePriceEUR: m.basePriceEUR,
      storageOptions: m.storageOptions as unknown as Prisma.InputJsonValue,
    })),
    skipDuplicates: true,
  });

  console.log("Seeding live storefront inventory...");
  await prisma.inventoryItem.createMany({
    data: LIVE_ITEMS.map((item) => {
      const model = findModel(item.modelId);
      const storage = model.storageOptions.find((s) => s.gb === item.gb)!;
      const gradeMultiplier = item.condition === EXCELLENT ? 1 : item.condition === GOOD ? 0.75 : 0.5;
      return {
        id: `${model.id}-${item.gb}-${item.condition.functional}-${item.condition.screen}`,
        modelId: model.id,
        storageGb: item.gb,
        storageLabel: storage.label,
        condition: item.condition as unknown as Prisma.InputJsonValue,
        listPriceEUR: resaleEUR(model, item.gb, gradeMultiplier),
        status: "LISTED",
      };
    }),
    skipDuplicates: true,
  });

  console.log("Generating historical purchases, sold inventory, and orders...");
  const purchases: Prisma.PurchaseCreateManyInput[] = [];
  const soldItems: Prisma.InventoryItemCreateManyInput[] = [];
  const orders: Prisma.OrderCreateManyInput[] = [];

  MONTHS.forEach((month, monthIndex) => {
    const monthsFromEnd = monthIndex - (MONTHS.length - 1);

    for (const country of COUNTRIES) {
      const trend = country.base * Math.pow(1 + country.growth, monthsFromEnd);
      const monthRevenue = trend * (0.9 + random() * 0.2);

      (Object.keys(CATEGORY_SPLIT) as Category[]).forEach((category) => {
        const categoryRevenue = monthRevenue * CATEGORY_SPLIT[category] * (0.85 + random() * 0.3);
        const avgPrice = CATEGORY_AVG_PRICE[category];
        const salesUnits = Math.max(1, Math.round(categoryRevenue / avgPrice));
        const purchaseUnits = Math.max(1, Math.round(salesUnits * (0.9 + random() * 0.15)));

        for (let i = 0; i < purchaseUnits; i++) {
          const model = pickModel(category);
          const storage = model.storageOptions[Math.floor(random() * model.storageOptions.length)];
          const condition = CONDITIONS[Math.floor(random() * CONDITIONS.length)];
          const gradeMultiplier = condition === EXCELLENT ? 1 : condition === GOOD ? 0.75 : 0.5;
          const offerEUR = Math.max(
            Math.round((model.basePriceEUR * gradeMultiplier) / 5) * 5,
            10,
          );
          purchases.push({
            id: randomUUID(),
            modelId: model.id,
            storageGb: storage.gb,
            storageLabel: storage.label,
            condition: condition as unknown as Prisma.InputJsonValue,
            offerEUR,
            status: "PAID",
            countryCode: country.code,
            countryName: country.name,
            createdAt: randomDateInMonth(month),
          });
        }

        for (let i = 0; i < salesUnits; i++) {
          const model = pickModel(category);
          const storage = model.storageOptions[Math.floor(random() * model.storageOptions.length)];
          const condition = CONDITIONS[Math.floor(random() * CONDITIONS.length)];
          const gradeMultiplier = condition === EXCELLENT ? 1 : condition === GOOD ? 0.75 : 0.5;
          const priceEUR = resaleEUR(model, storage.gb, gradeMultiplier);
          const itemId = randomUUID();
          const createdAt = randomDateInMonth(month);

          soldItems.push({
            id: itemId,
            modelId: model.id,
            storageGb: storage.gb,
            storageLabel: storage.label,
            condition: condition as unknown as Prisma.InputJsonValue,
            listPriceEUR: priceEUR,
            status: "SOLD",
            createdAt,
          });

          const customerN = purchases.length + orders.length;
          orders.push({
            id: randomUUID(),
            inventoryItemId: itemId,
            priceEUR,
            status: "DELIVERED",
            countryCode: country.code,
            countryName: country.name,
            customerName: `Seed Customer ${customerN}`,
            customerEmail: `seed-customer-${customerN}@example.com`,
            createdAt,
          });
        }
      });
    }
  });

  await prisma.purchase.createMany({ data: purchases, skipDuplicates: true });
  console.log(`  ${purchases.length} historical purchases`);

  await prisma.inventoryItem.createMany({ data: soldItems, skipDuplicates: true });
  console.log(`  ${soldItems.length} historical (sold) inventory items`);

  await prisma.order.createMany({ data: orders, skipDuplicates: true });
  console.log(`  ${orders.length} historical orders`);

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
