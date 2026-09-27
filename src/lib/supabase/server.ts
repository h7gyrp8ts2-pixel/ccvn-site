import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente público (chave anon): respeita RLS. Usado para leituras públicas
// (eventos, disponibilidade de vagas) em Server Components e Server Actions.
// Sem o generic Database: os tipos de retorno são convertidos explicitamente
// (EventRow, EventAvailabilityRow, ...) no ponto de uso.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
