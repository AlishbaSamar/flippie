"use client";

import { useState, useTransition } from "react";
import {
  findOrdersForReturn,
  submitReturnRequest,
  type ReturnableOrder,
} from "@/app/returns/actions";
import { formatCurrency } from "@/lib/format";

const REASON_OPTIONS: { value: "CHANGED_MIND" | "FAULTY" | "NOT_AS_DESCRIBED" | "OTHER"; label: string }[] = [
  { value: "CHANGED_MIND", label: "I changed my mind" },
  { value: "FAULTY", label: "It arrived faulty" },
  { value: "NOT_AS_DESCRIBED", label: "Not as described" },
  { value: "OTHER", label: "Other" },
];

export function ReturnLookup() {
  const [step, setStep] = useState<"lookup" | "select" | "done">("lookup");
  const [orderReference, setOrderReference] = useState("");
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<ReturnableOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [reason, setReason] = useState<(typeof REASON_OPTIONS)[number]["value"]>("CHANGED_MIND");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleLookup() {
    setError(null);
    startTransition(async () => {
      const results = await findOrdersForReturn({ orderReference, email });
      if (results.length === 0) {
        setError("We couldn't find an order matching that reference and email.");
        return;
      }
      setOrders(results);
      setStep("select");
    });
  }

  function handleSubmit() {
    if (!selectedOrderId) {
      setError("Select which item you're returning.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await submitReturnRequest({ orderId: selectedOrderId, reason, note });
        setStep("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-2xl font-semibold text-ink">Start a return</h1>
      <p className="mt-1 text-muted">
        Find your order and tell us why you&apos;d like to return it. We cover return shipping if your device
        arrived faulty or not as described.
      </p>

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-white p-8 shadow-sm">
        {step === "lookup" && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold tracking-wide text-muted uppercase">Order reference</label>
              <input
                type="text"
                value={orderReference}
                onChange={(event) => setOrderReference(event.target.value)}
                placeholder="e.g. A1B2C3D4"
                className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
              />
              <p className="mt-1 text-xs text-muted">Find this in your order confirmation email.</p>
            </div>
            <div>
              <label className="text-xs font-semibold tracking-wide text-muted uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
              />
            </div>
            {error && <p className="text-sm font-medium text-[var(--viz-critical)]">{error}</p>}
            <button
              type="button"
              onClick={handleLookup}
              disabled={isPending || !orderReference.trim() || !email.trim()}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Looking up…" : "Find my order"}
            </button>
          </div>
        )}

        {step === "select" && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-ink">Which item are you returning?</p>
              <div className="mt-3 space-y-2">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => !order.alreadyRequested && setSelectedOrderId(order.id)}
                    disabled={order.alreadyRequested}
                    className={`block w-full rounded-lg border px-4 py-3 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      selectedOrderId === order.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <span className="font-semibold text-ink">{order.itemName}</span>
                    <span className="ml-2 text-muted">{formatCurrency(order.priceEUR)}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      Ordered {order.createdAtLabel}
                      {order.alreadyRequested && " · A return is already in progress for this item"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-ink">Why are you returning it?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {REASON_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setReason(option.value)}
                    className={`rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${
                      reason === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-ink hover:border-primary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold tracking-wide text-muted uppercase">
                Tell us more (optional)
              </label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="Any details that will help us process your return faster"
                className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
              />
            </div>

            {error && <p className="text-sm font-medium text-[var(--viz-critical)]">{error}</p>}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || !selectedOrderId}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? "Submitting…" : "Submit return request"}
              </button>
              <button
                type="button"
                onClick={() => setStep("lookup")}
                className="text-sm font-semibold text-muted transition hover:text-ink"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">Submitted</p>
            <h2 className="mt-2 text-xl font-semibold text-ink">We&apos;ve got your return request</h2>
            <p className="mt-3 text-sm text-muted">
              We&apos;ll review it and email you with next steps, usually within 1-2 business days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
