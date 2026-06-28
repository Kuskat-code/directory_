export const COLORS = {
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F8FAFC',
  TEAL: '#2563EB',
  DARK_GRAY: '#334155',
  ACCENT: '#2563EB',
};

export const LANDING_SPECIALTIES = [
  { name: 'Medicina General', icon: 'stethoscope' },
  { name: 'Cardiología', icon: 'heart' },
  { name: 'Pediatría', icon: 'baby' },
  { name: 'Psicología', icon: 'brain' },
  { name: 'Neurología', icon: 'activity' },
  { name: 'Nefrología', icon: 'droplets' },
  { name: 'Dermatología', icon: 'sparkles' },
  { name: 'Ginecología', icon: 'heart-handshake' },
] as const;

export const TRUST_POINTS = [
  'Médicos verificados',
  'Información actualizada',
  'Contacto directo',
  'Especialistas por departamento',
] as const;

export const PROFESSIONS = [
  { id: 'lawyer', label: 'Abogado/a', icon: '⚖️' },
  { id: 'doctor', label: 'Médico/a', icon: '🏥' },
  { id: 'engineer', label: 'Ingeniero/a', icon: '🔧' },
  { id: 'architect', label: 'Arquitecto/a', icon: '🏗️' },
  { id: 'accountant', label: 'Contador/a', icon: '📊' },
  { id: 'psychologist', label: 'Psicólogo/a', icon: '🧠' },
];

export const MEDICAL_SPECIALTIES = [
  'Medicina General',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Psiquiatría',
  'Neurología',
  'Oftalmología',
  'Otorrinolaringología',
  'Gastroenterología',
  'Ortopedia',
  'Ginecología',
  'Urología',
  'Nefrología',
  'Psicología',
];

export const EL_SALVADOR_DEPARTMENTS = [
  'San Salvador',
  'Santa Ana',
  'Sonsonate',
  'Cuscatlán',
  'La Libertad',
  'Cabañas',
  'Chalatenango',
  'La Paz',
  'San Vicente',
  'Morazán',
  'La Unión',
  'Usulután',
  'San Miguel',
];

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[0-9\s\-()]{9,}$/,
  PASSWORD_MIN_LENGTH: 8,
} as const;

export const APPOINTMENT_STATUSES = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmada',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
} as const;

export type DoctorAvailability = 'available' | 'limited' | 'unavailable';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  reviews: number;
  experience: number;
  availability?: DoctorAvailability;
  bio?: string;
  certifications?: string[];
  languages?: string[];
  verified?: boolean;
}

export function countDoctorsByDepartment(department: string): number {
  return EXAMPLE_DOCTORS.filter((d) => d.location === department).length;
}

export function getTopSpecialtiesForDepartment(
  department: string,
  defaults: readonly string[],
): string[] {
  const counts = new Map<string, number>();

  for (const doctor of EXAMPLE_DOCTORS) {
    if (doctor.location !== department) continue;
    counts.set(doctor.specialty, (counts.get(doctor.specialty) ?? 0) + 1);
  }

  if (counts.size === 0) return [...defaults];

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([specialty]) => specialty);
}

export const FEATURED_DOCTOR_IDS = ['1', '2', '7', '8', '10'] as const;

export const EXAMPLE_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Carlos López',
    specialty: 'Cardiología',
    location: 'San Salvador',
    phone: '+503 2345 6789',
    email: 'carlos.lopez@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    rating: 4.9,
    reviews: 45,
    experience: 15,
    availability: 'available',
    bio: 'Cardiólogo con más de 15 años de trayectoria en el diagnóstico y tratamiento de enfermedades cardiovasculares.',
    certifications: ['Universidad de El Salvador', 'UNAM - Cardiología'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '2',
    name: 'Dra. María García',
    specialty: 'Pediatría',
    location: 'Santa Ana',
    phone: '+503 2345 6790',
    email: 'maria.garcia@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    rating: 4.8,
    reviews: 38,
    experience: 12,
    availability: 'available',
    bio: 'Pediatra apasionada por la salud infantil con experiencia en desarrollo y nutrición pediátrica.',
    certifications: ['Universidad de El Salvador', 'Hospital Bloom'],
    languages: ['Español'],
  },
  {
    id: '3',
    name: 'Dr. Roberto Martínez',
    specialty: 'Dermatología',
    location: 'San Salvador',
    phone: '+503 2345 6791',
    email: 'roberto.martinez@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
    rating: 4.7,
    reviews: 52,
    experience: 20,
    availability: 'limited',
    bio: 'Dermatólogo especializado en dermatología clínica, estética y cirugía dermatológica.',
    certifications: ['Universidad de El Salvador', 'Hospital General'],
    languages: ['Español', 'Inglés', 'Francés'],
  },
  {
    id: '4',
    name: 'Dra. Ana Hernández',
    specialty: 'Neurología',
    location: 'La Libertad',
    phone: '+503 2345 6792',
    email: 'ana.hernandez@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    rating: 4.9,
    reviews: 29,
    experience: 8,
    bio: 'Neuróloga dedicada al estudio y tratamiento de trastornos del sistema nervioso central y periférico.',
    certifications: ['Universidad Centroamericana', 'Hospital de Diagnóstico'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '5',
    name: 'Dr. José Rodríguez',
    specialty: 'Oftalmología',
    location: 'San Salvador',
    phone: '+503 2345 6793',
    email: 'jose.rodriguez@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jose',
    rating: 4.6,
    reviews: 61,
    experience: 18,
    bio: 'Oftalmólogo con amplia experiencia en cirugía refractiva y tratamiento de enfermedades oculares.',
    certifications: ['Universidad de El Salvador', 'Instituto de Oftalmología'],
    languages: ['Español'],
  },
  {
    id: '6',
    name: 'Dra. Laura Fernández',
    specialty: 'Psiquiatría',
    location: 'Santa Ana',
    phone: '+503 2345 6794',
    email: 'laura.fernandez@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    rating: 4.8,
    reviews: 33,
    experience: 10,
    bio: 'Psiquiatra enfocada en salud mental, trastornos de ansiedad y depresión con enfoque humanista.',
    certifications: ['Universidad de El Salvador', 'Hospital Psiquiátrico'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '7',
    name: 'Dr. Miguel Ángel Ruiz',
    specialty: 'Ortopedia',
    location: 'San Miguel',
    phone: '+503 2345 6795',
    email: 'miguel.ruiz@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
    rating: 4.5,
    reviews: 27,
    experience: 14,
    bio: 'Ortopedico especializado en traumatología deportiva y reemplazos articulares.',
    certifications: ['Universidad de El Salvador', 'Hospital Militar'],
    languages: ['Español'],
  },
  {
    id: '8',
    name: 'Dra. Patricia Sandoval',
    specialty: 'Medicina General',
    location: 'San Salvador',
    phone: '+503 2345 6796',
    email: 'patricia.sandoval@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Patricia',
    rating: 4.9,
    reviews: 73,
    experience: 22,
    bio: 'Médica general con más de 22 años de experiencia en atención primaria y medicina preventiva.',
    certifications: ['Universidad de El Salvador', 'Ministerio de Salud'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '9',
    name: 'Dr. Fernando Castillo',
    specialty: 'Cardiología',
    location: 'La Libertad',
    phone: '+503 2345 6797',
    email: 'fernando.castillo@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernando',
    rating: 4.7,
    reviews: 41,
    experience: 16,
    bio: 'Cardiólogo intervencionista especializado en cateterismo cardíaco y hemodinamia.',
    certifications: ['Universidad de El Salvador', 'Hospital Nacional'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '10',
    name: 'Dra. Carmen Rivas',
    specialty: 'Ginecología',
    location: 'San Salvador',
    phone: '+503 2345 6798',
    email: 'carmen.rivas@email.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carmen',
    rating: 4.8,
    reviews: 56,
    experience: 19,
    bio: 'Ginecóloga obstetra con experiencia en atención integral de la salud femenina y embarazos de alto riesgo.',
    certifications: ['Universidad de El Salvador', 'Hospital de la Mujer'],
    languages: ['Español', 'Inglés'],
  },
];
