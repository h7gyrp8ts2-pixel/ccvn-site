import Link from "next/link";
import type { EventAvailabilityRow } from "@/types/database";
import { formatShortDate, formatCHF } from "@/lib/format";

export function EventCard({ event }: { event: EventAvailabilityRow }) {
  const full = event.spots_remaining <= 0;

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="block rounded-2xl border border-border bg-surface p-6 hover:border-foreground/30 transition-colors"
    >
      <p className="text-sm text-muted">{formatShortDate(event.event_date)}</p>
      <h3 className="mt-2 font-serif text-xl">{event.name}</h3>
      <p className="mt-2 text-sm text-muted line-clamp-2">{event.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{formatCHF(event.price_chf)}</span>
        <span className={full ? "text-muted" : "text-accent"}>
          {full ? "Vagas esgotadas" : `${event.spots_remaining} vagas restantes`}
        </span>
      </div>
    </Link>
  );
}
