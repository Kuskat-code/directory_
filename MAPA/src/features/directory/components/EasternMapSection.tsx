'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { EXAMPLE_DOCTORS } from '@/src/lib/constants';

interface Branch {
  id: string;
  department: string;
  name: string;
  address: string;
  phone: string;
  icon: string;
  colorClass: string;
}

const BRANCHES: Branch[] = [
  {
    id: 'san-miguel',
    department: 'San Miguel',
    name: 'Sucursal San Miguel',
    address: 'Complejo Médico Clínico, Avenida Roosevelt Norte, San Miguel.',
    phone: '+503 2661 1234',
    icon: '🏥',
    colorClass: 'border-amber-500 text-amber-600'
  },
  {
    id: 'usulutan',
    department: 'Usulután',
    name: 'Sucursal Usulután',
    address: 'Centro de Especialidades de Usulután, 4a Calle Poniente, Usulután.',
    phone: '+503 2662 5678',
    icon: '🏢',
    colorClass: 'border-emerald-500 text-emerald-600'
  },
  {
    id: 'la-union',
    department: 'La Unión',
    name: 'Sucursal La Unión',
    address: 'Clínicas Médicas del Golfo, Calle General Morazán, La Unión.',
    phone: '+503 2663 7890',
    icon: '🏥',
    colorClass: 'border-blue-500 text-blue-600'
  },
  {
    id: 'morazan',
    department: 'Morazán',
    name: 'Sucursal Morazán',
    address: 'Consultorios Médicos del Norte, Avenida 15 de Septiembre, Morazán.',
    phone: '+503 2664 3456',
    icon: '🏢',
    colorClass: 'border-pink-500 text-pink-600'
  }
];

export default function EasternMapSection() {
  const router = useRouter();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Escuchar mensajes del mapa (cuando hacen clic en el mapa)
  useEffect(() => {
    const handleMapMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SELECT_DEPARTMENT') {
        setSelectedDept(event.data.department);
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
      iframeRef.current?.contentWindow?.postMessage({ type: 'CLEAR_HIGHLIGHT' }, '*');
    } else {
      // Seleccionar e indicar al mapa que haga zoom/aislamiento
      setSelectedDept(deptName);
      iframeRef.current?.contentWindow?.postMessage({
        type: 'HIGHLIGHT_DEPARTMENT',
        department: deptName
      }, '*');
    }
  };

  // Contar doctores disponibles en el departamento seleccionado
  const getDoctorsCount = (dept: string) => {
    return EXAMPLE_DOCTORS.filter((d) => d.location.toLowerCase() === dept.toLowerCase()).length;
  };

  const handleGoToDirectory = (dept: string) => {
    router.push(`/directorio?location=${encodeURIComponent(dept)}`);
  };

  return (
    <section className="py-20 px-4 bg-white relative border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado de Sección */}
        <div className="mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight">
            Sucursales
          </h2>
          <p className="text-gray-500 mt-2.5 text-sm md:text-base leading-relaxed">
            Selecciona un departamento en la lista o en el mapa interactivo para ver los especialistas activos.
          </p>
        </div>

        {/* Layout 50/50 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Columna Izquierda: Mapa (Invisible sin bordes ni sombras) */}
          <div className="relative h-[550px] md:h-[600px] overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
            <iframe 
              ref={iframeRef}
              src="/mapa/index.html" 
              title="Mapa de Oriente"
              className="w-full h-full border-none bg-transparent"
              sandbox="allow-scripts allow-same-origin"
            />

            {/* Ventana Emergente Integrada en el Mapa (Shadcn-style Modal) */}
            <AnimatePresence>
              {selectedDept && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-gray-100 z-50 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                        Departamento seleccionado
                      </span>
                      <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
                        {selectedDept}
                      </h3>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedDept(null);
                        iframeRef.current?.contentWindow?.postMessage({ type: 'CLEAR_HIGHLIGHT' }, '*');
                      }}
                      className="text-gray-400 hover:text-gray-600 text-sm font-semibold p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="py-2 border-t border-b border-gray-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-brand-teal">
                        {getDoctorsCount(selectedDept)}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        {getDoctorsCount(selectedDept) === 1 ? 'médico disponible' : 'médicos disponibles'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleGoToDirectory(selectedDept)}
                    className="w-full py-3 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                  >
                    Ver médicos de {selectedDept} →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Columna Derecha: Listado de Sucursales */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-[550px] md:max-h-[600px] justify-center">
            {BRANCHES.map((branch) => {
              const isSelected = selectedDept === branch.department;
              const count = getDoctorsCount(branch.department);
              
              return (
                <article
                  key={branch.id}
                  onClick={() => handleSelectBranch(branch.department)}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-start ${
                    isSelected
                      ? `bg-slate-50 shadow-md border-l-4 ${branch.colorClass.split(' ')[0]}`
                      : 'bg-white hover:bg-slate-50 border-gray-150 shadow-xs border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="text-2xl p-2.5 bg-slate-100 rounded-xl shrink-0">
                    {branch.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-extrabold text-base text-gray-900 truncate">
                        {branch.name}
                      </h3>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 border bg-white ${
                        isSelected ? branch.colorClass.split(' ')[1] + ' ' + branch.colorClass.split(' ')[0] : 'text-gray-500 border-gray-200'
                      }`}>
                        {count} {count === 1 ? 'Médico' : 'Médicos'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-normal font-medium">
                      {branch.address}
                    </p>
                    <div className="flex gap-4 mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <span>📞 {branch.phone}</span>
                      <span className={isSelected ? branch.colorClass.split(' ')[1] : 'text-brand-accent'}>
                        Ver Especialistas →
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
