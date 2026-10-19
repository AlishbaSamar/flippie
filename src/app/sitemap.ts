import type { MetadataRoute } from "next";
import { SHOP_ENABLED } from "@/lib/feature-flags";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

// Regenerate hourly so newly listed/sold inventory shows up without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: SHOP_ENABLED ? "daily" : "weekly", priority: SHOP_ENABLED ? 0.9 : 0.3 },
    { url: `${SITE_URL}/sell`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/refunds`, changeFrequency: "yearly", priority: 0.3 },
  ];

  if (!SHOP_ENABLED) return staticRoutes;

  const listedItems = await prisma.inventoryItem.findMany({
    where: { status: "LISTED" },
    select: { id: true, createdAt: true },
  });

  const productRoutes: MetadataRoute.Sitemap = listedItems.map((item) => ({
    url: `${SITE_URL}/shop/${item.id}`,
    lastModified: item.createdAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
