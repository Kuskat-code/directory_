'use server';

import { createClient } from '@/src/lib/supabase/server';
import { publicSupabase } from '@/src/lib/supabase/public';
import type { ActionResponse, EditableProfile } from './types';
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

async function verifyOwnership(doctorId: string, supabase: any): Promise<string | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.id !== doctorId) {
    return 'Acceso no autorizado: Debes iniciar sesión y ser propietario de este perfil.';
  }
  return null;
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

  // 1. Obtener o crear el ID de la especialidad en la tabla especialidades
  const { data: specialtyData, error: specError } = await supabase
    .from('especialidades')
    .select('id')
    .eq('categoria', result.data.specialty)
    .maybeSingle();

  let specialtyId: number;
  if (specError || !specialtyData) {
    // Si no existe, la creamos
    const { data: newSpec, error: insertSpecErr } = await supabase
      .from('especialidades')
      .insert({ categoria: result.data.specialty })
      .select('id')
      .single();
      
    if (insertSpecErr || !newSpec) {
      return { success: false, error: 'Error al asociar la especialidad médica.' };
    }
    specialtyId = Number(newSpec.id);
  } else {
    specialtyId = Number(specialtyData.id);
  }

  // 2. Actualizar los datos generales en la tabla usuarios (nombre y correo)
  const { error: userError } = await supabase
    .from('usuarios')
    .update({
      nombre: result.data.name,
      correo: result.data.email,
    })
    .eq('id', result.data.doctorId);

  if (userError) {
    return { success: false, error: 'Error al actualizar datos de usuario: ' + userError.message };
  }

  // 3. Actualizar los datos específicos en la tabla doctores
  const { error: doctorError } = await supabase
    .from('doctores')
    .update({
      id_especialidad: specialtyId,
      ubicacion: result.data.location,
      experiencia: result.data.experience,
      telefono: result.data.phone,
    })
    .eq('id', result.data.doctorId);

  if (doctorError) {
    return { success: false, error: 'Error al actualizar perfil médico: ' + doctorError.message };
  }

  return { success: true, data: result.data };
}

export async function updateSummary(
  input: unknown,
): Promise<ActionResponse<UpdateSummaryInput>> {
  const result = updateSummarySchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createClient();
  const errorMsg = await verifyOwnership(result.data.doctorId, supabase);
  if (errorMsg) {
    return { success: false, error: errorMsg };
  }

  const { error } = await supabase
    .from('doctores')
    .update({
      bio: result.data.bio,
      lenguajes: result.data.languages,
    })
    .eq('id', result.data.doctorId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: result.data };
}

export async function updateSchedule(
  input: unknown,
): Promise<ActionResponse<UpdateScheduleInput>> {
  const result = updateScheduleSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createClient();
  const errorMsg = await verifyOwnership(result.data.doctorId, supabase);
  if (errorMsg) {
    return { success: false, error: errorMsg };
  }

  const { error } = await supabase
    .from('doctores')
    .update({
      cronograma: result.data.schedule,
    })
    .eq('id', result.data.doctorId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: result.data };
}

export async function updateServices(
  input: unknown,
): Promise<ActionResponse<UpdateServicesInput>> {
  const result = updateServicesSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  const supabase = await createClient();
  const errorMsg = await verifyOwnership(result.data.doctorId, supabase);
  if (errorMsg) {
    return { success: false, error: errorMsg };
  }

  const { error } = await supabase
    .from('doctores')
    .update({
      servicios: result.data.services,
    })
    .eq('id', result.data.doctorId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: result.data };
}

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

  const { error } = await supabase
    .from('doctores')
    .update({
      galeria_imagenes: result.data.galleryImages,
    })
    .eq('id', result.data.doctorId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: result.data };
}

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

  const { error } = await supabase
    .from('usuarios')
    .update({
      avatar: result.data.avatar,
    })
    .eq('id', result.data.doctorId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data: result.data };
}

export async function getDoctorProfile(
  doctorId: string,
): Promise<ActionResponse<Partial<EditableProfile> | null>> {
  if (!doctorId) {
    return { success: false, error: 'ID de doctor inválido' };
  }

  const { data, error } = await publicSupabase
    .from('doctores')
    .select(`
      id,
      ubicacion,
      experiencia,
      telefono,
      bio,
      lenguajes,
      servicios,
      cronograma,
      galeria_imagenes,
      imagen_portada,
      usuarios (
        nombre,
        correo,
        avatar
      ),
      especialidades (
        categoria
      )
    `)
    .eq('id', doctorId)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: true, data: null };
  }

  const userData = data.usuarios as any;
  const specialtyData = data.especialidades as any;

  const profile: Partial<EditableProfile> = {
    name: userData?.nombre || undefined,
    specialty: specialtyData?.categoria || undefined,
    location: data.ubicacion || undefined,
    experience: data.experiencia !== null ? Number(data.experiencia) : undefined,
    phone: data.telefono || undefined,
    email: userData?.correo || undefined,
    bio: data.bio || undefined,
    languages: data.lenguajes || undefined,
    services: data.servicios as any || undefined,
    schedule: data.cronograma as any || undefined,
    galleryImages: data.galeria_imagenes || undefined,
    avatar: userData?.avatar || undefined,
    coverImage: data.imagen_portada || undefined,
  };

  return { success: true, data: profile };
}

import type { Doctor } from '@/src/lib/constants';

export async function getDoctorsList(): Promise<ActionResponse<Doctor[]>> {
  console.log('getDoctorsList: Fetching doctors from Supabase...');
  const { data, error } = await publicSupabase
    .from('doctores')
    .select(`
      id,
      ubicacion,
      experiencia,
      telefono,
      bio,
      lenguajes,
      imagen_portada,
      usuarios (
        nombre,
        correo,
        avatar
      ),
      especialidades (
        categoria
      )
    `);

  if (error) {
    console.error('getDoctorsList database error:', error);
    return { success: false, error: error.message };
  }

  console.log('getDoctorsList: Retrieved doctors count:', data?.length);

  const list: Doctor[] = (data || []).map((d: any) => {
    const userData = d.usuarios as any;
    const specialtyData = d.especialidades as any;

    return {
      id: d.id,
      name: userData?.nombre || 'Especialista Registrado',
      specialty: specialtyData?.categoria || 'Medicina General',
      location: d.ubicacion,
      phone: d.telefono || '',
      email: userData?.correo || '',
      avatar: userData?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + d.id,
      coverImage: d.imagen_portada || undefined,
      rating: 5.0,
      reviews: 1,
      experience: d.experiencia !== null && d.experiencia !== undefined ? Number(d.experiencia) : 1,
      availability: 'available',
      bio: d.bio || undefined,
      certifications: undefined,
      languages: d.lenguajes || undefined,
    };
  });

  return { success: true, data: list };
}

export async function signUpAction(input: {
  name: string;
  email: string;
  password: string;
}): Promise<ActionResponse<{ userId: string }>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name,
        role: 'doctor', // Asignar rol doctor por defecto para activar el trigger de doctores
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: 'Error al registrar el usuario' };
  }

  return { success: true, data: { userId: data.user.id } };
}

export async function signInAction(input: {
  email: string;
  password: string;
}): Promise<ActionResponse<{ userId: string }>> {
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
}

export interface UserSessionData {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
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
    .select('avatar, nombre, correo')
    .eq('id', user.id)
    .maybeSingle();

  return {
    success: true,
    data: {
      id: user.id,
      name: userData?.nombre || user.user_metadata?.name || 'Usuario',
      email: userData?.correo || user.email || '',
      avatar: userData?.avatar || null,
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
