"use client";

import { motion } from "framer-motion";
import { formatCurrencyCompact } from "@/lib/format";
import type { CategoryPerformance } from "@/lib/dashboard-analytics";

const CATEGORY_COLORS = ["var(--viz-series-1)", "var(--viz-series-2)", "var(--viz-series-3)"];

export function CategoryBarChart({ data }: { data: CategoryPerformance[] }) {
  const maxRevenue = Math.max(...data.map((entry) => entry.revenue));

  return (
    <ul className="space-y-4">
      {data.map((entry, index) => (
        <li key={entry.category} title={`${entry.label}: ${formatCurrencyCompact(entry.revenue)}`}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium text-ink">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
              />
              {entry.label}
            </span>
            <span className="text-muted">{entry.units.toLocaleString()} units</span>
          </div>
          <div className="h-6 rounded-full bg-surface-alt">
            <motion.div
              className="flex h-6 items-center justify-end overflow-hidden rounded-full px-3 text-xs font-semibold text-white"
              style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
              initial={{ width: "0%" }}
              animate={{ width: `${Math.max(12, (entry.revenue / maxRevenue) * 100)}%` }}
              transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.1 }}
            >
              <span className="whitespace-nowrap">{formatCurrencyCompact(entry.revenue)}</span>
            </motion.div>
          </div>
        </li>
      ))}
    </ul>
  );
}
