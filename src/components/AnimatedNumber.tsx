"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { formatCurrency, formatNumberCompact } from "@/lib/format";

type NumberFormat = "currency" | "compact" | "plain";

function format(value: number, kind: NumberFormat): string {
  if (kind === "currency") return formatCurrency(Math.round(value));
  if (kind === "compact") return formatNumberCompact(Math.round(value));
  return Math.round(value).toLocaleString();
}

interface AnimatedNumberProps {
  value: number;
  format?: NumberFormat;
  duration?: number;
}

export function AnimatedNumber({ value, format: kind = "plain", duration = 0.9 }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    const controls = animate(previous.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: setDisplay,
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return <>{format(display, kind)}</>;
}
