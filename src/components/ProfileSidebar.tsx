'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import type { EditableProfile, ProfileScheduleItem } from '@/src/features/profile/types';

const EASE = [0.4, 0, 0.2, 1] as const;

const sidebarVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: EASE },
  }),
};

interface ProfileSidebarProps {
  profile: EditableProfile;
  isEditing?: boolean;
  onChange?: (updates: Partial<EditableProfile>) => void;
}

export default function ProfileSidebar({
  profile,
  isEditing = false,
  onChange,
}: ProfileSidebarProps) {
  const address = `${profile.location}, El Salvador`;

  const updateScheduleItem = (index: number, field: keyof ProfileScheduleItem, value: string | boolean) => {
    if (!onChange) return;
    const schedule = profile.schedule.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ schedule });
  };

  const addScheduleItem = () => {
    if (!onChange) return;
    onChange({
      schedule: [...profile.schedule, { days: 'Nuevo horario', hours: '9:00 AM - 6:00 PM' }],
    });
  };

  const removeScheduleItem = (index: number) => {
    if (!onChange) return;
    onChange({ schedule: profile.schedule.filter((_, i) => i !== index) });
  };

  const sectionClass = (editing: boolean) =>
    `rounded-[var(--radius-card)] border bg-surface p-6 shadow-sm ${
      editing
        ? 'border-primary/40 ring-2 ring-primary/10'
        : 'border-border transition-shadow duration-300 hover:shadow-glow'
    }`;

  return (
    <div className="space-y-6">
      <motion.section
        custom={0}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={sidebarVariants}
        whileHover={isEditing ? undefined : { y: -4, scale: 1.005 }}
        className={sectionClass(isEditing)}
      >
        <h2 className="mb-1 text-center text-base font-bold text-text">Agenda tu cita</h2>
        <p className="mb-6 text-center text-xs text-text-muted">
          Contacta al especialista para discutir tu caso.
        </p>
        {isEditing && onChange ? (
          <div className="space-y-3 text-xs">
            <div>
              <label className="mb-1 block font-semibold text-text-muted">Telefono de contacto</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                className="profile-input"
              />
            </div>
            <div>
              <label className="mb-1 block font-semibold text-text-muted">Correo</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className="profile-input"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Button variant="primary" className="w-full">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Agendar Cita
            </Button>
            <Button variant="accent" className="w-full">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Contactar WhatsApp
            </Button>
          </div>
        )}
      </motion.section>

      <motion.section
        custom={1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={sidebarVariants}
        whileHover={isEditing ? undefined : { y: -4, scale: 1.005 }}
        className={sectionClass(isEditing)}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold text-text">
            <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
            Horario de Atencion
          </h2>
          {isEditing && onChange && (
            <button
              type="button"
              onClick={addScheduleItem}
              className="rounded p-1 text-primary transition-colors hover:bg-primary/10"
              aria-label="Agregar horario"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="space-y-3 text-xs">
          {profile.schedule.map((item, i) => (
            <div
              key={i}
              className={`border-b border-border py-1 last:border-0 ${isEditing ? 'space-y-2 pb-3' : 'flex items-center justify-between'}`}
            >
              {isEditing && onChange ? (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.days}
                      onChange={(e) => updateScheduleItem(i, 'days', e.target.value)}
                      className="profile-input flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeScheduleItem(i)}
                      className="shrink-0 rounded p-1 text-text-muted hover:text-red-500"
                      aria-label="Eliminar horario"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.hours}
                    onChange={(e) => updateScheduleItem(i, 'hours', e.target.value)}
                    className="profile-input"
                  />
                  <label className="flex cursor-pointer items-center gap-2 text-text-muted">
                    <input
                      type="checkbox"
                      checked={Boolean(item.closed)}
                      onChange={(e) => updateScheduleItem(i, 'closed', e.target.checked)}
                      className="accent-primary"
                    />
                    Cerrado / solo emergencias
                  </label>
                </>
              ) : (
                <>
                  <span className="font-medium text-text-muted">{item.days}</span>
                  <span className={`font-bold ${item.closed ? 'text-warning' : 'text-text'}`}>
                    {item.hours}
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        custom={2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={sidebarVariants}
        whileHover={isEditing ? undefined : { y: -4, scale: 1.005 }}
        className={sectionClass(isEditing)}
      >
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-text">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          Ubicacion
        </h2>
        {isEditing && onChange ? (
          <input
            type="text"
            value={profile.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="profile-input mb-3 text-xs"
            placeholder="Ciudad o departamento"
          />
        ) : (
          <div className="mb-3 flex h-32 w-full items-center justify-center rounded-[var(--radius-card)] border border-border bg-secondary text-xs font-medium text-text-muted">
            [ Mapa ]
          </div>
        )}
        <p className="text-xs font-medium leading-relaxed text-text-muted">{address}</p>
      </motion.section>
    </div>
  );
}
