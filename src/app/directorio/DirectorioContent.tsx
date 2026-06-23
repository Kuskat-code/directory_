'use client';
import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { EXAMPLE_DOCTORS, MEDICAL_SPECIALTIES, EL_SALVADOR_DEPARTMENTS } from '@/src/lib/constants';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import DoctorCard from '@/src/features/directory/components/DoctorCard';

export default function DirectorioContent() {
  const searchParams = useSearchParams();
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    return EXAMPLE_DOCTORS.filter((d) => {
      if (specialty && d.specialty !== specialty) return false;
      if (location && !d.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (d.rating < minRating) return false;
      return true;
    });
  }, [specialty, location, minRating]);

  const clearFilters = () => {
    setSpecialty('');
    setLocation('');
    setMinRating(0);
  };

  const hasFilters = specialty || location || minRating > 0;

  return (
    <div className="min-h-screen bg-brand-light">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Directorio Médico</h1>
              <p className="text-gray-500 text-sm mt-1">
                {filtered.length} {filtered.length === 1 ? 'profesional encontrado' : 'profesionales encontrados'}
              </p>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-brand-accent transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Especialidad</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="mt-2 w-full bg-gray-50 text-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer border border-gray-200"
                  >
                    <option value="">Todas</option>
                    {MEDICAL_SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ubicación</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-2 w-full bg-gray-50 text-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer border border-gray-200"
                  >
                    <option value="">Todas</option>
                    {EL_SALVADOR_DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rating mínimo</label>
                  <div className="mt-2 flex flex-col gap-2">
                    {[0, 3, 3.5, 4, 4.5].map((r) => (
                      <label
                        key={r}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors text-sm ${
                          minRating === r ? 'bg-brand-accent/10 text-brand-accent' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === r}
                          onChange={() => setMinRating(r)}
                          className="accent-brand-accent"
                        />
                        {r === 0 ? 'Cualquiera' : `${r}+ estrellas`}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin resultados</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    No encontramos profesionales con los filtros seleccionados. Intenta ajustar tu búsqueda.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((doctor, i) => (
                    <DoctorCard key={doctor.id} doctor={doctor} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
