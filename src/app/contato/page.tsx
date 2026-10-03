import { getSiteSettings } from "@/lib/site-settings";
import { PrayerRequestForm } from "@/components/prayer-request-form";

export const dynamic = "force-dynamic";

export default async function ContatoPage() {
  const settings = await getSiteSettings();
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    settings.maps_query
  )}&output=embed`;

  const socialLinks = [
    { label: "Instagram", href: settings.instagram },
    { label: "Facebook", href: settings.facebook },
    { label: "YouTube", href: settings.youtube },
  ].filter((link) => link.href);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-script text-2xl text-accent">venha nos visitar</p>
      <h1 className="mt-2 font-sans font-semibold text-4xl">Contato e localização</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide">
            Endereço
          </h2>
          <p className="mt-2">{settings.address_line1}</p>
          <p>{settings.address_line2}</p>

          <h2 className="mt-8 text-sm font-medium text-muted uppercase tracking-wide">
            E-mail
          </h2>
          <p className="mt-2">
            <a href={`mailto:${settings.email}`} className="hover:text-accent">
              {settings.email}
            </a>
          </p>

          <h2 className="mt-8 text-sm font-medium text-muted uppercase tracking-wide">
            Redes sociais
          </h2>
          {socialLinks.length > 0 ? (
            <div className="mt-2 flex flex-col gap-1">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:text-accent">
                  {link.label}
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-muted text-sm">
              Links a definir — cadastre em /admin/configuracoes.
            </p>
          )}
        </div>

        <div className="aspect-square md:aspect-auto md:h-full min-h-[280px] rounded-2xl overflow-hidden border border-border">
          <iframe
            title="Localização da CCVN"
            src={mapSrc}
            className="w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <section className="mt-16 border-t border-border pt-12">
        <p className="font-script text-2xl text-accent">podemos orar por você?</p>
        <h2 className="mt-1 font-serif text-2xl">Pedido de oração</h2>
        <p className="mt-2 mb-6 text-muted leading-relaxed">
          Compartilhe o que está no seu coração. Seu pedido é recebido pela
          equipe da igreja, que vai orar por você.
        </p>
        <PrayerRequestForm />
      </section>
    </div>
  );
}
