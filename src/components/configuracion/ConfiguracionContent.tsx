'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/src/lib/supabase/client';
import { motion } from 'framer-motion';
import { Lock, Mail, Trash2, Eye, EyeOff, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { signOutAction } from '@/src/features/profile/profile.actions';

export default function ConfiguracionContent() {
  const router = useRouter();
  const supabase = createClient();

  // Password States
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Email States
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  // Delete Account States
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (password !== confirmPassword) {
      return setPasswordError('Las contraseñas no coinciden.');
    }
    if (password.length < 6) {
      return setPasswordError('La contraseña debe tener al menos 6 caracteres.');
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPasswordSuccess('Contraseña actualizada con éxito.');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Error al actualizar la contraseña.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(null);

    if (!email.trim()) {
      return setEmailError('El correo electrónico es requerido.');
    }

    setEmailLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      setEmailSuccess('Se ha enviado un enlace de confirmación a tu nuevo y antiguo correo electrónico.');
      setEmail('');
    } catch (err: any) {
      setEmailError(err.message || 'Error al actualizar el correo electrónico.');
    } finally {
      setEmailLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError(null);
    setDeleteLoading(true);

    try {
      // Llamar a la función RPC delete_own_user en Supabase
      const { error: rpcError } = await supabase.rpc('delete_own_user');
      if (rpcError) throw rpcError;

      // Cerrar la sesión localmente
      await signOutAction();
      window.dispatchEvent(new Event('auth-change'));
      
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setDeleteError(err.message || 'Error al eliminar la cuenta.');
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Configuración de Cuenta</h1>

      <div className="space-y-8">
        {/* 1. Actualizar Correo Electrónico */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5 text-teal-600" />
            Correo Electrónico
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Cambia la dirección de correo con la que inicias sesión y recibes notificaciones.
          </p>

          {emailSuccess && (
            <div className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-100 flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <span>{emailSuccess}</span>
            </div>
          )}

          {emailError && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-100 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <span>{emailError}</span>
            </div>
          )}

          <form onSubmit={handleUpdateEmail} className="max-w-md space-y-4">
            <div className="space-y-1">
              <label htmlFor="config-email" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Nuevo Correo Electrónico
              </label>
              <input
                id="config-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nuevo-correo@example.com"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-4 text-sm text-gray-900 outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={emailLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 font-semibold text-white hover:bg-teal-700 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {emailLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Actualizar Correo
            </button>
          </form>
        </section>

        {/* 2. Actualizar Contraseña */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Lock className="h-5 w-5 text-teal-600" />
            Cambiar Contraseña
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Asegura tu cuenta actualizando tu contraseña periódicamente.
          </p>

          {passwordSuccess && (
            <div className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-100 flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-100 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="max-w-md space-y-4">
            <div className="space-y-1">
              <label htmlFor="config-password" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="config-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm text-gray-900 outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="config-confirm-password" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Confirmar Contraseña
              </label>
              <input
                id="config-confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 px-4 text-sm text-gray-900 outline-none focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 font-semibold text-white hover:bg-teal-700 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none transition-all cursor-pointer"
            >
              {passwordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Actualizar Contraseña
            </button>
          </form>
        </section>

        {/* 3. Eliminar Cuenta */}
        <section className="rounded-2xl border border-red-100 bg-red-50/20 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Zona de Peligro
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Al eliminar tu cuenta, todos tus datos personales, historial clínico y perfiles creados se borrarán de forma permanente y no podrán ser recuperados.
          </p>

          {deleteError && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-100 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <span>{deleteError}</span>
            </div>
          )}

          {!deleteConfirm ? (
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700 active:scale-[0.98] transition-all cursor-pointer"
            >
              Eliminar mi Cuenta
            </button>
          ) : (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 max-w-md">
              <h3 className="text-base font-bold text-red-800 flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5" />
                ¿Estás absolutamente seguro?
              </h3>
              <p className="text-xs text-red-700 leading-relaxed mb-4">
                Esta acción es irreversible. Se eliminará tu registro de usuario, tu perfil clínico (si eres doctor) y tu suscripción asociada.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDeleteAccount}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-75 cursor-pointer"
                >
                  {deleteLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                  Sí, eliminar definitivamente
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setDeleteConfirm(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-75 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
