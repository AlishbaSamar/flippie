import { formatPercent } from "@/lib/format";

interface StatTileProps {
  label: string;
  value: string;
  delta?: number;
  deltaGoodDirection?: "up" | "down";
}

export function StatTile({ label, value, delta, deltaGoodDirection = "up" }: StatTileProps) {
  const isGood = delta !== undefined && (deltaGoodDirection === "up" ? delta >= 0 : delta <= 0);

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {delta !== undefined && (
        <p
          className="mt-1 text-xs font-semibold"
          style={{ color: isGood ? "var(--viz-good-text)" : "var(--viz-critical)" }}
        >
          {formatPercent(delta)} vs last month
        </p>
      )}
    </div>
  );
}
