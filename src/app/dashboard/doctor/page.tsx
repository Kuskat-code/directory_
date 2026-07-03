'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Eye, Calendar, Sparkles, Settings, ArrowRight, Stethoscope, Loader2 } from 'lucide-react';
import { type UserSessionData } from '@/src/features/profile/profile.actions';
import { getCachedUserSession } from '@/src/lib/session-cache';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import PricingSection from '@/src/components/PricingSection';

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const response = await getCachedUserSession();
      if (response.success && response.data && (response.data.role === 'doctor' || response.data.role === 'admin')) {
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

  const stats = [
    { label: 'Visitas al Perfil', value: '142', icon: Eye, color: 'text-blue-600 bg-blue-50' },
    { label: 'Próximas Citas', value: '8', icon: Calendar, color: 'text-teal-600 bg-teal-50' },
    { label: 'Plan Activo', value: 'Free', icon: Sparkles, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50/50 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          {/* Welcome Block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 p-6 md:p-10 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
              <Stethoscope className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200">
                Panel Profesional
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                ¡Bienvenido, Dr. {user.name.replace(/^Dr\.\s+/i, '')}!
              </h1>
              <p className="mt-2 text-lg text-teal-100">
                Gestiona tu consultorio, actualiza tus horarios de atención y atrae a más pacientes en El Salvador.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href={`/perfil?id=${user.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-500 px-5 py-3 font-semibold text-white transition-all hover:bg-teal-400 active:scale-95 shadow-md"
                >
                  <User className="h-5 w-5" />
                  Personalizar mi Perfil
                </Link>
                <Link
                  href="/configuracion"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/10 px-5 py-3 font-semibold text-white hover:bg-white/20 transition-all active:scale-95 border border-white/20"
                >
                  <Settings className="h-5 w-5" />
                  Cuenta
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Interactive Features panel */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-12">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Lista de Verificación de tu Perfil</h3>
              <ul className="space-y-4 text-sm text-gray-600">
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">✓</span>
                  <span>Registro y verificación de correo electrónico.</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-xs">ℹ</span>
                  <span className="flex-1">Sube tu foto de perfil profesional y banner de portada en el editor de perfil.</span>
                  <Link href={`/perfil?id=${user.id}`} className="text-teal-600 font-semibold hover:underline">Ir</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-xs">ℹ</span>
                  <span className="flex-1">Agrega tu dirección de consultorio, horarios de atención y rango de precios.</span>
                  <Link href={`/perfil?id=${user.id}`} className="text-teal-600 font-semibold hover:underline">Ir</Link>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Aumenta tu Visibilidad</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ¿Quieres destacar en las búsquedas de tu departamento? El plan Pro te permite enlazar tu WhatsApp directo, habilitar agenda interactiva y aparecer en los primeros lugares del directorio.
                </p>
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => document.getElementById('pricing-plans-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 transition-all cursor-pointer"
                >
                  Ver planes de suscripción
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section Embedded */}
        <div id="pricing-plans-section" className="border-t border-gray-100 bg-white">
          <PricingSection />
        </div>
      </div>
      <Footer />
    </>
  );
}
