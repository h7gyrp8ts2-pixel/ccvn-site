import { getSiteSettings } from "@/lib/site-settings";
import { getBucketImages, getPublicImageUrl } from "@/lib/photos";
import { updateSiteSettingsAction } from "@/app/admin/actions";
import { GalleryUploadForm } from "@/components/gallery-upload-form";
import { AdminImageGrid } from "@/components/admin-image-grid";

export const dynamic = "force-dynamic";

// Campos de site_settings que não são editados nesta página, mas precisam
// ser reenviados como hidden para não serem zerados ao salvar (a action
// sobrescreve a linha inteira com o que vier no formData).
function OtherSettingsFields({
  settings,
  exclude,
}: {
  settings: Awaited<ReturnType<typeof getSiteSettings>>;
  exclude: (keyof Awaited<ReturnType<typeof getSiteSettings>>)[];
}) {
  const fields: [string, string][] = [
    ["hero_title", settings.hero_title],
    ["hero_subtitle", settings.hero_subtitle],
    ["about_quem_somos", settings.about_quem_somos],
    ["about_missao", settings.about_missao],
    ["about_visao", settings.about_visao],
    ["address_line1", settings.address_line1],
    ["address_line2", settings.address_line2],
    ["maps_query", settings.maps_query],
    ["email", settings.email],
    ["instagram", settings.instagram],
    ["facebook", settings.facebook],
    ["youtube", settings.youtube],
    ["twint_number", settings.twint_number],
    ["account_holder", settings.account_holder],
    ["iban", settings.iban],
    ["payment_notes", settings.payment_notes],
  ];

  return (
    <>
      {fields
        .filter(([name]) => !exclude.includes(name as keyof typeof settings))
        .map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
    </>
  );
}

export default async function AdminConteudoPage() {
  const [settings, images] = await Promise.all([
    getSiteSettings(),
    getBucketImages("sobre"),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl">Conteúdo</h1>

      <h2 className="mt-6 font-serif text-xl">Início (hero)</h2>
      <form
        action={updateSiteSettingsAction}
        className="mt-4 flex flex-col gap-4 rounded-2xl border border-border p-6"
      >
        <OtherSettingsFields settings={settings} exclude={["hero_title", "hero_subtitle"]} />
        <div>
          <label className="block text-sm text-muted mb-1">
            Título principal (a frase grande da home)
          </label>
          <textarea
            name="hero_title"
            rows={2}
            defaultValue={settings.hero_title}
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">
            Frase de destaque (o texto em script acima do título)
          </label>
          <input
            name="hero_subtitle"
            defaultValue={settings.hero_subtitle}
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        {settings.hero_photo_path && (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getPublicImageUrl("hero", settings.hero_photo_path)}
              alt=""
              className="w-32 h-20 object-cover rounded-lg border border-border"
            />
            <label className="flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" name="remove_hero_photo" />
              remover foto de fundo
            </label>
          </div>
        )}
        <div>
          <label className="block text-sm text-muted mb-1">
            {settings.hero_photo_path
              ? "Trocar foto de fundo do hero"
              : "Foto de fundo do hero (opcional)"}
          </label>
          <input type="file" name="hero_photo" accept="image/*" />
          <p className="mt-1 text-xs text-muted">
            Quando tiver uma foto, ela vira o fundo da seção inicial da home,
            com o texto sobreposto e um escurecido para manter a leitura.
          </p>
        </div>
        <div>
          <button
            type="submit"
            className="rounded-full bg-foreground text-background px-6 py-2 text-sm"
          >
            Salvar
          </button>
        </div>
      </form>

      <h2 className="mt-10 font-serif text-xl">Sobre</h2>
      <form
        action={updateSiteSettingsAction}
        className="mt-4 flex flex-col gap-4 rounded-2xl border border-border p-6"
      >
        <OtherSettingsFields
          settings={settings}
          exclude={["about_quem_somos", "about_missao", "about_visao"]}
        />
        <div>
          <label className="block text-sm text-muted mb-1">Quem somos</label>
          <textarea
            name="about_quem_somos"
            rows={5}
            defaultValue={settings.about_quem_somos}
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Missão</label>
          <textarea
            name="about_missao"
            rows={3}
            defaultValue={settings.about_missao}
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Visão</label>
          <textarea
            name="about_visao"
            rows={3}
            defaultValue={settings.about_visao}
            className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
          />
        </div>
        <div>
          <button
            type="submit"
            className="rounded-full bg-foreground text-background px-6 py-2 text-sm"
          >
            Salvar
          </button>
        </div>
      </form>

      <h2 className="mt-10 font-serif text-xl">Fotos da página Sobre</h2>
      <GalleryUploadForm bucket="sobre" />
      <AdminImageGrid bucket="sobre" images={images} />
    </div>
  );
}
