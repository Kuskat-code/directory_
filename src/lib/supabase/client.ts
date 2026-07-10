import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

let clientInstance: SupabaseClient | null = null;

export function createClient() {
  if (clientInstance) return clientInstance;

  // Nota: En Client Components que se ejecutan en el navegador,
  // Next.js solo expone las variables que inician con NEXT_PUBLIC_.
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

  clientInstance = createBrowserClient(
    cleanUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
  );

  return clientInstance;
}
