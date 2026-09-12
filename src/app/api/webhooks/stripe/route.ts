import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

async function finalizeSession(session: Stripe.Checkout.Session) {
  const orders = await prisma.order.findMany({ where: { stripeSessionId: session.id, status: "PENDING" } });
  if (orders.length === 0) return;

  await prisma.$transaction([
    prisma.order.updateMany({ where: { stripeSessionId: session.id, status: "PENDING" }, data: { status: "PAID" } }),
    prisma.inventoryItem.updateMany({
      where: { id: { in: orders.map((order) => order.inventoryItemId) }, status: "RESERVED" },
      data: { status: "SOLD" },
    }),
  ]);
}

async function releaseSession(session: Stripe.Checkout.Session) {
  const orders = await prisma.order.findMany({ where: { stripeSessionId: session.id, status: "PENDING" } });
  if (orders.length === 0) return;

  await prisma.$transaction([
    prisma.order.updateMany({
      where: { stripeSessionId: session.id, status: "PENDING" },
      data: { status: "CANCELLED" },
    }),
    prisma.inventoryItem.updateMany({
      where: { id: { in: orders.map((order) => order.inventoryItemId) }, status: "RESERVED" },
      data: { status: "LISTED" },
    }),
  ]);
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err instanceof Error ? err.message : err}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await finalizeSession(event.data.object);
      break;
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await releaseSession(event.data.object);
      break;
  }

  return Response.json({ received: true });
}
