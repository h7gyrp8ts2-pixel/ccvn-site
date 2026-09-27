import { getBucketImages } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function GaleriaPage() {
  const images = await getBucketImages("gallery");

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <p className="font-script text-2xl text-accent">momentos em comunhão</p>
      <h1 className="mt-2 font-sans font-semibold text-4xl">Galeria de fotos</h1>

      {images.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          Ainda não há fotos na galeria.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
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
