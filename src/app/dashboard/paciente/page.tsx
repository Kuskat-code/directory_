'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, User, ArrowRight, Stethoscope, Heart, Baby, Brain, Activity, Sparkles, HeartHandshake, Loader2 } from 'lucide-react';
import { type UserSessionData } from '@/src/features/profile/profile.actions';
import { getCachedUserSession } from '@/src/lib/session-cache';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

const specialtyIcons: Record<string, any> = {
  stethoscope: Stethoscope,
  heart: Heart,
  baby: Baby,
  brain: Brain,
  activity: Activity,
  sparkles: Sparkles,
  'heart-handshake': HeartHandshake,
};

const LANDING_SPECIALTIES = [
  { name: 'Medicina General', iconName: 'stethoscope', color: 'from-teal-500/20 to-emerald-500/20 text-teal-700' },
  { name: 'Cardiología', iconName: 'heart', color: 'from-red-500/20 to-pink-500/20 text-red-700' },
  { name: 'Pediatría', iconName: 'baby', color: 'from-blue-500/20 to-indigo-500/20 text-blue-700' },
  { name: 'Psicología', iconName: 'brain', color: 'from-purple-500/20 to-fuchsia-500/20 text-purple-700' },
  { name: 'Neurología', iconName: 'activity', color: 'from-amber-500/20 to-orange-500/20 text-amber-700' },
  { name: 'Dermatología', iconName: 'sparkles', color: 'from-rose-500/20 to-orange-500/20 text-rose-700' },
] as const;

export default function PacienteDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const response = await getCachedUserSession();
      if (response.success && response.data && response.data.role === 'paciente') {
        setUser(response.data);
      } else {
        router.push('/');
      }
      setLoading(false);
    }
    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50/50 pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-2xl bg-gradient-to-r from-teal-800 to-emerald-950 p-6 md:p-10 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
              <Stethoscope className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200">
                Panel del Paciente
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                ¡Hola de nuevo, {user.name}!
              </h1>
              <p className="mt-2 text-lg text-teal-100">
                Encuentra los mejores doctores del oriente del país, agenda citas y gestiona tu salud de forma rápida y segura.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/directorio"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-3 font-semibold text-white transition-all hover:bg-teal-400 active:scale-95 shadow-md"
                >
                  <Search className="h-5 w-5" />
                  Buscar Especialistas
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick Specialties Access */}
          <div className="mb-12">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Especialidades Recomendadas</h2>
              <Link
                href="/directorio"
                className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
              >
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {LANDING_SPECIALTIES.map((spec, idx) => {
                const IconComp = specialtyIcons[spec.iconName] || Stethoscope;
                return (
                  <motion.div
                    key={spec.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Link
                      href={`/directorio?especialidad=${encodeURIComponent(spec.name)}`}
                      className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-5 text-center shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all duration-300 group cursor-pointer"
                    >
                      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${spec.color} transition-all duration-300 group-hover:scale-110`}>
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className="text-sm font-bold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-1">
                        {spec.name}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Additional information cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">¿Cómo funciona?</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-bold text-xs">1</span>
                  <span>Filtra los médicos por especialidad, ciudad (San Miguel, Usulután, Morazán, La Unión) y experiencia.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-bold text-xs">2</span>
                  <span>Compara perfiles, lee opiniones verificadas de otros pacientes y revisa su disponibilidad.</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 font-bold text-xs">3</span>
                  <span>Contacta directamente al consultorio del médico para agendar tu consulta sin intermediarios.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Mi Perfil y Seguridad</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Tus datos de contacto están protegidos. Mantén tu información básica actualizada para que la comunicación con los doctores sea fluida y sin contratiempos.
                </p>
              </div>
              <div className="mt-6 flex gap-4">
                <Link
                  href="/configuracion"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  Ajustes de Cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
