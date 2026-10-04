"use client";

import { useState, useTransition } from "react";
import { approveReturn, issueRefund, markReturnReceived, rejectReturn } from "@/app/admin/returns/actions";
import { formatCurrency } from "@/lib/format";

interface ReturnListItem {
  id: string;
  status: string;
  reason: string;
  customerNote: string;
  adminNote: string;
  refundAmountEUR: number | null;
  createdAtLabel: string;
  itemName: string;
  orderPriceEUR: number;
  customerName: string;
  customerEmail: string;
}

interface ReturnQueueProps {
  pending: ReturnListItem[];
  history: ReturnListItem[];
}

const STATUS_STYLES: Record<string, string> = {
  REQUESTED: "bg-accent/20 text-accent-dark",
  APPROVED: "bg-primary/10 text-primary",
  RECEIVED: "bg-primary/10 text-primary",
  REFUNDED: "bg-[var(--viz-good)]/15 text-[var(--viz-good-text)]",
  REJECTED: "bg-[var(--viz-critical)]/10 text-[var(--viz-critical)]",
};

const STATUS_LABELS: Record<string, string> = {
  REQUESTED: "Requested",
  APPROVED: "Approved",
  RECEIVED: "Received",
  REFUNDED: "Refunded",
  REJECTED: "Rejected",
};

const REASON_LABELS: Record<string, string> = {
  CHANGED_MIND: "Changed their mind",
  FAULTY: "Arrived faulty",
  NOT_AS_DESCRIBED: "Not as described",
  OTHER: "Other",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? ""}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function ReturnQueue({ pending, history }: ReturnQueueProps) {
  if (pending.length === 0 && history.length === 0) {
    return <p className="text-muted">No return requests yet.</p>;
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
              <ReturnCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-ink">History</h2>
          <p className="mt-1 text-sm text-muted">Most recent {history.length} resolved returns.</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="px-4 py-3 font-medium">Device</th>
                  <th className="px-4 py-3 font-medium">Reason</th>
                  <th className="px-4 py-3 font-medium">Refund</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-ink">{item.itemName}</td>
                    <td className="px-4 py-3 text-muted">{REASON_LABELS[item.reason] ?? item.reason}</td>
                    <td className="px-4 py-3 text-ink">
                      {item.refundAmountEUR !== null ? formatCurrency(item.refundAmountEUR) : "—"}
                    </td>
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

function ReturnCard({ item }: { item: ReturnListItem }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [refundAmount, setRefundAmount] = useState(String(item.orderPriceEUR));

  function run(action: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  function handleReject() {
    if (!rejectNote.trim()) {
      setError("Add a short note explaining the decision.");
      return;
    }
    run(() => rejectReturn(item.id, rejectNote.trim()));
  }

  function handleRefund() {
    const amount = Number(refundAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid refund amount.");
      return;
    }
    run(() => issueRefund({ returnId: item.id, refundAmountEUR: amount }));
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{item.itemName}</p>
          <p className="mt-1 text-sm text-muted">
            {REASON_LABELS[item.reason] ?? item.reason}
            {item.customerNote && ` — "${item.customerNote}"`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {item.customerName}
            {item.customerName && item.customerEmail && " · "}
            {item.customerEmail && (
              <a href={`mailto:${item.customerEmail}`} className="text-primary hover:text-primary-dark">
                {item.customerEmail}
              </a>
            )}
          </p>
          <p className="mt-1 text-sm text-muted">Requested {item.createdAtLabel}</p>
        </div>
        <div className="text-right">
          <StatusBadge status={item.status} />
          <p className="mt-2 text-lg font-semibold text-ink">{formatCurrency(item.orderPriceEUR)}</p>
          <p className="text-xs text-muted">order total</p>
        </div>
      </div>

      {error && <p className="mt-3 text-sm font-medium text-[var(--viz-critical)]">{error}</p>}

      <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
        {item.status === "REQUESTED" && !showReject && (
          <>
            <button
              type="button"
              onClick={() => run(() => approveReturn(item.id))}
              disabled={isPending}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Working…" : "Approve"}
            </button>
            <RejectToggle onClick={() => setShowReject(true)} disabled={isPending} />
          </>
        )}

        {item.status === "APPROVED" && !showReject && (
          <>
            <button
              type="button"
              onClick={() => run(() => markReturnReceived(item.id))}
              disabled={isPending}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Working…" : "Mark as received"}
            </button>
            <RejectToggle onClick={() => setShowReject(true)} disabled={isPending} />
          </>
        )}

        {item.status === "RECEIVED" && !showReject && (
          <div className="flex w-full flex-wrap items-end gap-3">
            <div>
              <label className="text-xs font-medium text-muted">Refund amount (EUR)</label>
              <input
                type="number"
                min={1}
                max={item.orderPriceEUR}
                value={refundAmount}
                onChange={(event) => setRefundAmount(event.target.value)}
                className="mt-1 block w-32 rounded-lg border border-border px-3 py-2 text-sm text-ink"
              />
            </div>
            <button
              type="button"
              onClick={handleRefund}
              disabled={isPending}
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Working…" : "Issue refund"}
            </button>
            <RejectToggle onClick={() => setShowReject(true)} disabled={isPending} />
          </div>
        )}

        {showReject && (
          <div className="flex w-full flex-wrap items-end gap-3">
            <div className="min-w-48 flex-1">
              <label className="text-xs font-medium text-muted">Reason for the customer</label>
              <input
                type="text"
                value={rejectNote}
                onChange={(event) => setRejectNote(event.target.value)}
                placeholder="e.g. Outside the 14-day return window"
                className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
              />
            </div>
            <button
              type="button"
              onClick={handleReject}
              disabled={isPending}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-[var(--viz-critical)] hover:text-[var(--viz-critical)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Working…" : "Reject return"}
            </button>
            <button
              type="button"
              onClick={() => setShowReject(false)}
              disabled={isPending}
              className="text-sm font-semibold text-muted transition hover:text-ink"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RejectToggle({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-[var(--viz-critical)] hover:text-[var(--viz-critical)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      Reject
    </button>
  );
}
