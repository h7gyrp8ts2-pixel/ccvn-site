import Link from "next/link";
import type { EventAvailabilityRow } from "@/types/database";
import { formatShortDate, formatCHF } from "@/lib/format";
import { getPublicImageUrl } from "@/lib/photos";

export function EventCard({ event }: { event: EventAvailabilityRow }) {
  const full = event.spots_remaining <= 0;

  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="block rounded-2xl border border-border bg-surface overflow-hidden hover:border-foreground/30 transition-colors"
    >
      {event.image_path && (
        <div className="aspect-[4/3] bg-surface flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getPublicImageUrl("eventos", event.image_path)}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      <div className="p-6">
        <p className="text-sm text-muted">{formatShortDate(event.event_date)}</p>
        <h3 className="mt-2 font-serif text-xl">{event.name}</h3>
        <p className="mt-2 text-sm text-muted line-clamp-2">{event.description}</p>
        {(event.show_price || event.show_spots || full) && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span>
              {event.show_price &&
                (event.price_chf > 0 ? formatCHF(event.price_chf) : "Gratuito")}
            </span>
            {(event.show_spots || full) && (
              <span className={full ? "text-muted" : "text-accent"}>
                {full ? "Vagas esgotadas" : `${event.spots_remaining} vagas restantes`}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
