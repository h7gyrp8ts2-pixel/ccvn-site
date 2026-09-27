import { deleteImageAction } from "@/app/admin/actions";

export function AdminImageGrid({
  bucket,
  images,
}: {
  bucket: "gallery" | "sobre";
  images: { name: string; url: string }[];
}) {
  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.map((image) => (
        <div key={image.name} className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt=""
            className="aspect-square w-full object-cover rounded-xl border border-border"
          />
          <form
            action={deleteImageAction.bind(null, bucket, image.name)}
            className="absolute top-2 right-2"
          >
            <button
              type="submit"
              className="rounded-full bg-background/90 border border-border px-3 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              remover
            </button>
          </form>
        </div>
      ))}
      {images.length === 0 && (
        <p className="col-span-full py-8 text-sm text-muted">
          Nenhuma foto enviada ainda.
        </p>
      )}
    </div>
  );
}
