import { getMinistries } from "@/lib/ministries";
import {
  createMinistryAction,
  updateMinistryAction,
  deleteMinistryAction,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminMinisteriosPage() {
  const ministries = await getMinistries();
  const nextPosition = ministries.length
    ? Math.max(...ministries.map((m) => m.position)) + 1
    : 1;

  return (
    <div>
      <h1 className="font-serif text-2xl">Ministérios</h1>

      <details className="mt-6 rounded-2xl border border-border p-6">
        <summary className="cursor-pointer font-medium">
          + Adicionar ministério
        </summary>
        <form action={createMinistryAction} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">Nome</label>
            <input
              name="name"
              required
              className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Descrição</label>
            <textarea
              name="description"
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Ordem</label>
            <input
              type="number"
              name="position"
              defaultValue={nextPosition}
              className="w-32 rounded-lg border border-border px-3 py-2 bg-surface"
            />
          </div>
          <div>
            <button
              type="submit"
              className="rounded-full bg-foreground text-background px-6 py-2 text-sm"
            >
              Adicionar
            </button>
          </div>
        </form>
      </details>

      <div className="mt-8 flex flex-col gap-4">
        {ministries.map((ministry) => (
          <details key={ministry.id} className="rounded-2xl border border-border p-6">
            <summary className="cursor-pointer font-medium">
              {ministry.position}. {ministry.name}
            </summary>
            <form
              action={updateMinistryAction.bind(null, ministry.id)}
              className="mt-6 flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm text-muted mb-1">Nome</label>
                <input
                  name="name"
                  defaultValue={ministry.name}
                  required
                  className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Descrição</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={ministry.description}
                  className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Ordem</label>
                <input
                  type="number"
                  name="position"
                  defaultValue={ministry.position}
                  className="w-32 rounded-lg border border-border px-3 py-2 bg-surface"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-foreground text-background px-6 py-2 text-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
            <form action={deleteMinistryAction.bind(null, ministry.id)} className="mt-2">
              <button type="submit" className="text-sm text-muted hover:text-red-700">
                Remover ministério
              </button>
            </form>
          </details>
        ))}
        {ministries.length === 0 && (
          <p className="text-sm text-muted">Nenhum ministério cadastrado.</p>
        )}
      </div>
    </div>
  );
}
