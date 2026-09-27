import { getPosts } from "@/lib/posts";
import { getPublicImageUrl } from "@/lib/photos";
import { createPostAction, deletePostAction } from "@/app/admin/actions";
import { formatShortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminAvisosPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1 className="font-serif text-2xl">Avisos e atividades</h1>
      <p className="mt-2 text-sm text-muted">
        Para divulgar um flyer de evento externo, atividade pontual ou aviso
        que não precisa de inscrição/controle de vagas — diferente de um
        evento da igreja (que fica em Eventos).
      </p>

      <details className="mt-6 rounded-2xl border border-border p-6">
        <summary className="cursor-pointer font-medium">+ Adicionar aviso</summary>
        <form action={createPostAction} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm text-muted mb-1">Título</label>
            <input
              name="title"
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
            <label className="block text-sm text-muted mb-1">
              Data (opcional, se for uma atividade com data marcada)
            </label>
            <input
              type="datetime-local"
              name="event_date"
              className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Link externo (opcional — inscrição, WhatsApp, Instagram...)
            </label>
            <input
              type="url"
              name="external_link"
              placeholder="https://..."
              className="w-full rounded-lg border border-border px-3 py-2 bg-surface"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Imagem / flyer (opcional)
            </label>
            <input type="file" name="image" accept="image/*" />
          </div>
          <div>
            <button
              type="submit"
              className="rounded-full bg-foreground text-background px-6 py-2 text-sm"
            >
              Publicar
            </button>
          </div>
        </form>
      </details>

      <div className="mt-8 flex flex-col gap-4">
        {posts.map((post) => (
          <div key={post.id} className="flex gap-4 rounded-2xl border border-border p-6">
            {post.image_path && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPublicImageUrl("posts", post.image_path)}
                alt=""
                className="w-24 h-24 object-cover rounded-lg border border-border shrink-0"
              />
            )}
            <div className="flex-1">
              <p className="font-medium">{post.title}</p>
              {post.event_date && (
                <p className="text-sm text-muted">{formatShortDate(post.event_date)}</p>
              )}
              <p className="mt-1 text-sm text-muted">{post.description}</p>
              {post.external_link && (
                <a
                  href={post.external_link}
                  className="mt-1 inline-block text-sm text-accent"
                >
                  {post.external_link}
                </a>
              )}
              <form action={deletePostAction.bind(null, post.id)} className="mt-2">
                <button type="submit" className="text-sm text-muted hover:text-red-700">
                  Remover
                </button>
              </form>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-muted">Nenhum aviso publicado ainda.</p>
        )}
      </div>
    </div>
  );
}
