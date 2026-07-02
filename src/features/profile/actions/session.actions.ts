'use server';

import { createClient } from '@/src/lib/supabase/server';
import type { ActionResponse } from '../types';
import { signUpSchema } from '../validation';

type ApplicationRole = 'paciente' | 'doctor' | 'admin';

function toApplicationRole(value: unknown): ApplicationRole {
  return value === 'doctor' || value === 'admin' ? value : 'paciente';
}

export async function signUpAction(input: unknown): Promise<ActionResponse<{ userId: string }>> {
  try {
    const result = signUpSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
    }

    // Si Turnstile está activo en el proyecto, el token es obligatorio
    if (!result.data.captchaToken) {
      console.error('Validation Error: captchaToken is missing');
      return { 
        success: false, 
        error: 'Falta el token de verificación de seguridad (Captcha). Por favor, asegúrese de completar el captcha en el formulario antes de enviar.' 
      };
    }

    const supabase = await createClient();
    const targetRole = result.data.role;
    
    const { data, error } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          name: result.data.name,
          role: targetRole,
        },
        captchaToken: result.data.captchaToken,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Error al registrar el usuario' };
    }

    return { success: true, data: { userId: data.user.id } };
  } catch (err) {
    console.error('Error in signUpAction:', err);
    const message = err instanceof Error ? err.message : 'Error interno al registrar el usuario.';
    return { success: false, error: message };
  }
}

export async function signInAction(input: {
  email: string;
  password: string;
}): Promise<ActionResponse<{ userId: string }>> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: 'Credenciales inválidas' };
    }

    return { success: true, data: { userId: data.user.id } };
  } catch (err) {
    console.error('Error in signInAction:', err);
    const message = err instanceof Error ? err.message : 'Error interno al iniciar sesión.';
    return { success: false, error: message };
  }
}

export interface UserSessionData {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: ApplicationRole;
}

export async function getCurrentUserSession(): Promise<ActionResponse<UserSessionData | null>> {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { success: true, data: null };
  }

  // Buscamos los datos de perfil desde la tabla usuarios
  const { data: userData } = await supabase
    .from('usuarios')
    .select('avatar, nombre, correo, rol')
    .eq('id', user.id)
    .maybeSingle();

  return {
    success: true,
    data: {
      id: user.id,
      name: userData?.nombre || user.user_metadata?.name || 'Usuario',
      email: userData?.correo || user.email || '',
      avatar: userData?.avatar || null,
      role: toApplicationRole(userData?.rol),
    },
  };
}

export async function signOutAction(): Promise<ActionResponse<void>> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data: undefined };
}
