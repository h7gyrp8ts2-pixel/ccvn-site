import { getSiteSettings } from "@/lib/site-settings";
import { getBucketImages } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function SobrePage() {
  const [settings, images] = await Promise.all([
    getSiteSettings(),
    getBucketImages("sobre"),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-script text-2xl text-accent">quem somos</p>
      <h1 className="mt-2 font-serif text-4xl">Sobre e nossa missão</h1>

      <p className="mt-8 leading-relaxed text-muted">{settings.about_quem_somos}</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border p-6">
          <h2 className="font-serif text-xl">Missão</h2>
          <p className="mt-2 text-muted leading-relaxed">{settings.about_missao}</p>
        </div>
        <div className="rounded-2xl border border-border p-6">
          <h2 className="font-serif text-xl">Visão</h2>
          <p className="mt-2 text-muted leading-relaxed">{settings.about_visao}</p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={image.name}
              src={image.url}
              alt=""
              className="aspect-square w-full object-cover rounded-xl border border-border"
            />
          ))}
        </div>
      )}
    </div>
  );
}
