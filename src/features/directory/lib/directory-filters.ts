import { EL_SALVADOR_DEPARTMENTS_ORIENTE, MEDICAL_SPECIALTIES, type Doctor } from '@/src/lib/constants';

export function uniqueSorted(values: readonly string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

export function getDirectorySpecialties(doctors: readonly Doctor[]) {
  return uniqueSorted([...MEDICAL_SPECIALTIES, ...doctors.map((doctor) => doctor.specialty)]);
}

export function getDirectoryLocations(doctors: readonly Doctor[]) {
  return uniqueSorted([...EL_SALVADOR_DEPARTMENTS_ORIENTE, ...doctors.map((doctor) => doctor.location)]);
}

export function filterDoctors(
  doctors: readonly Doctor[],
  filters: { specialty?: string; location?: string },
) {
  const specialty = filters.specialty?.trim();
  const location = filters.location?.trim().toLocaleLowerCase('es');

  return doctors.filter((doctor) => {
    if (specialty && doctor.specialty !== specialty) return false;
    if (location && doctor.location.toLocaleLowerCase('es') !== location) return false;
    return true;
  });
}
