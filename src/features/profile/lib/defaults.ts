import type { Doctor } from '@/src/lib/constants';
import type { EditableProfile, ProfileScheduleItem, ProfileService } from '../types';

const DEFAULT_COVER =
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200';

const DEFAULT_GALLERY = [
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400',
];

const DEFAULT_SERVICES: ProfileService[] = [
  {
    title: 'Consulta Especializada',
    desc: 'Atencion medica personalizada con enfasis en diagnostico preciso y plan de tratamiento integral.',
  },
  {
    title: 'Diagnostico Avanzado',
    desc: 'Evaluacion completa utilizando tecnologia de punta para resultados precisos y confiables.',
  },
  {
    title: 'Seguimiento Continuo',
    desc: 'Monitoreo regular del progreso del tratamiento con ajustes personalizados segun sea necesario.',
  },
  {
    title: 'Teleconsulta',
    desc: 'Consultas virtuales para seguimiento y atencion primaria desde la comodidad de tu hogar.',
  },
];

const DEFAULT_SCHEDULE: ProfileScheduleItem[] = [
  { days: 'Lunes - Viernes', hours: '8:00 AM - 5:00 PM' },
  { days: 'Sabado', hours: '8:00 AM - 12:00 PM' },
  { days: 'Domingo', hours: 'Solo Emergencias', closed: true },
];

export function buildDefaultProfile(
  doctor: Doctor,
  services: ProfileService[] = DEFAULT_SERVICES,
  schedule: ProfileScheduleItem[] = DEFAULT_SCHEDULE,
  galleryImages: string[] = DEFAULT_GALLERY,
): EditableProfile {
  return {
    avatar: doctor.avatar,
    coverImage: DEFAULT_COVER,
    name: doctor.name,
    specialty: doctor.specialty,
    location: doctor.location,
    experience: doctor.experience,
    bio:
      doctor.bio ??
      `Especialista en ${doctor.specialty} con ${doctor.experience} anos de experiencia. Atencion personalizada y compromiso con la salud de sus pacientes.`,
    languages: doctor.languages ?? [],
    phone: doctor.phone,
    email: doctor.email,
    services,
    schedule,
    galleryImages,
  };
}

export const PROFILE_STORAGE_KEY = (doctorId: string) => `directorio-pro-profile-${doctorId}`;
