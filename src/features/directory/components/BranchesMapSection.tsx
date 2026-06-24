'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Calendar, ChevronRight, X, Phone, Building } from 'lucide-react';
import { EXAMPLE_DOCTORS, EL_SALVADOR_DEPARTMENTS_ORIENTE, MEDICAL_SPECIALTIES } from '@/src/lib/constants';
import { Card } from '@/src/components/ui/Card';
import { Badge } from '@/src/components/ui/Badge';
import { Button } from '@/src/components/ui/Button';

interface Branch {
  id: string;
  department: string;
  name: string;
  address: string;
  phone: string;
  icon: string;
  colorClass: string;
  bgLight: string;
  textColor: string;
}

const BRANCHES: Branch[] = [
  {
    id: 'san-miguel',
    department: 'San Miguel',
    name: 'Sucursal San Miguel',
    address: 'Complejo Médico Clínico, Avenida Roosevelt Norte, San Miguel.',
    phone: '+503 2661 1234',
    icon: '🏥',
    colorClass: 'border-amber-500 text-amber-600',
    bgLight: 'bg-amber-50/50',
    textColor: 'text-amber-700',
  },
  {
    id: 'usulutan',
    department: 'Usulután',
    name: 'Sucursal Usulután',
    address: 'Centro de Especialidades de Usulután, 4a Calle Poniente, Usulután.',
    phone: '+503 2662 5678',
    icon: '🏢',
    colorClass: 'border-emerald-500 text-emerald-600',
    bgLight: 'bg-emerald-50/50',
    textColor: 'text-emerald-700',
  },
  {
    id: 'la-union',
    department: 'La Unión',
    name: 'Sucursal La Unión',
    address: 'Clínicas Médicas del Golfo, Calle General Morazán, La Unión.',
    phone: '+503 2663 7890',
    icon: '🏥',
    colorClass: 'border-blue-500 text-blue-600',
    bgLight: 'bg-blue-50/50',
    textColor: 'text-blue-700',
  },
  {
    id: 'morazan',
    department: 'Morazán',
    name: 'Sucursal Morazán',
    address: 'Consultorios Médicos del Norte, Avenida 15 de Septiembre, Morazán.',
    phone: '+503 2664 3456',
    icon: '🏢',
    colorClass: 'border-pink-500 text-pink-600',
    bgLight: 'bg-pink-50/50',
    textColor: 'text-pink-700',
  },
];

const EASE = [0.4, 0, 0.2, 1] as const;

export default function BranchesMapSection() {
  const router = useRouter();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchSpecialty, setSearchSpecialty] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Escuchar mensajes del mapa (cuando hacen clic en el mapa)
  useEffect(() => {
    const handleMapMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SELECT_DEPARTMENT') {
        setSelectedDept(event.data.department);
        setSearchLocation(event.data.department);
      } else if (event.data && event.data.type === 'CLEAR_DEPARTMENT') {
        setSelectedDept(null);
      }
    };

    window.addEventListener('message', handleMapMessage);
    return () => window.removeEventListener('message', handleMapMessage);
  }, []);

  // Sincronizar selección de sucursal desde la lista hacia el mapa
  const handleSelectBranch = (deptName: string) => {
    if (selectedDept === deptName) {
      // Si ya está seleccionado, deseleccionar
      setSelectedDept(null);
      setSearchLocation('');
      iframeRef.current?.contentWindow?.postMessage({ type: 'CLEAR_HIGHLIGHT' }, '*');
    } else {
      // Seleccionar e indicar al mapa que haga zoom/aislamiento
      setSelectedDept(deptName);
      setSearchLocation(deptName);
      iframeRef.current?.contentWindow?.postMessage({
        type: 'HIGHLIGHT_DEPARTMENT',
        department: deptName,
      }, '*');
    }
  };

  // Contar doctores disponibles en el departamento seleccionado
  const getDoctorsCount = (dept: string) => {
    return EXAMPLE_DOCTORS.filter((d) => d.location.toLowerCase() === dept.toLowerCase()).length;
  };

  const handleGoToDirectory = (dept: string) => {
    const params = new URLSearchParams();
    params.set('location', dept);
    if (searchSpecialty) {
      params.set('specialty', searchSpecialty);
    }
    router.push(`/directorio?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si se seleccionó una ubicación del mapa, la sincronizamos
    if (searchLocation) {
      const match = BRANCHES.find(b => b.department.toLowerCase() === searchLocation.toLowerCase());
      if (match) {
        // Seleccionamos en el mapa
        setSelectedDept(match.department);
        iframeRef.current?.contentWindow?.postMessage({
          type: 'HIGHLIGHT_DEPARTMENT',
          department: match.department,
        }, '*');
      } else {
        // Limpiamos selección del mapa
        setSelectedDept(null);
        iframeRef.current?.contentWindow?.postMessage({ type: 'CLEAR_HIGHLIGHT' }, '*');
      }
    } else {
      // Limpiamos selección del mapa
      setSelectedDept(null);
      iframeRef.current?.contentWindow?.postMessage({ type: 'CLEAR_HIGHLIGHT' }, '*');
    }

    // Redirigir al directorio
    const params = new URLSearchParams();
    if (searchLocation) params.set('location', searchLocation);
    if (searchSpecialty) params.set('specialty', searchSpecialty);
    router.push(`/directorio${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="py-20 px-4 bg-surface relative border-b border-border" id="sucursales-mapa">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado de Sección */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" className="mb-3 px-3 py-1 text-xs">
            Red de Especialistas
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-text tracking-tight">
            Navega por Sucursales y Especialistas
          </h2>
          <p className="text-text-muted mt-3 text-sm md:text-base leading-relaxed">
            Utiliza el buscador o interactúa con el mapa de la Zona Oriental de El Salvador para encontrar médicos autorizados en tu zona.
          </p>
        </div>

        {/* Buscador Integrado (Encima del Mapa) */}
        <div className="max-w-4xl mx-auto mb-10">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-surface/90 border border-border rounded-[var(--radius-card)] p-3 md:p-4 shadow-glow flex flex-col md:flex-row items-stretch gap-3"
          >
            {/* Ubicación */}
            <div className="flex-1 relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full rounded-[var(--radius-button)] border border-border bg-white py-3.5 pl-11 pr-4 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 transition-premium cursor-pointer"
              >
                <option value="">Todas las sucursales (Oriente)</option>
                {EL_SALVADOR_DEPARTMENTS_ORIENTE.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Especialidad */}
            <div className="flex-1 relative">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                <Search className="h-5 w-5" aria-hidden="true" />
              </div>
              <select
                value={searchSpecialty}
                onChange={(e) => setSearchSpecialty(e.target.value)}
                className="w-full rounded-[var(--radius-button)] border border-border bg-white py-3.5 pl-11 pr-4 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 transition-premium cursor-pointer"
              >
                <option value="">Todas las especialidades</option>
                {MEDICAL_SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de Buscar */}
            <Button
              type="submit"
              variant="accent"
              className="w-full md:w-auto md:min-w-[150px] shrink-0"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              Buscar Médicos
            </Button>
          </form>
        </div>

        {/* Layout 50/50 Grid (Mapa y Sucursales) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Columna Izquierda: Mapa */}
          <div className="relative h-[480px] md:h-[550px] overflow-hidden rounded-[var(--radius-card)] border border-border shadow-sm bg-slate-50">
            <iframe 
              ref={iframeRef}
              src="/mapa/index.html" 
              title="Mapa de Oriente de El Salvador"
              className="w-full h-full border-none bg-transparent"
              sandbox="allow-scripts allow-same-origin"
            />

            {/* Ventana Emergente Integrada en el Mapa */}
            <AnimatePresence>
              {selectedDept && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-glow border border-border z-30 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                        Departamento Seleccionado
                      </span>
                      <h3 className="text-xl font-extrabold text-text mt-0.5">
                        {selectedDept}
                      </h3>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedDept(null);
                        setSearchLocation('');
                        iframeRef.current?.contentWindow?.postMessage({ type: 'CLEAR_HIGHLIGHT' }, '*');
                      }}
                      className="text-text-muted hover:text-text p-1 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                      aria-label="Cerrar detalles del departamento"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="py-2 border-t border-b border-border">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-primary">
                        {getDoctorsCount(selectedDept)}
                      </span>
                      <span className="text-xs text-text-muted font-medium">
                        {getDoctorsCount(selectedDept) === 1 ? 'especialista activo' : 'especialistas activos'}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleGoToDirectory(selectedDept)}
                    variant="primary"
                    className="w-full justify-between"
                  >
                    <span>Ver médicos de {selectedDept}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Columna Derecha: Listado de Sucursales */}
          <div className="flex flex-col gap-4 max-h-[480px] md:max-h-[550px] overflow-y-auto pr-2 justify-center">
            {BRANCHES.map((branch) => {
              const isSelected = selectedDept === branch.department;
              const count = getDoctorsCount(branch.department);
              
              return (
                <Card
                  key={branch.id}
                  hoverable
                  elevated={isSelected}
                  onClick={() => handleSelectBranch(branch.department)}
                  className={`p-5 cursor-pointer flex gap-4 items-start border-l-4 transition-all duration-300 ${
                    isSelected
                      ? `bg-secondary/40 shadow-glow border-l-primary`
                      : 'bg-white hover:bg-secondary/20 border-l-transparent border-border'
                  }`}
                >
                  <div className="text-2xl p-2.5 bg-secondary rounded-xl shrink-0">
                    {branch.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-base text-text truncate">
                        {branch.name}
                      </h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 border ${
                        isSelected 
                          ? `${branch.textColor} ${branch.colorClass.split(' ')[0]} bg-white` 
                          : 'text-text-muted border-border bg-slate-50'
                      }`}>
                        {count} {count === 1 ? 'Médico' : 'Médicos'}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-1.5 leading-normal">
                      {branch.address}
                    </p>
                    <div className="flex gap-4 mt-3 text-[10px] text-text-muted font-semibold uppercase tracking-wider items-center">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-primary" /> {branch.phone}
                      </span>
                      <span className={`flex items-center gap-0.5 ${isSelected ? 'text-primary font-bold' : 'text-accent'}`}>
                        Ver Especialistas <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
