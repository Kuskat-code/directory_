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
  updateCoverImageSchema,
  type UpdateBasicInfoInput,
  type UpdateSummaryInput,
  type UpdateScheduleInput,
  type UpdateServicesInput,
  type UpdateGalleryInput,
  type UpdateAvatarInput,
  type UpdateCoverImageInput,
} from './validation';

async function verifyOwnership(doctorId: string, supabase: any): Promise<string | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.id !== doctorId) {
    return 'Acceso no autorizado: Debes iniciar sesión y ser propietario de este perfil.';
  }
  return null;
}

async function uploadBase64Image(
  supabase: any,
  base64String: string,
  bucketName: string,
  fileName: string
): Promise<string> {
  // Check if it's actually a base64 string
  const match = base64String.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
  if (!match) {
    // If it's not a base64 string, assume it's already a URL
    return base64String;
  }

  const contentType = match[1];
  const base64Data = match[2];
  
  // Convert base64 data to Buffer
  const buffer = Buffer.from(base64Data, 'base64');

  // Attempt to upload the file to storage
  const { error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Error al subir a storage: ${error.message}. Asegúrate de que el bucket "${bucketName}" exista en Supabase y tenga las políticas RLS correspondientes activadas.`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrl;
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

  const currentSpecialtyId = current.id_especialidad;
  const currentUbicacion = current.ubicacion;
  const currentExperiencia = current.experiencia;
  const currentTelefono = current.telefono;
  const userRelation = current.usuarios as any;
  const currentNombre = Array.isArray(userRelation) ? userRelation[0]?.nombre : userRelation?.nombre;
  const currentCorreo = Array.isArray(userRelation) ? userRelation[0]?.correo : userRelation?.correo;

  // 1. Actualizar usuarios si nombre o correo cambiaron
  const userUpdates: Record<string, any> = {};
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
  const doctorUpdates: Record<string, any> = {};
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

  const { data: current, error: fetchErr } = await supabase
    .from('doctores')
    .select('bio, lenguajes')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener el perfil actual.' };
  }

  const summaryUpdates: Record<string, any> = {};
  if (result.data.bio !== current.bio) summaryUpdates.bio = result.data.bio;

  const languagesChanged =
    !current.lenguajes ||
    result.data.languages.length !== current.lenguajes.length ||
    result.data.languages.some((val, idx) => val !== current.lenguajes[idx]);

  if (languagesChanged) summaryUpdates.lenguajes = result.data.languages;

  if (Object.keys(summaryUpdates).length > 0) {
    const { error } = await supabase
      .from('doctores')
      .update(summaryUpdates)
      .eq('id', result.data.doctorId);

    if (error) {
      return { success: false, error: error.message };
    }
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

  const { data: current, error: fetchErr } = await supabase
    .from('doctores')
    .select('cronograma')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener el cronograma actual.' };
  }

  if (JSON.stringify(result.data.schedule) !== JSON.stringify(current.cronograma)) {
    const { error } = await supabase
      .from('doctores')
      .update({
        cronograma: result.data.schedule,
      })
      .eq('id', result.data.doctorId);

    if (error) {
      return { success: false, error: error.message };
    }
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

  const { data: current, error: fetchErr } = await supabase
    .from('doctores')
    .select('servicios')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener los servicios actuales.' };
  }

  if (JSON.stringify(result.data.services) !== JSON.stringify(current.servicios)) {
    const { error } = await supabase
      .from('doctores')
      .update({
        servicios: result.data.services,
      })
      .eq('id', result.data.doctorId);

    if (error) {
      return { success: false, error: error.message };
    }
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

  const { data: current, error: fetchErr } = await supabase
    .from('doctores')
    .select('galeria_imagenes')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener la galería actual.' };
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
    return err.message;
  });

  if (typeof uploadedUrls === 'string') {
    return { success: false, error: uploadedUrls };
  }

  if (JSON.stringify(uploadedUrls) !== JSON.stringify(current.galeria_imagenes)) {
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
    } catch (uploadError: any) {
      return { success: false, error: 'Error al subir el avatar: ' + uploadError.message };
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
    .select('imagen_portada')
    .eq('id', result.data.doctorId)
    .single();

  if (fetchErr || !current) {
    return { success: false, error: 'No se pudo obtener la imagen de portada actual.' };
  }

  let coverUrl = result.data.coverImage;
  if (coverUrl.startsWith('data:image/')) {
    try {
      coverUrl = await uploadBase64Image(
        supabase,
        coverUrl,
        'covers',
        `cover-${result.data.doctorId}-${Date.now()}`
      );
    } catch (uploadError: any) {
      return { success: false, error: 'Error al subir la imagen de portada: ' + uploadError.message };
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
