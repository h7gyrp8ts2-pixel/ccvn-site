import { createAdminClient } from "@/lib/supabase/admin";

export async function getBucketImages(bucket: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .list("", { sortBy: { column: "created_at", order: "desc" } });

  if (error) throw error;

  return (data ?? [])
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      name: f.name,
      url: supabase.storage.from(bucket).getPublicUrl(f.name).data.publicUrl,
    }));
}
