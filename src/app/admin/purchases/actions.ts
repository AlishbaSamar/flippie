"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function approvePurchase(id: string): Promise<void> {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id } });
  if (purchase.status !== "SUBMITTED") {
    throw new Error("Only submitted purchases can be approved.");
  }
  await prisma.purchase.update({ where: { id }, data: { status: "APPROVED" } });
  revalidatePath("/admin/purchases");
}

export async function rejectPurchase(id: string): Promise<void> {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id } });
  if (purchase.status !== "SUBMITTED" && purchase.status !== "APPROVED") {
    throw new Error("This purchase can no longer be rejected.");
  }
  await prisma.purchase.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/purchases");
}

export interface ConvertToInventoryInput {
  purchaseId: string;
  listPriceEUR: number;
  status: "PROCESSING" | "LISTED";
}

export async function convertToInventory(input: ConvertToInventoryInput): Promise<void> {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id: input.purchaseId } });
  if (purchase.status !== "APPROVED") {
    throw new Error("Only approved purchases can be added to inventory.");
  }
  if (!Number.isFinite(input.listPriceEUR) || input.listPriceEUR <= 0) {
    throw new Error("List price must be a positive number.");
  }

  await prisma.$transaction([
    prisma.inventoryItem.create({
      data: {
        modelId: purchase.modelId,
        storageGb: purchase.storageGb,
        storageLabel: purchase.storageLabel,
        condition: purchase.condition as Prisma.InputJsonValue,
        listPriceEUR: Math.round(input.listPriceEUR),
        status: input.status,
        sourcePurchaseId: purchase.id,
      },
    }),
    prisma.purchase.update({ where: { id: purchase.id }, data: { status: "PAID" } }),
  ]);

  revalidatePath("/admin/purchases");
  revalidatePath("/admin");
  revalidatePath("/shop");
}
