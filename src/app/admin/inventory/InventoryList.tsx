"use client";

import { useState, useTransition } from "react";
import { updateInventoryStatus, type UpdatableInventoryStatus } from "@/app/admin/inventory/actions";
import { GRADE_DESCRIPTIONS, conditionGrade } from "@/lib/condition";
import { formatCurrency } from "@/lib/format";
import type { ConditionAnswers } from "@/types/device";

interface InventoryListItem {
  id: string;
  status: string;
  modelName: string;
  storageLabel: string;
  listPriceEUR: number;
  imei: string | null;
  condition: ConditionAnswers;
  createdAtLabel: string;
}

const STATUS_OPTIONS: { value: UpdatableInventoryStatus; label: string }[] = [
  { value: "PROCESSING", label: "Processing" },
  { value: "WIPING_DATA", label: "Wiping data" },
  { value: "REPAIR", label: "Repair queue" },
  { value: "FINAL_QA", label: "Final QA" },
  { value: "LISTED", label: "Listed for sale" },
  { value: "RETURNED", label: "Returned (needs re-check)" },
  { value: "QUARANTINE", label: "Quarantine (flagged)" },
];

const STATUS_STYLES: Record<string, string> = {
  PROCESSING: "bg-accent/20 text-accent-dark",
  WIPING_DATA: "bg-primary/10 text-primary",
  REPAIR: "bg-[var(--viz-serious)]/15 text-[var(--viz-serious)]",
  FINAL_QA: "bg-primary/10 text-primary",
  RETURNED: "bg-[var(--viz-warning)]/20 text-accent-dark",
  QUARANTINE: "bg-[var(--viz-critical)]/10 text-[var(--viz-critical)]",
};

export function InventoryList({ items }: { items: InventoryListItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted">Nothing in prep right now — every device is listed, reserved, or sold.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <InventoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function InventoryCard({ item }: { item: InventoryListItem }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<UpdatableInventoryStatus>(item.status as UpdatableInventoryStatus);
  const [imei, setImei] = useState(item.imei ?? "");
  const grade = conditionGrade(item.condition);

  function handleUpdate() {
    setError(null);
    if (imei.trim() && !/^\d{15}$/.test(imei.trim())) {
      setError("IMEI must be exactly 15 digits, or left blank.");
      return;
    }
    startTransition(async () => {
      try {
        await updateInventoryStatus({ itemId: item.id, status, imei: imei.trim() || undefined });
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
          <p className="mt-1 text-sm text-muted">Added {item.createdAtLabel}</p>
        </div>
        <div className="text-right">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[item.status] ?? ""}`}>
            {STATUS_OPTIONS.find((option) => option.value === item.status)?.label ?? item.status}
          </span>
          <p className="mt-2 text-lg font-semibold text-ink">{formatCurrency(item.listPriceEUR)}</p>
          <p className="text-xs text-muted">list price</p>
        </div>
      </div>

      {error && <p className="mt-3 text-sm font-medium text-[var(--viz-critical)]">{error}</p>}

      <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
        <div>
          <label className="text-xs font-medium text-muted">Status</label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as UpdatableInventoryStatus)}
            className="mt-1 block rounded-lg border border-border px-3 py-2 text-sm text-ink"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted">IMEI</label>
          <input
            type="text"
            value={imei}
            onChange={(event) => setImei(event.target.value)}
            placeholder="15 digits"
            className="mt-1 block w-40 rounded-lg border border-border px-3 py-2 text-sm text-ink"
          />
        </div>
        <button
          type="button"
          onClick={handleUpdate}
          disabled={isPending}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Working…" : "Update"}
        </button>
      </div>
    </div>
  );
}
