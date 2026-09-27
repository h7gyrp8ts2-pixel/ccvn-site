import { createClient } from "@/lib/supabase/server";
import type { SiteSettingsRow } from "@/types/database";

const fallback: SiteSettingsRow = {
  id: 1,
  about_quem_somos: "",
  about_missao: "",
  about_visao: "",
  address_line1: "Lettenstrasse 7",
  address_line2: "6343 Rotkreuz, Suíça",
  maps_query: "Lettenstrasse 7, 6343 Rotkreuz, Switzerland",
  email: "contato@ccvn.ch",
  instagram: "",
  facebook: "",
  youtube: "",
  twint_number: "",
  account_holder: "Comunidade Cristã Vida Nova",
  iban: "",
  payment_notes: "",
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettingsRow> {
  const supabase = createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (data as SiteSettingsRow | null) ?? fallback;
}
