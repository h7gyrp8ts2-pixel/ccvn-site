"use client";

import { useActionState } from "react";
import { submitPrayerRequestAction } from "@/app/contato/actions";

export function PrayerRequestForm() {
  const [state, formAction, pending] = useActionState(submitPrayerRequestAction, undefined);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="font-medium">Pedido recebido.</p>
        <p className="mt-1 text-sm text-muted">
          Vamos orar por você. Que Deus abençoe a sua vida.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="prayer-name" className="block text-sm text-muted mb-1">
          Nome (opcional)
        </label>
        <input
          id="prayer-name"
          name="name"
          maxLength={120}
          className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
        />
      </div>
      <div>
        <label htmlFor="prayer-contact" className="block text-sm text-muted mb-1">
          E-mail ou telefone (opcional, se quiser retorno)
        </label>
        <input
          id="prayer-contact"
          name="contact"
          maxLength={160}
          className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
        />
      </div>
      <div>
        <label htmlFor="prayer-message" className="block text-sm text-muted mb-1">
          Seu pedido de oração
        </label>
        <textarea
          id="prayer-message"
          name="message"
          rows={5}
          required
          maxLength={2000}
          className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
        />
      </div>

      <div aria-hidden="true" className="hidden">
        <label htmlFor="prayer-website">Não preencha este campo</label>
        <input id="prayer-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent text-accent-foreground px-6 py-2.5 text-sm disabled:opacity-60 self-start"
      >
        {pending ? "Enviando..." : "Enviar pedido"}
      </button>
    </form>
  );
}
