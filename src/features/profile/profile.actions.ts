'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import type { ActionResponse } from './types';
import {
  updateBasicInfoSchema,
  updateSummarySchema,
  updateScheduleSchema,
  updateServicesSchema,
  updateGallerySchema,
  updateAvatarSchema,
  type UpdateBasicInfoInput,
  type UpdateSummaryInput,
  type UpdateScheduleInput,
  type UpdateServicesInput,
  type UpdateGalleryInput,
  type UpdateAvatarInput,
} from './validation';

async function createSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    },
  );
}

async function getAuthenticatedUser() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function updateBasicInfo(
  input: unknown,
): Promise<ActionResponse<UpdateBasicInfoInput>> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'No autorizado' };

  const result = updateBasicInfoSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createSupabaseClient();
  const { doctorId, ...data } = result.data;

  const { error } = await supabase
    .from('doctor_profiles')
    .update(data)
    .eq('id', doctorId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: 'Error al guardar los cambios' };

  revalidatePath(`/perfil`);
  return { success: true, data: result.data };
}

export async function updateSummary(input: unknown): Promise<ActionResponse<UpdateSummaryInput>> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'No autorizado' };

  const result = updateSummarySchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createSupabaseClient();
  const { doctorId, ...data } = result.data;

  const { error } = await supabase
    .from('doctor_profiles')
    .update(data)
    .eq('id', doctorId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: 'Error al guardar el resumen' };

  revalidatePath(`/perfil`);
  return { success: true, data: result.data };
}

export async function updateSchedule(
  input: unknown,
): Promise<ActionResponse<UpdateScheduleInput>> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'No autorizado' };

  const result = updateScheduleSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createSupabaseClient();
  const { doctorId, schedule } = result.data;

  const { error } = await supabase
    .from('doctor_profiles')
    .update({ schedule })
    .eq('id', doctorId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: 'Error al guardar el horario' };

  revalidatePath(`/perfil`);
  return { success: true, data: result.data };
}

export async function updateServices(
  input: unknown,
): Promise<ActionResponse<UpdateServicesInput>> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'No autorizado' };

  const result = updateServicesSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createSupabaseClient();
  const { doctorId, services } = result.data;

  const { error } = await supabase
    .from('doctor_profiles')
    .update({ services })
    .eq('id', doctorId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: 'Error al guardar los servicios' };

  revalidatePath(`/perfil`);
  return { success: true, data: result.data };
}

export async function updateGallery(input: unknown): Promise<ActionResponse<UpdateGalleryInput>> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'No autorizado' };

  const result = updateGallerySchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createSupabaseClient();
  const { doctorId, galleryImages } = result.data;

  const { error } = await supabase
    .from('doctor_profiles')
    .update({ gallery_images: galleryImages })
    .eq('id', doctorId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: 'Error al guardar la galería' };

  revalidatePath(`/perfil`);
  return { success: true, data: result.data };
}

export async function updateAvatar(input: unknown): Promise<ActionResponse<UpdateAvatarInput>> {
  const user = await getAuthenticatedUser();
  if (!user) return { success: false, error: 'No autorizado' };

  const result = updateAvatarSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createSupabaseClient();
  const { doctorId, avatar } = result.data;

  const { error } = await supabase
    .from('doctor_profiles')
    .update({ avatar })
    .eq('id', doctorId)
    .eq('user_id', user.id);

  if (error) return { success: false, error: 'Error al guardar el avatar' };

  revalidatePath(`/perfil`);
  return { success: true, data: result.data };
}
