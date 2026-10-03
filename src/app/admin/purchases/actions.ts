"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@/generated/prisma/client";
import { sendRevisedOfferEmail } from "@/lib/emails";
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
  const rejectable: string[] = ["SUBMITTED", "APPROVED", "RECEIVED", "IN_INSPECTION", "REVISED_OFFER_SENT"];
  if (!rejectable.includes(purchase.status)) {
    throw new Error("This purchase can no longer be rejected.");
  }
  await prisma.purchase.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/purchases");
}

export async function markReceived(id: string): Promise<void> {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id } });
  if (purchase.status !== "APPROVED") {
    throw new Error("Only approved purchases can be marked as received.");
  }
  await prisma.purchase.update({ where: { id }, data: { status: "RECEIVED" } });
  revalidatePath("/admin/purchases");
}

export async function startInspection(id: string): Promise<void> {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id } });
  if (purchase.status !== "RECEIVED") {
    throw new Error("Only received purchases can enter inspection.");
  }
  await prisma.purchase.update({ where: { id }, data: { status: "IN_INSPECTION" } });
  revalidatePath("/admin/purchases");
}

export interface SendRevisedOfferInput {
  purchaseId: string;
  revisedOfferEUR: number;
  note: string;
}

export async function sendRevisedOffer(input: SendRevisedOfferInput): Promise<void> {
  const purchase = await prisma.purchase.findUniqueOrThrow({
    where: { id: input.purchaseId },
    include: { model: true },
  });
  if (purchase.status !== "IN_INSPECTION") {
    throw new Error("Only purchases currently in inspection can get a revised offer.");
  }
  if (!Number.isFinite(input.revisedOfferEUR) || input.revisedOfferEUR <= 0) {
    throw new Error("Revised offer must be a positive number.");
  }
  if (!input.note.trim()) {
    throw new Error("Add a short note explaining the revision.");
  }

  await prisma.purchase.update({
    where: { id: purchase.id },
    data: {
      status: "REVISED_OFFER_SENT",
      revisedOfferEUR: Math.round(input.revisedOfferEUR),
      revisedOfferNote: input.note.trim(),
    },
  });

  await sendRevisedOfferEmail({
    to: purchase.customerEmail,
    customerName: purchase.customerName,
    modelName: purchase.model.name,
    storageLabel: purchase.storageLabel,
    originalOfferEUR: purchase.offerEUR,
    revisedOfferEUR: Math.round(input.revisedOfferEUR),
    note: input.note.trim(),
    purchaseId: purchase.id,
  });

  revalidatePath("/admin/purchases");
}

export async function recordCustomerDeclined(id: string): Promise<void> {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id } });
  if (purchase.status !== "REVISED_OFFER_SENT") {
    throw new Error("Only purchases with a pending revised offer can be declined.");
  }
  await prisma.purchase.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath("/admin/purchases");
}

export interface ConvertToInventoryInput {
  purchaseId: string;
  listPriceEUR: number;
  status: "PROCESSING" | "LISTED";
  imei?: string;
}

export async function convertToInventory(input: ConvertToInventoryInput): Promise<void> {
  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id: input.purchaseId } });
  const convertible: string[] = ["IN_INSPECTION", "REVISED_OFFER_SENT"];
  if (!convertible.includes(purchase.status)) {
    throw new Error("This purchase isn't ready to be added to inventory yet.");
  }
  if (!Number.isFinite(input.listPriceEUR) || input.listPriceEUR <= 0) {
    throw new Error("List price must be a positive number.");
  }

  const imei = input.imei?.trim();
  if (imei && !/^\d{15}$/.test(imei)) {
    throw new Error("IMEI must be exactly 15 digits, or left blank.");
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
        imei: imei || null,
      },
    }),
    prisma.purchase.update({ where: { id: purchase.id }, data: { status: "PAID" } }),
  ]);

  revalidatePath("/admin/purchases");
  revalidatePath("/admin");
  revalidatePath("/shop");
}
