"use server";

import { revalidatePath } from "next/cache";
import {
  sendRefundIssuedEmail,
  sendReturnApprovedEmail,
  sendReturnRejectedEmail,
} from "@/lib/emails";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

function revalidateReturns(): void {
  revalidatePath("/admin/returns");
  revalidatePath("/admin");
}

async function loadReturn(id: string) {
  return prisma.returnRequest.findUniqueOrThrow({
    where: { id },
    include: { order: { include: { inventoryItem: { include: { model: true } } } } },
  });
}

function itemNameFor(returnRequest: Awaited<ReturnType<typeof loadReturn>>): string {
  return `${returnRequest.order.inventoryItem.model.name} (${returnRequest.order.inventoryItem.storageLabel})`;
}

export async function approveReturn(id: string): Promise<void> {
  const returnRequest = await loadReturn(id);
  if (returnRequest.status !== "REQUESTED") {
    throw new Error("Only requested returns can be approved.");
  }

  await prisma.returnRequest.update({ where: { id }, data: { status: "APPROVED" } });

  await sendReturnApprovedEmail({
    to: returnRequest.order.customerEmail,
    customerName: returnRequest.order.customerName,
    itemName: itemNameFor(returnRequest),
    returnId: returnRequest.id,
  });

  revalidateReturns();
}

export async function markReturnReceived(id: string): Promise<void> {
  const returnRequest = await loadReturn(id);
  if (returnRequest.status !== "APPROVED") {
    throw new Error("Only approved returns can be marked as received.");
  }

  await prisma.returnRequest.update({ where: { id }, data: { status: "RECEIVED" } });
  revalidateReturns();
}

export async function rejectReturn(id: string, note: string): Promise<void> {
  if (!note.trim()) {
    throw new Error("Add a short note explaining the decision.");
  }

  const returnRequest = await loadReturn(id);
  if (!["REQUESTED", "APPROVED", "RECEIVED"].includes(returnRequest.status)) {
    throw new Error("This return can't be rejected from its current state.");
  }

  await prisma.returnRequest.update({
    where: { id },
    data: { status: "REJECTED", adminNote: note.trim() },
  });

  await sendReturnRejectedEmail({
    to: returnRequest.order.customerEmail,
    customerName: returnRequest.order.customerName,
    itemName: itemNameFor(returnRequest),
    note: note.trim(),
    returnId: returnRequest.id,
  });

  revalidateReturns();
}

export interface IssueRefundInput {
  returnId: string;
  refundAmountEUR: number;
}

export async function issueRefund(input: IssueRefundInput): Promise<void> {
  if (!Number.isFinite(input.refundAmountEUR) || input.refundAmountEUR <= 0) {
    throw new Error("Enter a valid refund amount.");
  }

  const returnRequest = await loadReturn(input.returnId);
  if (returnRequest.status !== "RECEIVED") {
    throw new Error("Only received returns can be refunded.");
  }
  if (input.refundAmountEUR > returnRequest.order.priceEUR) {
    throw new Error("Refund can't exceed the original order amount.");
  }

  let stripeRefundId: string | undefined;
  const sessionId = returnRequest.order.stripeSessionId;
  if (sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    if (paymentIntentId) {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: Math.round(input.refundAmountEUR * 100),
      });
      stripeRefundId = refund.id;
    }
  }

  await prisma.$transaction([
    prisma.returnRequest.update({
      where: { id: input.returnId },
      data: { status: "REFUNDED", refundAmountEUR: input.refundAmountEUR, stripeRefundId },
    }),
    prisma.order.update({ where: { id: returnRequest.orderId }, data: { status: "REFUNDED" } }),
    prisma.inventoryItem.update({
      where: { id: returnRequest.order.inventoryItemId },
      data: { status: "RETURNED" },
    }),
  ]);

  await sendRefundIssuedEmail({
    to: returnRequest.order.customerEmail,
    customerName: returnRequest.order.customerName,
    itemName: itemNameFor(returnRequest),
    refundAmountEUR: input.refundAmountEUR,
    returnId: returnRequest.id,
  });

  revalidateReturns();
  revalidatePath("/admin/inventory");
}
