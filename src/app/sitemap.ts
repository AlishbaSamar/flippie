import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

// Regenerate hourly so newly listed/sold inventory shows up without a redeploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listedItems = await prisma.inventoryItem.findMany({
    where: { status: "LISTED" },
    select: { id: true, createdAt: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/sell`, changeFrequency: "monthly", priority: 0.8 },
  ];

  const productRoutes: MetadataRoute.Sitemap = listedItems.map((item) => ({
    url: `${SITE_URL}/shop/${item.id}`,
    lastModified: item.createdAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes];
}
