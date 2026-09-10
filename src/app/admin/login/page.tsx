"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/login/actions";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-14">
      <h1 className="text-2xl font-semibold text-ink">Admin sign in</h1>
      <p className="mt-1 text-sm text-muted">Business dashboard access only.</p>

      <form action={formAction} className="mt-8 space-y-4 rounded-2xl border border-border bg-white p-6">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-lg border border-border px-3 py-2 text-sm text-ink"
          />
        </div>
        {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
