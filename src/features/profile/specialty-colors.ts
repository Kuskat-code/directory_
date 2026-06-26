import type { MedicalSpecialty, SpecialtyColorScheme } from './types';

export const SPECIALTY_COLORS: Record<string, SpecialtyColorScheme> = {
  'Cardiología': {
    primary: '#2563eb',
    light: '#eff6ff',
    border: '#bfdbfe',
    text: '#1d4ed8',
    badge: '#dbeafe',
  },
  'Dermatología': {
    primary: '#059669',
    light: '#ecfdf5',
    border: '#a7f3d0',
    text: '#047857',
    badge: '#d1fae5',
  },
  'Pediatría': {
    primary: '#d97706',
    light: '#fffbeb',
    border: '#fde68a',
    text: '#b45309',
    badge: '#fef3c7',
  },
  'Psicología': {
    primary: '#7c3aed',
    light: '#f5f3ff',
    border: '#ddd6fe',
    text: '#6d28d9',
    badge: '#ede9fe',
  },
  'Psiquiatría': {
    primary: '#7c3aed',
    light: '#f5f3ff',
    border: '#ddd6fe',
    text: '#6d28d9',
    badge: '#ede9fe',
  },
  'Ortopedia': {
    primary: '#dc2626',
    light: '#fef2f2',
    border: '#fecaca',
    text: '#b91c1c',
    badge: '#fee2e2',
  },
  'Neurología': {
    primary: '#0891b2',
    light: '#ecfeff',
    border: '#a5f3fc',
    text: '#0e7490',
    badge: '#cffafe',
  },
  'Oftalmología': {
    primary: '#0284c7',
    light: '#f0f9ff',
    border: '#bae6fd',
    text: '#0369a1',
    badge: '#e0f2fe',
  },
  'Ginecología': {
    primary: '#db2777',
    light: '#fdf2f8',
    border: '#fbcfe8',
    text: '#be185d',
    badge: '#fce7f3',
  },
  'Gastroenterología': {
    primary: '#ea580c',
    light: '#fff7ed',
    border: '#fed7aa',
    text: '#c2410c',
    badge: '#ffedd5',
  },
  'Urología': {
    primary: '#0f766e',
    light: '#f0fdfa',
    border: '#99f6e4',
    text: '#0d9488',
    badge: '#ccfbf1',
  },
  'Otorrinolaringología': {
    primary: '#4f46e5',
    light: '#eef2ff',
    border: '#c7d2fe',
    text: '#4338ca',
    badge: '#e0e7ff',
  },
};

const DEFAULT_SCHEME: SpecialtyColorScheme = {
  primary: '#0A6E7A',
  light: '#e8f4f8',
  border: '#b2d8e0',
  text: '#085660',
  badge: '#cce8ef',
};

export function getSpecialtyColors(specialty: MedicalSpecialty): SpecialtyColorScheme {
  return SPECIALTY_COLORS[specialty] ?? DEFAULT_SCHEME;
}
