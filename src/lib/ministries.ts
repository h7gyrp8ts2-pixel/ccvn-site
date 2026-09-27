import { createClient } from "@/lib/supabase/server";
import type { MinistryRow } from "@/types/database";

export async function getMinistries() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ministries")
    .select("*")
    .order("position", { ascending: true });

  if (error) return [];
  return (data ?? []) as MinistryRow[];
}
