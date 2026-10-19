"use client";

import { useState, useTransition } from "react";
import { clearDemoData, type ClearDemoDataResult } from "@/app/admin/maintenance/actions";

const CONFIRM_PHRASE = "DELETE ALL DATA";

export function ClearDataPanel() {
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClearDemoDataResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClear() {
    setError(null);
    startTransition(async () => {
      try {
        const outcome = await clearDemoData(confirmation);
        setResult(outcome);
        setConfirmation("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  if (result) {
    return (
      <p className="rounded-lg bg-[var(--viz-good)]/15 p-3 text-sm font-medium text-[var(--viz-good-text)]">
        Cleared {result.purchases} purchases, {result.orders} orders, {result.inventoryItems} inventory items,
        and {result.returnRequests} returns.
      </p>
    );
  }

  return (
    <div>
      <label className="text-xs font-medium text-muted">
        Type <span className="font-mono font-semibold text-ink">{CONFIRM_PHRASE}</span> to confirm
      </label>
      <div className="mt-1.5 flex flex-wrap gap-3">
        <input
          type="text"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          placeholder={CONFIRM_PHRASE}
          className="min-w-64 flex-1 rounded-lg border border-border px-3 py-2 text-sm text-ink"
        />
        <button
          type="button"
          onClick={handleClear}
          disabled={isPending || confirmation !== CONFIRM_PHRASE}
          className="rounded-full bg-[var(--viz-critical)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? "Clearing…" : "Clear all data"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm font-medium text-[var(--viz-critical)]">{error}</p>}
    </div>
  );
}
