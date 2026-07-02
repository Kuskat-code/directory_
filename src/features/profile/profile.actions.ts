'use server';

import { createClient } from '@/src/lib/supabase/server';
import { publicSupabase } from '@/src/lib/supabase/public';
import type { Doctor } from '@/src/lib/constants';
import type {
  ActionResponse,
  EditableProfile,
  ProfileScheduleItem,
  ProfileService,
} from './types';
import {
  ACCEPTED_IMAGE_MIME_TYPES,
  FREE_GALLERY_LIMIT,
  MAX_GALLERY_IMAGES,
  MAX_IMAGE_BYTES,
  signUpSchema,
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

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;
type AcceptedImageMimeType = (typeof ACCEPTED_IMAGE_MIME_TYPES)[number];
type ApplicationRole = 'paciente' | 'doctor' | 'admin';
type Relation<T> = T | T[] | null;

interface BasicUserRelation {
  nombre: string | null;
  correo: string | null;
}

interface DoctorUserRelation extends BasicUserRelation {
  avatar: string | null;
}

interface SpecialtyRelation {
  categoria: string | null;
}

interface BasicInfoRow {
  ubicacion: string | null;
  experiencia: number | null;
  telefono: string | null;
  id_especialidad: number | null;
  usuarios: Relation<BasicUserRelation>;
}

interface SummaryRow {
  bio: string | null;
  lenguajes: string[] | null;
}

interface DoctorProfileRow {
  ubicacion: string | null;
  experiencia: number | null;
  telefono: string | null;
  bio: string | null;
  lenguajes: string[] | null;
  servicios: ProfileService[] | null;
  cronograma: ProfileScheduleItem[] | null;
  galeria_imagenes: string[] | null;
  imagen_portada: string | null;
  tipo_plan: unknown;
  usuarios: Relation<DoctorUserRelation>;
  especialidades: Relation<SpecialtyRelation>;
}

interface DoctorListRow {
  id: string;
  ubicacion: string;
  experiencia: number | null;
  telefono: string | null;
  bio: string | null;
  lenguajes: string[] | null;
  imagen_portada: string | null;
  tipo_plan: string | null;
  usuarios: Relation<DoctorUserRelation>;
  especialidades: Relation<SpecialtyRelation>;
}

const ACCEPTED_IMAGE_MIME_SET = new Set<string>(ACCEPTED_IMAGE_MIME_TYPES);

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Error desconocido';
}

function normalizeImageMimeType(contentType: string): AcceptedImageMimeType | null {
  const normalized = contentType === 'image/jpg' ? 'image/jpeg' : contentType;
  return ACCEPTED_IMAGE_MIME_SET.has(normalized) ? (normalized as AcceptedImageMimeType) : null;
}

function getBase64DecodedSize(base64Data: string): number {
  const padding = base64Data.endsWith('==') ? 2 : base64Data.endsWith('=') ? 1 : 0;
  return Math.floor((base64Data.length * 3) / 4) - padding;
}

function hasAllowedImageSignature(buffer: Buffer, contentType: AcceptedImageMimeType): boolean {
  switch (contentType) {
    case 'image/jpeg':
      return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    case 'image/webp':
      return buffer.length >= 12 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
    case 'image/gif':
      return buffer.subarray(0, 6).toString('ascii') === 'GIF87a' || buffer.subarray(0, 6).toString('ascii') === 'GIF89a';
  }
}

function isPremiumPlan(planType: unknown): boolean {
  return planType === 'premium' || planType === 'enterprise';
}

function toApplicationRole(value: unknown): ApplicationRole {
  return value === 'doctor' || value === 'admin' ? value : 'paciente';
}

function toPlanType(value: unknown): EditableProfile['planType'] | undefined {
  return value === 'free' || value === 'premium' || value === 'enterprise' ? value : undefined;
}

function firstRelation<T>(relation: Relation<T> | undefined): T | null {
  if (Array.isArray(relation)) return relation[0] ?? null;
  return relation ?? null;
}

function isHttpImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function verifyOwnership(doctorId: string, supabase: ServerSupabaseClient): Promise<string | null> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.id !== doctorId) {
    return 'Acceso no autorizado: Debes iniciar sesión y ser propietario de este perfil.';
  }
  return null;
}

async function uploadBase64Image(
  supabase: ServerSupabaseClient,
  base64String: string,
  bucketName: string,
  fileName: string
): Promise<string> {
  const match = base64String.match(/^data:(image\/(?:jpeg|jpg|png|webp|gif));base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) {
    if (isHttpImageUrl(base64String)) {
      return base64String;
    }
    throw new Error('Formato de imagen inválido.');
  }

  const contentType = normalizeImageMimeType(match[1]);
  if (!contentType) {
    throw new Error('Tipo de imagen no permitido.');
  }

  const base64Data = match[2];
  if (base64Data.length % 4 !== 0) {
    throw new Error('La imagen base64 está corrupta.');
  }

  const decodedSize = getBase64DecodedSize(base64Data);
  if (decodedSize <= 0 || decodedSize > MAX_IMAGE_BYTES) {
    throw new Error('La imagen excede el tamaño máximo de 5 MB.');
  }

  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.byteLength > MAX_IMAGE_BYTES || !hasAllowedImageSignature(buffer, contentType)) {
    throw new Error('El contenido del archivo no coincide con una imagen permitida.');
  }

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Error al subir a storage: ${error.message}. Asegúrate de que el bucket "${bucketName}" exista en Supabase y tenga las políticas RLS correspondientes activadas.`);
  }

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

  const currentRow = current as SummaryRow;
  const summaryUpdates: Partial<{ bio: string; lenguajes: string[] }> = {};
  if (result.data.bio !== currentRow.bio) summaryUpdates.bio = result.data.bio;

  const languagesChanged =
    !currentRow.lenguajes ||
    result.data.languages.length !== currentRow.lenguajes.length ||
    result.data.languages.some((val, idx) => val !== currentRow.lenguajes?.[idx]);

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

export async function getDoctorProfile(
  doctorId: string,
): Promise<ActionResponse<Partial<EditableProfile> | null>> {
  if (!doctorId) {
    return { success: false, error: 'ID de doctor inválido' };
  }

  try {
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
        tipo_plan,
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

    const profileRow = data as DoctorProfileRow;
    const userData = firstRelation(profileRow.usuarios);
    const specialtyData = firstRelation(profileRow.especialidades);

    const profile: Partial<EditableProfile> = {
      name: userData?.nombre || undefined,
      specialty: specialtyData?.categoria || undefined,
      location: profileRow.ubicacion || undefined,
      experience: profileRow.experiencia !== null ? Number(profileRow.experiencia) : undefined,
      phone: profileRow.telefono || undefined,
      email: userData?.correo || undefined,
      bio: profileRow.bio || undefined,
      languages: profileRow.lenguajes || undefined,
      services: profileRow.servicios || undefined,
      schedule: profileRow.cronograma || undefined,
      galleryImages: profileRow.galeria_imagenes || undefined,
      avatar: userData?.avatar || undefined,
      coverImage: profileRow.imagen_portada || undefined,
      planType: toPlanType(profileRow.tipo_plan),
    };

    return { success: true, data: profile };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error de red al intentar conectar con la base de datos.',
    };
  }
}

export async function getDoctorsList(): Promise<ActionResponse<Doctor[]>> {
  try {
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
        tipo_plan,
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
      return { success: false, error: error.message };
    }

    const list: Doctor[] = ((data ?? []) as DoctorListRow[]).map((d) => {
      const userData = firstRelation(d.usuarios);
      const specialtyData = firstRelation(d.especialidades);

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
        isPremium: d.tipo_plan === 'premium' || d.tipo_plan === 'enterprise',
      };
    });

    return { success: true, data: list };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Error de red al intentar conectar con la base de datos.',
    };
  }
}

export async function signUpAction(input: unknown): Promise<ActionResponse<{ userId: string }>> {
  try {
    const result = signUpSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message ?? 'Datos inválidos' };
    }

    // Dejamos que Supabase valide si el token es requerido según la configuración del proyecto

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
