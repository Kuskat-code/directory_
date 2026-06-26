'use client';
import { useState } from 'react';
import { EL_SALVADOR_DEPARTMENTS } from '@/src/lib/constants';

export default function HeroSearch() {
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando:', { service, location });
  };

  return (
    <section className="flex flex-col items-center justify-center py-24 px-4 text-center bg-brand-light">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
        Encuentra al profesional ideal en <br /> El Salvador
      </h1>
      <p className="text-gray-500 mb-10 max-w-2xl text-sm md:text-base">
        DirectorioPro conecta a clientes exigentes con los mejores expertos
        verificados del país. Calidad, confianza y resultados garantizados.
      </p>

      <form 
        onSubmit={handleSearch} 
        className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-gray-200 p-2 flex flex-col md:flex-row items-center gap-2"
      >
        <div className="flex-1 flex items-center px-4 w-full md:border-r border-gray-200">
          <span className="text-brand-teal mr-2">🔍</span>
          <input
            type="text"
            placeholder="¿Qué servicio buscas? (ej. Abogado)"
            className="w-full py-3 outline-none text-brand-dark"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />
        </div>

        <div className="flex-1 flex items-center px-4 w-full">
          <span className="text-brand-teal mr-2">📍</span>
          <select 
            className="w-full py-3 outline-none text-brand-dark bg-transparent"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">¿Dónde? (ej. San Salvador)</option>
            {EL_SALVADOR_DEPARTMENTS?.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <button 
          type="submit" 
          className="w-full md:w-auto px-8 py-3 bg-brand-teal text-white font-medium rounded-md hover:bg-opacity-90 transition-colors"
        >
          Buscar
        </button>
      </form>
    </section>
  );
}
