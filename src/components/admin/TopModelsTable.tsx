import { formatCurrency } from "@/lib/format";
import type { ModelPerformance } from "@/lib/dashboard-analytics";

export function TopModelsTable({ data }: { data: ModelPerformance[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left text-xs font-semibold tracking-wide text-muted uppercase">
          <th className="pb-2 font-semibold">Model</th>
          <th className="pb-2 text-right font-semibold">Units sold</th>
          <th className="pb-2 text-right font-semibold">Revenue</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => (
          <tr key={entry.modelId} className="border-b border-border/60 last:border-0">
            <td className="py-2.5 font-medium text-ink">{entry.modelName}</td>
            <td className="py-2.5 text-right text-muted">{entry.unitsSold.toLocaleString()}</td>
            <td className="py-2.5 text-right font-semibold text-ink">{formatCurrency(entry.revenueEUR)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
