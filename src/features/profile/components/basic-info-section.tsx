'use client';

import { Mail, MapPin, Phone, Stethoscope, User } from 'lucide-react';
import type { EditableProfile, SpecialtyColorScheme } from '../types';
import { MEDICAL_SPECIALTIES } from '@/src/lib/constants';

interface BasicInfoSectionProps {
  profile: EditableProfile;
  isEditing: boolean;
  colors: SpecialtyColorScheme;
  onChange: (updates: Partial<EditableProfile>) => void;
}

export function BasicInfoSection({ profile, isEditing, colors, onChange }: BasicInfoSectionProps) {
  if (!isEditing) return null;

  return (
    <section
      aria-label="Información básica"
      className="rounded-[var(--radius-card)] border p-6 shadow-sm"
      style={{ borderColor: colors.border, backgroundColor: colors.light }}
    >
      <h2
        className="mb-4 flex items-center gap-2 text-sm font-bold tracking-tight"
        style={{ color: colors.text }}
      >
        <User className="h-4 w-4" aria-hidden="true" />
        Información Básica
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <fieldset className="space-y-1">
          <label htmlFor="profile-name" className="block text-xs font-semibold text-text-muted">
            Nombre completo
          </label>
          <input
            id="profile-name"
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="profile-input"
            placeholder="Dr. Nombre Apellido"
          />
        </fieldset>

        <fieldset className="space-y-1">
          <label
            htmlFor="profile-experience"
            className="block text-xs font-semibold text-text-muted"
          >
            Años de experiencia
          </label>
          <input
            id="profile-experience"
            type="number"
            min={0}
            max={60}
            value={profile.experience}
            onChange={(e) => onChange({ experience: parseInt(e.target.value, 10) || 0 })}
            className="profile-input"
          />
        </fieldset>

        <fieldset className="space-y-1">
          <label
            htmlFor="profile-specialty"
            className="flex items-center gap-1 text-xs font-semibold text-text-muted"
          >
            <Stethoscope className="h-3 w-3" aria-hidden="true" />
            Especialidad
          </label>
          <select
            id="profile-specialty"
            value={profile.specialty}
            onChange={(e) => onChange({ specialty: e.target.value })}
            className="profile-input"
          >
            {MEDICAL_SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="space-y-1">
          <label
            htmlFor="profile-location"
            className="flex items-center gap-1 text-xs font-semibold text-text-muted"
          >
            <MapPin className="h-3 w-3" aria-hidden="true" />
            Ubicación
          </label>
          <input
            id="profile-location"
            type="text"
            value={profile.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="profile-input"
            placeholder="Ciudad, Departamento"
          />
        </fieldset>

        <fieldset className="space-y-1">
          <label
            htmlFor="profile-phone"
            className="flex items-center gap-1 text-xs font-semibold text-text-muted"
          >
            <Phone className="h-3 w-3" aria-hidden="true" />
            Teléfono
          </label>
          <input
            id="profile-phone"
            type="tel"
            value={profile.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className="profile-input"
            placeholder="+503 2345 6789"
          />
        </fieldset>

        <fieldset className="space-y-1">
          <label
            htmlFor="profile-email"
            className="flex items-center gap-1 text-xs font-semibold text-text-muted"
          >
            <Mail className="h-3 w-3" aria-hidden="true" />
            Correo electrónico
          </label>
          <input
            id="profile-email"
            type="email"
            value={profile.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className="profile-input"
            placeholder="doctor@email.com"
          />
        </fieldset>
      </div>
    </section>
  );
}
