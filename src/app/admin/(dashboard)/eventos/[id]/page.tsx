import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateEventAction, confirmRegistrationAction } from "@/app/admin/actions";
import { toDatetimeLocalValue } from "@/lib/format";
import type { EventRow, RegistrationViewRow } from "@/types/database";

export const dynamic = "force-dynamic";

const statusLabel: Record<RegistrationViewRow["effective_status"], string> = {
  reservado: "Reservado",
  confirmado: "Confirmado",
  expirado: "Expirado",
};

export default async function AdminEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: event }, { data: registrations }] = await Promise.all([
    supabase.from("events").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("registrations_view")
      .select("*")
      .eq("event_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!event) notFound();

  const typedEvent = event as EventRow;
  const typedRegistrations = (registrations ?? []) as RegistrationViewRow[];
  const boundUpdate = updateEventAction.bind(null, typedEvent.id);

  return (
    <div>
      <h1 className="font-serif text-2xl">{typedEvent.name}</h1>

      <form action={boundUpdate} className="mt-6 grid gap-4 md:grid-cols-2 rounded-2xl border border-border p-6">
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-1">Nome</label>
          <input
            name="name"
            defaultValue={typedEvent.name}
            required
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-muted mb-1">Descrição</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={typedEvent.description}
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Data e hora</label>
          <input
            type="datetime-local"
            name="event_date"
            defaultValue={toDatetimeLocalValue(typedEvent.event_date)}
            required
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Local</label>
          <input
            name="location"
            defaultValue={typedEvent.location}
            required
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Valor (CHF)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="price_chf"
            defaultValue={typedEvent.price_chf}
            required
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Vagas máximas</label>
          <input
            type="number"
            min="1"
            name="max_spots"
            defaultValue={typedEvent.max_spots}
            required
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            Prazo de reserva (dias)
          </label>
          <input
            type="number"
            min="1"
            name="reservation_days"
            defaultValue={typedEvent.reservation_days}
            required
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Status</label>
          <select
            name="status"
            defaultValue={typedEvent.status}
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          >
            <option value="ativo">Ativo</option>
            <option value="encerrado">Encerrado</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="rounded-full bg-foreground text-background px-6 py-2 text-sm"
          >
            Salvar alterações
          </button>
        </div>
      </form>

      <h2 className="mt-10 font-serif text-xl">
        Inscritos ({typedRegistrations.length})
      </h2>
      <div className="mt-4 divide-y divide-border">
        {typedRegistrations.map((r) => (
          <div key={r.id} className="flex items-center justify-between py-4 gap-4">
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-sm text-muted">
                {r.email} · {r.phone}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={
                  r.effective_status === "confirmado"
                    ? "text-accent text-sm"
                    : r.effective_status === "expirado"
                    ? "text-muted text-sm line-through"
                    : "text-sm"
                }
              >
                {statusLabel[r.effective_status]}
              </span>
              {r.effective_status !== "confirmado" && (
                <form
                  action={confirmRegistrationAction.bind(null, typedEvent.id, r.id)}
                >
                  <button
                    type="submit"
                    className="text-sm rounded-full border border-border px-4 py-1.5 hover:border-foreground/40"
                  >
                    Marcar como pago
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
        {typedRegistrations.length === 0 && (
          <p className="py-8 text-sm text-muted">Nenhuma inscrição ainda.</p>
        )}
      </div>
    </div>
  );
}
