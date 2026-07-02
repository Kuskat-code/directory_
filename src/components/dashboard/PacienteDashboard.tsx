'use client'

import { useEffect, useState } from 'react'
import { getCurrentUserSession, type UserSessionData } from '@/src/features/profile/profile.actions'
import Link from 'next/link'
import { Search, User, MapPin, ArrowRight } from 'lucide-react'

const specialties = [
  { label: 'Cardiología', icon: '❤️' },
  { label: 'Pediatría', icon: '👶' },
  { label: 'Dermatología', icon: '🔬' },
  { label: 'Ginecología', icon: '🩺' },
  { label: 'Oftalmología', icon: '👁️' },
  { label: 'Odontología', icon: '🦷' },
]

export default function PacienteDashboard() {
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
          ¡Bienvenido, {user?.name?.split(' ')[0] || 'Paciente'}!
        </h1>
        <p className="mt-1 text-gray-600">
          Encuentra al especialista que necesitas y agenda tu cita médica.
        </p>
      </div>

      {/* Buscador rápido */}
      <Link
        href="/directorio"
        className="group mb-8 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-500 p-6 text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.01]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
          <Search className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold">Buscar Doctores</h2>
          <p className="text-sm text-white/80">Explora nuestro directorio de especialistas certificados</p>
        </div>
        <ArrowRight className="h-5 w-5 text-white/60 transition-all group-hover:translate-x-1" />
      </Link>

      {/* Especialidades */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-gray-900">Especialidades</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {specialties.map((spec) => (
            <Link
              key={spec.label}
              href={`/directorio?specialty=${encodeURIComponent(spec.label)}`}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-center transition-all hover:border-teal-500 hover:shadow-md"
            >
              <span className="text-2xl">{spec.icon}</span>
              <span className="text-sm font-medium text-gray-700">{spec.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Enlaces rápidos */}
      <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/directorio"
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-teal-500 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Directorio Médico</h3>
            <p className="text-xs text-gray-500">Ver todos los doctores disponibles</p>
          </div>
        </Link>
        <Link
          href="/directorio"
          className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-teal-500 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Cerca de Ti</h3>
            <p className="text-xs text-gray-500">Doctores en tu ubicación</p>
          </div>
        </Link>
      </section>
    </div>
  )
}
