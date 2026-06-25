'use client';

import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import type { EditableProfile, ProfileService, SpecialtyColorScheme } from '../types';

const EASE = [0.4, 0, 0.2, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

interface PracticeAreasSectionProps {
  services: ProfileService[];
  isEditing: boolean;
  colors: SpecialtyColorScheme;
  onChange: (updates: Partial<EditableProfile>) => void;
}

export function PracticeAreasSection({
  services,
  isEditing,
  colors,
  onChange,
}: PracticeAreasSectionProps) {
  const update = (index: number, field: keyof ProfileService, value: string) => {
    const updated = services.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    onChange({ services: updated });
  };

  const add = () => {
    onChange({
      services: [
        ...services,
        { title: 'Nuevo servicio', desc: 'Descripción del servicio' },
      ],
    });
  };

  const remove = (index: number) => {
    onChange({ services: services.filter((_, i) => i !== index) });
  };

  const sectionClass = isEditing
    ? 'rounded-[var(--radius-card)] border p-6 shadow-sm md:p-8'
    : 'rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm md:p-8';

  return (
    <motion.section
      aria-labelledby="practice-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
      className={sectionClass}
      style={isEditing ? { borderColor: colors.border, backgroundColor: colors.light } : undefined}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="practice-heading"
          className="text-base font-bold tracking-tight"
          style={{ color: isEditing ? colors.text : 'var(--color-text)' }}
        >
          Áreas de Práctica Especializada
        </h2>

        {isEditing && (
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-1 rounded-[var(--radius-button)] px-2.5 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ color: colors.primary, backgroundColor: colors.badge }}
            aria-label="Agregar área de práctica"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Agregar
          </button>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        role="list"
        aria-label="Servicios y áreas de práctica"
      >
        {services.map((service, i) => (
          <motion.article
            key={i}
            role="listitem"
            variants={itemVariants}
            whileHover={isEditing ? undefined : { y: -4, scale: 1.01 }}
            className={`rounded-[var(--radius-card)] border p-4 ${
              isEditing
                ? 'bg-white/60'
                : 'bg-secondary/40 transition-all hover:bg-white'
            }`}
            style={
              isEditing
                ? { borderColor: colors.border }
                : { borderColor: 'var(--color-border)' }
            }
          >
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => update(i, 'title', e.target.value)}
                    className="profile-input text-xs font-bold"
                    aria-label={`Título del servicio ${i + 1}`}
                    maxLength={100}
                  />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="shrink-0 rounded p-1 text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                    aria-label={`Eliminar servicio ${service.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={service.desc}
                  onChange={(e) => update(i, 'desc', e.target.value)}
                  className="profile-input profile-textarea min-h-[4rem] text-[11px]"
                  aria-label={`Descripción del servicio ${i + 1}`}
                  maxLength={500}
                />
              </div>
            ) : (
              <>
                <h3 className="mb-1 flex items-center gap-1.5 text-xs font-bold tracking-tight text-text">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                    aria-hidden="true"
                  />
                  {service.title}
                </h3>
                <p className="pl-3 text-[11px] leading-normal text-text-muted">{service.desc}</p>
              </>
            )}
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  );
}
