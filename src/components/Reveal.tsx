"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

function subscribe(): () => void {
  return () => {};
}

/** True once hydrated on the client, false during SSR and the first client render. */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * Scroll-reveal wrapper. Renders a plain, fully visible div until hydration
 * is confirmed — so content is never hidden behind an animation that
 * depends on JS successfully running. Also skips the animation entirely
 * when the user prefers reduced motion.
 */
export function Reveal({ children, delay = 0, y = 16, className }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();

  if (reduceMotion || !hydrated) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
