import { formatCurrencyCompact, formatPercent } from "@/lib/format";
import type { CountryPerformance } from "@/lib/dashboard-analytics";

export function InsightBanner({ data }: { data: CountryPerformance[] }) {
  const topGrower = [...data].sort((a, b) => b.growthPct - a.growthPct)[0];
  const topDecliner = [...data].sort((a, b) => a.growthPct - b.growthPct)[0];

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">SEO &amp; marketing signal</p>
      <p className="mt-2 text-sm text-ink">
        <span className="font-semibold">{topGrower.country.name}</span> is your fastest-growing market —{" "}
        {formatCurrencyCompact(topGrower.revenue)} this month, up {formatPercent(topGrower.growthPct)}
        {" "}month-over-month. That&apos;s a strong case for shifting SEO and ad spend toward it.{" "}
        <span className="font-semibold">{topDecliner.country.name}</span> is down{" "}
        {formatPercent(topDecliner.growthPct)} — worth investigating before committing further budget there.
      </p>
    </div>
  );
}
