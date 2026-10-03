"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const UPDATABLE_STATUSES = [
  "PROCESSING",
  "WIPING_DATA",
  "REPAIR",
  "FINAL_QA",
  "LISTED",
  "RETURNED",
  "QUARANTINE",
] as const;

export type UpdatableInventoryStatus = (typeof UPDATABLE_STATUSES)[number];

export interface UpdateInventoryStatusInput {
  itemId: string;
  status: UpdatableInventoryStatus;
  imei?: string;
}

export async function updateInventoryStatus(input: UpdateInventoryStatusInput): Promise<void> {
  if (!UPDATABLE_STATUSES.includes(input.status)) {
    throw new Error("Not a valid status for this action.");
  }

  const imei = input.imei?.trim();
  if (imei && !/^\d{15}$/.test(imei)) {
    throw new Error("IMEI must be exactly 15 digits, or left blank.");
  }

  const item = await prisma.inventoryItem.findUniqueOrThrow({ where: { id: input.itemId } });
  if (item.status === "RESERVED" || item.status === "SOLD") {
    throw new Error("Reserved or sold items can't be edited here.");
  }

  await prisma.inventoryItem.update({
    where: { id: input.itemId },
    data: { status: input.status, ...(imei ? { imei } : {}) },
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin");
  revalidatePath("/shop");
}
