export const COLORS = {
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F1F5F9',
  TEAL: '#0F4C81',
  DARK_GRAY: '#334155',
};

export const PROFESSIONS = [
  { id: 'lawyer', label: 'Abogado/a', icon: '⚖️' },
  { id: 'doctor', label: 'Médico/a', icon: '🏥' },
  { id: 'engineer', label: 'Ingeniero/a', icon: '🔧' },
  { id: 'architect', label: 'Arquitecto/a', icon: '🏗️' },
  { id: 'accountant', label: 'Contador/a', icon: '📊' },
  { id: 'psychologist', label: 'Psicólogo/a', icon: '🧠' },
];

export interface SpecialtyInfo {
  name: string;
  themeColor: string; // Tailwinds colors: green, red, emerald, sky, purple...
  textColor: string;
  bgColor: string;
  accentColor: string;
  borderColor: string;
  hoverColor: string;
}

export const SPECIALTIES_THEMES: Record<string, SpecialtyInfo> = {
  'Medicina General': { name: 'Medicina General', themeColor: 'slate', textColor: 'text-slate-700', bgColor: 'bg-slate-50', accentColor: 'bg-slate-600', borderColor: 'border-slate-200', hoverColor: 'hover:bg-slate-100' },
  'Cardiología': { name: 'Cardiología', themeColor: 'red', textColor: 'text-red-700', bgColor: 'bg-red-50', accentColor: 'bg-red-600', borderColor: 'border-red-200', hoverColor: 'hover:bg-red-100' },
  'Nefrología': { name: 'Nefrología', themeColor: 'emerald', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', accentColor: 'bg-emerald-600', borderColor: 'border-emerald-200', hoverColor: 'hover:bg-emerald-100' },
  'Pediatría': { name: 'Pediatría', themeColor: 'amber', textColor: 'text-amber-700', bgColor: 'bg-amber-50', accentColor: 'bg-amber-500', borderColor: 'border-amber-200', hoverColor: 'hover:bg-amber-100' },
  'Dermatología': { name: 'Dermatología', themeColor: 'rose', textColor: 'text-rose-700', bgColor: 'bg-rose-50', accentColor: 'bg-rose-500', borderColor: 'border-rose-200', hoverColor: 'hover:bg-rose-100' },
  'Neurología': { name: 'Neurología', themeColor: 'indigo', textColor: 'text-indigo-700', bgColor: 'bg-indigo-50', accentColor: 'bg-indigo-600', borderColor: 'border-indigo-200', hoverColor: 'hover:bg-indigo-100' },
  'Psiquiatría': { name: 'Psiquiatría', themeColor: 'violet', textColor: 'text-violet-700', bgColor: 'bg-violet-50', accentColor: 'bg-violet-600', borderColor: 'border-violet-200', hoverColor: 'hover:bg-violet-100' },
  'Oftalmología': { name: 'Oftalmología', themeColor: 'sky', textColor: 'text-sky-700', bgColor: 'bg-sky-50', accentColor: 'bg-sky-500', borderColor: 'border-sky-200', hoverColor: 'hover:bg-sky-100' },
  'Ginecología': { name: 'Ginecología', themeColor: 'pink', textColor: 'text-pink-700', bgColor: 'bg-pink-50', accentColor: 'bg-pink-500', borderColor: 'border-pink-200', hoverColor: 'hover:bg-pink-100' },
  'Urología': { name: 'Urología', themeColor: 'blue', textColor: 'text-blue-700', bgColor: 'bg-blue-50', accentColor: 'bg-blue-600', borderColor: 'border-blue-200', hoverColor: 'hover:bg-blue-100' },
  'Gastroenterología': { name: 'Gastroenterología', themeColor: 'yellow', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50', accentColor: 'bg-yellow-600', borderColor: 'border-yellow-200', hoverColor: 'hover:bg-yellow-100' },
  'Ortopedia': { name: 'Ortopedia', themeColor: 'cyan', textColor: 'text-cyan-700', bgColor: 'bg-cyan-50', accentColor: 'bg-cyan-600', borderColor: 'border-cyan-200', hoverColor: 'hover:bg-cyan-100' },
  'Otorrinolaringología': { name: 'Otorrinolaringología', themeColor: 'teal', textColor: 'text-teal-700', bgColor: 'bg-teal-50', accentColor: 'bg-teal-600', borderColor: 'border-teal-200', hoverColor: 'hover:bg-teal-100' },
  'Odontología': { name: 'Odontología', themeColor: 'blue', textColor: 'text-blue-700', bgColor: 'bg-blue-50', accentColor: 'bg-blue-500', borderColor: 'border-blue-200', hoverColor: 'hover:bg-blue-100' },
  'Nutrición': { name: 'Nutrición', themeColor: 'lime', textColor: 'text-lime-700', bgColor: 'bg-lime-50', accentColor: 'bg-lime-600', borderColor: 'border-lime-200', hoverColor: 'hover:bg-lime-100' }
};

export const MEDICAL_SPECIALTIES = Object.keys(SPECIALTIES_THEMES);

export const EL_SALVADOR_DEPARTMENTS = [
  'San Miguel',
  'Usulután',
  'Morazán',
  'La Unión',
  'San Salvador',
  'La Libertad',
  'Santa Ana',
  'Sonsonate',
  'Cuscatlán',
  'Cabañas',
  'Chalatenango',
  'La Paz',
  'San Vicente',
  'Morazán',
  'Usulután',
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
  bio?: string;
  certifications?: string[];
  languages?: string[];
}

export const EXAMPLE_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Carlos López',
    specialty: 'Cardiología',
    location: 'San Miguel',
    phone: '+503 2661 1234',
    email: 'carlos.lopez@email.com',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=256&h=256&fit=crop',
    rating: 4.9,
    reviews: 45,
    experience: 15,
    bio: 'Cardiólogo con más de 15 años de trayectoria en el diagnóstico y tratamiento de enfermedades cardiovasculares en San Miguel.',
    certifications: ['Universidad de El Salvador', 'UNAM - Cardiología'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '2',
    name: 'Dra. María García',
    specialty: 'Pediatría',
    location: 'Usulután',
    phone: '+503 2662 5678',
    email: 'maria.garcia@email.com',
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=256&h=256&fit=crop',
    rating: 4.8,
    reviews: 38,
    experience: 12,
    bio: 'Pediatra apasionada por la salud infantil con amplia trayectoria atendiendo familias en Usulután.',
    certifications: ['Universidad de El Salvador', 'Hospital Bloom'],
    languages: ['Español'],
  },
  {
    id: '3',
    name: 'Dr. Roberto Martínez',
    specialty: 'Dermatología',
    location: 'San Miguel',
    phone: '+503 2661 9876',
    email: 'roberto.martinez@email.com',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=256&h=256&fit=crop',
    rating: 4.7,
    reviews: 52,
    experience: 20,
    bio: 'Dermatólogo especializado en dermatología clínica, estética y cirugía cutánea en la zona oriental.',
    certifications: ['Universidad de El Salvador', 'Hospital General'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '4',
    name: 'Dra. Ana Hernández',
    specialty: 'Neurología',
    location: 'Morazán',
    phone: '+503 2664 3456',
    email: 'ana.hernandez@email.com',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256&h=256&fit=crop',
    rating: 4.9,
    reviews: 29,
    experience: 8,
    bio: 'Neuróloga dedicada al estudio y tratamiento de trastornos del sistema nervioso en San Francisco Gotera y alrededores.',
    certifications: ['Universidad Centroamericana', 'Hospital de Diagnóstico'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '5',
    name: 'Dr. José Rodríguez',
    specialty: 'Oftalmología',
    location: 'La Unión',
    phone: '+503 2663 7890',
    email: 'jose.rodriguez@email.com',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=256&h=256&fit=crop',
    rating: 4.6,
    reviews: 61,
    experience: 18,
    bio: 'Oftalmólogo enfocado en cirugía refractiva y tratamiento integral de problemas de la vista en La Unión.',
    certifications: ['Universidad de El Salvador', 'Instituto de Oftalmología'],
    languages: ['Español'],
  },
  {
    id: '6',
    name: 'Dra. Laura Fernández',
    specialty: 'Psiquiatría',
    location: 'San Miguel',
    phone: '+503 2661 4321',
    email: 'laura.fernandez@email.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&fit=crop',
    rating: 4.8,
    reviews: 33,
    experience: 10,
    bio: 'Psiquiatra enfocada en salud mental, manejo del estrés y bienestar integral en la zona oriental.',
    certifications: ['Universidad de El Salvador', 'Hospital Psiquiátrico'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '7',
    name: 'Dr. Miguel Ángel Ruiz',
    specialty: 'Ortopedia',
    location: 'San Miguel',
    phone: '+503 2661 8765',
    email: 'miguel.ruiz@email.com',
    avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=256&h=256&fit=crop',
    rating: 4.5,
    reviews: 27,
    experience: 14,
    bio: 'Traumatólogo y ortopedista con amplia experiencia en lesiones deportivas y cirugía articular en San Miguel.',
    certifications: ['Universidad de El Salvador', 'Hospital Militar'],
    languages: ['Español'],
  },
  {
    id: '8',
    name: 'Dra. Patricia Sandoval',
    specialty: 'Medicina General',
    location: 'Usulután',
    phone: '+503 2662 1122',
    email: 'patricia.sandoval@email.com',
    avatar: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=256&h=256&fit=crop',
    rating: 4.9,
    reviews: 73,
    experience: 22,
    bio: 'Atención médica primaria y preventiva con enfoque en control de hipertensión y diabetes en Usulután.',
    certifications: ['Universidad de El Salvador', 'Ministerio de Salud'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '9',
    name: 'Dr. Fernando Castillo',
    specialty: 'Nefrología',
    location: 'La Unión',
    phone: '+503 2663 4455',
    email: 'fernando.castillo@email.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop',
    rating: 4.7,
    reviews: 41,
    experience: 16,
    bio: 'Médico Nefrólogo certificado, especialista en prevención, control y tratamiento de la insuficiencia renal.',
    certifications: ['Universidad de El Salvador', 'Hospital Rosales'],
    languages: ['Español', 'Inglés'],
  },
  {
    id: '10',
    name: 'Dra. Carmen Rivas',
    specialty: 'Ginecología',
    location: 'Usulután',
    phone: '+503 2662 9900',
    email: 'carmen.rivas@email.com',
    avatar: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=256&h=256&fit=crop',
    rating: 4.8,
    reviews: 56,
    experience: 19,
    bio: 'Ginecóloga obstetra enfocada en salud reproductiva y control de embarazos de alto riesgo en Usulután.',
    certifications: ['Universidad de El Salvador', 'Hospital de la Mujer'],
    languages: ['Español', 'Inglés'],
  },
];

