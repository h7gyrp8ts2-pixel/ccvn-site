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

  const supabase = createAdminClient();

  const { data: availability, error: availabilityError } = await supabase
    .from("events_availability")
    .select("status, spots_remaining, price_chf")
    .eq("id", eventId)
    .maybeSingle();

  if (availabilityError) throw availabilityError;

  if (!availability || availability.status !== "ativo") {
    return { error: "Este evento não está mais aceitando inscrições." };
  }

  const isPaid = availability.price_chf > 0;

  if (!name || (isPaid && (!email || !phone))) {
    return {
      error: isPaid
        ? "Preencha nome, e-mail e telefone."
        : "Preencha seu nome.",
    };
  }

  if (availability.spots_remaining <= 0) {
    return { error: "As vagas para este evento se esgotaram." };
  }

  const { data: registration, error } = await supabase
    .from("registrations")
    .insert({
      event_id: eventId,
      name,
      email: email || null,
      phone: phone || null,
      status: isPaid ? "reservado" : "confirmado",
    })
    .select("id")
    .single();

  if (error) throw error;

  redirect(`/eventos/${eventSlug}/confirmacao/${registration.id}`);
}
