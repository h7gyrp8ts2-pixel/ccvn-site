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
  created_at: string;
}

export interface EventAvailabilityRow extends EventRow {
  spots_remaining: number;
}

export interface RegistrationRow {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  status: RegistrationStatus;
  created_at: string;
  expires_at: string;
}

export interface RegistrationViewRow extends RegistrationRow {
  effective_status: EffectiveRegistrationStatus;
}

export interface SiteSettingsRow {
  id: number;
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
  created_at: string;
}
