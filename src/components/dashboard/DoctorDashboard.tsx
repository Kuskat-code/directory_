'use client'

import { useEffect, useState } from 'react'
import { getCurrentUserSession, type UserSessionData } from '@/src/features/profile/profile.actions'
import Link from 'next/link'
import { Settings, Eye, Edit3, TrendingUp, DollarSign, Calendar } from 'lucide-react'
import PricingSection from '@/src/components/PricingSection'

export default function DoctorDashboard() {
  const [user, setUser] = useState<UserSessionData | null>(null)

  useEffect(() => {
    async function load() {
      const res = await getCurrentUserSession()
      if (res.success && res.data) {
        setUser(res.data)
      }
    }
    void load()
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Bienvenida */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Bienvenido, {user?.name?.split(' ')[0] || 'Doctor'}!
        </h1>
        <p className="mt-1 text-gray-600">
          Gestiona tu perfil profesional y conecta con más pacientes.
        </p>
      </div>

      {/* Acciones rápidas */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href={`/perfil?id=${user?.id || ''}`}
          className="group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
            <Edit3 className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Personalizar Perfil</h2>
            <p className="text-sm text-white/80">Edita tu información, horarios y servicios</p>
          </div>
        </Link>
        <Link
          href="/configuracion"
          className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-600">
            <Settings className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">Configuración</h2>
            <p className="text-sm text-gray-500">Cambia tu contraseña y datos de acceso</p>
          </div>
        </Link>
      </div>

      {/* Estadísticas (placeholder) */}
      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Resumen</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <Eye className="mb-2 h-5 w-5 text-teal-600" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">Visitas al perfil</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <Calendar className="mb-2 h-5 w-5 text-teal-600" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">Citas agendadas</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <TrendingUp className="mb-2 h-5 w-5 text-teal-600" />
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-500">Pacientes nuevos</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <DollarSign className="mb-2 h-5 w-5 text-teal-600" />
            <p className="text-2xl font-bold text-gray-900">Free</p>
            <p className="text-xs text-gray-500">Plan actual</p>
          </div>
        </div>
      </section>

      {/* Enlace al directorio */}
      <section className="mb-8">
        <Link
          href="/directorio"
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-teal-500 hover:shadow-md"
        >
          <div>
            <h3 className="font-semibold text-gray-900">Ver Directorio Médico</h3>
            <p className="text-sm text-gray-500">Explora otros profesionales de la salud</p>
          </div>
          <span className="text-teal-600 font-medium text-sm">Ir &rarr;</span>
        </Link>
      </section>

      {/* Sección de Precios al final */}
      <section id="pricing" className="scroll-mt-24">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Planes y Precios</h2>
        <PricingSection />
      </section>
    </div>
  )
}
