import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import DirectorioContent from './DirectorioContent';
import { getDoctorsList } from '@/src/features/profile/profile.actions';
import { filterDoctors } from '@/src/features/directory/lib/directory-filters';
import { getSiteUrl, jsonLd, siteConfig } from '@/src/lib/seo';
import { type Doctor, EXAMPLE_DOCTORS } from '@/src/lib/constants';

type SearchParams = Record<string, string | string[] | undefined>;

interface DirectorioPageProps {
  searchParams?: Promise<SearchParams>;
}

function firstParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

async function getDirectorySearchParams(searchParams?: Promise<SearchParams>) {
  const params = (await searchParams) ?? {};
  return {
    specialty: firstParam(params, 'specialty'),
    location: firstParam(params, 'location'),
  };
}

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
  revalidate: 300,
  tags: ['directory-doctors'],
});

export async function generateMetadata({ searchParams }: DirectorioPageProps): Promise<Metadata> {
  const { specialty, location } = await getDirectorySearchParams(searchParams);
  const titleParts = ['Directorio medico'];
  if (specialty) titleParts.push(specialty);
  if (location) titleParts.push(location);

  const title = titleParts.join(' - ');
  const description = [
    'Encuentra medicos y especialistas verificados en El Salvador',
    specialty ? `en ${specialty}` : '',
    location ? `en ${location}` : '',
    'con filtros por ubicacion y especialidad.',
  ]
    .filter(Boolean)
    .join(' ');

  const query = new URLSearchParams();
  if (specialty) query.set('specialty', specialty);
  if (location) query.set('location', location);
  const canonicalPath = query.size > 0 ? `/directorio?${query.toString()}` : '/directorio';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: 'website',
      locale: 'es_SV',
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function DirectorioPage({ searchParams }: DirectorioPageProps) {
  const [{ specialty, location }, { doctors, error }] = await Promise.all([
    getDirectorySearchParams(searchParams),
    getCachedDirectoryDoctors(),
  ]);
  const filteredDoctors = filterDoctors(doctors, { specialty, location });
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Directorio medico de El Salvador',
    url: getSiteUrl('/directorio').toString(),
    numberOfItems: filteredDoctors.length,
    itemListElement: filteredDoctors.slice(0, 24).map((doctor, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: getSiteUrl(`/perfil?id=${encodeURIComponent(doctor.id)}`).toString(),
      item: {
        '@type': 'Physician',
        name: doctor.name,
        medicalSpecialty: doctor.specialty,
        address: {
          '@type': 'PostalAddress',
          addressLocality: doctor.location,
          addressCountry: 'SV',
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(itemListJsonLd) }}
      />
      <DirectorioContent
        initialDoctors={doctors}
        initialSpecialty={specialty}
        initialLocation={location}
        loadError={error}
      />
    </>
  );
}
