import { getPosts } from "@/lib/posts";
import { getPublicImageUrl } from "@/lib/photos";
import { formatShortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AvisosPage() {
  const posts = await getPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-script text-2xl text-accent">fique por dentro</p>
      <h1 className="mt-2 font-serif text-4xl">Avisos e atividades</h1>

      <div className="mt-10 flex flex-col gap-6">
        {posts.map((post) => (
          <div key={post.id} className="rounded-2xl border border-border overflow-hidden">
            {post.image_path && (
              <div className="bg-surface flex justify-center max-h-[560px] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getPublicImageUrl("posts", post.image_path)}
                  alt=""
                  className="max-w-full max-h-[560px] object-contain"
                />
              </div>
            )}
            <div className="p-6">
              {post.event_date && (
                <p className="text-sm text-muted">{formatShortDate(post.event_date)}</p>
              )}
              <h2 className="mt-1 font-serif text-xl">{post.title}</h2>
              {post.description && (
                <p className="mt-2 text-muted leading-relaxed">{post.description}</p>
              )}
              {post.external_link && (
                <a
                  href={post.external_link}
                  className="mt-4 inline-block rounded-full border border-foreground px-5 py-2 text-sm hover:bg-foreground hover:text-background transition-colors"
                >
                  Saiba mais
                </a>
              )}
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-muted">Nenhum aviso publicado no momento.</p>
        )}
      </div>
    </div>
  );
}
