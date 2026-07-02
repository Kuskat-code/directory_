import { cache } from 'react'
import { createClient } from '@/src/lib/supabase/server'
import { redirect } from 'next/navigation'

// cache() dedupe: si varios Server Components del mismo request llaman a
// getAuthenticatedRole (directa o indirectamente vía requireRole), solo se
// ejecuta un supabase.auth.getUser() real por request.
export const getAuthenticatedRole = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = user?.app_metadata?.role ?? null
  return { user, role }
})

export async function requireRole(allowedRoles: ('paciente' | 'doctor' | 'admin')[], fallback = '/') {
  const { user, role } = await getAuthenticatedRole()
  if (!user || !role || !allowedRoles.includes(role as 'paciente' | 'doctor' | 'admin')) {
    if (!user) {
      redirect('/?auth=login')
    }
    redirect(fallback)
  }
  return { user, role: role as 'paciente' | 'doctor' | 'admin' }
}
