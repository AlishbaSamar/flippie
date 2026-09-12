import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/admin/login/actions";
import { CategoryBarChart } from "@/components/admin/CategoryBarChart";
import { CountryLeaderboard } from "@/components/admin/CountryLeaderboard";
import { InsightBanner } from "@/components/admin/InsightBanner";
import { LineChart } from "@/components/admin/LineChart";
import { StatTile } from "@/components/admin/StatTile";
import { TopModelsTable } from "@/components/admin/TopModelsTable";
import {
  getCategoryPerformance,
  getCountryPerformance,
  getKpis,
  getRevenueTrend,
  getTopModels,
  getVolumeTrend,
} from "@/lib/dashboard-analytics";

export const metadata: Metadata = {
  title: "Business dashboard — flippie",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [kpis, revenueTrend, volumeTrend, countryPerformance, categoryPerformance, topModels] = await Promise.all([
    getKpis(),
    getRevenueTrend(),
    getVolumeTrend(),
    getCountryPerformance(),
    getCategoryPerformance(),
    getTopModels(),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink">Business dashboard</h1>
          <p className="mt-1 text-muted">Purchases, sales, and demand across Europe — last 6 months.</p>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/admin/purchases" className="text-sm font-semibold text-primary transition hover:text-primary-dark">
            Purchase queue →
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm font-semibold text-muted transition hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <StatTile label="Revenue" value={kpis.totalRevenue} format="currency" />
        <StatTile label="Devices sold" value={kpis.totalSalesUnits} format="compact" />
        <StatTile label="Devices purchased" value={kpis.totalPurchaseUnits} format="compact" />
        <StatTile label="Pending orders" value={kpis.pendingOrders} />
        <StatTile label="Listed inventory" value={kpis.listedInventory} />
        <Link href="/admin/purchases">
          <StatTile label="Awaiting review" value={kpis.purchasesAwaitingReview} />
        </Link>
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
            <TopModelsTable data={topModels} />
          </div>
        </div>
      </div>
    </main>
  );
}
