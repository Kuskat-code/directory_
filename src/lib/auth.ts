import { createClient } from '@/src/lib/supabase/server';
import { type User } from '@supabase/supabase-js';

export async function getAuthenticatedRole(): Promise<{ user: User | null; role: 'paciente' | 'doctor' | 'admin' | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { user, role: (user?.app_metadata?.role as any) ?? null };
}
