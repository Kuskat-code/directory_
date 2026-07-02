import '@supabase/supabase-js'

declare module '@supabase/supabase-js' {
  export interface UserAppMetadata {
    role?: 'paciente' | 'doctor' | 'admin'
  }
}
