'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EXAMPLE_DOCTORS, MEDICAL_SPECIALTIES, EL_SALVADOR_DEPARTMENTS } from '@/src/lib/constants';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import DoctorCard from '@/src/features/directory/components/DoctorCard';

export default function DirectorioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Estados de filtros
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [minRating, setMinRating] = useState(0);

  // Escuchar cambios en los searchParams (por ejemplo si buscan desde el header)
  useEffect(() => {
    const urlSpecialty = searchParams.get('specialty');
    const urlLocation = searchParams.get('location');
    const urlSearch = searchParams.get('search');

    if (urlSpecialty !== null) setSpecialty(urlSpecialty);
    if (urlLocation !== null) setLocation(urlLocation);
    if (urlSearch !== null) setSearchTerm(urlSearch);
  }, [searchParams]);

  // Filtrado de profesionales
  const filtered = useMemo(() => {
    return EXAMPLE_DOCTORS.filter((d) => {
      // Filtro de Especialidad
      if (specialty && d.specialty !== specialty) return false;
      
      // Filtro de Departamento / Ubicación
      if (location && d.location.toLowerCase() !== location.toLowerCase()) return false;
      
      // Filtro de Rating Mínimo
      if (d.rating < minRating) return false;
      
      // Filtro de Término de Búsqueda Libre (Nombre, Bio, Especialidad)
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesName = d.name.toLowerCase().includes(query);
        const matchesBio = d.bio?.toLowerCase().includes(query) || false;
        const matchesSpecialty = d.specialty.toLowerCase().includes(query);
        if (!matchesName && !matchesBio && !matchesSpecialty) return false;
      }
      
      return true;
    });
  }, [specialty, location, searchTerm, minRating]);

  const clearFilters = () => {
    setSpecialty('');
    setLocation('');
    setSearchTerm('');
    setMinRating(0);
    router.push('/directorio'); // Limpiar la URL también
  };

  const hasFilters = specialty || location || searchTerm || minRating > 0;

  return (
    <div className="min-h-screen bg-brand-light flex flex-col justify-between">
      <div>
        <Header />

        <main className="pt-28 pb-16">
          <div className="max-w-7xl mx-auto px-4">
            
            {/* Cabecera del Listado */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  Directorio Médico de Oriente
                </h1>
                <p className="text-gray-500 text-xs mt-1 font-semibold">
                  {filtered.length} {filtered.length === 1 ? 'profesional encontrado' : 'profesionales encontrados'}
                  {searchTerm && ` para "${searchTerm}"`}
                  {location && ` en ${location}`}
                </p>
              </div>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-brand-accent hover:text-blue-700 transition-colors self-start md:self-auto cursor-pointer"
                >
                  ✕ Limpiar todos los filtros
                </button>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Barra Lateral de Filtros */}
              <aside className="w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-gray-150 shadow-sm p-6 space-y-6">
                
                {/* Filtro por Especialidad */}
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
                    Especialidad
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full bg-slate-50 text-gray-800 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer border border-gray-200 font-semibold"
                  >
                    <option value="">Todas las especialidades</option>
                    {MEDICAL_SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Filtro por Ubicación (Departamentos) */}
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
                    Departamento
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-50 text-gray-800 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer border border-gray-200 font-semibold"
                  >
                    <option value="">Todos los departamentos</option>
                    {EL_SALVADOR_DEPARTMENTS.slice(0, 4).map((d) => (
                      <option key={d} value={d}>{d} (Oriente)</option>
                    ))}
                    <option disabled>──────────</option>
                    {EL_SALVADOR_DEPARTMENTS.slice(4).map((d, index) => (
                      <option key={`${d}-${index}`} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Búsqueda Directa por Texto */}
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
                    Buscar por Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos López"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 text-gray-800 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-blue-400 transition-all border border-gray-200 font-semibold"
                  />
                </div>

                {/* Filtro por Calificación */}
                <div>
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
                    Calificación Mínima
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {[0, 3, 4, 4.5].map((r) => (
                      <label
                        key={r}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors text-xs font-bold ${
                          minRating === r ? 'bg-brand-accent/10 text-brand-accent' : 'text-gray-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === r}
                          onChange={() => setMinRating(r)}
                          className="accent-brand-accent"
                        />
                        {r === 0 ? 'Cualquiera' : `${r}★ o más`}
                      </label>
                    ))}
                  </div>
                </div>

              </aside>

              {/* Grid de Doctores */}
              <div className="flex-1 w-full">
                {filtered.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-3xl border border-gray-150 shadow-sm">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Sin resultados</h3>
                    <p className="text-gray-400 text-xs max-w-sm mx-auto font-medium leading-relaxed">
                      No encontramos especialistas con los criterios seleccionados. Prueba limpiando o cambiando los filtros.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((doctor, i) => (
                      <DoctorCard key={doctor.id} doctor={doctor} index={i} />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
