"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export interface CreateCheckoutSessionInput {
  itemIds: string[];
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  countryCode: string;
  countryName: string;
}

async function siteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  const host = (await headers()).get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function createCheckoutSession(input: CreateCheckoutSessionInput): Promise<{ url: string }> {
  const items = await prisma.inventoryItem.findMany({
    where: { id: { in: input.itemIds }, status: "LISTED" },
    include: { model: true },
  });

  if (items.length === 0) {
    throw new Error("None of the selected items are available anymore.");
  }

  const itemIds = items.map((item) => item.id);

  // Reserve atomically so two customers can't both check out the same (single-unit) item.
  const reserved = await prisma.inventoryItem.updateMany({
    where: { id: { in: itemIds }, status: "LISTED" },
    data: { status: "RESERVED" },
  });

  if (reserved.count !== itemIds.length) {
    await prisma.inventoryItem.updateMany({
      where: { id: { in: itemIds }, status: "RESERVED" },
      data: { status: "LISTED" },
    });
    throw new Error("One or more items in your cart were just purchased by someone else. Please refresh your cart.");
  }

  const base = await siteUrl();

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.customerEmail,
      line_items: items.map((item) => ({
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: item.listPriceEUR * 100,
          product_data: { name: `${item.model.name} (${item.storageLabel})` },
        },
      })),
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/checkout`,
    });
  } catch (err) {
    await prisma.inventoryItem.updateMany({
      where: { id: { in: itemIds }, status: "RESERVED" },
      data: { status: "LISTED" },
    });
    throw err;
  }

  if (!session.url) {
    await prisma.inventoryItem.updateMany({
      where: { id: { in: itemIds }, status: "RESERVED" },
      data: { status: "LISTED" },
    });
    throw new Error("Stripe did not return a checkout URL.");
  }

  await prisma.order.createMany({
    data: items.map((item) => ({
      inventoryItemId: item.id,
      priceEUR: item.listPriceEUR,
      status: "PENDING",
      countryCode: input.countryCode,
      countryName: input.countryName,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      shippingAddress: input.shippingAddress,
      city: input.city,
      postalCode: input.postalCode,
      stripeSessionId: session.id,
    })),
  });

  return { url: session.url };
}
