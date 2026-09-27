import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { createEventAction } from "@/app/admin/actions";
import { formatShortDate, formatCHF } from "@/lib/format";
import type { EventAvailabilityRow } from "@/types/database";

export const dynamic = "force-dynamic";

async function getEvents() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("events_availability")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) throw error;
  return (data ?? []) as EventAvailabilityRow[];
}

export default async function AdminEventosPage() {
  const events = await getEvents();

  return (
    <div>
      <h1 className="font-serif text-2xl">Eventos</h1>

      <details className="mt-6 rounded-2xl border border-border p-6">
        <summary className="cursor-pointer font-medium">
          + Criar novo evento
        </summary>
        <form action={createEventAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm text-muted mb-1">Nome</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-muted mb-1">Descrição</label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Data e hora</label>
            <input
              type="datetime-local"
              name="event_date"
              required
              className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Local</label>
            <input
              name="location"
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
              defaultValue={0}
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
              defaultValue={7}
              required
              className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-foreground text-background px-6 py-2 text-sm"
            >
              Criar evento
            </button>
          </div>
        </form>
      </details>

      <div className="mt-8 divide-y divide-border">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/admin/eventos/${event.id}`}
            className="flex items-center justify-between py-4 hover:opacity-70"
          >
            <div>
              <p className="font-medium">{event.name}</p>
              <p className="text-sm text-muted">
                {formatShortDate(event.event_date)} · {event.location}
              </p>
            </div>
            <div className="text-right text-sm">
              <p>{formatCHF(event.price_chf)}</p>
              <p className="text-muted">
                {event.spots_remaining}/{event.max_spots} vagas ·{" "}
                <span className={event.status === "ativo" ? "text-accent" : ""}>
                  {event.status}
                </span>
              </p>
            </div>
          </Link>
        ))}
        {events.length === 0 && (
          <p className="py-8 text-sm text-muted">Nenhum evento cadastrado.</p>
        )}
      </div>
    </div>
  );
}
