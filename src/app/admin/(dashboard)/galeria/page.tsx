import { getBucketImages } from "@/lib/photos";
import { GalleryUploadForm } from "@/components/gallery-upload-form";
import { AdminImageGrid } from "@/components/admin-image-grid";

export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  const images = await getBucketImages("gallery");

  return (
    <div>
      <h1 className="font-serif text-2xl">Galeria</h1>
      <GalleryUploadForm bucket="gallery" />
      <AdminImageGrid bucket="gallery" images={images} />
    </div>
  );
}
