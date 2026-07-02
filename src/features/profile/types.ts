export interface ProfileService {
  title: string;
  desc: string;
}

export interface ProfileScheduleItem {
  days: string;
  hours: string;
  closed?: boolean;
}

export interface EditableProfile {
  avatar: string;
  coverImage: string;
  name: string;
  specialty: string;
  location: string;
  experience: number;
  bio: string;
  languages: string[];
  phone: string;
  email: string;
  services: ProfileService[];
  schedule: ProfileScheduleItem[];
  galleryImages: string[];
  planType?: 'free' | 'premium' | 'enterprise';
}

export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type MedicalSpecialty =
  | 'Cardiología'
  | 'Dermatología'
  | 'Pediatría'
  | 'Psicología'
  | 'Psiquiatría'
  | 'Ortopedia'
  | 'Neurología'
  | 'Oftalmología'
  | 'Medicina General'
  | 'Gastroenterología'
  | 'Ginecología'
  | 'Otorrinolaringología'
  | 'Urología'
  | string;

export interface SpecialtyColorScheme {
  primary: string;
  light: string;
  border: string;
  text: string;
  badge: string;
}
