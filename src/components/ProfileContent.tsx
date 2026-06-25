'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { EXAMPLE_DOCTORS } from '@/src/lib/constants';
import ProfileHero from '@/src/components/ProfileHero';
import ProfileDetails from '@/src/components/ProfileDetails';
import ProfileSidebar from '@/src/components/ProfileSidebar';
import { buildDefaultProfile } from '@/src/features/profile/lib/defaults';
import { useProfileEditor } from '@/src/features/profile/hooks/use-profile-editor';
import { ProfileEditToolbar } from '@/src/features/profile/components/ProfileEditToolbar';

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
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <div className="mx-4 w-full max-w-sm rounded-2xl border border-amber-200/40 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-sm dark:border-amber-700/40 dark:bg-gray-900/95">
              <div className="mb-3 flex justify-center">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
                  <Lock className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
              </div>
              <p className="mb-1 text-sm font-bold text-gray-900 dark:text-white">
                Función Premium
              </p>
              <p className="mb-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                Personalizar el banner de fondo requiere una Licencia Premium.
              </p>
              <button
                type="button"
                onClick={() => alert('¡Próximamente podrás adquirir tu Licencia Premium!')}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Obtener Licencia Premium
              </button>
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
