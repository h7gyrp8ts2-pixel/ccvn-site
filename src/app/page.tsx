import Link from "next/link";
import { Logo } from "@/components/logo";
import { EventCard } from "@/components/event-card";
import { getUpcomingEvents } from "@/lib/events";
import { getSiteSettings } from "@/lib/site-settings";
import { getPosts } from "@/lib/posts";
import { getPublicImageUrl } from "@/lib/photos";
import { formatShortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, settings, posts] = await Promise.all([
    getUpcomingEvents(3),
    getSiteSettings(),
    getPosts(3),
  ]);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32 text-center">
        <div className="flex justify-center">
          <Logo variant="wordmark" />
        </div>
        <p className="mt-8 font-script text-3xl text-accent">{settings.hero_subtitle}</p>
        <h1 className="mt-4 font-serif text-3xl md:text-5xl max-w-3xl mx-auto text-balance">
          {settings.hero_title}
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

      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-2xl">Avisos e atividades</h2>
            <Link href="/avisos" className="text-sm text-muted hover:text-foreground">
              ver todos
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={post.external_link ?? "/avisos"}
                className="block rounded-2xl border border-border overflow-hidden hover:border-foreground/30 transition-colors"
              >
                {post.image_path && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getPublicImageUrl("posts", post.image_path)}
                    alt=""
                    className="w-full aspect-video object-cover"
                  />
                )}
                <div className="p-5">
                  {post.event_date && (
                    <p className="text-sm text-muted">{formatShortDate(post.event_date)}</p>
                  )}
                  <p className="mt-1 font-serif text-lg">{post.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
