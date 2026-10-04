"use server";

import { sendReturnRequestedEmail } from "@/lib/emails";
import { prisma } from "@/lib/prisma";

const RETURNABLE_ORDER_STATUSES = ["PAID", "SHIPPED", "DELIVERED"] as const;
const ACTIVE_RETURN_STATUSES = ["REQUESTED", "APPROVED", "RECEIVED", "REFUNDED"] as const;

function isReturnable(status: string): boolean {
  return (RETURNABLE_ORDER_STATUSES as readonly string[]).includes(status);
}

function hasActiveReturn(statuses: string[]): boolean {
  return statuses.some((status) => (ACTIVE_RETURN_STATUSES as readonly string[]).includes(status));
}

export interface FindOrdersInput {
  orderReference: string;
  email: string;
}

export interface ReturnableOrder {
  id: string;
  itemName: string;
  priceEUR: number;
  createdAtLabel: string;
  alreadyRequested: boolean;
}

export async function findOrdersForReturn(input: FindOrdersInput): Promise<ReturnableOrder[]> {
  const reference = input.orderReference.trim();
  const email = input.email.trim().toLowerCase();
  if (reference.length < 6 || !email) return [];

  const orders = await prisma.order.findMany({
    where: {
      customerEmail: { equals: email, mode: "insensitive" },
      status: { in: [...RETURNABLE_ORDER_STATUSES] },
      stripeSessionId: { endsWith: reference, mode: "insensitive" },
    },
    include: { inventoryItem: { include: { model: true } }, returnRequests: { select: { status: true } } },
  });

  return orders.map((order) => ({
    id: order.id,
    itemName: `${order.inventoryItem.model.name} (${order.inventoryItem.storageLabel})`,
    priceEUR: order.priceEUR,
    createdAtLabel: order.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    alreadyRequested: hasActiveReturn(order.returnRequests.map((r) => r.status)),
  }));
}

export interface SubmitReturnInput {
  orderId: string;
  reason: "CHANGED_MIND" | "FAULTY" | "NOT_AS_DESCRIBED" | "OTHER";
  note: string;
}

export async function submitReturnRequest(input: SubmitReturnInput): Promise<{ id: string }> {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: input.orderId },
    include: { inventoryItem: { include: { model: true } }, returnRequests: { select: { status: true } } },
  });

  if (!isReturnable(order.status)) {
    throw new Error("This order isn't eligible for a return.");
  }
  if (hasActiveReturn(order.returnRequests.map((r) => r.status))) {
    throw new Error("A return request already exists for this order.");
  }

  const returnRequest = await prisma.returnRequest.create({
    data: {
      orderId: order.id,
      reason: input.reason,
      customerNote: input.note.trim(),
      status: "REQUESTED",
    },
  });

  await sendReturnRequestedEmail({
    to: order.customerEmail,
    customerName: order.customerName,
    itemName: `${order.inventoryItem.model.name} (${order.inventoryItem.storageLabel})`,
    returnId: returnRequest.id,
  });

  return { id: returnRequest.id };
}
