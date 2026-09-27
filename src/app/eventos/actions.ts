"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function registerForEventAction(
  eventId: string,
  eventSlug: string,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !email || !phone) {
    return { error: "Preencha nome, e-mail e telefone." };
  }

  const supabase = createAdminClient();

  const { data: availability, error: availabilityError } = await supabase
    .from("events_availability")
    .select("status, spots_remaining")
    .eq("id", eventId)
    .maybeSingle();

  if (availabilityError) throw availabilityError;

  if (!availability || availability.status !== "ativo") {
    return { error: "Este evento não está mais aceitando inscrições." };
  }

  if (availability.spots_remaining <= 0) {
    return { error: "As vagas para este evento se esgotaram." };
  }

  const { data: registration, error } = await supabase
    .from("registrations")
    .insert({ event_id: eventId, name, email, phone })
    .select("id")
    .single();

  if (error) throw error;

  redirect(`/eventos/${eventSlug}/confirmacao/${registration.id}`);
}
