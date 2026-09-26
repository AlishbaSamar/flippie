"use server";

import type { Prisma } from "@/generated/prisma/client";
import { sendTradeInConfirmationEmail } from "@/lib/emails";
import { prisma } from "@/lib/prisma";
import type { ConditionAnswers } from "@/types/device";

export interface SubmitPurchaseInput {
  modelId: string;
  storageGb: number;
  storageLabel: string;
  condition: ConditionAnswers;
  offerEUR: number;
  countryCode: string;
  countryName: string;
  customerName: string;
  customerEmail: string;
}

export async function submitPurchase(input: SubmitPurchaseInput): Promise<{ id: string }> {
  const purchase = await prisma.purchase.create({
    data: {
      modelId: input.modelId,
      storageGb: input.storageGb,
      storageLabel: input.storageLabel,
      condition: input.condition as unknown as Prisma.InputJsonValue,
      offerEUR: input.offerEUR,
      countryCode: input.countryCode,
      countryName: input.countryName,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      status: "SUBMITTED",
    },
    include: { model: true },
  });

  await sendTradeInConfirmationEmail({
    to: input.customerEmail,
    customerName: input.customerName,
    modelName: purchase.model.name,
    storageLabel: input.storageLabel,
    offerEUR: input.offerEUR,
    purchaseId: purchase.id,
  });

  return { id: purchase.id };
}
