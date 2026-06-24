'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { EditableProfile } from '../types';
import { PROFILE_STORAGE_KEY } from '../lib/defaults';

export function useProfileEditor(doctorId: string, defaults: EditableProfile) {
  const [profile, setProfile] = useState(defaults);
  const [draft, setDraft] = useState(defaults);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
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
  }, [profile]);

  const cancelEditing = useCallback(() => {
    setDraft(profile);
    setIsEditing(false);
  }, [profile]);

  const saveProfile = useCallback(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY(doctorId), JSON.stringify(draft));
    setProfile(draft);
    setIsEditing(false);
  }, [doctorId, draft]);

  const updateDraft = useCallback((updates: Partial<EditableProfile>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  }, []);

  const display = isEditing ? draft : profile;

  return {
    profile: display,
    isEditing,
    isLoaded,
    startEditing,
    cancelEditing,
    saveProfile,
    updateDraft,
  };
}
