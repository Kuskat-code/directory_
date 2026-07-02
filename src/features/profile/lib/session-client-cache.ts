'use client';

import { getCurrentUserSession } from '../actions/session.actions';
import type { UserSessionData } from '../actions/session.actions';
import type { ActionResponse } from '../types';

// Varios componentes cliente (Header, dashboards, ConfiguracionContent, etc.)
// montan casi al mismo tiempo y cada uno llama a `getCurrentUserSession()`.
// Como es una Server Action, cada llamada es un round-trip de red
// independiente (React `cache()` no ayuda aquí porque no comparten el mismo
// request de servidor). Este módulo deduplica esas llamadas en el navegador:
// reutiliza la promesa en curso y cachea el resultado por un TTL corto, para
// que una ráfaga de componentes montándose juntos dispare una sola petición real.
const SESSION_CACHE_TTL_MS = 3000;

type SessionResponse = ActionResponse<UserSessionData | null>;

let inFlightRequest: Promise<SessionResponse> | null = null;
let cachedResult: { value: SessionResponse; fetchedAt: number } | null = null;

export function getCachedUserSession(): Promise<SessionResponse> {
  const now = Date.now();

  if (cachedResult && now - cachedResult.fetchedAt < SESSION_CACHE_TTL_MS) {
    return Promise.resolve(cachedResult.value);
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = getCurrentUserSession()
    .then((result) => {
      cachedResult = { value: result, fetchedAt: Date.now() };
      return result;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}

// Limpia la caché para forzar un round-trip fresco en la próxima lectura.
// Debe llamarse tras cualquier acción que cambie la sesión o el perfil
// (login, logout, actualización de nombre/avatar) para no servir datos viejos.
export function invalidateCachedUserSession(): void {
  cachedResult = null;
  inFlightRequest = null;
}

export const AUTH_CHANGE_EVENT = 'auth-change';

// Invalida la caché ANTES de notificar, para que cualquier listener de
// 'auth-change' que vuelva a pedir la sesión reciba datos frescos en vez del
// valor cacheado previo.
export function notifyAuthChange(): void {
  invalidateCachedUserSession();
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
