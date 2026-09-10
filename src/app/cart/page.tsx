"use client";

import Link from "next/link";
import { DeviceThumbnail } from "@/components/DeviceThumbnail";
import { conditionGrade } from "@/lib/condition";
import { useCartItems } from "@/lib/use-cart-items";

export default function CartPage() {
  const { items, loading, removeItem } = useCartItems();
  const subtotal = items.reduce((sum, item) => sum + item.listPriceEUR, 0);

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-3xl font-semibold text-ink">Your cart</h1>

      {loading ? null : items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-white p-10 text-center">
          <p className="text-muted">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Browse refurbished devices
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 rounded-2xl border border-border bg-white p-4">
                <DeviceThumbnail category={item.model.category} className="h-24 w-24 shrink-0" />
                <div className="flex flex-1 flex-col">
                  <p className="font-semibold text-ink">{item.model.name}</p>
                  <p className="text-sm text-muted">
                    {item.storage.label} · {conditionGrade(item.condition)}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm font-semibold text-muted transition hover:text-ink"
                    >
                      Remove
                    </button>
                    <p className="font-semibold text-ink">€{item.listPriceEUR}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit rounded-2xl border border-border bg-white p-6">
            <div className="flex items-center justify-between text-sm text-muted">
              <span>Subtotal</span>
              <span>€{subtotal}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-muted">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 font-semibold text-ink">
              <span>Total</span>
              <span>€{subtotal}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
