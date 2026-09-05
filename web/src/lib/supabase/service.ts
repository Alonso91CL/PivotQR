import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente con clave service_role: SOLO se usa en el servidor y en el worker
// de Cloudflare. Nunca en el frontend. Firma los inserts de escaneos.
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}