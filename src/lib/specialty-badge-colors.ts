export interface SpecialtyBadgeColors {
  bg: string;
  text: string;
  button: string;
  gradientFrom: string;
  gradientTo: string;
}

export const SPECIALTY_COLORS: Record<string, SpecialtyBadgeColors> = {
  'Cardiología': {
    bg: 'bg-red-100',
    text: 'text-red-600',
    button: 'bg-red-600 hover:bg-red-700',
    gradientFrom: '#fecaca',
    gradientTo: '#fee2e2',
  },
  'Pediatría': {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    button: 'bg-blue-500 hover:bg-blue-600',
    gradientFrom: '#bfdbfe',
    gradientTo: '#dbeafe',
  },
  'Dermatología': {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    button: 'bg-orange-500 hover:bg-orange-600',
    gradientFrom: '#fed7aa',
    gradientTo: '#ffedd5',
  },
  'Neurología': {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    button: 'bg-purple-500 hover:bg-purple-600',
    gradientFrom: '#e9d5ff',
    gradientTo: '#f3e8ff',
  },
  'Oftalmología': {
    bg: 'bg-cyan-100',
    text: 'text-cyan-600',
    button: 'bg-cyan-500 hover:bg-cyan-600',
    gradientFrom: '#a5f3fc',
    gradientTo: '#cffafe',
  },
  'Psiquiatría': {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    button: 'bg-violet-500 hover:bg-violet-600',
    gradientFrom: '#ddd6fe',
    gradientTo: '#ede9fe',
  },
  'Ginecología': {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    button: 'bg-rose-500 hover:bg-rose-600',
    gradientFrom: '#fecdd3',
    gradientTo: '#ffe4e6',
  },
  'Traumatología': {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    button: 'bg-amber-500 hover:bg-amber-600',
    gradientFrom: '#fde68a',
    gradientTo: '#fef3c7',
  },
  'Ortopedia': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    button: 'bg-yellow-600 hover:bg-yellow-700',
    gradientFrom: '#fef08a',
    gradientTo: '#fef9c3',
  },
  'Endocrinología': {
    bg: 'bg-lime-100',
    text: 'text-lime-600',
    button: 'bg-lime-600 hover:bg-lime-700',
    gradientFrom: '#d9f99d',
    gradientTo: '#ecfccb',
  },
  'Gastroenterología': {
    bg: 'bg-green-100',
    text: 'text-green-600',
    button: 'bg-green-600 hover:bg-green-700',
    gradientFrom: '#bbf7d0',
    gradientTo: '#dcfce7',
  },
  'Urología': {
    bg: 'bg-sky-100',
    text: 'text-sky-600',
    button: 'bg-sky-500 hover:bg-sky-600',
    gradientFrom: '#bae6fd',
    gradientTo: '#e0f2fe',
  },
  'Oncología': {
    bg: 'bg-pink-100',
    text: 'text-pink-700',
    button: 'bg-pink-600 hover:bg-pink-700',
    gradientFrom: '#fbcfe8',
    gradientTo: '#fce7f3',
  },
  'Reumatología': {
    bg: 'bg-fuchsia-100',
    text: 'text-fuchsia-600',
    button: 'bg-fuchsia-500 hover:bg-fuchsia-600',
    gradientFrom: '#f5d0fe',
    gradientTo: '#fae8ff',
  },
  'Medicina General': {
    bg: 'bg-teal-100',
    text: 'text-teal-600',
    button: 'bg-teal-600 hover:bg-teal-700',
    gradientFrom: '#99f6e4',
    gradientTo: '#ccfbf1',
  },
  'Otorrinolaringología': {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    button: 'bg-indigo-500 hover:bg-indigo-600',
    gradientFrom: '#c7d2fe',
    gradientTo: '#e0e7ff',
  },
  'Neumología': {
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    button: 'bg-slate-500 hover:bg-slate-600',
    gradientFrom: '#cbd5e1',
    gradientTo: '#e2e8f0',
  },
  'Nefrología': {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    gradientFrom: '#a7f3d0',
    gradientTo: '#d1fae5',
  },
  'Infectología': {
    bg: 'bg-orange-100',
    text: 'text-orange-700',
    button: 'bg-orange-600 hover:bg-orange-700',
    gradientFrom: '#fdba74',
    gradientTo: '#fed7aa',
  },
  'Cirugía General': {
    bg: 'bg-zinc-100',
    text: 'text-zinc-600',
    button: 'bg-zinc-500 hover:bg-zinc-600',
    gradientFrom: '#d4d4d8',
    gradientTo: '#e4e4e7',
  },
};

export const DEFAULT_SPECIALTY_COLOR: SpecialtyBadgeColors = {
  bg: 'bg-teal-100',
  text: 'text-teal-600',
  button: 'bg-teal-600 hover:bg-teal-700',
  gradientFrom: '#99f6e4',
  gradientTo: '#ccfbf1',
};

export function getSpecialtyBadgeColors(specialty: string): SpecialtyBadgeColors {
  return SPECIALTY_COLORS[specialty] ?? DEFAULT_SPECIALTY_COLOR;
}
