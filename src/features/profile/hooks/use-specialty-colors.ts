'use client';

import { useMemo } from 'react';
import { getSpecialtyColors } from '../specialty-colors';
import type { MedicalSpecialty, SpecialtyColorScheme } from '../types';

export function useSpecialtyColors(specialty: MedicalSpecialty): SpecialtyColorScheme {
  return useMemo(() => getSpecialtyColors(specialty), [specialty]);
}

export function useSpecialtyCssVars(specialty: MedicalSpecialty): React.CSSProperties {
  const colors = useSpecialtyColors(specialty);
  return useMemo(
    () => ({
      '--specialty-primary': colors.primary,
      '--specialty-light': colors.light,
      '--specialty-border': colors.border,
      '--specialty-text': colors.text,
      '--specialty-badge': colors.badge,
    } as React.CSSProperties),
    [colors],
  );
}
