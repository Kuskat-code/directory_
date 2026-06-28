'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { EXAMPLE_DOCTORS } from '@/src/lib/constants';
import ProfileHero from '@/src/components/ProfileHero';
import ProfileDetails from '@/src/components/ProfileDetails';
import ProfileSidebar from '@/src/components/ProfileSidebar';
import { buildDefaultProfile } from '@/src/features/profile/lib/defaults';
import { useProfileEditor } from '@/src/features/profile/hooks/use-profile-editor';
import { ProfileEditorModal } from '@/src/features/profile/components/ProfileEditorModal';

const EASE = [0.4, 0, 0.2, 1] as const;

export default function ProfileContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id') ?? EXAMPLE_DOCTORS[0].id;

  const baseDoctor = useMemo(
    () => EXAMPLE_DOCTORS.find((d) => d.id === doctorId) ?? EXAMPLE_DOCTORS[0],
    [doctorId],
  );

  const defaultProfile = useMemo(() => buildDefaultProfile(baseDoctor), [baseDoctor]);

  const {
    profile,
    draft,
    isEditing,
    isLoaded,
    isSaving,
    saveStatus,
    saveError,
    startEditing,
    cancelEditing,
    saveProfile,
    updateDraft,
  } = useProfileEditor(doctorId, defaultProfile);

  const tags = useMemo(
    () => [
      profile.specialty,
      `${profile.experience} años experiencia`,
      ...profile.languages,
    ],
    [profile.specialty, profile.experience, profile.languages],
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="skeleton h-12 w-12 rounded-full" />
      </div>
    );
  }

  return (
    <>
      {/* ── Profile Editor Modal ─────────────────────────────── */}
      <ProfileEditorModal
        isOpen={isEditing}
        draft={draft}
        isSaving={isSaving}
        saveStatus={saveStatus}
        saveError={saveError}
        onSave={saveProfile}
        onCancel={cancelEditing}
        onChange={updateDraft}
      />

      <div className="w-full">
        {/* ── Banner ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative h-72 w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${profile.coverImage}')` }}
        >
          <div className="absolute inset-0 bg-text/20 backdrop-blur-[2px]" />
        </motion.div>

        {/* ── Page body ─────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {/* Edit button */}
          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex items-center gap-2 rounded-[var(--radius-button)] border border-border bg-white/95 px-4 py-2 text-sm font-semibold text-text shadow-sm backdrop-blur-sm transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Personalizar perfil
            </button>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <ProfileHero
                profile={profile}
                doctor={baseDoctor}
                isEditing={false}
                onChange={updateDraft}
              />
              <ProfileDetails
                profile={profile}
                tags={tags}
                doctor={baseDoctor}
                isEditing={false}
                onChange={updateDraft}
              />
            </div>
            <ProfileSidebar
              profile={profile}
              isEditing={isEditing}
              onChange={updateDraft}
            />
          </div>
        </div>
      </div>
    </>
  );
}
