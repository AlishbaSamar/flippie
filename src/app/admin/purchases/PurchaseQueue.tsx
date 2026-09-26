"use client";

import { useState, useTransition } from "react";
import { approvePurchase, convertToInventory, rejectPurchase } from "@/app/admin/purchases/actions";
import { GRADE_DESCRIPTIONS, conditionGrade } from "@/lib/condition";
import { formatCurrency } from "@/lib/format";
import type { ConditionAnswers } from "@/types/device";

interface PurchaseListItem {
  id: string;
  status: string;
  offerEUR: number;
  countryName: string;
  customerName: string;
  customerEmail: string;
  createdAtLabel: string;
  modelName: string;
  storageLabel: string;
  condition: ConditionAnswers;
  suggestedListPriceEUR: number;
}

interface PurchaseQueueProps {
  pending: PurchaseListItem[];
  history: PurchaseListItem[];
}

export function PurchaseQueue({ pending, history }: PurchaseQueueProps) {
  if (pending.length === 0 && history.length === 0) {
    return <p className="text-muted">No trade-in submissions yet.</p>;
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold text-ink">Needs review ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Nothing waiting on you right now.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {pending.map((item) => (
              <PurchaseCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-ink">History</h2>
          <p className="mt-1 text-sm text-muted">Most recent {history.length} resolved submissions.</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="px-4 py-3 font-medium">Device</th>
                  <th className="px-4 py-3 font-medium">Offer</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-ink">
                      {item.modelName} ({item.storageLabel})
                    </td>
                    <td className="px-4 py-3 text-ink">{formatCurrency(item.offerEUR)}</td>
                    <td className="px-4 py-3 text-muted">{item.countryName}</td>
                    <td className="px-4 py-3 text-muted">{item.createdAtLabel}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    SUBMITTED: "bg-accent/20 text-accent-dark",
    APPROVED: "bg-primary/10 text-primary",
    PAID: "bg-[var(--viz-good)]/15 text-[var(--viz-good-text)]",
    REJECTED: "bg-[var(--viz-critical)]/10 text-[var(--viz-critical)]",
  };
  const labels: Record<string, string> = {
    SUBMITTED: "Submitted",
    APPROVED: "Approved",
    PAID: "Purchased",
    REJECTED: "Rejected",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] ?? ""}`}>
      {labels[status] ?? status}
    </span>
  );
}

function PurchaseCard({ item }: { item: PurchaseListItem }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [listPrice, setListPrice] = useState(String(item.suggestedListPriceEUR));
  const [listNow, setListNow] = useState(true);
  const grade = conditionGrade(item.condition);

  function handleApprove() {
    setError(null);
    startTransition(async () => {
      try {
        await approvePurchase(item.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleReject() {
    setError(null);
    startTransition(async () => {
      try {
        await rejectPurchase(item.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleConvert() {
    setError(null);
    const price = Number(listPrice);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid list price.");
      return;
    }
    startTransition(async () => {
      try {
        await convertToInventory({
          purchaseId: item.id,
          listPriceEUR: price,
          status: listNow ? "LISTED" : "PROCESSING",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">
            {item.modelName} · {item.storageLabel}
          </p>
          <p className="mt-1 text-sm text-muted">
            {grade} — {GRADE_DESCRIPTIONS[grade]}
          </p>
          <p className="mt-1 text-sm text-muted">
            {item.countryName} · Submitted {item.createdAtLabel}
          </p>
          {(item.customerName || item.customerEmail) && (
            <p className="mt-1 text-sm text-muted">
              {item.customerName}
              {item.customerName && item.customerEmail && " · "}
              {item.customerEmail && (
                <a href={`mailto:${item.customerEmail}`} className="text-primary hover:text-primary-dark">
                  {item.customerEmail}
                </a>
              )}
            </p>
          )}
        </div>
        <div className="text-right">
          <StatusBadge status={item.status} />
          <p className="mt-2 text-lg font-semibold text-ink">{formatCurrency(item.offerEUR)}</p>
          <p className="text-xs text-muted">offer to customer</p>
        </div>
      </div>

      {error && <p className="mt-3 text-sm font-medium text-[var(--viz-critical)]">{error}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        {item.status === "SUBMITTED" && (
          <>
            <button
              type="button"
              onClick={handleApprove}
              disabled={isPending}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Working…" : "Approve"}
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={isPending}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-[var(--viz-critical)] hover:text-[var(--viz-critical)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reject
            </button>
          </>
        )}

        {item.status === "APPROVED" && (
          <div className="flex w-full flex-wrap items-end gap-3">
            <div>
              <label className="text-xs font-medium text-muted">List price (EUR)</label>
              <input
                type="number"
                min={1}
                value={listPrice}
                onChange={(event) => setListPrice(event.target.value)}
                className="mt-1 block w-32 rounded-lg border border-border px-3 py-2 text-sm text-ink"
              />
            </div>
            <label className="flex items-center gap-2 pb-2 text-sm text-ink">
              <input type="checkbox" checked={listNow} onChange={(event) => setListNow(event.target.checked)} />
              List immediately
            </label>
            <button
              type="button"
              onClick={handleConvert}
              disabled={isPending}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Working…" : "Confirm payment & add to inventory"}
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={isPending}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-[var(--viz-critical)] hover:text-[var(--viz-critical)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
