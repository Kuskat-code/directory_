'use server';

import { publicSupabase } from '@/src/lib/supabase/public';
import type { Doctor } from '@/src/lib/constants';
import type { ActionResponse, EditableProfile, ProfileScheduleItem, ProfileService } from '../types';
import { firstRelation, type BasicUserRelation, type Relation } from './shared';

interface DoctorUserRelation extends BasicUserRelation {
  avatar: string | null;
}

interface SpecialtyRelation {
  categoria: string | null;
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

function toPlanType(value: unknown): EditableProfile['planType'] | undefined {
  return value === 'free' || value === 'premium' || value === 'enterprise' ? value : undefined;
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
}

export async function getDoctorsList(): Promise<ActionResponse<Doctor[]>> {
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
}
