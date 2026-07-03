'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Crown, MapPin, Stethoscope } from 'lucide-react';
import type { Doctor } from '@/src/lib/constants';
import { Card } from '@/src/components/ui/Card';
import AppointmentModal from '@/src/components/AppointmentModal';
import { EASE } from '@/src/lib/constants';
import type { AppointmentData } from '@/src/components/AppointmentModal';

interface Props {
  doctor: Doctor;
  index?: number;
}

const SPECIALTY_COLORS: Record<string, { bg: string; text: string; button: string; gradientFrom: string; gradientTo: string }> = {
  'Medicina General': { bg: 'bg-green-100', text: 'text-green-700', button: 'bg-green-600 hover:bg-green-700', gradientFrom: '#bbf7d0', gradientTo: '#dcfce7' },
  'Cardiología': { bg: 'bg-red-100', text: 'text-red-700', button: 'bg-red-600 hover:bg-red-700', gradientFrom: '#fecaca', gradientTo: '#fee2e2' },
  'Dermatología': { bg: 'bg-orange-100', text: 'text-orange-700', button: 'bg-orange-500 hover:bg-orange-600', gradientFrom: '#fdba74', gradientTo: '#fed7aa' },
  'Pediatría': { bg: 'bg-sky-100', text: 'text-sky-700', button: 'bg-sky-500 hover:bg-sky-600', gradientFrom: '#7dd3fc', gradientTo: '#bae6fd' },
  'Psiquiatría': { bg: 'bg-violet-100', text: 'text-violet-700', button: 'bg-violet-600 hover:bg-violet-700', gradientFrom: '#c4b5fd', gradientTo: '#ddd6fe' },
  'Neurología': { bg: 'bg-indigo-100', text: 'text-indigo-700', button: 'bg-indigo-600 hover:bg-indigo-700', gradientFrom: '#a5b4fc', gradientTo: '#c7d2fe' },
  'Oftalmología': { bg: 'bg-blue-100', text: 'text-blue-700', button: 'bg-blue-600 hover:bg-blue-700', gradientFrom: '#93c5fd', gradientTo: '#bfdbfe' },
  'Otorrinolaringología': { bg: 'bg-yellow-100', text: 'text-yellow-700', button: 'bg-yellow-500 hover:bg-yellow-600', gradientFrom: '#fde68a', gradientTo: '#fef9c3' },
  'Gastroenterología': { bg: 'bg-lime-100', text: 'text-lime-700', button: 'bg-lime-600 hover:bg-lime-700', gradientFrom: '#d9f99d', gradientTo: '#ecfccb' },
  'Ortopedia': { bg: 'bg-slate-100', text: 'text-slate-700', button: 'bg-slate-600 hover:bg-slate-700', gradientFrom: '#cbd5e1', gradientTo: '#e2e8f0' },
  'Ginecología': { bg: 'bg-pink-100', text: 'text-pink-700', button: 'bg-pink-500 hover:bg-pink-600', gradientFrom: '#f9a8d4', gradientTo: '#fbcfe8' },
  'Urología': { bg: 'bg-amber-100', text: 'text-amber-700', button: 'bg-amber-500 hover:bg-amber-600', gradientFrom: '#fde68a', gradientTo: '#fef3c7' },
};

function AvailabilityIndicator({ status }: { status: Doctor['availability'] }) {
  const config = {
    available: { label: 'Disponible hoy', dot: 'bg-success', text: 'text-success' },
    limited: { label: 'Pocos horarios', dot: 'bg-warning', text: 'text-warning' },
    unavailable: { label: 'Sin cupos', dot: 'bg-text-muted', text: 'text-text-muted' },
  }[status ?? 'available'];

  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium ${config.text}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </div>
  );
}

export default function DoctorCard({ doctor, index = 0 }: Props) {
  const [showAppointment, setShowAppointment] = useState(false);
  const specialtyColor = SPECIALTY_COLORS[doctor.specialty] ?? { bg: 'bg-teal-100', text: 'text-teal-700', button: 'bg-teal-600 hover:bg-teal-700', gradientFrom: '#ccfbf1', gradientTo: '#e6fffa' };

  const handleAppointmentConfirm = (data: AppointmentData) => {
    console.log('Cita agendada:', data);
  };

  return (
    <>
      <AppointmentModal
        isOpen={showAppointment}
        doctorName={doctor.name}
        specialty={doctor.specialty}
        onClose={() => setShowAppointment(false)}
        onConfirm={handleAppointmentConfirm}
      />
      <motion.article
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: index * 0.06, ease: EASE }}
        whileHover={{ y: -6, scale: 1.01 }}
        className="group h-full"
      >
        <Card
          hoverable
          padding="none"
          className="flex h-full flex-col overflow-hidden transition-shadow duration-300 transition-premium group-hover:shadow-glow"
        >
          {/* Header: cover image (premium) or gradient (free) */}
          <div className="relative h-30 overflow-hidden">
            {doctor.isPremium && doctor.coverImage ? (
              <>
                <Image
                  src={doctor.coverImage}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 31vw, (min-width: 768px) 45vw, 92vw"
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />
                <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-amber-400/90 px-2 py-0.5 text-[10px] font-bold text-amber-900 shadow-sm backdrop-blur-sm">
                  <Crown className="h-3 w-3" />
                  Premium
                </div>
              </>
            ) : (
              <div
                className="h-full w-full"
                style={{
                  background: `linear-gradient(135deg, ${specialtyColor.gradientFrom} 0%, ${specialtyColor.gradientTo} 100%)`,
                }}
              />
            )}
          </div>

          {/* Content: avatar + info */}
          <div className="relative z-10 -mt-10 flex flex-col items-center px-6 pb-4 text-center">
            <div className="relative mb-3">
              <div className={`absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100 ${doctor.isPremium ? 'bg-white/40' : 'bg-gradient-to-br from-primary/30 to-cyan-400/30'}`} />
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-secondary shadow-md">
                <Image
                  src={doctor.avatar}
                  alt={`Foto de ${doctor.name}`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>

            <h3 className="text-base font-bold text-text">{doctor.name}</h3>

            <span
              className={`mt-1.5 inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-0.5 text-[11px] font-semibold ${specialtyColor.bg} ${specialtyColor.text}`}
            >
              <Stethoscope className="h-3 w-3" aria-hidden="true" />
              {doctor.specialty}
            </span>

            <div className="mt-3 w-full space-y-2">
              <div className="flex items-center justify-center gap-1 text-xs text-text-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span>{doctor.location}</span>
              </div>

              <AvailabilityIndicator status={doctor.availability} />

              <p className="text-[11px] text-text-muted">
                {doctor.experience} años de experiencia
              </p>
            </div>
          </div>

          <div className="mt-auto flex gap-2 border-t border-border p-3">
            <button
              type="button"
              onClick={() => setShowAppointment(true)}
              className={`flex-1 rounded-[var(--radius-button)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98] ${specialtyColor.button}`}
            >
              Agendar Cita
            </button>
            <Link
              href={`/perfil?id=${doctor.id}`}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-button)] border border-border px-3 py-2 text-xs font-semibold text-text-muted transition-all hover:border-primary/50 hover:text-primary active:scale-[0.98]`}
            >
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Ver Perfil
            </Link>
          </div>
        </Card>
      </motion.article>
    </>
  );
}
