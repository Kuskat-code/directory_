import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Nota: En Client Components que se ejecutan en el navegador, 
  // Next.js solo expone las variables que inician con NEXT_PUBLIC_.
  // Si necesitas interactuar con Supabase desde componentes del lado del cliente,
  // asegúrate de añadir NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu .env.
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');

  return createBrowserClient(
    cleanUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
  );
}
