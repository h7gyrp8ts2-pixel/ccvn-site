import { notFound } from "next/navigation";
import { getEventBySlug } from "@/lib/events";
import { formatEventDate, formatCHF } from "@/lib/format";
import { EventRegistrationForm } from "@/components/event-registration-form";
import { getPublicImageUrl } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const full = event.spots_remaining <= 0;
  const closed = event.status !== "ativo";
  const isPaid = event.price_chf > 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-sm text-muted">{formatEventDate(event.event_date)}</p>
      <h1 className="mt-2 font-sans font-semibold text-4xl">{event.name}</h1>
      <p className="mt-2 text-muted">{event.location}</p>

      {event.image_path && (
        <div className="mt-8 bg-surface flex justify-center max-h-[560px] overflow-hidden rounded-2xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getPublicImageUrl("eventos", event.image_path)}
            alt=""
            className="max-w-full max-h-[560px] object-contain"
          />
        </div>
      )}

      {event.description && (
        <p className="mt-8 leading-relaxed">{event.description}</p>
      )}

      {(event.show_price || event.show_spots) && (
        <div className="mt-10 rounded-2xl border border-border p-6 flex flex-col gap-2">
          {event.show_price && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Valor</span>
              <span className="font-medium">
                {isPaid ? formatCHF(event.price_chf) : "Gratuito"}
              </span>
            </div>
          )}
          {event.show_spots && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Vagas restantes</span>
              <span className={full ? "text-muted" : "text-accent font-medium"}>
                {event.spots_remaining} / {event.max_spots}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        {closed || full ? (
          <p className="rounded-2xl bg-border/40 px-6 py-4 text-sm text-muted">
            {closed
              ? "As inscrições para este evento estão encerradas."
              : "As vagas para este evento se esgotaram."}
          </p>
        ) : (
          <>
            <h2 className="font-serif text-xl mb-4">Inscreva-se</h2>
            <EventRegistrationForm eventId={event.id} eventSlug={event.slug} isPaid={isPaid} />
          </>
        )}
      </div>
    </div>
  );
}
