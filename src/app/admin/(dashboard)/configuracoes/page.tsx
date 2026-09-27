import { getSiteSettings } from "@/lib/site-settings";
import { updateSiteSettingsAction } from "@/app/admin/actions";

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
