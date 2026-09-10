"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export function AddToCartButton({ itemId }: { itemId: string }) {
  const { addItem, has } = useCart();
  const inCart = has(itemId);

  if (inCart) {
    return (
      <div className="flex flex-wrap gap-3">
        <span className="flex items-center rounded-full bg-primary/10 px-6 py-3 text-sm font-semibold text-primary">
          Added to cart
        </span>
        <Link
          href="/cart"
          className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
        >
          View cart
        </Link>
      </div>
    );
  }

  return (
    <button
      onClick={() => addItem(itemId)}
      className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
    >
      Add to cart
    </button>
  );
}
