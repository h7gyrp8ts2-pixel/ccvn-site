import { createClient } from "@/lib/supabase/server";
import type { PostRow } from "@/types/database";

export async function getPosts(limit?: number) {
  const supabase = createClient();
  let query = supabase.from("posts").select("*").order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as PostRow[];
}
