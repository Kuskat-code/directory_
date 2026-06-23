// Colores de la marca
export const COLORS = {
  WHITE: '#FFFFFF',
  LIGHT_GRAY: '#F1F5F9',
  TEAL: '#0F4C81',
  DARK_GRAY: '#334155',
};

// Profesiones disponibles
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

export const EXAMPLE_DOCTORS = [
  {
    id: '1',
    name: 'Dr. Carlos López',
    specialty: 'Cardiología',
    location: 'San Salvador, El Salvador',
    phone: '+503 2345 6789',
    email: 'carlos.lopez@medicalpro.sv',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    rating: 4.9,
    reviews: 45,
    experience: 15,
    bio: 'Cardiólogo experimentado con más de 15 años de trayectoria.',
    certifications: [
      'Título de Médico Cirujano - Universidad de El Salvador',
      'Especialización en Cardiología - Universidad Nacional Autónoma de México',
    ],
    languages: ['Español', 'Inglés'],
  },
];
