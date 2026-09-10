import type { Metadata } from "next";
import { SellWizard } from "@/components/sell/SellWizard";
import { mapDeviceModel } from "@/lib/db-mappers";
import { prisma } from "@/lib/prisma";
import type { DeviceCategory } from "@/types/device";

export const metadata: Metadata = {
  title: "Sell your device — flippie",
  description: "Get an instant offer for your iPhone, iPad, or Samsung Galaxy S device.",
};

export const dynamic = "force-dynamic";

const VALID_CATEGORIES: DeviceCategory[] = ["iphone", "ipad", "galaxy-s"];

interface SellPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function SellPage({ searchParams }: SellPageProps) {
  const params = await searchParams;
  const initialCategory = VALID_CATEGORIES.find((category) => category === params.category);

  const rows = await prisma.deviceModel.findMany({ orderBy: { releaseYear: "asc" } });
  const allModels = rows.map(mapDeviceModel);

  return <SellWizard allModels={allModels} initialCategory={initialCategory} />;
}
