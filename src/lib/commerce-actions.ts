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

export interface PlaceOrderInput {
  itemIds: string[];
  customerName: string;
  customerEmail: string;
  countryCode: string;
  countryName: string;
}

export async function placeOrder(input: PlaceOrderInput): Promise<{ orderIds: string[] }> {
  const items = await prisma.inventoryItem.findMany({
    where: { id: { in: input.itemIds }, status: "LISTED" },
  });

  if (items.length === 0) {
    throw new Error("None of the selected items are available anymore.");
  }

  const orderIds = await prisma.$transaction(
    async (tx) => {
      const orders = await Promise.all(
        items.map((item) =>
          tx.order.create({
            data: {
              inventoryItemId: item.id,
              priceEUR: item.listPriceEUR,
              status: "PAID",
              countryCode: input.countryCode,
              countryName: input.countryName,
              customerName: input.customerName,
              customerEmail: input.customerEmail,
            },
          }),
        ),
      );
      await tx.inventoryItem.updateMany({
        where: { id: { in: items.map((item) => item.id) } },
        data: { status: "SOLD" },
      });
      return orders.map((order) => order.id);
    },
    { timeout: 15000 },
  );

  return { orderIds };
}
