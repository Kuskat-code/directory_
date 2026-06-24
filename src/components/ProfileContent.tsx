'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { EXAMPLE_DOCTORS } from '@/src/lib/constants';
import ProfileHero from '@/src/components/ProfileHero';
import ProfileDetails from '@/src/components/ProfileDetails';
import ProfileSidebar from '@/src/components/ProfileSidebar';
import { buildDefaultProfile } from '@/src/features/profile/lib/defaults';
import { useProfileEditor } from '@/src/features/profile/hooks/use-profile-editor';
import { ProfileEditToolbar } from '@/src/features/profile/components/ProfileEditToolbar';
import { ImageUploader } from '@/src/features/profile/components/ImageUploader';

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
    isEditing,
    isLoaded,
    startEditing,
    cancelEditing,
    saveProfile,
    updateDraft,
  } = useProfileEditor(doctorId, defaultProfile);

  const tags = useMemo(
    () => [
      profile.specialty,
      `${profile.experience} anos experiencia`,
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
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative h-72 w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${profile.coverImage}')` }}
      >
        <div className="absolute inset-0 bg-text/20 backdrop-blur-[2px]" />
        {isEditing && (
          <div className="absolute inset-0 flex items-end justify-center bg-text/30 p-4">
            <div className="w-full max-w-md rounded-[var(--radius-card)] bg-white/95 p-4 shadow-lg backdrop-blur-sm">
              <p className="mb-2 text-xs font-semibold text-text">Imagen de portada</p>
              <ImageUploader
                value={profile.coverImage}
                onChange={(coverImage) => updateDraft({ coverImage })}
                label="Subir portada"
                showUrlInput
              />
            </div>
          </div>
        )}
      </motion.div>

      <div className="relative z-10 mx-auto -mt-14 max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <ProfileEditToolbar
          isEditing={isEditing}
          onStart={startEditing}
          onSave={saveProfile}
          onCancel={cancelEditing}
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ProfileHero
              profile={profile}
              doctor={baseDoctor}
              isEditing={isEditing}
              onChange={updateDraft}
            />
            <ProfileDetails
              profile={profile}
              tags={tags}
              doctor={baseDoctor}
              isEditing={isEditing}
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
  );
}
