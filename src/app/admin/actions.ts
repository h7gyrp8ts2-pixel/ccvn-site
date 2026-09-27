"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { checkAdminPassword } from "@/lib/admin-auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EventStatus } from "@/types/database";

type ImageBucket = "gallery" | "sobre";

const bucketPaths: Record<ImageBucket, { admin: string; public: string }> = {
  gallery: { admin: "/admin/galeria", public: "/galeria" },
  sobre: { admin: "/admin/conteudo", public: "/sobre" },
};

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!checkAdminPassword(password)) {
    return { error: "Senha incorreta." };
  }

  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createEventAction(formData: FormData) {
  const supabase = createAdminClient();
  const name = String(formData.get("name") ?? "").trim();

  const { error } = await supabase.from("events").insert({
    name,
    slug: slugify(name),
    description: String(formData.get("description") ?? ""),
    event_date: new Date(String(formData.get("event_date"))).toISOString(),
    location: String(formData.get("location") ?? ""),
    price_chf: Number(formData.get("price_chf") ?? 0),
    max_spots: Number(formData.get("max_spots") ?? 0),
    reservation_days: Number(formData.get("reservation_days") ?? 7),
    status: "ativo",
  });

  if (error) throw error;

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  revalidatePath("/");
  redirect("/admin/eventos");
}

export async function updateEventAction(eventId: string, formData: FormData) {
  const supabase = createAdminClient();
  const name = String(formData.get("name") ?? "").trim();

  const { error } = await supabase
    .from("events")
    .update({
      name,
      description: String(formData.get("description") ?? ""),
      event_date: new Date(String(formData.get("event_date"))).toISOString(),
      location: String(formData.get("location") ?? ""),
      price_chf: Number(formData.get("price_chf") ?? 0),
      max_spots: Number(formData.get("max_spots") ?? 0),
      reservation_days: Number(formData.get("reservation_days") ?? 7),
      status: String(formData.get("status") ?? "ativo") as EventStatus,
    })
    .eq("id", eventId);

  if (error) throw error;

  revalidatePath("/admin/eventos");
  revalidatePath(`/admin/eventos/${eventId}`);
  revalidatePath("/eventos");
  revalidatePath("/");
  redirect("/admin/eventos");
}

export async function confirmRegistrationAction(eventId: string, registrationId: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("registrations")
    .update({ status: "confirmado" })
    .eq("id", registrationId);

  if (error) throw error;

  revalidatePath(`/admin/eventos/${eventId}`);
  revalidatePath("/eventos");
}

export async function uploadImageAction(bucket: ImageBucket, formData: FormData) {
  const supabase = createAdminClient();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { error: "Selecione uma imagem." };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type });

  if (error) return { error: error.message };

  revalidatePath(bucketPaths[bucket].admin);
  revalidatePath(bucketPaths[bucket].public);
  return { error: null };
}

export async function deleteImageAction(bucket: ImageBucket, path: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;

  revalidatePath(bucketPaths[bucket].admin);
  revalidatePath(bucketPaths[bucket].public);
}

export async function updateSiteSettingsAction(formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("site_settings")
    .update({
      about_quem_somos: String(formData.get("about_quem_somos") ?? ""),
      about_missao: String(formData.get("about_missao") ?? ""),
      about_visao: String(formData.get("about_visao") ?? ""),
      address_line1: String(formData.get("address_line1") ?? ""),
      address_line2: String(formData.get("address_line2") ?? ""),
      maps_query: String(formData.get("maps_query") ?? ""),
      email: String(formData.get("email") ?? ""),
      instagram: String(formData.get("instagram") ?? ""),
      facebook: String(formData.get("facebook") ?? ""),
      youtube: String(formData.get("youtube") ?? ""),
      twint_number: String(formData.get("twint_number") ?? ""),
      account_holder: String(formData.get("account_holder") ?? ""),
      iban: String(formData.get("iban") ?? ""),
      payment_notes: String(formData.get("payment_notes") ?? ""),
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) throw error;

  revalidatePath("/admin/configuracoes");
  revalidatePath("/sobre");
  revalidatePath("/contato");
  revalidatePath("/eventos", "layout");
}

export async function createMinistryAction(formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase.from("ministries").insert({
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    position: Number(formData.get("position") ?? 0),
  });

  if (error) throw error;

  revalidatePath("/admin/ministerios");
  revalidatePath("/ministerios");
}

export async function updateMinistryAction(ministryId: string, formData: FormData) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("ministries")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? ""),
      position: Number(formData.get("position") ?? 0),
    })
    .eq("id", ministryId);

  if (error) throw error;

  revalidatePath("/admin/ministerios");
  revalidatePath("/ministerios");
}

export async function deleteMinistryAction(ministryId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("ministries").delete().eq("id", ministryId);
  if (error) throw error;

  revalidatePath("/admin/ministerios");
  revalidatePath("/ministerios");
}
