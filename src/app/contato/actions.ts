"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export type PrayerFormState = { error?: string; success?: boolean } | undefined;

export async function submitPrayerRequestAction(
  _prev: PrayerFormState,
  formData: FormData
): Promise<PrayerFormState> {
  // Campo escondido que humanos não preenchem; robôs costumam preencher.
  if (String(formData.get("website") ?? "")) {
    return { success: true };
  }

  const name = String(formData.get("name") ?? "").trim().slice(0, 120);
  const contact = String(formData.get("contact") ?? "").trim().slice(0, 160);
  const message = String(formData.get("message") ?? "").trim();

  if (!message) {
    return { error: "Escreva seu pedido de oração." };
  }
  if (message.length > 2000) {
    return { error: "O pedido está muito longo (máximo de 2000 caracteres)." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("prayer_requests").insert({
    name: name || null,
    contact: contact || null,
    message,
  });

  if (error) {
    return { error: "Não foi possível enviar agora. Tente novamente em instantes." };
  }

  return { success: true };
}
