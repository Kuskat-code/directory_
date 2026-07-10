import type { SpecialtyColorScheme } from '@/src/features/profile/types';

export interface SpecialtyColorTokens {
  bg: string;
  text: string;
  button: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface SpecialtyColorEntry extends SpecialtyColorTokens {
  editor: SpecialtyColorScheme;
}

export const DEFAULT_SPECIALTY_COLORS: SpecialtyColorEntry = {
  bg: 'bg-teal-100',
  text: 'text-teal-600',
  button: 'bg-teal-600 hover:bg-teal-700',
  gradientFrom: '#ccfbf1',
  gradientTo: '#e6fffa',
  editor: {
    primary: '#0d9488',
    light: '#f0fdfa',
    border: '#99f6e4',
    text: '#0f766e',
    badge: '#ccfbf1',
  },
};

export const SPECIALTY_COLORS: Record<string, SpecialtyColorEntry> = {
  'Cardiología': {
    bg: 'bg-red-100',
    text: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700',
    gradientFrom: '#fecaca',
    gradientTo: '#fee2e2',
    editor: { primary: '#dc2626', light: '#fef2f2', border: '#fecaca', text: '#b91c1c', badge: '#fee2e2' },
  },
  'Pediatría': {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    button: 'bg-blue-500 hover:bg-blue-600',
    gradientFrom: '#bfdbfe',
    gradientTo: '#dbeafe',
    editor: { primary: '#2563eb', light: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', badge: '#dbeafe' },
  },
  'Dermatología': {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    button: 'bg-orange-500 hover:bg-orange-600',
    gradientFrom: '#fed7aa',
    gradientTo: '#ffedd5',
    editor: { primary: '#ea580c', light: '#fff7ed', border: '#fed7aa', text: '#c2410c', badge: '#ffedd5' },
  },
  'Neurología': {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    button: 'bg-purple-500 hover:bg-purple-600',
    gradientFrom: '#e9d5ff',
    gradientTo: '#f3e8ff',
    editor: { primary: '#9333ea', light: '#faf5ff', border: '#e9d5ff', text: '#7e22ce', badge: '#f3e8ff' },
  },
  'Oftalmología': {
    bg: 'bg-cyan-100',
    text: 'text-cyan-600',
    button: 'bg-cyan-500 hover:bg-cyan-600',
    gradientFrom: '#a5f3fc',
    gradientTo: '#cffafe',
    editor: { primary: '#0891b2', light: '#ecfeff', border: '#a5f3fc', text: '#0e7490', badge: '#cffafe' },
  },
  'Psiquiatría': {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    button: 'bg-violet-500 hover:bg-violet-600',
    gradientFrom: '#ddd6fe',
    gradientTo: '#ede9fe',
    editor: { primary: '#7c3aed', light: '#f5f3ff', border: '#ddd6fe', text: '#6d28d9', badge: '#ede9fe' },
  },
  'Ginecología': {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    button: 'bg-rose-500 hover:bg-rose-600',
    gradientFrom: '#fecdd3',
    gradientTo: '#ffe4e6',
    editor: { primary: '#e11d48', light: '#fff1f2', border: '#fecdd3', text: '#be123c', badge: '#ffe4e6' },
  },
  'Traumatología y Ortopedia': {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    button: 'bg-amber-500 hover:bg-amber-600',
    gradientFrom: '#fde68a',
    gradientTo: '#fef3c7',
    editor: { primary: '#d97706', light: '#fffbeb', border: '#fde68a', text: '#b45309', badge: '#fef3c7' },
  },
  'Ortopedia': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    button: 'bg-yellow-600 hover:bg-yellow-700',
    gradientFrom: '#fef08a',
    gradientTo: '#fef9c3',
    editor: { primary: '#ca8a04', light: '#fefce8', border: '#fef08a', text: '#a16207', badge: '#fef9c3' },
  },
  'Endocrinología': {
    bg: 'bg-lime-100',
    text: 'text-lime-600',
    button: 'bg-lime-600 hover:bg-lime-700',
    gradientFrom: '#d9f99d',
    gradientTo: '#ecfccb',
    editor: { primary: '#65a30d', light: '#f7fee7', border: '#d9f99d', text: '#4d7c0f', badge: '#ecfccb' },
  },
  'Gastroenterología': {
    bg: 'bg-green-100',
    text: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700',
    gradientFrom: '#bbf7d0',
    gradientTo: '#dcfce7',
    editor: { primary: '#16a34a', light: '#f0fdf4', border: '#bbf7d0', text: '#15803d', badge: '#dcfce7' },
  },
  'Urología': {
    bg: 'bg-sky-100',
    text: 'text-sky-600',
    button: 'bg-sky-500 hover:bg-sky-600',
    gradientFrom: '#bae6fd',
    gradientTo: '#e0f2fe',
    editor: { primary: '#0284c7', light: '#f0f9ff', border: '#bae6fd', text: '#0369a1', badge: '#e0f2fe' },
  },
  'Oncología': {
    bg: 'bg-pink-100',
    text: 'text-pink-700',
    button: 'bg-pink-600 hover:bg-pink-700',
    gradientFrom: '#fbcfe8',
    gradientTo: '#fce7f3',
    editor: { primary: '#db2777', light: '#fdf2f8', border: '#fbcfe8', text: '#be185d', badge: '#fce7f3' },
  },
  'Reumatología': {
    bg: 'bg-fuchsia-100',
    text: 'text-fuchsia-600',
    button: 'bg-fuchsia-500 hover:bg-fuchsia-600',
    gradientFrom: '#f5d0fe',
    gradientTo: '#fae8ff',
    editor: { primary: '#c026d3', light: '#fdf4ff', border: '#f5d0fe', text: '#a21caf', badge: '#fae8ff' },
  },
  'Medicina General': {
    bg: 'bg-teal-100',
    text: 'text-teal-600',
    button: 'bg-teal-600 hover:bg-teal-700',
    gradientFrom: '#99f6e4',
    gradientTo: '#ccfbf1',
    editor: { primary: '#0d9488', light: '#f0fdfa', border: '#99f6e4', text: '#0f766e', badge: '#ccfbf1' },
  },
  'Otorrinolaringología': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    button: 'bg-indigo-500 hover:bg-indigo-600',
    gradientFrom: '#c7d2fe',
    gradientTo: '#e0e7ff',
    editor: { primary: '#4f46e5', light: '#eef2ff', border: '#c7d2fe', text: '#4338ca', badge: '#e0e7ff' },
  },
  'Neumología': {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    button: 'bg-slate-500 hover:bg-slate-600',
    gradientFrom: '#cbd5e1',
    gradientTo: '#e2e8f0',
    editor: { primary: '#475569', light: '#f8fafc', border: '#cbd5e1', text: '#334155', badge: '#e2e8f0' },
  },
  'Nefrología': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    gradientFrom: '#a7f3d0',
    gradientTo: '#d1fae5',
    editor: { primary: '#059669', light: '#ecfdf5', border: '#a7f3d0', text: '#047857', badge: '#d1fae5' },
  },
  'Infectología': {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    button: 'bg-orange-600 hover:bg-orange-700',
    gradientFrom: '#fdba74',
    gradientTo: '#ffedd5',
    editor: { primary: '#c2410c', light: '#fff7ed', border: '#fdba74', text: '#9a3412', badge: '#ffedd5' },
  },
  'Cirugía General': {
    bg: 'bg-zinc-100',
    text: 'text-zinc-600',
    button: 'bg-zinc-500 hover:bg-zinc-600',
    gradientFrom: '#d4d4d8',
    gradientTo: '#e4e4e7',
    editor: { primary: '#52525b', light: '#fafafa', border: '#d4d4d8', text: '#3f3f46', badge: '#e4e4e7' },
  },
  'Odontología': {
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    button: 'bg-sky-600 hover:bg-sky-700',
    gradientFrom: '#7dd3fc',
    gradientTo: '#e0f2fe',
    editor: { primary: '#0369a1', light: '#f0f9ff', border: '#7dd3fc', text: '#075985', badge: '#e0f2fe' },
  },
  'Psicología': {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    button: 'bg-purple-500 hover:bg-purple-600',
    gradientFrom: '#d8b4fe',
    gradientTo: '#f3e8ff',
    editor: { primary: '#9333ea', light: '#faf5ff', border: '#d8b4fe', text: '#7e22ce', badge: '#f3e8ff' },
  },
  'Nutrición': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    button: 'bg-emerald-500 hover:bg-emerald-600',
    gradientFrom: '#6ee7b7',
    gradientTo: '#d1fae5',
    editor: { primary: '#10b981', light: '#ecfdf5', border: '#6ee7b7', text: '#047857', badge: '#d1fae5' },
  },
};

export function getSpecialtyColorTokens(specialty: string): SpecialtyColorTokens {
  const entry = SPECIALTY_COLORS[specialty];
  if (!entry) {
    return DEFAULT_SPECIALTY_COLORS;
  }

  return {
    bg: entry.bg,
    text: entry.text,
    button: entry.button,
    gradientFrom: entry.gradientFrom,
    gradientTo: entry.gradientTo,
  };
}

export function getSpecialtyEditorColors(specialty: string): SpecialtyColorScheme {
  return SPECIALTY_COLORS[specialty]?.editor ?? DEFAULT_SPECIALTY_COLORS.editor;
}
