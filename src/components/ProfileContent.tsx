'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { EASE, EXAMPLE_DOCTORS, type Doctor, type DoctorAvailability } from '@/src/lib/constants';
import ProfileHero from '@/src/components/ProfileHero';
import ProfileDetails from '@/src/components/ProfileDetails';
import ProfileSidebar from '@/src/components/ProfileSidebar';
import { buildDefaultProfile } from '@/src/features/profile/lib/defaults';
import { useProfileEditor } from '@/src/features/profile/hooks/use-profile-editor';
import { ProfileEditorModal } from '@/src/features/profile/components/ProfileEditorModal';
import type { UserSessionData } from '@/src/features/profile/profile.actions';
import { AUTH_CHANGE_EVENT, getCachedUserSession } from '@/src/features/profile/lib/session-client-cache';

export default function ProfileContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id') ?? '';

  const [currentUser, setCurrentUser] = useState<UserSessionData | null>(null);

  useEffect(() => {
    async function loadUser() {
      const response = await getCachedUserSession();
      if (response.success && response.data) {
        setCurrentUser(response.data);
      } else {
        setCurrentUser(null);
      }
    }
    void loadUser();

    window.addEventListener(AUTH_CHANGE_EVENT, loadUser);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, loadUser);
    };
  }, []);

  const isMockDoctor = useMemo(
    () => EXAMPLE_DOCTORS.some((d) => d.id === doctorId),
    [doctorId],
  );

  const baseDoctor = useMemo<Doctor>(
    () => EXAMPLE_DOCTORS.find((d) => d.id === doctorId) ?? {
      id: doctorId,
      name: 'Especialista',
      specialty: 'Medicina General',
      location: 'San Miguel',
      phone: '',
      email: '',
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Especialista',
      rating: 5.0,
      reviews: 0,
      experience: 0,
      availability: 'available' as DoctorAvailability,
      bio: '',
      certifications: [] as string[],
      languages: ['Español'],
    },
    [doctorId],
  );

  const defaultProfile = useMemo(
    () => buildDefaultProfile(baseDoctor, isMockDoctor),
    [baseDoctor, isMockDoctor],
  );

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

  const isOwner = currentUser && currentUser.id === doctorId;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="skeleton h-12 w-12 rounded-full" />
      </div>
    );
  }

  return (
    <>
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
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative h-72 w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${profile.coverImage}')` }}
        >
          <div className="absolute inset-0 bg-text/20 backdrop-blur-[2px]" />
        </motion.div>

        <div className={`relative z-10 mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 ${isOwner ? '-mt-14' : '-mt-4'}`}>
          {isOwner && (
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
          )}

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
