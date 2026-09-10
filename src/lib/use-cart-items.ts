"use client";

import { useEffect, useState, useTransition } from "react";
import { getInventoryItemsByIds } from "@/lib/commerce-actions";
import { useCart } from "@/lib/cart-store";
import type { InventoryItem } from "@/types/commerce";

export function useCartItems() {
  const { itemIds, removeItem } = useCart();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      const result = await getInventoryItemsByIds(itemIds);
      if (!cancelled) setItems(result);
    });
    return () => {
      cancelled = true;
    };
  }, [itemIds]);

  return { items, loading: isPending, removeItem };
}
