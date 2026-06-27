'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';
import { EXAMPLE_DOCTORS, MEDICAL_SPECIALTIES, EL_SALVADOR_DEPARTMENTS_ORIENTE } from '@/src/lib/constants';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import DoctorCard from '@/src/features/directory/components/DoctorCard';
import { SectionContainer } from '@/src/components/ui/SectionContainer';
import { Button } from '@/src/components/ui/Button';

export default function DirectorioContent() {
  const searchParams = useSearchParams();
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const filtered = useMemo(() => {
    return EXAMPLE_DOCTORS.filter((d) => {
      if (specialty && d.specialty !== specialty) return false;
      if (location && !d.location.toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    });
  }, [specialty, location]);

  const clearFilters = () => {
    setSpecialty('');
    setLocation('');
  };

  const hasFilters = specialty || location;

  return (
    <div className="min-h-screen bg-secondary/40">
      <Header />

      <main className="pt-24 pb-16">
        <SectionContainer spacing="sm" size="wide">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-heading font-bold text-text">Directorio Medico</h1>
              <p className="mt-1 text-sm text-text-muted">
                {filtered.length}{' '}
                {filtered.length === 1 ? 'especialista encontrado' : 'especialistas encontrados'}
                {specialty ? ` en ${specialty}` : ''}
                {location ? ` . ${location}` : ''}
              </p>
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="shrink-0 lg:w-72" aria-label="Filtros de busqueda">
              <div className="sticky top-24 rounded-[var(--radius-card)] border border-border bg-white p-5 shadow-md">
                <div className="mb-5 flex items-center gap-2 text-sm font-bold text-text">
                  <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
                  Filtros
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="filter-specialty" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Especialidad
                    </label>
                    <select
                      id="filter-specialty"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="mt-2 w-full cursor-pointer rounded-[var(--radius-button)] border border-border bg-secondary/50 px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Todas</option>
                      {MEDICAL_SPECIALTIES.map((s) => (
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
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-2 w-full cursor-pointer rounded-[var(--radius-button)] border border-border bg-secondary/50 px-4 py-2.5 text-sm text-text outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Todas</option>
                      {EL_SALVADOR_DEPARTMENTS_ORIENTE.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.length === 0 ? (
                  <div className="col-span-full rounded-[var(--radius-card)] border border-border bg-white py-20 text-center shadow-sm">
                    <p className="text-5xl" aria-hidden="true">🔍</p>
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
