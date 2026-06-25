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
    setIsLoaded(false);
    const base = defaultsRef.current;
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY(doctorId));
      const merged = stored
        ? { ...base, ...(JSON.parse(stored) as Partial<EditableProfile>) }
        : base;
      setProfile(merged);
      setDraft(merged);
    } catch {
      setProfile(base);
      setDraft(base);
    } finally {
      setIsLoaded(true);
      setIsEditing(false);
    }
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
      const results = await Promise.allSettled([
        updateBasicInfo({
          doctorId,
          name: draft.name,
          specialty: draft.specialty,
          location: draft.location,
          experience: draft.experience,
          phone: draft.phone,
          email: draft.email,
        }),
        updateSummary({ doctorId, bio: draft.bio, languages: draft.languages }),
        updateSchedule({ doctorId, schedule: draft.schedule }),
        updateServices({ doctorId, services: draft.services }),
        updateGallery({ doctorId, galleryImages: draft.galleryImages }),
      ]);

      const firstError = results.find(
        (r): r is PromiseFulfilledResult<{ success: false; error: string }> =>
          r.status === 'fulfilled' && !r.value.success,
      );

      if (firstError) {
        setSaveStatus('error');
        setSaveError(firstError.value.error);
        return;
      }

      localStorage.setItem(PROFILE_STORAGE_KEY(doctorId), JSON.stringify(draft));
      setProfile(draft);
      setIsEditing(false);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    });
  }, [doctorId, draft]);

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
