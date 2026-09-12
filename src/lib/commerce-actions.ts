"use server";

import { mapInventoryItem } from "@/lib/db-mappers";
import { prisma } from "@/lib/prisma";
import type { InventoryItem } from "@/types/commerce";

export async function getInventoryItemsByIds(ids: string[]): Promise<InventoryItem[]> {
  if (ids.length === 0) return [];
  const rows = await prisma.inventoryItem.findMany({
    where: { id: { in: ids }, status: "LISTED" },
    include: { model: true },
  });
  const byId = new Map(rows.map((row) => [row.id, mapInventoryItem(row)]));
  return ids.map((id) => byId.get(id)).filter((item): item is InventoryItem => item !== undefined);
}

