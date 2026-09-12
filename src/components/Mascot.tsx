"use client";

import { motion } from "framer-motion";

interface MascotProps {
  size?: number;
  className?: string;
}

/**
 * Brand mascot — a rounded-rect "phone body" character.
 * Kept as hand-authored SVG (not a raster asset) so future redesigns —
 * new pose, new accessory, a v2 look — are a diff to this one file,
 * and it automatically re-themes if the brand palette changes.
 */
export function Mascot({ size = 40, className }: MascotProps) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size, display: "inline-block", perspective: 240 }}
      animate={{
        x: [0, -4, 0, 4, 0],
        y: [0, -4, 0, -4, 0],
        rotateZ: [0, -6, 0, 6, 0],
      }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.svg
        viewBox="0 0 72 92"
        width="100%"
        height="100%"
        style={{ transformStyle: "preserve-3d", overflow: "visible" }}
        animate={{ rotateY: [0, 0, 180, 180, 0, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          times: [0, 0.6, 0.72, 0.85, 0.97, 1],
          ease: "easeInOut",
        }}
      >
        <ellipse cx="36" cy="89" rx="17" ry="3" fill="var(--color-ink)" opacity="0.08" />

        {/* legs */}
        <line x1="26" y1="80" x2="24" y2="88" stroke="var(--color-primary)" strokeWidth="9" strokeLinecap="round" />
        <line x1="46" y1="80" x2="48" y2="88" stroke="var(--color-primary)" strokeWidth="9" strokeLinecap="round" />

        {/* trailing arm */}
        <line x1="12" y1="46" x2="4" y2="60" stroke="var(--color-primary)" strokeWidth="9" strokeLinecap="round" />

        {/* body */}
        <rect
          x="10"
          y="4"
          width="52"
          height="80"
          rx="15"
          fill="var(--color-primary)"
          stroke="var(--color-primary-dark)"
          strokeWidth="2"
        />

        {/* screen / face */}
        <rect x="16.5" y="12" width="39" height="52" rx="7" fill="var(--color-surface)" />
        <circle cx="27" cy="35" r="3.1" fill="var(--color-ink)" />
        <circle cx="45" cy="35" r="3.1" fill="var(--color-ink)" />
        <path
          d="M25 45 Q36 54 47 45"
          stroke="var(--color-ink)"
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* home button */}
        <circle cx="36" cy="72" r="3" fill="none" stroke="var(--color-primary-dark)" strokeWidth="2" opacity="0.6" />

        {/* raised arm + phone in hand */}
        <line x1="58" y1="46" x2="65" y2="30" stroke="var(--color-primary)" strokeWidth="9" strokeLinecap="round" />
        <rect
          x="60"
          y="16"
          width="15"
          height="23"
          rx="3.5"
          fill="var(--color-primary-dark)"
          transform="rotate(8 67.5 27.5)"
        />
        <rect
          x="62"
          y="18.5"
          width="11"
          height="15.5"
          rx="1.6"
          fill="var(--color-surface)"
          transform="rotate(8 67.5 27.5)"
        />
        <circle cx="65" cy="24" r="1.3" fill="var(--color-accent)" transform="rotate(8 67.5 27.5)" />
        <circle cx="69" cy="24" r="1.3" fill="var(--viz-series-3)" transform="rotate(8 67.5 27.5)" />
        <circle cx="65" cy="28" r="1.3" fill="var(--viz-series-1)" transform="rotate(8 67.5 27.5)" />
        <circle cx="69" cy="28" r="1.3" fill="var(--viz-series-5)" transform="rotate(8 67.5 27.5)" />
      </motion.svg>
    </motion.div>
  );
}
