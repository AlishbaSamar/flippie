import type { Metadata } from "next";
import { CategoryBarChart } from "@/components/admin/CategoryBarChart";
import { CountryLeaderboard } from "@/components/admin/CountryLeaderboard";
import { InsightBanner } from "@/components/admin/InsightBanner";
import { LineChart } from "@/components/admin/LineChart";
import { StatTile } from "@/components/admin/StatTile";
import { TopModelsTable } from "@/components/admin/TopModelsTable";
import { TOP_MODELS } from "@/data/analytics";
import {
  getCategoryPerformance,
  getCountryPerformance,
  getKpis,
  getRevenueTrend,
  getVolumeTrend,
} from "@/lib/dashboard-analytics";
import { formatCurrency, formatNumberCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Business dashboard — flippie",
};

export default function AdminDashboardPage() {
  const kpis = getKpis();
  const revenueTrend = getRevenueTrend();
  const volumeTrend = getVolumeTrend();
  const countryPerformance = getCountryPerformance();
  const categoryPerformance = getCategoryPerformance();

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-ink">Business dashboard</h1>
      <p className="mt-1 text-muted">Purchases, sales, and demand across Europe — last 6 months.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile label="Revenue" value={formatCurrency(kpis.totalRevenue)} />
        <StatTile label="Devices sold" value={formatNumberCompact(kpis.totalSalesUnits)} />
        <StatTile label="Devices purchased" value={formatNumberCompact(kpis.totalPurchaseUnits)} />
        <StatTile label="Pending orders" value={String(kpis.pendingOrders)} />
        <StatTile label="Listed inventory" value={String(kpis.listedInventory)} />
      </div>

      <div className="mt-8">
        <InsightBanner data={countryPerformance} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="font-semibold text-ink">Revenue trend</p>
          <p className="text-sm text-muted">Monthly sales revenue, all countries</p>
          <div className="mt-4">
            <LineChart
              labels={revenueTrend.map((row) => row.label)}
              series={[
                {
                  key: "revenue",
                  label: "Revenue",
                  color: "var(--viz-seq-500)",
                  values: revenueTrend.map((row) => row.revenue),
                },
              ]}
              valueFormat="currency"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="font-semibold text-ink">Sales vs. purchases</p>
          <p className="text-sm text-muted">Devices sold to customers vs. bought from customers</p>
          <div className="mt-4">
            <LineChart
              labels={volumeTrend.map((row) => row.label)}
              series={[
                {
                  key: "sales",
                  label: "Devices sold",
                  color: "var(--viz-series-1)",
                  values: volumeTrend.map((row) => row.sales),
                },
                {
                  key: "purchases",
                  label: "Devices purchased",
                  color: "var(--viz-series-2)",
                  values: volumeTrend.map((row) => row.purchases),
                },
              ]}
              valueFormat="number"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-white p-6">
        <p className="font-semibold text-ink">Country performance</p>
        <p className="text-sm text-muted">Where demand is strongest and weakest across Europe</p>
        <div className="mt-6">
          <CountryLeaderboard data={countryPerformance} />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="font-semibold text-ink">Revenue by product category</p>
          <p className="text-sm text-muted">Last 6 months</p>
          <div className="mt-6">
            <CategoryBarChart data={categoryPerformance} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-6">
          <p className="font-semibold text-ink">Best-selling models</p>
          <p className="text-sm text-muted">By revenue, last 6 months</p>
          <div className="mt-4">
            <TopModelsTable data={TOP_MODELS} />
          </div>
        </div>
      </div>
    </main>
  );
}
