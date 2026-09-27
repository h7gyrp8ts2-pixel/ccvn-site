import { getMinistries } from "@/lib/ministries";
import { getPublicImageUrl } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function MinisteriosPage() {
  const ministries = await getMinistries();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-script text-2xl text-accent">como servimos</p>
      <h1 className="mt-2 font-serif text-4xl">Ministérios</h1>

      <ul className="mt-10 divide-y divide-border">
        {ministries.map((m) => (
          <li key={m.id} className="py-6 flex gap-5">
            {m.photo_path && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getPublicImageUrl("ministerios", m.photo_path)}
                alt=""
                className="w-20 h-20 rounded-xl object-cover border border-border shrink-0"
              />
            )}
            <div>
              <h2 className="font-serif text-xl">{m.name}</h2>
              <p className="mt-1 text-muted leading-relaxed">{m.description}</p>
            </div>
          </li>
        ))}
        {ministries.length === 0 && (
          <p className="py-8 text-sm text-muted">Nenhum ministério cadastrado ainda.</p>
        )}
      </ul>
    </div>
  );
}
