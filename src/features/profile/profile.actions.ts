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
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(doctorId);
  if (!isUuid) {
    // Si no es UUID (ID de prueba de ejemplo local '1', '2', etc.), 
    // permitimos la actualización temporal para desarrollo local sin sesión.
    return null;
  }

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

  const { error } = await supabase
    .from('doctors')
    .upsert({
      id: result.data.doctorId,
      name: result.data.name,
      specialty: result.data.specialty,
      location: result.data.location,
      experience: result.data.experience,
      phone: result.data.phone,
      email: result.data.email,
    });

  if (error) {
    return { success: false, error: error.message };
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
    .from('doctors')
    .upsert({
      id: result.data.doctorId,
      bio: result.data.bio,
      languages: result.data.languages,
    });

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
    .from('doctors')
    .upsert({
      id: result.data.doctorId,
      schedule: result.data.schedule,
    });

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
    .from('doctors')
    .upsert({
      id: result.data.doctorId,
      services: result.data.services,
    });

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
    .from('doctors')
    .upsert({
      id: result.data.doctorId,
      gallery_images: result.data.galleryImages,
    });

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
    .from('doctors')
    .upsert({
      id: result.data.doctorId,
      avatar: result.data.avatar,
    });

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
    .from('doctors')
    .select('*')
    .eq('id', doctorId)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data) {
    return { success: true, data: null };
  }

  const profile: Partial<EditableProfile> = {
    name: data.name || undefined,
    specialty: data.specialty || undefined,
    location: data.location || undefined,
    experience: data.experience !== null ? Number(data.experience) : undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    bio: data.bio || undefined,
    languages: data.languages || undefined,
    services: data.services || undefined,
    schedule: data.schedule || undefined,
    galleryImages: data.gallery_images || undefined,
    avatar: data.avatar || undefined,
    coverImage: data.cover_image || undefined,
  };

  return { success: true, data: profile };
}

import type { Doctor } from '@/src/lib/constants';

export async function getDoctorsList(): Promise<ActionResponse<Doctor[]>> {
  console.log('getDoctorsList: Fetching doctors from Supabase...');
  const { data, error } = await publicSupabase
    .from('doctors')
    .select('id, name, specialty, location, phone, email, avatar, cover_image, rating, reviews, experience, availability, bio, languages');

  if (error) {
    console.error('getDoctorsList database error:', error);
    return { success: false, error: error.message };
  }

  console.log('getDoctorsList: Retrieved doctors count:', data?.length);

  const list: Doctor[] = data.map((d) => ({
    id: d.id,
    name: d.name,
    specialty: d.specialty,
    location: d.location,
    phone: d.phone,
    email: d.email,
    avatar: d.avatar,
    coverImage: d.cover_image || undefined,
    rating: d.rating !== null && d.rating !== undefined ? Number(d.rating) : 5.0,
    reviews: d.reviews !== null && d.reviews !== undefined ? Number(d.reviews) : 1,
    experience: d.experience !== null && d.experience !== undefined ? Number(d.experience) : 1,
    availability: d.availability || 'available',
    bio: d.bio || undefined,
    certifications: undefined,
    languages: d.languages || undefined,
  }));

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

  // Si hay sesión, buscamos el avatar de la tabla doctors
  const { data: doctorData } = await supabase
    .from('doctors')
    .select('avatar, name')
    .eq('id', user.id)
    .single();

  return {
    success: true,
    data: {
      id: user.id,
      name: doctorData?.name || user.user_metadata?.name || 'Doctor',
      email: user.email || '',
      avatar: doctorData?.avatar || null,
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
