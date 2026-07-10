'use client';

import { motion } from 'framer-motion';
import { Clock, Plus, Trash2 } from 'lucide-react';
import { EASE } from '@/src/lib/constants';
import type { EditableProfile, ProfileScheduleItem, SpecialtyColorScheme } from '../types';

interface HoursSectionProps {
  schedule: ProfileScheduleItem[];
  isEditing: boolean;
  colors: SpecialtyColorScheme;
  onChange: (updates: Partial<EditableProfile>) => void;
}

export function HoursSection({ schedule, isEditing, colors, onChange }: HoursSectionProps) {
  const update = (index: number, field: keyof ProfileScheduleItem, value: string | boolean) => {
    const updated = schedule.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ schedule: updated });
  };

  const add = () => {
    onChange({ schedule: [...schedule, { days: 'Nuevo horario', hours: '9:00 AM - 6:00 PM' }] });
  };

  const remove = (index: number) => {
    onChange({ schedule: schedule.filter((_, i) => i !== index) });
  };

  const sectionClass = isEditing
    ? 'rounded-[var(--radius-card)] border p-6 shadow-sm'
    : 'rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm transition-shadow duration-300 hover:shadow-[var(--shadow-glow)]';

  return (
    <motion.section
      aria-labelledby="hours-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
      className={sectionClass}
      style={isEditing ? { borderColor: colors.border, backgroundColor: colors.light } : undefined}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          id="hours-heading"
          className="flex items-center gap-2 text-sm font-bold"
          style={{ color: isEditing ? colors.text : 'var(--color-text)' }}
        >
          <Clock
            className="h-4 w-4"
            aria-hidden="true"
            style={{ color: isEditing ? colors.primary : 'var(--color-primary)' }}
          />
          Horario de Atención
        </h2>

        {isEditing && (
          <button
            type="button"
            onClick={add}
            className="rounded p-1 transition-colors hover:opacity-80"
            style={{ color: colors.primary }}
            aria-label="Agregar horario"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3 text-xs">
        {schedule.map((item, i) => (
          <div
            key={i}
            className={`border-b border-border py-1 last:border-0 ${
              isEditing ? 'space-y-2 pb-3' : 'flex items-center justify-between'
            }`}
          >
            {isEditing ? (
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.days}
                    onChange={(e) => update(i, 'days', e.target.value)}
                    className="profile-input flex-1"
                    aria-label={`Días del horario ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="shrink-0 rounded p-1 text-text-muted transition-colors hover:text-red-500"
                    aria-label={`Eliminar horario ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={item.hours}
                  onChange={(e) => update(i, 'hours', e.target.value)}
                  className="profile-input"
                  aria-label={`Horas del horario ${i + 1}`}
                />
                <label className="flex cursor-pointer items-center gap-2 text-text-muted">
                  <input
                    type="checkbox"
                    checked={Boolean(item.closed)}
                    onChange={(e) => update(i, 'closed', e.target.checked)}
                    className="rounded"
                    style={{ accentColor: colors.primary }}
                  />
                  Cerrado / solo emergencias
                </label>
              </>
            ) : (
              <>
                <span className="font-medium text-text-muted">{item.days}</span>
                <span
                  className="font-bold"
                  style={{ color: item.closed ? 'var(--color-warning)' : 'var(--color-text)' }}
                >
                  {item.hours}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  );
}
