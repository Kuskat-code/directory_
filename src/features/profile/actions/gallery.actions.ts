'use server';

import { createClient } from '@/src/lib/supabase/server';
import type { ActionResponse } from '../types';
import {
  FREE_GALLERY_LIMIT,
  MAX_GALLERY_IMAGES,
  updateGallerySchema,
  type UpdateGalleryInput,
} from '../validation';
import { getErrorMessage, isPremiumPlan, uploadBase64Image, verifyOwnership } from './shared';

export async function updateGallery(
  input: unknown,
): Promise<ActionResponse<UpdateGalleryInput>> {
  const result = updateGallerySchema.safeParse(input);
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
    .select('galeria_imagenes, tipo_plan')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener la galería actual.' };
  }

  const maxImages = isPremiumPlan(current.tipo_plan) ? MAX_GALLERY_IMAGES : FREE_GALLERY_LIMIT;
  if (result.data.galleryImages.length > maxImages) {
    return {
      success: false,
      error: `Tu plan permite un máximo de ${maxImages} imágenes en la galería.`,
    };
  }

  const uploadedUrls = await Promise.all(
    result.data.galleryImages.map(async (img, idx) => {
      if (img.startsWith('data:image/')) {
        try {
          return await uploadBase64Image(
            supabase,
            img,
            'gallery',
            `gallery-${result.data.doctorId}-${idx}-${Date.now()}`
          );
        } catch (uploadError) {
          console.error('Error uploading gallery image:', uploadError);
          throw new Error('Error al subir imágenes de la galería');
        }
      }
      return img;
    })
  ).catch((err) => {
    return getErrorMessage(err);
  });

  if (typeof uploadedUrls === 'string') {
    return { success: false, error: uploadedUrls };
  }

  const currentGallery = current.galeria_imagenes ?? [];
  if (JSON.stringify(uploadedUrls) !== JSON.stringify(currentGallery)) {
    const { error } = await supabase
      .from('doctores')
      .update({
        galeria_imagenes: uploadedUrls,
      })
      .eq('id', result.data.doctorId);

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true, data: { ...result.data, galleryImages: uploadedUrls } };
}
