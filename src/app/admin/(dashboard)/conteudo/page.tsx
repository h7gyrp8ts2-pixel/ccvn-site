import { getSiteSettings } from "@/lib/site-settings";
import { getBucketImages } from "@/lib/photos";
import { updateSiteSettingsAction } from "@/app/admin/actions";
import { GalleryUploadForm } from "@/components/gallery-upload-form";
import { AdminImageGrid } from "@/components/admin-image-grid";

export const dynamic = "force-dynamic";

export default async function AdminConteudoPage() {
  const [settings, images] = await Promise.all([
    getSiteSettings(),
    getBucketImages("sobre"),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl">Conteúdo — página Sobre</h1>

      <form
        action={updateSiteSettingsAction}
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-border p-6"
      >
        {/* Campos de contato/pagamento também vivem em site_settings, então
            reenviamos os valores atuais aqui para não zerá-los ao salvar. */}
        <input type="hidden" name="address_line1" value={settings.address_line1} />
        <input type="hidden" name="address_line2" value={settings.address_line2} />
        <input type="hidden" name="maps_query" value={settings.maps_query} />
        <input type="hidden" name="email" value={settings.email} />
        <input type="hidden" name="instagram" value={settings.instagram} />
        <input type="hidden" name="facebook" value={settings.facebook} />
        <input type="hidden" name="youtube" value={settings.youtube} />
        <input type="hidden" name="twint_number" value={settings.twint_number} />
        <input type="hidden" name="account_holder" value={settings.account_holder} />
        <input type="hidden" name="iban" value={settings.iban} />
        <input type="hidden" name="payment_notes" value={settings.payment_notes} />

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
