import Link from "next/link";
import { Logo } from "@/components/logo";
import { EventCard } from "@/components/event-card";
import { getUpcomingEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const events = await getUpcomingEvents(3);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32 text-center">
        <div className="flex justify-center">
          <Logo variant="wordmark" />
        </div>
        <p className="mt-8 font-script text-3xl text-accent">bem-vindos à nossa comunidade</p>
        <h1 className="mt-4 font-serif text-3xl md:text-5xl max-w-3xl mx-auto text-balance">
          Um lugar para viver fé, comunhão e propósito juntos.
        </h1>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/sobre"
            className="rounded-full border border-foreground px-6 py-3 text-sm hover:bg-foreground hover:text-background transition-colors"
          >
            Conheça a CCVN
          </Link>
          <Link
            href="/eventos"
            className="rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm hover:opacity-90 transition-opacity"
          >
            Ver eventos
          </Link>
        </div>
      </section>

      {events.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-2xl">Próximos eventos</h2>
            <Link href="/eventos" className="text-sm text-muted hover:text-foreground">
              ver todos
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
