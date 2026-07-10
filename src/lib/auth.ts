import { cache } from 'react';
import { createClient } from '@/src/lib/supabase/server';
import { redirect } from 'next/navigation';

type ApplicationRole = 'paciente' | 'doctor' | 'admin';

function toApplicationRole(value: unknown): ApplicationRole | null {
  if (value === 'doctor' || value === 'admin' || value === 'paciente') {
    return value;
  }
  return null;
}

// cache() dedupe: si varios Server Components del mismo request llaman a
// getAuthenticatedRole (directa o indirectamente vía requireRole), solo se
// ejecuta un supabase.auth.getUser() real por request.
export const getAuthenticatedRole = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, role: null };
  }

  const { data: userData } = await supabase
    .from('usuarios')
    .select('rol')
    .eq('id', user.id)
    .maybeSingle();

  const role =
    toApplicationRole(userData?.rol) ??
    toApplicationRole(user.app_metadata?.role) ??
    toApplicationRole(user.user_metadata?.role);

  return { user, role };
});

export async function requireRole(
  allowedRoles: ApplicationRole[],
  fallback = '/',
) {
  const { user, role } = await getAuthenticatedRole();

  if (!user || !role || !allowedRoles.includes(role)) {
    if (!user) {
      redirect('/?auth=login');
    }
    redirect(fallback);
  }

  return { user, role };
}
