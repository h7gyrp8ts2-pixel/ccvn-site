import { EventCard } from "@/components/event-card";
import { getAllActiveEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function EventosPage() {
  const events = await getAllActiveEvents();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-script text-2xl text-accent">participe com a gente</p>
      <h1 className="mt-2 font-sans font-semibold text-4xl">Eventos</h1>

      {events.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          Nenhum evento disponível no momento.
        </p>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
