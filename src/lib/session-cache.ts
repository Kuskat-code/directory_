import { getCurrentUserSession, type UserSessionData } from '@/src/features/profile/profile.actions';
import type { ActionResponse } from '@/src/features/profile/types';

let sessionPromise: Promise<ActionResponse<UserSessionData | null>> | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 30000; // 30 segundos de cache

export async function getCachedUserSession(forceRefresh = false): Promise<ActionResponse<UserSessionData | null>> {
  const now = Date.now();
  if (forceRefresh || !sessionPromise || (now - lastFetchTime > CACHE_TTL)) {
    lastFetchTime = now;
    sessionPromise = getCurrentUserSession();
  }
  return sessionPromise;
}

export function invalidateSessionCache() {
  sessionPromise = null;
  lastFetchTime = 0;
}

// Invalidador reactivo automático ante eventos de autenticación y cambios de perfil
if (typeof window !== 'undefined') {
  window.addEventListener('auth-change', () => {
    invalidateSessionCache();
  });
}
