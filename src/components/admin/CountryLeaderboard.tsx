"use client";

import { motion } from "framer-motion";
import { formatCurrencyCompact, formatPercent } from "@/lib/format";
import type { CountryPerformance } from "@/lib/dashboard-analytics";

function GrowthBadge({ growthPct }: { growthPct: number }) {
  const isUp = growthPct >= 0;
  return (
    <span
      className="flex items-center gap-1 text-xs font-semibold"
      style={{ color: isUp ? "var(--viz-good-text)" : "var(--viz-critical)" }}
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
        {isUp ? <path d="M6 2l4 5H8v3H4V7H2z" /> : <path d="M6 10L2 5h2V2h4v3h2z" />}
      </svg>
      {formatPercent(growthPct)}
    </span>
  );
}

function CountryRow({ entry, maxRevenue, index }: { entry: CountryPerformance; maxRevenue: number; index: number }) {
  const widthPct = Math.max(4, (entry.revenue / maxRevenue) * 100);
  return (
    <li className="flex items-center gap-4">
      <span className="w-28 shrink-0 text-sm font-medium text-ink">{entry.country.name}</span>
      <div className="h-6 flex-1 rounded-full bg-surface-alt">
        <motion.div
          className="h-6 rounded-full"
          style={{ backgroundColor: "var(--viz-seq-400)" }}
          initial={{ width: "0%" }}
          animate={{ width: `${widthPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.04 }}
        />
      </div>
      <span className="w-20 shrink-0 text-right text-sm font-semibold text-ink">
        {formatCurrencyCompact(entry.revenue)}
      </span>
      <span className="w-16 shrink-0 text-right">
        <GrowthBadge growthPct={entry.growthPct} />
      </span>
    </li>
  );
}

export function CountryLeaderboard({ data }: { data: CountryPerformance[] }) {
  const maxRevenue = Math.max(...data.map((entry) => entry.revenue));
  const best = [...data].sort((a, b) => b.growthPct - a.growthPct).slice(0, 3);
  const worst = [...data].sort((a, b) => a.growthPct - b.growthPct).slice(0, 3);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
      <div>
        <p className="mb-3 text-xs font-semibold tracking-wide text-muted uppercase">
          Revenue by country · this month
        </p>
        <ul className="space-y-3">
          {data.map((entry, index) => (
            <CountryRow key={entry.country.code} entry={entry} maxRevenue={maxRevenue} index={index} />
          ))}
        </ul>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Fastest growing</p>
          <ul className="space-y-2">
            {best.map((entry) => (
              <li key={entry.country.code} className="flex items-center justify-between text-sm">
                <span className="text-ink">{entry.country.name}</span>
                <GrowthBadge growthPct={entry.growthPct} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">Needs attention</p>
          <ul className="space-y-2">
            {worst.map((entry) => (
              <li key={entry.country.code} className="flex items-center justify-between text-sm">
                <span className="text-ink">{entry.country.name}</span>
                <GrowthBadge growthPct={entry.growthPct} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
