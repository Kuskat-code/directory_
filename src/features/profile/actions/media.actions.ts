'use server';

import { createClient } from '@/src/lib/supabase/server';
import type { ActionResponse } from '../types';
import {
  updateAvatarSchema,
  updateCoverImageSchema,
  type UpdateAvatarInput,
  type UpdateCoverImageInput,
} from '../validation';
import { getErrorMessage, isPremiumPlan, uploadBase64Image, verifyOwnership } from './shared';

export async function updateAvatar(
  input: unknown,
): Promise<ActionResponse<UpdateAvatarInput>> {
  const result = updateAvatarSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createClient();
  const errorMsg = await verifyOwnership(result.data.doctorId, supabase);
  if (errorMsg) {
    return { success: false, error: errorMsg };
  }

  const { data: current, error: fetchErr } = await supabase
    .from('usuarios')
    .select('avatar')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener el avatar actual.' };
  }

  let avatarUrl = result.data.avatar;
  if (avatarUrl.startsWith('data:image/')) {
    try {
      avatarUrl = await uploadBase64Image(
        supabase,
        avatarUrl,
        'avatars',
        `avatar-${result.data.doctorId}-${Date.now()}`
      );
    } catch (uploadError: unknown) {
      return { success: false, error: 'Error al subir el avatar: ' + getErrorMessage(uploadError) };
    }
  }

  if (avatarUrl !== current.avatar) {
    const { error } = await supabase
      .from('usuarios')
      .update({
        avatar: avatarUrl,
      })
      .eq('id', result.data.doctorId);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true, data: { ...result.data, avatar: avatarUrl } };
}

export async function updateCoverImage(
  input: unknown,
): Promise<ActionResponse<UpdateCoverImageInput>> {
  const result = updateCoverImageSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createClient();
  const errorMsg = await verifyOwnership(result.data.doctorId, supabase);
  if (errorMsg) {
    return { success: false, error: errorMsg };
  }

  const { data: current, error: fetchErr } = await supabase
    .from('doctores')
    .select('imagen_portada, tipo_plan')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener la imagen de portada actual.' };
  }

  let coverUrl = result.data.coverImage;
  if (coverUrl !== current.imagen_portada && !isPremiumPlan(current.tipo_plan)) {
    return {
      success: false,
      error: 'La imagen de portada personalizada requiere un plan Premium o Enterprise.',
    };
  }

  if (coverUrl.startsWith('data:image/')) {
    try {
      coverUrl = await uploadBase64Image(
        supabase,
        coverUrl,
        'covers',
        `cover-${result.data.doctorId}-${Date.now()}`
      );
    } catch (uploadError: unknown) {
      return { success: false, error: 'Error al subir la imagen de portada: ' + getErrorMessage(uploadError) };
    }
  }

  if (coverUrl !== current.imagen_portada) {
    const { error } = await supabase
      .from('doctores')
      .update({
        imagen_portada: coverUrl,
      })
      .eq('id', result.data.doctorId);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true, data: { ...result.data, coverImage: coverUrl } };
}
