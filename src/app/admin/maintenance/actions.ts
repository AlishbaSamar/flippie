"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const CONFIRM_PHRASE = "DELETE ALL DATA";

export interface ClearDemoDataResult {
  returnRequests: number;
  orders: number;
  inventoryItems: number;
  purchases: number;
}

/**
 * One-time cleanup for leftover seed/demo data in a freshly-launched
 * environment. Wipes every Purchase, Order, InventoryItem, and ReturnRequest
 * row while leaving the DeviceModel catalog untouched. Deliberately requires
 * the caller to pass the exact confirmation phrase so it can't be triggered
 * by a stray click.
 */
export async function clearDemoData(confirmation: string): Promise<ClearDemoDataResult> {
  if (confirmation !== CONFIRM_PHRASE) {
    throw new Error(`Type "${CONFIRM_PHRASE}" exactly to confirm.`);
  }

  const [returnRequests, orders, inventoryItems, purchases] = await prisma.$transaction([
    prisma.returnRequest.deleteMany(),
    prisma.order.deleteMany(),
    prisma.inventoryItem.deleteMany(),
    prisma.purchase.deleteMany(),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/purchases");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/returns");
  revalidatePath("/shop");

  return {
    returnRequests: returnRequests.count,
    orders: orders.count,
    inventoryItems: inventoryItems.count,
    purchases: purchases.count,
  };
}
