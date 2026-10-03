import { createAdminClient } from "@/lib/supabase/admin";
import { deletePrayerRequestAction } from "@/app/admin/actions";
import { ConfirmForm } from "@/components/confirm-form";
import type { PrayerRequestRow } from "@/types/database";

export const dynamic = "force-dynamic";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default async function AdminOracoesPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("prayer_requests")
    .select("*")
    .order("created_at", { ascending: false });

  const requests = (data ?? []) as PrayerRequestRow[];

  return (
    <div>
      <h1 className="font-serif text-2xl">Pedidos de oração</h1>
      <p className="mt-2 text-sm text-muted">
        Enviados pelo formulário da página Contato. Apague os pedidos depois de
        orar, para não acumular informações pessoais.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {requests.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border p-6">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-medium">{r.name || "Anônimo"}</p>
              <p className="text-xs text-muted shrink-0">{formatDateTime(r.created_at)}</p>
            </div>
            {r.contact && <p className="text-sm text-muted">{r.contact}</p>}
            <p className="mt-3 whitespace-pre-wrap leading-relaxed">{r.message}</p>
            <ConfirmForm
              action={deletePrayerRequestAction.bind(null, r.id)}
              message="Apagar este pedido de oração? Não dá para desfazer."
              className="mt-4"
            >
              <button type="submit" className="text-sm text-muted hover:text-red-700">
                Apagar
              </button>
            </ConfirmForm>
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-sm text-muted">Nenhum pedido de oração no momento.</p>
        )}
      </div>
    </div>
  );
}
