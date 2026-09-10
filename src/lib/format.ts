/**
 * Manual (non-Intl) compact formatting for numbers/currency.
 * Intl's `notation: "compact"` renders trailing-zero cases (e.g. 4000) differently
 * between Node's ICU (server render) and the browser's (client hydration), which
 * causes React hydration mismatches. Plain math is deterministic everywhere.
 */
function compactSuffix(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${trimTrailingZero((value / 1_000_000).toFixed(1))}M`;
  if (abs >= 1_000) return `${trimTrailingZero((value / 1_000).toFixed(1))}K`;
  return String(Math.round(value));
}

function trimTrailingZero(value: string): string {
  return value.endsWith(".0") ? value.slice(0, -2) : value;
}

export function formatCurrencyCompact(value: number): string {
  return `€${compactSuffix(value)}`;
}

export function formatNumberCompact(value: number): string {
  return compactSuffix(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
