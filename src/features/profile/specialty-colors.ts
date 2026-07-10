import type { MedicalSpecialty, SpecialtyColorScheme } from './types';
import { getSpecialtyEditorColors } from '@/src/lib/specialty-colors';

export { SPECIALTY_COLORS, getSpecialtyColorTokens, DEFAULT_SPECIALTY_COLORS } from '@/src/lib/specialty-colors';

export function getSpecialtyColors(specialty: MedicalSpecialty): SpecialtyColorScheme {
  return getSpecialtyEditorColors(specialty);
}
