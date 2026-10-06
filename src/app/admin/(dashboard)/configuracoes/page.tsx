import { getSiteSettings } from "@/lib/site-settings";
import { updateSiteSettingsAction } from "@/app/admin/actions";
import { getPublicImageUrl } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-serif text-2xl">Configurações</h1>

      <form
        action={updateSiteSettingsAction}
        className="mt-6 grid gap-6 md:grid-cols-2 rounded-2xl border border-border p-6"
      >
        <input type="hidden" name="hero_title" value={settings.hero_title} />
        <input type="hidden" name="hero_subtitle" value={settings.hero_subtitle} />
        <input type="hidden" name="about_quem_somos" value={settings.about_quem_somos} />
        <input type="hidden" name="about_missao" value={settings.about_missao} />
        <input type="hidden" name="about_visao" value={settings.about_visao} />

        <div className="md:col-span-2">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
            Endereço
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-muted mb-1">Endereço (linha 1)</label>
              <input
                name="address_line1"
                defaultValue={settings.address_line1}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Endereço (linha 2)</label>
              <input
                name="address_line2"
                defaultValue={settings.address_line2}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-muted mb-1">
                Busca no Google Maps
              </label>
              <input
                name="maps_query"
                defaultValue={settings.maps_query}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
            Contato e redes sociais
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-muted mb-1">E-mail</label>
              <input
                name="email"
                type="email"
                defaultValue={settings.email}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Instagram (URL)</label>
              <input
                name="instagram"
                defaultValue={settings.instagram}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Facebook (URL)</label>
              <input
                name="facebook"
                defaultValue={settings.facebook}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">YouTube (URL)</label>
              <input
                name="youtube"
                defaultValue={settings.youtube}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-3">
            Dados de pagamento (confirmação de inscrição)
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm text-muted mb-1">Twint</label>
              <input
                name="twint_number"
                defaultValue={settings.twint_number}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Titular da conta</label>
              <input
                name="account_holder"
                defaultValue={settings.account_holder}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">IBAN</label>
              <input
                name="iban"
                defaultValue={settings.iban}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
            <div className="md:col-span-2">
              {settings.twint_qr_path && (
                <div className="mb-3 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getPublicImageUrl("pagamento", settings.twint_qr_path)}
                    alt="QR code Twint atual"
                    className="w-24 h-24 object-contain rounded-lg border border-border bg-white"
                  />
                  <label className="flex items-center gap-2 text-sm text-muted">
                    <input type="checkbox" name="remove_twint_qr" />
                    remover QR code atual
                  </label>
                </div>
              )}
              <label className="block text-sm text-muted mb-1">
                {settings.twint_qr_path ? "Trocar QR code do Twint" : "QR code do Twint (imagem)"}
              </label>
              <input type="file" name="twint_qr" accept="image/*" />
              <p className="mt-1 text-xs text-muted">
                Aparece na página de pagamento dos eventos pagos.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-muted mb-1">Observações</label>
              <input
                name="payment_notes"
                defaultValue={settings.payment_notes}
                className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
              />
            </div>
          </div>
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
    </div>
  );
}
