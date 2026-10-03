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

type ContentBucket = "ministerios" | "posts" | "hero" | "eventos";

async function uploadToBucket(bucket: ContentBucket, file: File) {
  const supabase = createAdminClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type });

  if (error) throw error;
  return path;
}

async function removeFromBucket(bucket: ContentBucket, path: string | null) {
  if (!path) return;
  const supabase = createAdminClient();
  await supabase.storage.from(bucket).remove([path]);
}

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
  const image = formData.get("image") as File | null;
  const imagePath = image && image.size > 0 ? await uploadToBucket("eventos", image) : null;

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
    show_spots: formData.get("show_spots") === "on",
    show_price: formData.get("show_price") === "on",
    image_path: imagePath,
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
  const image = formData.get("image") as File | null;
  const removeImage = formData.get("remove_image") === "on";

  const update: Record<string, unknown> = {
    name,
    description: String(formData.get("description") ?? ""),
    event_date: new Date(String(formData.get("event_date"))).toISOString(),
    location: String(formData.get("location") ?? ""),
    price_chf: Number(formData.get("price_chf") ?? 0),
    max_spots: Number(formData.get("max_spots") ?? 0),
    reservation_days: Number(formData.get("reservation_days") ?? 7),
    status: String(formData.get("status") ?? "ativo") as EventStatus,
    show_spots: formData.get("show_spots") === "on",
    show_price: formData.get("show_price") === "on",
  };

  if (image && image.size > 0) {
    const { data: current } = await supabase
      .from("events")
      .select("image_path")
      .eq("id", eventId)
      .maybeSingle();
    await removeFromBucket("eventos", current?.image_path ?? null);
    update.image_path = await uploadToBucket("eventos", image);
  } else if (removeImage) {
    const { data: current } = await supabase
      .from("events")
      .select("image_path")
      .eq("id", eventId)
      .maybeSingle();
    await removeFromBucket("eventos", current?.image_path ?? null);
    update.image_path = null;
  }

  const { error } = await supabase.from("events").update(update).eq("id", eventId);

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

  const heroPhoto = formData.get("hero_photo") as File | null;
  const removeHeroPhoto = formData.get("remove_hero_photo") === "on";
  const update: Record<string, unknown> = {
    hero_title: String(formData.get("hero_title") ?? ""),
    hero_subtitle: String(formData.get("hero_subtitle") ?? ""),
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
  };

  if (heroPhoto && heroPhoto.size > 0) {
    const { data: current } = await supabase
      .from("site_settings")
      .select("hero_photo_path")
      .eq("id", 1)
      .maybeSingle();
    await removeFromBucket("hero", current?.hero_photo_path ?? null);
    update.hero_photo_path = await uploadToBucket("hero", heroPhoto);
  } else if (removeHeroPhoto) {
    const { data: current } = await supabase
      .from("site_settings")
      .select("hero_photo_path")
      .eq("id", 1)
      .maybeSingle();
    await removeFromBucket("hero", current?.hero_photo_path ?? null);
    update.hero_photo_path = null;
  }

  const { error } = await supabase.from("site_settings").update(update).eq("id", 1);

  if (error) throw error;

  revalidatePath("/admin/configuracoes");
  revalidatePath("/admin/conteudo");
  revalidatePath("/");
  revalidatePath("/sobre");
  revalidatePath("/contato");
  revalidatePath("/eventos", "layout");
}

export async function createMinistryAction(formData: FormData) {
  const supabase = createAdminClient();
  const photo = formData.get("photo") as File | null;
  const photoPath = photo && photo.size > 0 ? await uploadToBucket("ministerios", photo) : null;

  const { error } = await supabase.from("ministries").insert({
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    position: Number(formData.get("position") ?? 0),
    photo_path: photoPath,
  });

  if (error) throw error;

  revalidatePath("/admin/ministerios");
  revalidatePath("/ministerios");
}

export async function updateMinistryAction(ministryId: string, formData: FormData) {
  const supabase = createAdminClient();
  const photo = formData.get("photo") as File | null;
  const removePhoto = formData.get("remove_photo") === "on";

  const update: Record<string, unknown> = {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    position: Number(formData.get("position") ?? 0),
  };

  if (photo && photo.size > 0) {
    const { data: current } = await supabase
      .from("ministries")
      .select("photo_path")
      .eq("id", ministryId)
      .maybeSingle();
    await removeFromBucket("ministerios", current?.photo_path ?? null);
    update.photo_path = await uploadToBucket("ministerios", photo);
  } else if (removePhoto) {
    const { data: current } = await supabase
      .from("ministries")
      .select("photo_path")
      .eq("id", ministryId)
      .maybeSingle();
    await removeFromBucket("ministerios", current?.photo_path ?? null);
    update.photo_path = null;
  }

  const { error } = await supabase.from("ministries").update(update).eq("id", ministryId);

  if (error) throw error;

  revalidatePath("/admin/ministerios");
  revalidatePath("/ministerios");
}

export async function deleteMinistryAction(ministryId: string) {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("ministries")
    .select("photo_path")
    .eq("id", ministryId)
    .maybeSingle();

  const { error } = await supabase.from("ministries").delete().eq("id", ministryId);
  if (error) throw error;

  await removeFromBucket("ministerios", current?.photo_path ?? null);

  revalidatePath("/admin/ministerios");
  revalidatePath("/ministerios");
}

export async function createPostAction(formData: FormData) {
  const supabase = createAdminClient();
  const image = formData.get("image") as File | null;
  const imagePath = image && image.size > 0 ? await uploadToBucket("posts", image) : null;
  const eventDate = String(formData.get("event_date") ?? "");

  const { error } = await supabase.from("posts").insert({
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? ""),
    external_link: String(formData.get("external_link") ?? "") || null,
    event_date: eventDate ? new Date(eventDate).toISOString() : null,
    image_path: imagePath,
  });

  if (error) throw error;

  revalidatePath("/admin/avisos");
  revalidatePath("/avisos");
  revalidatePath("/");
}

export async function deletePostAction(postId: string) {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("posts")
    .select("image_path")
    .eq("id", postId)
    .maybeSingle();

  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;

  await removeFromBucket("posts", current?.image_path ?? null);

  revalidatePath("/admin/avisos");
  revalidatePath("/avisos");
  revalidatePath("/");
}

export async function deleteEventAction(eventId: string) {
  const supabase = createAdminClient();
  const { data: current } = await supabase
    .from("events")
    .select("image_path")
    .eq("id", eventId)
    .maybeSingle();

  // As inscrições do evento são apagadas junto (on delete cascade).
  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) throw error;

  await removeFromBucket("eventos", current?.image_path ?? null);

  revalidatePath("/admin/eventos");
  revalidatePath("/eventos");
  revalidatePath("/");
  redirect("/admin/eventos");
}

export async function deletePrayerRequestAction(requestId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("prayer_requests").delete().eq("id", requestId);
  if (error) throw error;

  revalidatePath("/admin/oracoes");
}
