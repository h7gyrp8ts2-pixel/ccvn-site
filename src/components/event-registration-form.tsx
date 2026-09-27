"use client";

import { useActionState } from "react";
import { registerForEventAction } from "@/app/eventos/actions";

export function EventRegistrationForm({
  eventId,
  eventSlug,
}: {
  eventId: string;
  eventSlug: string;
}) {
  const action = registerForEventAction.bind(null, eventId, eventSlug);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm text-muted mb-1">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm text-muted mb-1">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm text-muted mb-1">
          Telefone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
        />
      </div>

      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-accent text-accent-foreground px-6 py-2.5 text-sm disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Confirmar inscrição"}
      </button>
    </form>
  );
}
