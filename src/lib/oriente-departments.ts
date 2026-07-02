import {
  countDoctorsByDepartment,
  getTopSpecialtiesForDepartment,
} from '@/src/lib/constants';

export const ORIENTE_DEPARTMENT_MAP = {
  'SV-SM': {
    name: 'San Miguel',
    slug: 'san-miguel',
    location: 'San Miguel',
    doctors: 42,
    specialties: ['Medicina General', 'Cardiología', 'Traumatología y Ortopedia'],
  },
  'SV-US': {
    name: 'Usulután',
    slug: 'usulutan',
    location: 'Usulután',
    doctors: 32,
    specialties: ['Medicina General', 'Pediatría', 'Ginecología'],
  },
  'SV-MO': {
    name: 'Morazán',
    slug: 'morazan',
    location: 'Morazán',
    doctors: 24,
    specialties: ['Medicina General', 'Psicología', 'Dermatología'],
  },
  'SV-UN': {
    name: 'La Unión',
    slug: 'la-union',
    location: 'La Unión',
    doctors: 19,
    specialties: ['Medicina General', 'Oftalmología', 'Cardiología'],
  },
} as const;

export type OrienteDepartmentId = keyof typeof ORIENTE_DEPARTMENT_MAP;

export type OrienteDepartmentConfig = (typeof ORIENTE_DEPARTMENT_MAP)[OrienteDepartmentId];

export const ORIENTE_DEPARTMENT_IDS = Object.keys(
  ORIENTE_DEPARTMENT_MAP,
) as OrienteDepartmentId[];

export function getOrienteDepartment(id: OrienteDepartmentId): OrienteDepartmentConfig {
  return ORIENTE_DEPARTMENT_MAP[id];
}

export function getOrienteDepartmentByRouteSlug(
  routeSlug: string,
): (OrienteDepartmentConfig & { id: OrienteDepartmentId }) | undefined {
  const entry = ORIENTE_DEPARTMENT_IDS.find((id) => ORIENTE_DEPARTMENT_MAP[id].slug === routeSlug);
  if (!entry) return undefined;
  return { id: entry, ...ORIENTE_DEPARTMENT_MAP[entry] };
}

export function getOrienteDoctorCount(department: OrienteDepartmentConfig): number {
  const count = countDoctorsByDepartment(department.location);
  return count > 0 ? count : department.doctors;
}

export function getOrienteSpecialties(department: OrienteDepartmentConfig): string[] {
  return getTopSpecialtiesForDepartment(department.location, department.specialties);
}
