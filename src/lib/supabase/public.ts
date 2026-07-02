import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const rawUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cliente público global estático que reutiliza las conexiones HTTP
// para evitar latencia de handshakes SSL repetidos y sobrecarga de cookies de Next.js
export const publicSupabase = createSupabaseClient(cleanUrl, anonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
