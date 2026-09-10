"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export function CartBadge() {
  const { itemIds } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition hover:border-primary hover:text-primary"
      aria-label={`Cart, ${itemIds.length} item${itemIds.length === 1 ? "" : "s"}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13L5.4 5M7 13l-2.29 2.29A1 1 0 0 0 5.41 17H17M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
      {itemIds.length > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink">
          {itemIds.length}
        </span>
      )}
    </Link>
  );
}
