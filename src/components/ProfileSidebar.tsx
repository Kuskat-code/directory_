'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Plus, Trash2 } from 'lucide-react';
import AppointmentModal from '@/src/components/AppointmentModal';
import { getSpecialtyBadgeColors } from '@/src/lib/specialty-badge-colors';
import type { EditableProfile, ProfileScheduleItem } from '@/src/features/profile/types';
import type { AppointmentData } from '@/src/components/AppointmentModal';

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
  const [showAppointment, setShowAppointment] = useState(false);
  const address = `${profile.location}, El Salvador`;
  const specialtyColor = getSpecialtyBadgeColors(profile.specialty);

  const handleAppointmentConfirm = (data: AppointmentData) => {
    console.log('Cita agendada:', data);
  };

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
    <>
      <AppointmentModal
        isOpen={showAppointment}
        doctorName={profile.name}
        specialty={profile.specialty}
        onClose={() => setShowAppointment(false)}
        onConfirm={handleAppointmentConfirm}
      />
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
            <button
              type="button"
              onClick={() => setShowAppointment(true)}
              className={`flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${specialtyColor.button}`}
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Agendar Cita
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1ebe5d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.852L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.724.886.938-3.617-.234-.373A9.818 9.818 0 1112 21.818z" />
              </svg>
              Contactar WhatsApp
            </button>
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
                  {item.closed ? (
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600"></span>
                      </span>
                      <span className="font-semibold text-red-600">{item.hours}</span>
                    </span>
                  ) : (
                    <span className="font-bold text-text">{item.hours}</span>
                  )}
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
    </>
  );
}
