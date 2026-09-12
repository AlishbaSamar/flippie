"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/cart-store";

export function ClearCartOnLoad() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
