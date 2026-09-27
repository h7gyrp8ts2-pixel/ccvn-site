"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-serif text-2xl">Painel admin</h1>
      <p className="mt-2 text-sm text-muted">
        Acesso restrito à administração da CCVN.
      </p>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="block text-sm text-muted mb-1">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>

        {state?.error && (
          <p className="text-sm text-red-700">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-foreground text-background px-6 py-2 text-sm disabled:opacity-60"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
