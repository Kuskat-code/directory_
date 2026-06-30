'use client';

import { useCallback, useEffect, useRef, useState, useTransition } from 'react';
import type { EditableProfile } from '../types';
import { PROFILE_STORAGE_KEY } from '../lib/defaults';
import {
  updateBasicInfo,
  updateSummary,
  updateSchedule,
  updateServices,
  updateGallery,
  updateAvatar,
  updateCoverImage,
  getDoctorProfile,
} from '../profile.actions';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useProfileEditor(doctorId: string, defaults: EditableProfile) {
  const [profile, setProfile] = useState(defaults);
  const [draft, setDraft] = useState(defaults);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;

  useEffect(() => {
    let active = true;
    setIsLoaded(false);

    async function loadProfile() {
      const base = defaultsRef.current;
      let dbProfile: Partial<EditableProfile> | null = null;

      try {
        const response = await getDoctorProfile(doctorId);
        if (response.success && response.data) {
          dbProfile = response.data;
        }
      } catch (err) {
        console.error('Error fetching profile from Supabase:', err);
      }

      if (!active) return;

      try {
        // Fallback secundario a localStorage por si se guardaron cambios locales
        const stored = localStorage.getItem(PROFILE_STORAGE_KEY(doctorId));
        const localData = stored ? (JSON.parse(stored) as Partial<EditableProfile>) : null;

        const merged = {
          ...base,
          ...(localData || {}),
          ...(dbProfile || {}),
        };

        setProfile(merged);
        setDraft(merged);
      } catch {
        setProfile(base);
        setDraft(base);
      } finally {
        setIsLoaded(true);
        setIsEditing(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [doctorId]);

  const startEditing = useCallback(() => {
    setDraft(profile);
    setIsEditing(true);
    setSaveStatus('idle');
    setSaveError(null);
  }, [profile]);

  const cancelEditing = useCallback(() => {
    setDraft(profile);
    setIsEditing(false);
    setSaveStatus('idle');
    setSaveError(null);
  }, [profile]);

  const saveProfile = useCallback(() => {
    setSaveStatus('saving');
    setSaveError(null);

    startTransition(async () => {
      const promises: Promise<any>[] = [];

      // 1. Verificar si la información básica cambió
      const basicInfoChanged =
        draft.name !== profile.name ||
        draft.specialty !== profile.specialty ||
        draft.location !== profile.location ||
        draft.experience !== profile.experience ||
        draft.phone !== profile.phone ||
        draft.email !== profile.email;

      if (basicInfoChanged) {
        promises.push(
          updateBasicInfo({
            doctorId,
            name: draft.name,
            specialty: draft.specialty,
            location: draft.location,
            experience: draft.experience,
            phone: draft.phone,
            email: draft.email,
          })
        );
      }

      // 2. Verificar si la biografía o los idiomas cambiaron
      const languagesChanged =
        draft.languages.length !== profile.languages.length ||
        draft.languages.some((val, idx) => val !== profile.languages[idx]);
      const summaryChanged = draft.bio !== profile.bio || languagesChanged;

      if (summaryChanged) {
        promises.push(
          updateSummary({ doctorId, bio: draft.bio, languages: draft.languages })
        );
      }

      // 3. Verificar si el cronograma cambió
      const scheduleChanged = JSON.stringify(draft.schedule) !== JSON.stringify(profile.schedule);
      if (scheduleChanged) {
        promises.push(
          updateSchedule({ doctorId, schedule: draft.schedule })
        );
      }

      // 4. Verificar si los servicios cambiaron
      const servicesChanged = JSON.stringify(draft.services) !== JSON.stringify(profile.services);
      if (servicesChanged) {
        promises.push(
          updateServices({ doctorId, services: draft.services })
        );
      }

      // 5. Verificar si las imágenes de galería cambiaron
      const galleryChanged = JSON.stringify(draft.galleryImages) !== JSON.stringify(profile.galleryImages);
      if (galleryChanged) {
        promises.push(
          updateGallery({ doctorId, galleryImages: draft.galleryImages })
        );
      }

      // 6. Verificar si el avatar cambió
      const avatarChanged = draft.avatar !== profile.avatar;
      if (avatarChanged) {
        promises.push(
          updateAvatar({ doctorId, avatar: draft.avatar })
        );
      }

      // 7. Verificar si la imagen de portada cambió
      const coverChanged = draft.coverImage !== profile.coverImage;
      if (coverChanged) {
        promises.push(
          updateCoverImage({ doctorId, coverImage: draft.coverImage })
        );
      }

      // Si nada cambió, terminar inmediatamente
      if (promises.length === 0) {
        setIsEditing(false);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
        return;
      }

      const results = await Promise.allSettled(promises);

      const firstError = results.find(
        (r): r is PromiseFulfilledResult<{ success: false; error: string }> =>
          r.status === 'fulfilled' && !r.value.success,
      );

      if (firstError) {
        setSaveStatus('error');
        setSaveError(firstError.value.error);
        return;
      }

      // Obtener los datos resultantes con las URL de imágenes actualizadas
      const finalDraft = { ...draft };
      results.forEach((r) => {
        if (r.status === 'fulfilled' && r.value.success && r.value.data) {
          const resData = r.value.data;
          // Actualizar en el draft local las URLs de imágenes devueltas por el servidor
          if ('avatar' in resData) finalDraft.avatar = resData.avatar;
          if ('coverImage' in resData) finalDraft.coverImage = resData.coverImage;
          if ('galleryImages' in resData) finalDraft.galleryImages = resData.galleryImages;
        }
      });

      localStorage.setItem(PROFILE_STORAGE_KEY(doctorId), JSON.stringify(finalDraft));
      setProfile(finalDraft);
      setDraft(finalDraft);
      setIsEditing(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    });
  }, [doctorId, draft, profile]);

  const updateDraft = useCallback((updates: Partial<EditableProfile>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const display = isEditing ? draft : profile;

  return {
    profile: display,
    draft,
    isEditing,
    isLoaded,
    isSaving: isPending,
    saveStatus,
    saveError,
    startEditing,
    cancelEditing,
    saveProfile,
    updateDraft,
  };
}
