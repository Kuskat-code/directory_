'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import type { EditableProfile, SpecialtyColorScheme } from '../types';

const EASE = [0.4, 0, 0.2, 1] as const;

interface SummarySectionProps {
  profile: EditableProfile;
  tags: string[];
  isEditing: boolean;
  colors: SpecialtyColorScheme;
  onChange: (updates: Partial<EditableProfile>) => void;
}

export function SummarySection({ profile, tags, isEditing, colors, onChange }: SummarySectionProps) {
  const sectionClass = isEditing
    ? 'rounded-[var(--radius-card)] border p-6 shadow-sm md:p-8'
    : 'rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm md:p-8';

  return (
    <motion.section
      aria-labelledby="summary-heading"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: EASE }}
      className={sectionClass}
      style={
        isEditing
          ? { borderColor: colors.border, backgroundColor: colors.light }
          : undefined
      }
    >
      <h2
        id="summary-heading"
        className="mb-3 flex items-center gap-2 text-base font-bold tracking-tight"
        style={isEditing ? { color: colors.text } : { color: 'var(--color-text)' }}
      >
        {isEditing && <BookOpen className="h-4 w-4" aria-hidden="true" />}
        Resumen Profesional
      </h2>

      {isEditing ? (
        <div className="space-y-4">
          <fieldset className="space-y-1">
            <label htmlFor="profile-bio" className="block text-xs font-semibold text-text-muted">
              Biografía profesional
            </label>
            <textarea
              id="profile-bio"
              value={profile.bio}
              onChange={(e) => onChange({ bio: e.target.value })}
              className="profile-input profile-textarea min-h-[7rem]"
              placeholder="Describe tu experiencia, enfoque y valores profesionales"
              maxLength={1000}
            />
            <p className="text-right text-[10px] text-text-muted">
              {profile.bio.length}/1000
            </p>
          </fieldset>

          <fieldset className="space-y-1">
            <label
              htmlFor="profile-languages"
              className="block text-xs font-semibold text-text-muted"
            >
              Idiomas (separados por coma)
            </label>
            <input
              id="profile-languages"
              type="text"
              value={profile.languages.join(', ')}
              onChange={(e) =>
                onChange({
                  languages: e.target.value
                    .split(',')
                    .map((l) => l.trim())
                    .filter(Boolean),
                })
              }
              className="profile-input"
              placeholder="Español, Inglés, Francés"
            />
          </fieldset>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm leading-relaxed text-text-muted">{profile.bio}</p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5" role="list" aria-label="Etiquetas">
              {tags.map((tag) => (
                <span
                  key={tag}
                  role="listitem"
                  className="rounded-[var(--radius-button)] px-2.5 py-1 text-[11px] font-medium"
                  style={{
                    backgroundColor: colors.badge,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </motion.section>
  );
}
