export type EventStatus = "ativo" | "encerrado";
export type RegistrationStatus = "reservado" | "confirmado";
export type EffectiveRegistrationStatus = RegistrationStatus | "expirado";

export interface EventRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  price_chf: number;
  max_spots: number;
  reservation_days: number;
  status: EventStatus;
  image_path: string | null;
  show_spots: boolean;
  show_price: boolean;
  created_at: string;
}

export interface EventAvailabilityRow extends EventRow {
  spots_remaining: number;
}

export interface RegistrationRow {
  id: string;
  event_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: RegistrationStatus;
  created_at: string;
  expires_at: string;
}

export interface RegistrationViewRow extends RegistrationRow {
  effective_status: EffectiveRegistrationStatus;
}

export interface SiteSettingsRow {
  id: number;
  hero_title: string;
  hero_subtitle: string;
  hero_photo_path: string | null;
  twint_qr_path: string | null;
  about_quem_somos: string;
  about_missao: string;
  about_visao: string;
  address_line1: string;
  address_line2: string;
  maps_query: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
  twint_number: string;
  account_holder: string;
  iban: string;
  payment_notes: string;
  updated_at: string;
}

export interface MinistryRow {
  id: string;
  name: string;
  description: string;
  position: number;
  photo_path: string | null;
  created_at: string;
}

export interface PostRow {
  id: string;
  title: string;
  description: string;
  image_path: string | null;
  external_link: string | null;
  event_date: string | null;
  created_at: string;
}

export interface PrayerRequestRow {
  id: string;
  name: string | null;
  contact: string | null;
  message: string;
  created_at: string;
}
