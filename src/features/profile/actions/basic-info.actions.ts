'use server';

import { createClient } from '@/src/lib/supabase/server';
import type { ActionResponse } from '../types';
import {
  updateBasicInfoSchema,
  updateUserProfileSchema,
  type UpdateBasicInfoInput,
  type UpdateUserProfileInput,
} from '../validation';
import { firstRelation, verifyOwnership, type BasicUserRelation, type Relation } from './shared';

interface BasicInfoRow {
  ubicacion: string | null;
  experiencia: number | null;
  telefono: string | null;
  id_especialidad: number | null;
  usuarios: Relation<BasicUserRelation>;
}

export async function updateBasicInfo(
  input: unknown,
): Promise<ActionResponse<UpdateBasicInfoInput>> {
  const result = updateBasicInfoSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createClient();
  const errorMsg = await verifyOwnership(result.data.doctorId, supabase);
  if (errorMsg) {
    return { success: false, error: errorMsg };
  }

  // Obtener los datos actuales de la BD para comparar
  const { data: current, error: fetchError } = await supabase
    .from('doctores')
    .select(`
      ubicacion,
      experiencia,
      telefono,
      id_especialidad,
      usuarios (nombre, correo)
    `)
    .eq('id', result.data.doctorId)
    .single();

  if (fetchError || !current) {
    return { success: false, error: 'No se pudo obtener el perfil actual para actualizar.' };
  }

  const currentRow = current as BasicInfoRow;
  const currentSpecialtyId = currentRow.id_especialidad;
  const currentUbicacion = currentRow.ubicacion;
  const currentExperiencia = currentRow.experiencia;
  const currentTelefono = currentRow.telefono;
  const userRelation = firstRelation(currentRow.usuarios);
  const currentNombre = userRelation?.nombre;
  const currentCorreo = userRelation?.correo;

  // 1. Actualizar usuarios si nombre o correo cambiaron
  const userUpdates: Partial<{ nombre: string; correo: string }> = {};
  if (result.data.name !== currentNombre) userUpdates.nombre = result.data.name;
  if (result.data.email !== currentCorreo) userUpdates.correo = result.data.email;

  if (Object.keys(userUpdates).length > 0) {
    const { error: userError } = await supabase
      .from('usuarios')
      .update(userUpdates)
      .eq('id', result.data.doctorId);

    if (userError) {
      return { success: false, error: 'Error al actualizar datos de usuario: ' + userError.message };
    }
  }

  // 2. Buscar o crear especialidad si es necesario
  let specialtyId = currentSpecialtyId;
  const { data: specialtyData } = await supabase
    .from('especialidades')
    .select('id')
    .eq('categoria', result.data.specialty)
    .maybeSingle();

  if (!specialtyData) {
    const { data: newSpec, error: insertSpecErr } = await supabase
      .from('especialidades')
      .insert({ categoria: result.data.specialty })
      .select('id')
      .single();
      
    if (!insertSpecErr && newSpec) {
      specialtyId = Number(newSpec.id);
    }
  } else {
    specialtyId = Number(specialtyData.id);
  }

  // 3. Actualizar doctores solo si los campos cambiaron
  const doctorUpdates: Partial<{
    id_especialidad: number | null;
    ubicacion: string;
    experiencia: number;
    telefono: string;
  }> = {};
  if (specialtyId !== currentSpecialtyId) doctorUpdates.id_especialidad = specialtyId;
  if (result.data.location !== currentUbicacion) doctorUpdates.ubicacion = result.data.location;
  if (result.data.experience !== currentExperiencia) doctorUpdates.experiencia = result.data.experience;
  if (result.data.phone !== currentTelefono) doctorUpdates.telefono = result.data.phone;

  if (Object.keys(doctorUpdates).length > 0) {
    const { error: doctorError } = await supabase
      .from('doctores')
      .update(doctorUpdates)
      .eq('id', result.data.doctorId);

    if (doctorError) {
      return { success: false, error: 'Error al actualizar perfil médico: ' + doctorError.message };
    }
  }

  return { success: true, data: result.data };
}

export async function updateUserProfile(
  input: unknown,
): Promise<ActionResponse<UpdateUserProfileInput>> {
  const result = updateUserProfileSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createClient();
  const errorMsg = await verifyOwnership(result.data.userId, supabase);
  if (errorMsg) {
    return { success: false, error: errorMsg };
  }

  const { error } = await supabase
    .from('usuarios')
    .update({ nombre: result.data.name })
    .eq('id', result.data.userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: result.data };
}
