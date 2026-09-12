import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { ClearCartOnLoad } from "./ClearCartOnLoad";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const session = sessionId ? await stripe.checkout.sessions.retrieve(sessionId).catch(() => null) : null;
  const isPaid = session?.payment_status === "paid";

  return (
    <main className="mx-auto max-w-lg px-6 py-24 text-center">
      {isPaid && <ClearCartOnLoad />}
      <p className="text-sm font-semibold tracking-wide text-primary uppercase">
        {isPaid ? "Order confirmed" : "Checking payment status"}
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-ink">{isPaid ? "Thank you!" : "One moment…"}</h1>
      <p className="mt-3 text-muted">
        {isPaid ? (
          <>
            Your payment was successful and your order is on its way to fulfillment. A confirmation email is
            on its way. Reference:{" "}
            <span className="font-semibold text-ink">{sessionId!.slice(-8).toUpperCase()}</span>
          </>
        ) : (
          "We couldn't confirm this payment yet. If you completed checkout, refresh this page in a moment — otherwise your cart is still saved."
        )}
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
      >
        Continue shopping
      </Link>
    </main>
  );
}
