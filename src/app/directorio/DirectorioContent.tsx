'use client';

import { useState, useMemo, type ElementType } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  SlidersHorizontal,
  Heart, Stethoscope, Activity, Brain, Eye, Baby,
  Bone, FlaskConical, Ear, Microscope, ShieldPlus,
  Droplets, Thermometer, Zap, Sun, Moon, Star,
  Wind, Leaf, Cross, Pill, ScanLine, Dna,
} from 'lucide-react';
import { EXAMPLE_DOCTORS, MEDICAL_SPECIALTIES, EL_SALVADOR_DEPARTMENTS_ORIENTE } from '@/src/lib/constants';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import DoctorCard from '@/src/features/directory/components/DoctorCard';
import { SectionContainer } from '@/src/components/ui/SectionContainer';
import { Button } from '@/src/components/ui/Button';

// Lucide icons associated with each specialty, used for the floating background decoration
const SPECIALTY_ICONS: Record<string, ElementType[]> = {
  'Medicina General': [Stethoscope, ShieldPlus, Thermometer, Cross, Pill],
  'Cardiología': [Heart, Activity, Zap, Stethoscope, Droplets],
  'Dermatología': [Sun, Leaf, Star, Microscope, ScanLine],
  'Pediatría': [Baby, Star, Moon, Heart, Stethoscope],
  'Psiquiatría': [Brain, Moon, Star, Wind, Zap],
  'Neurología': [Brain, Zap, Activity, Dna, ScanLine],
  'Oftalmología': [Eye, Sun, Star, ScanLine, Microscope],
  'Otorrinolaringología': [Ear, Wind, Activity, Stethoscope, Zap],
  'Gastroenterología': [FlaskConical, Droplets, Leaf, Microscope, Pill],
  'Ortopedia': [Bone, ShieldPlus, Zap, Activity, Cross],
  'Ginecología': [Heart, Baby, Moon, Star, Leaf],
  'Urología': [Droplets, FlaskConical, Microscope, ShieldPlus, Activity],
};

// Soft (300 shade) text color per specialty so the floating icons match the badge palette
const SPECIALTY_ICON_COLOR: Record<string, string> = {
  'Medicina General': 'text-green-300',
  'Cardiología': 'text-red-300',
  'Dermatología': 'text-orange-300',
  'Pediatría': 'text-sky-300',
  'Psiquiatría': 'text-violet-300',
  'Neurología': 'text-indigo-300',
  'Oftalmología': 'text-blue-300',
  'Otorrinolaringología': 'text-yellow-300',
  'Gastroenterología': 'text-lime-300',
  'Ortopedia': 'text-slate-300',
  'Ginecología': 'text-pink-300',
  'Urología': 'text-amber-300',
};

// Fixed (seeded) position/size/animation combos to avoid per-render layout shifts
const FLOAT_SEEDS = [
  { top: '6%', left: '5%', size: 'h-10 w-10', opacity: 'opacity-30', delay: '0s', duration: '4.5s' },
  { top: '14%', left: '82%', size: 'h-8 w-8', opacity: 'opacity-30', delay: '1.2s', duration: '5.2s' },
  { top: '30%', left: '42%', size: 'h-12 w-12', opacity: 'opacity-30', delay: '0.6s', duration: '6s' },
  { top: '46%', left: '10%', size: 'h-7 w-7', opacity: 'opacity-30', delay: '2.1s', duration: '4s' },
  { top: '56%', left: '72%', size: 'h-11 w-11', opacity: 'opacity-30', delay: '1.8s', duration: '5.5s' },
  { top: '70%', left: '28%', size: 'h-6 w-6', opacity: 'opacity-30', delay: '0.3s', duration: '3.5s' },
  { top: '82%', left: '86%', size: 'h-9 w-9', opacity: 'opacity-30', delay: '2.6s', duration: '4.8s' },
  { top: '20%', left: '60%', size: 'h-8 w-8', opacity: 'opacity-30', delay: '1.0s', duration: '5s' },
  { top: '88%', left: '50%', size: 'h-10 w-10', opacity: 'opacity-30', delay: '0.9s', duration: '6s' },
  { top: '38%', left: '90%', size: 'h-7 w-7', opacity: 'opacity-30', delay: '2.3s', duration: '3.8s' },
  { top: '64%', left: '3%', size: 'h-9 w-9', opacity: 'opacity-30', delay: '1.5s', duration: '5.3s' },
  { top: '4%', left: '46%', size: 'h-8 w-8', opacity: 'opacity-30', delay: '0.4s', duration: '4.2s' },
];

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

  // Floating background icons only show when a concrete specialty (not "Todas") is selected
  const floatingIcons = specialty ? SPECIALTY_ICONS[specialty] : undefined;
  const floatingColor = SPECIALTY_ICON_COLOR[specialty] ?? 'text-teal-300';

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

            <div className="relative flex-1">
              {/* Decorative floating specialty icons scattered behind the doctor grid */}
              {floatingIcons && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  {FLOAT_SEEDS.map((seed, i) => {
                    const Icon = floatingIcons[i % floatingIcons.length];
                    return (
                      <Icon
                        key={i}
                        className={`animate-float-icon absolute ${seed.size} ${seed.opacity} ${floatingColor}`}
                        style={{
                          top: seed.top,
                          left: seed.left,
                          animationDelay: seed.delay,
                          animationDuration: seed.duration,
                        }}
                      />
                    );
                  })}
                </div>
              )}
              <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
