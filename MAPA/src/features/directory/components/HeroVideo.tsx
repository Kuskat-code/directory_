'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MEDICAL_SPECIALTIES, EL_SALVADOR_DEPARTMENTS } from '@/src/lib/constants';

export default function HeroVideo() {
  const router = useRouter();
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');

  const videoUrl = "https://res.cloudinary.com/dl6txsp09/video/upload/f_auto,q_auto/v1782191676/medical-center-hospital-business-presentation_afwzlh.mp4";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (specialty) params.set('specialty', specialty);
    if (location) params.set('location', location);
    router.push(`/directorio${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
          Encuentra al{' '}
          <span className="text-blue-400">médico ideal</span>
        </h1>
        <p className="text-white/70 text-lg md:text-xl mt-4 max-w-xl mx-auto">
          Directorio de profesionales de la salud en El Salvador. Conectamos pacientes con los mejores especialistas.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 md:p-4 flex flex-col md:flex-row items-stretch md:items-center gap-3 max-w-xl mx-auto"
        >
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">📍</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white/90 text-gray-800 rounded-xl pl-11 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer"
            >
              <option value="">Todas las ubicaciones</option>
              {EL_SALVADOR_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-8 py-3.5 bg-brand-accent hover:brightness-110 text-white font-medium rounded-xl transition-all active:scale-[0.98] text-sm whitespace-nowrap"
          >
            Buscar
          </button>
        </form>
      </div>
    </section>
  );
}
