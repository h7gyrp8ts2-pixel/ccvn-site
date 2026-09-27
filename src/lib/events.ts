import { createClient } from "@/lib/supabase/server";
import type { EventAvailabilityRow } from "@/types/database";

export async function getUpcomingEvents(limit?: number) {
  const supabase = createClient();
  let query = supabase
    .from("events_availability")
    .select("*")
    .eq("status", "ativo")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as EventAvailabilityRow[];
}

export async function getAllActiveEvents() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events_availability")
    .select("*")
    .eq("status", "ativo")
    .order("event_date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as EventAvailabilityRow[];
}

export async function getEventBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events_availability")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as EventAvailabilityRow | null;
}
