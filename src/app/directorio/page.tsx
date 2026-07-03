import type { Metadata } from 'next';
import { Suspense } from 'react';
import DirectorioContent from './DirectorioContent';
import { getDoctorsList } from '@/src/features/profile/profile.actions';
import { type Doctor, EXAMPLE_DOCTORS } from '@/src/lib/constants';
import { unstable_cache } from 'next/cache';

async function loadDirectoryDoctors(): Promise<{ doctors: Doctor[]; error: string | null }> {
  try {
    const response = await getDoctorsList();
    if (response.success) {
      return { doctors: response.data, error: null };
    }
    return {
      doctors: EXAMPLE_DOCTORS,
      error: 'error' in response ? response.error : 'No se pudo cargar el directorio desde la base de datos.'
    };
  } catch (err: unknown) {
    return {
      doctors: EXAMPLE_DOCTORS,
      error: err instanceof Error ? err.message : 'Error de conexión con el servidor.'
    };
  }
}

const getCachedDirectoryDoctors = unstable_cache(loadDirectoryDoctors, ['directory-doctors'], {
  revalidate: 300, // Regenerar estáticamente cada 5 minutos
  tags: ['directory-doctors'],
});

export const metadata: Metadata = {
  title: 'Directorio Médico - Especialistas en El Salvador',
  description: 'Filtra por especialidad y departamento para encontrar atención médica disponible en El Salvador.',
  alternates: {
    canonical: '/directorio',
  },
};

export default async function DirectorioPage() {
  const { doctors, error } = await getCachedDirectoryDoctors();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary/40 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    }>
      <DirectorioContent
        initialDoctors={doctors}
        loadError={error}
      />
    </Suspense>
  );
}
