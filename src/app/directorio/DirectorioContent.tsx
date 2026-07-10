'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Search, SlidersHorizontal } from 'lucide-react';
import type { Doctor } from '@/src/lib/constants';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import DoctorCard from '@/src/features/directory/components/DoctorCard';
import { SectionContainer } from '@/src/components/ui/SectionContainer';
import { Button } from '@/src/components/ui/Button';
import {
  filterDoctors,
  getDirectoryLocations,
  getDirectorySpecialties,
} from '@/src/features/directory/lib/directory-filters';

interface DirectorioContentProps {
  initialDoctors: Doctor[];
  initialSpecialty: string;
  initialLocation: string;
  loadError: string | null;
}

export default function DirectorioContent({
  initialDoctors,
  initialSpecialty,
  initialLocation,
  loadError,
}: DirectorioContentProps) {
  const router = useRouter();
  const [specialty, setSpecialty] = useState(initialSpecialty);
  const [location, setLocation] = useState(initialLocation);
  const doctors = initialDoctors;

  const filtered = useMemo(() => {
    return filterDoctors(doctors, { specialty, location });
  }, [doctors, specialty, location]);

  const specialtyOptions = useMemo(() => getDirectorySpecialties(doctors), [doctors]);
  const locationOptions = useMemo(() => getDirectoryLocations(doctors), [doctors]);

  const updateRoute = (nextSpecialty: string, nextLocation: string) => {
    const params = new URLSearchParams();
    if (nextSpecialty) params.set('specialty', nextSpecialty);
    if (nextLocation) params.set('location', nextLocation);
    router.replace(params.size > 0 ? `/directorio?${params.toString()}` : '/directorio', {
      scroll: false,
    });
  };

  const updateSpecialty = (nextSpecialty: string) => {
    setSpecialty(nextSpecialty);
    updateRoute(nextSpecialty, location);
  };

  const updateLocation = (nextLocation: string) => {
    setLocation(nextLocation);
    updateRoute(specialty, nextLocation);
  };

  const clearFilters = () => {
    setSpecialty('');
    setLocation('');
    updateRoute('', '');
  };

  const hasFilters = specialty || location;

  return (
    <div className="relative min-h-screen bg-secondary/40">
      <Header />

      <main className="pt-24 pb-16">
        <SectionContainer spacing="sm" size="wide">
          <div className="mb-8 border-b border-border/80 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Especialistas verificados
              </p>
              <h1 className="mt-2 text-heading font-bold text-text">Directorio Medico</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
                Filtra por especialidad y departamento para encontrar atencion medica disponible en El Salvador.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col gap-8 lg:flex-row">
            <aside className="shrink-0 lg:w-72" aria-label="Filtros de busqueda">
              <div className="sticky top-24 rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-md">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-text">
                    <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" suppressHydrationWarning />
                    Filtros
                  </div>
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="filter-specialty" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Especialidad
                    </label>
                    <select
                      id="filter-specialty"
                      value={specialty}
                      onChange={(e) => updateSpecialty(e.target.value)}
                      className="mt-2 w-full cursor-pointer rounded-[var(--radius-button)] border border-border bg-secondary/50 px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Todas</option>
                      {specialtyOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="filter-location" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Ubicacion
                    </label>
                    <select
                      id="filter-location"
                      value={location}
                      onChange={(e) => updateLocation(e.target.value)}
                      className="mt-2 w-full cursor-pointer rounded-[var(--radius-button)] border border-border bg-secondary/50 px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Todas</option>
                      {locationOptions.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 rounded-[var(--radius-card)] bg-secondary/60 p-3 text-xs leading-5 text-text-muted">
                  {filtered.length}{' '}
                  {filtered.length === 1 ? 'resultado coincide' : 'resultados coinciden'}
                  {specialty ? ` con ${specialty}` : ''}
                  {location ? ` en ${location}` : ''}.
                </div>
              </div>
            </aside>

            <div className="relative flex-1">
              {loadError && (
                <div className="mb-5 flex items-start gap-3 rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <p>No se pudo cargar el directorio desde Supabase: {loadError}</p>
                </div>
              )}

              <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.length === 0 ? (
                  <div className="col-span-full rounded-[var(--radius-card)] border border-border bg-white py-20 text-center shadow-sm">
                    <Search className="mx-auto h-10 w-10 text-primary/70" aria-hidden="true" />
                    <h2 className="mt-4 text-lg font-semibold text-text">Sin resultados</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
                      No encontramos especialistas con los filtros seleccionados. Intenta ajustar tu busqueda.
                    </p>
                    <Button variant="primary" className="mt-6" onClick={clearFilters}>
                      Ver todos los especialistas
                    </Button>
                  </div>
                ) : (
                  filtered.map((doctor, i) => (
                    <DoctorCard key={doctor.id} doctor={doctor} index={i} />
                  ))
                )}
              </div>
            </div>
          </div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
}
