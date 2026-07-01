'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { Doctor } from '@/src/lib/constants';
import { MEDICAL_SPECIALTIES as SPECIALTIES } from '@/src/lib/constants';
import type { EditableProfile } from '@/src/features/profile/types';
import { ImageUploader } from '@/src/features/profile/components/ImageUploader';

const EASE = [0.4, 0, 0.2, 1] as const;

interface ProfileHeroProps {
  profile: EditableProfile;
  doctor: Doctor;
  isEditing?: boolean;
  onChange?: (updates: Partial<EditableProfile>) => void;
}

export default function ProfileHero({
  profile,
  isEditing = false,
  onChange,
}: ProfileHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: EASE }}
      whileHover={isEditing ? undefined : { y: -4, scale: 1.005 }}
      className={`rounded-[var(--radius-card)] border bg-surface p-6 shadow-sm md:p-8 ${
        isEditing ? 'border-primary/40 ring-2 ring-primary/10' : 'border-border transition-shadow duration-300 hover:shadow-glow'
      }`}
    >
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/30 to-cyan-400/30 opacity-60 blur-md" />
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-surface ring-2 ring-secondary bg-secondary shadow-md">
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={112}
              height={112}
              className="h-full w-full object-cover"
              unoptimized
            />
            {isEditing && onChange && (
              <ImageUploader
                overlay
                value={profile.avatar}
                onChange={(avatar) => onChange({ avatar })}
                label="Cambiar foto"
              />
            )}
          </div>
          {isEditing && onChange && (
            <div className="mt-3 w-28">
              <ImageUploader
                value={profile.avatar}
                onChange={(avatar) => onChange({ avatar })}
                label="Subir foto"
                showUrlInput
              />
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-3">
          {isEditing && onChange ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">Nombre</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                  className="profile-input"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-text-muted">Especialidad</label>
                <select
                  value={profile.specialty}
                  onChange={(e) => onChange({ specialty: e.target.value })}
                  className="profile-input cursor-pointer"
                >
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-muted">Ubicacion</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => onChange({ location: e.target.value })}
                    className="profile-input"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-muted">Años de experiencia</label>
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={profile.experience}
                    onChange={(e) => onChange({ experience: Number(e.target.value) || 0 })}
                    className="profile-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-muted">Telefono</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => onChange({ phone: e.target.value })}
                    className="profile-input"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-text-muted">Correo</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => onChange({ email: e.target.value })}
                    className="profile-input"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 md:justify-start">
                <h1 className="text-2xl font-bold text-text tracking-tight">{profile.name}</h1>
                <span className="text-accent text-lg" title="Perfil Verificado">&#10003;</span>
              </div>
              <p className="text-sm font-medium text-primary md:text-base">{profile.specialty}</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-text-muted md:justify-start">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {profile.location}
                </span>
                <span className="flex items-center gap-1">{profile.experience} años de experiencia</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}
