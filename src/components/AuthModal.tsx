'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signUpAction, signInAction } from '@/src/features/profile/profile.actions';

export default function AuthModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authMode = searchParams.get('auth'); // 'login' o 'register'
  
  const isOpen = authMode === 'login' || authMode === 'register';
  const isRegister = authMode === 'register';

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    // Para cerrar, removemos el query param "auth"
    const params = new URLSearchParams(searchParams.toString());
    params.delete('auth');
    router.replace(`?${params.toString()}`, { scroll: false });
    // Resetear form
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
  };

  const switchMode = (mode: 'login' | 'register') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('auth', mode);
    router.replace(`?${params.toString()}`, { scroll: false });
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegister) {
      if (!name.trim()) return setError('El nombre es requerido');
      if (password !== confirmPassword) return setError('Las contraseñas no coinciden');
      if (password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres');

      startTransition(async () => {
        const response = await signUpAction({ name, email, password });
        if (response.success) {
          // Registro exitoso, iniciamos sesión de forma automática
          const loginResponse = await signInAction({ email, password });
          if (loginResponse.success) {
            window.dispatchEvent(new Event('auth-change'));
            router.push(`/perfil?id=${loginResponse.data.userId}`);
            router.refresh();
          } else {
            // Fallback a login manual en caso de error de autologin
            router.push('?auth=login');
          }
          handleClose();
        } else {
          setError((response as { error: string }).error);
        }
      });
    } else {
      if (!email.trim() || !password) return setError('Todos los campos son requeridos');

      startTransition(async () => {
        const response = await signInAction({ email, password });
        if (response.success) {
          // Login exitoso, redirigimos al perfil, notificamos y cerramos
          window.dispatchEvent(new Event('auth-change'));
          router.push(`/perfil?id=${response.data.userId}`);
          router.refresh();
          handleClose();
        } else {
          setError((response as { error: string }).error);
        }
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop con Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />

          {/* Caja del Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 flex flex-col"
          >
            {/* Botón Cerrar */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Encabezado */}
            <div className="mb-6 text-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-teal-600">
                Directorio Médico
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                {isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
              </h2>
              <p className="text-sm text-gray-500 mt-1.5">
                {isRegister 
                  ? 'Regístrate para personalizar tu perfil profesional' 
                  : 'Ingresa tus credenciales para administrar tu perfil'}
              </p>
            </div>

            {/* Alerta de Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100"
              >
                {error}
              </motion.div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1">
                  <label htmlFor="auth-name" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="auth-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Juan Pérez"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="auth-email" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@example.com"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="auth-password" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
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

              {isRegister && (
                <div className="space-y-1">
                  <label htmlFor="auth-confirm-password" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="auth-confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 py-3 font-semibold text-white transition-all hover:bg-teal-700 active:scale-[0.98] disabled:opacity-75 disabled:pointer-events-none mt-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  isRegister ? 'Registrarse' : 'Ingresar'
                )}
              </button>
            </form>

            {/* Separador */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-x-0 h-px bg-gray-100" />
              <span className="relative bg-white px-3 text-xs text-gray-400 uppercase tracking-wider">O</span>
            </div>

            {/* Botón inferior de Cambio de Modo */}
            <div className="text-center text-sm text-gray-500">
              {isRegister ? (
                <>
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2 transition-colors"
                  >
                    Inicia Sesión
                  </button>
                </>
              ) : (
                <>
                  ¿Eres médico y no tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2 transition-colors"
                  >
                    Regístrate aquí
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
