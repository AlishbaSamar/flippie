"use server";

import type { Prisma } from "@/generated/prisma/client";
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
      status: "SUBMITTED",
    },
  });

  return { id: purchase.id };
}
