"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { EU_COUNTRIES } from "@/data/countries";
import { findInventoryItem } from "@/data/inventory";
import { useCart } from "@/lib/cart-store";
import type { InventoryItem } from "@/types/commerce";

export default function CheckoutPage() {
  const { itemIds, clear } = useCart();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [country, setCountry] = useState(EU_COUNTRIES[0].code);

  const items = useMemo(
    () => itemIds.map(findInventoryItem).filter((item): item is InventoryItem => item !== undefined),
    [itemIds],
  );
  const total = items.reduce((sum, item) => sum + item.listPriceEUR, 0);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderId(`FL-${Math.floor(100000 + Math.random() * 900000)}`);
    clear();
  }

  if (orderId) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">Order confirmed</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Thank you!</h1>
        <p className="mt-3 text-muted">
          Order <span className="font-semibold text-ink">{orderId}</span> has been placed. A confirmation email is
          on its way.
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

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-muted">Your cart is empty, so there&apos;s nothing to check out.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Browse refurbished devices
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-semibold text-ink">Checkout</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <Field label="Address" name="address" required />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City" name="city" required />
            <Field label="Postal code" name="postal" required />
            <div>
              <label className="text-sm font-medium text-ink">Country</label>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
              >
                {EU_COUNTRIES.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Place order · €{total}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-border bg-white p-6">
          <p className="font-semibold text-ink">Order summary</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>
                  {item.model.name} ({item.storage.label})
                </span>
                <span className="text-ink">€{item.listPriceEUR}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold text-ink">
            <span>Total</span>
            <span>€{total}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
      />
    </div>
  );
}
