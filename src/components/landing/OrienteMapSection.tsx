'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MapPin, Stethoscope } from 'lucide-react';
import { ORIENTE_MAP_PATHS, ORIENTE_MAP_VIEWBOX } from '@/src/components/landing/oriente-map-paths';
import { SectionContainer } from '@/src/components/ui/SectionContainer';
import {
  ORIENTE_DEPARTMENT_IDS,
  getOrienteDepartment,
  getOrienteDoctorCount,
  getOrienteSpecialties,
  type OrienteDepartmentConfig,
  type OrienteDepartmentId,
} from '@/src/lib/oriente-departments';

const EASE = [0.4, 0, 0.2, 1] as const;

interface TooltipState {
  id: OrienteDepartmentId;
  x: number;
  y: number;
}

function getPathClass(isHovered: boolean, isSelected: boolean): string {
  const base =
    'cursor-pointer fill-current transition-colors duration-300 ease-out outline-none focus-visible:stroke-primary focus-visible:stroke-[1.5]';
  if (isHovered) return `${base} text-[#2563EB]`;
  if (isSelected) return `${base} text-[#1D4ED8]`;
  return `${base} text-[#CBD5E1]`;
}

interface DepartmentPanelProps {
  department: OrienteDepartmentConfig;
}

function DepartmentPanel({ department }: DepartmentPanelProps) {
  const doctorCount = getOrienteDoctorCount(department);
  const specialties = getOrienteSpecialties(department);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="flex h-full flex-col rounded-[var(--radius-card)] border border-border/60 bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)] md:p-8"
    >
      <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        Región Oriente
      </div>

      <h3 className="text-2xl font-bold tracking-tight text-text md:text-3xl">{department.name}</h3>
      <p className="mt-2 text-base text-text-muted">
        <span className="font-semibold text-text">{doctorCount}</span> médicos registrados
      </p>

      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Especialidades destacadas
        </p>
        <ul className="mt-3 space-y-2" role="list">
          {specialties.map((specialty) => (
            <li
              key={specialty}
              className="flex items-center gap-2.5 rounded-[var(--radius-button)] bg-secondary/70 px-3 py-2.5 text-sm font-medium text-text"
            >
              <Stethoscope className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {specialty}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-8">
        <Link
          href={`/directorio?location=${encodeURIComponent(department.name)}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-primary px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-primary-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          Ver especialistas
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function OrienteMapSection() {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredId, setHoveredId] = useState<OrienteDepartmentId | null>(null);
  const [focusedId, setFocusedId] = useState<OrienteDepartmentId | null>(null);
  const [selectedId, setSelectedId] = useState<OrienteDepartmentId>('SV-SM');
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const activeHoverId = hoveredId ?? focusedId;
  const panelId = activeHoverId ?? selectedId;
  const panelDepartment = getOrienteDepartment(panelId);

  const updateTooltip = useCallback((id: OrienteDepartmentId | null) => {
    if (!id || !svgRef.current) {
      setTooltip(null);
      return;
    }

    const path = svgRef.current.querySelector<SVGPathElement>(`#${CSS.escape(id)}`);
    if (!path) {
      setTooltip(null);
      return;
    }

    const box = path.getBBox();
    setTooltip({
      id,
      x: box.x + box.width / 2,
      y: box.y,
    });
  }, []);

  useLayoutEffect(() => {
    updateTooltip(activeHoverId);
  }, [activeHoverId, updateTooltip]);

  const handleNavigate = useCallback(
    (id: OrienteDepartmentId) => {
      router.push(`/directorio?location=${encodeURIComponent(getOrienteDepartment(id).name)}`);
    },
    [router],
  );

  const handlePathEnter = useCallback(
    (id: OrienteDepartmentId) => {
      setHoveredId(id);
      updateTooltip(id);
    },
    [updateTooltip],
  );

  const handlePathLeave = useCallback(() => {
    setHoveredId(null);
    setTooltip(null);
  }, []);

  return (
    <section id="departamentos" aria-labelledby="map-heading" className="bg-white">
      <SectionContainer spacing="lg" size="wide">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 id="map-heading" className="text-heading font-bold tracking-tight text-text">
            Encuentra especialistas cerca de ti
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-muted">
            Selecciona tu departamento para explorar médicos y especialistas disponibles.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="mt-14 grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:gap-10"
        >
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-border/50 bg-white p-4 shadow-[0_24px_60px_-32px_rgba(37,99,235,0.25)] sm:p-6 md:p-8">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <svg
                ref={svgRef}
                viewBox={ORIENTE_MAP_VIEWBOX}
                className="mx-auto w-full max-w-2xl touch-manipulation select-none"
                overflow="visible"
                role="img"
                aria-label="Mapa interactivo de la región Oriente de El Salvador"
              >
                <defs>
                  <filter id="oriente-dept-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow
                      dx="0"
                      dy="0"
                      stdDeviation="6"
                      floodColor="#2563EB"
                      floodOpacity="0.5"
                    />
                  </filter>
                </defs>

                {ORIENTE_DEPARTMENT_IDS.map((id) => {
                  const path = ORIENTE_MAP_PATHS[id];
                  const department = getOrienteDepartment(id);
                  const isHovered = activeHoverId === id;
                  const isSelected = selectedId === id && !activeHoverId;
                  const isActive = isHovered || isSelected;
                  const doctorCount = getOrienteDoctorCount(department);

                  return (
                    <motion.path
                      key={id}
                      id={id}
                      d={path.d}
                      fill="currentColor"
                      className={`${getPathClass(isHovered, isSelected)} [transform-box:fill-box] [transform-origin:center]`}
                      stroke={isActive ? '#1E40AF' : 'transparent'}
                      strokeWidth={isActive ? 1.5 : 0}
                      filter={isHovered ? 'url(#oriente-dept-glow)' : undefined}
                      role="button"
                      tabIndex={0}
                      aria-label={`${department.name}, ${doctorCount} médicos registrados`}
                      initial={false}
                      animate={{
                        scale: isHovered ? 1.04 : isSelected ? 1.02 : 1,
                      }}
                      transition={{ duration: 0.3, ease: EASE }}
                      onMouseEnter={() => handlePathEnter(id)}
                      onMouseLeave={handlePathLeave}
                      suppressHydrationWarning
                      onFocus={() => {
                        setFocusedId(id);
                        updateTooltip(id);
                      }}
                      onBlur={() => {
                        setFocusedId(null);
                        setTooltip(null);
                      }}
                      onClick={() => handleNavigate(id)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          handleNavigate(id);
                        }
                      }}
                    />
                  );
                })}

                <AnimatePresence>
                  {tooltip && (
                    <motion.foreignObject
                      key={tooltip.id}
                      x={tooltip.x - 90}
                      y={Math.max(64, tooltip.y - 56)}
                      width={180}
                      height={64}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="pointer-events-none overflow-visible"
                    >
                      <div className="rounded-xl border border-border/60 bg-white/95 px-3 py-2 text-center shadow-lg backdrop-blur-sm">
                        <p className="text-sm font-semibold text-text">
                          {getOrienteDepartment(tooltip.id).name}
                        </p>
                        <p className="mt-0.5 text-xs text-text-muted">
                          {getOrienteDoctorCount(getOrienteDepartment(tooltip.id))} médicos registrados
                        </p>
                      </div>
                    </motion.foreignObject>
                  )}
                </AnimatePresence>
              </svg>
            </motion.div>

            <p className="mt-4 text-center text-sm text-text-muted">
              Toca o haz clic en un departamento para ver especialistas
            </p>
          </div>

          <div className="min-h-[320px] lg:min-h-0">
            <AnimatePresence mode="wait">
              <DepartmentPanel key={panelId} department={panelDepartment} />
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4"
          role="list"
        >
          {ORIENTE_DEPARTMENT_IDS.map((id) => {
            const department = getOrienteDepartment(id);
            const doctorCount = getOrienteDoctorCount(department);
            const isSelected = selectedId === id;

            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(id)}
                  onMouseEnter={() => handlePathEnter(id)}
                  onMouseLeave={handlePathLeave}
                  className={[
                    'w-full rounded-[var(--radius-button)] border px-4 py-3.5 text-left transition-all duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-[0_8px_24px_-16px_rgba(37,99,235,0.6)]'
                      : 'border-border bg-white hover:border-primary/40 hover:bg-secondary/50',
                  ].join(' ')}
                >
                  <span className="block text-sm font-semibold text-text">{department.name}</span>
                  <span className="mt-0.5 block text-xs text-text-muted">{doctorCount} médicos</span>
                </button>
              </li>
            );
          })}
        </motion.ul>
      </SectionContainer>
    </section>
  );
}
