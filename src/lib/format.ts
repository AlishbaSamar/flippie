export function formatCurrencyCompact(value: number): string {
  if (value === 0) return "€0";
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumberCompact(value: number): string {
  if (value === 0) return "0";
  return new Intl.NumberFormat("en-IE", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
