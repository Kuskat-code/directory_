'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import type { Doctor, DoctorAvailability } from '@/src/lib/constants';
import { Badge } from '@/src/components/ui/Badge';
import { Card } from '@/src/components/ui/Card';

interface Props {
  doctor: Doctor;
  index?: number;
}

const EASE = [0.4, 0, 0.2, 1] as const;

interface SpecialtyStyle {
  bgGradient: string;
  badgeClass: string;
  buttonClass: string;
}

const SPECIALTY_STYLES: Record<string, SpecialtyStyle> = {
  'Cardiología': {
    bgGradient: 'from-rose-500/20 to-red-400/10',
    badgeClass: 'bg-red-50 text-red-600 border border-red-100/50',
    buttonClass: 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500',
  },
  'Pediatría': {
    bgGradient: 'from-sky-400/30 to-sky-200/10',
    badgeClass: 'bg-sky-50 text-sky-600 border border-sky-100/50',
    buttonClass: 'bg-[#00a3ff] hover:bg-[#008ce0] focus-visible:ring-[#00a3ff]',
  },
  'Dermatología': {
    bgGradient: 'from-amber-400/30 to-orange-200/10',
    badgeClass: 'bg-orange-50 text-orange-600 border border-orange-100/50',
    buttonClass: 'bg-[#ff7a00] hover:bg-[#e06b00] focus-visible:ring-[#ff7a00]',
  },
  'Neurología': {
    bgGradient: 'from-purple-400/30 to-purple-200/10',
    badgeClass: 'bg-purple-50 text-purple-600 border border-purple-100/50',
    buttonClass: 'bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-500',
  },
  'Psiquiatría': {
    bgGradient: 'from-indigo-400/30 to-indigo-200/10',
    badgeClass: 'bg-indigo-50 text-indigo-600 border border-indigo-100/50',
    buttonClass: 'bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-500',
  },
  'Ginecología': {
    bgGradient: 'from-pink-400/30 to-pink-200/10',
    badgeClass: 'bg-pink-50 text-pink-600 border border-pink-100/50',
    buttonClass: 'bg-pink-600 hover:bg-pink-700 focus-visible:ring-pink-500',
  },
  'Medicina General': {
    bgGradient: 'from-emerald-400/30 to-emerald-200/10',
    badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100/50',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500',
  },
};

const DEFAULT_STYLE: SpecialtyStyle = {
  bgGradient: 'from-primary/20 to-cyan-200/10',
  badgeClass: 'bg-primary/5 text-primary border border-primary/10',
  buttonClass: 'bg-primary hover:bg-primary-dark focus-visible:ring-primary',
};

function AvailabilityIndicator({ status }: { status: DoctorAvailability }) {
  const config = {
    available: { label: 'Disponible hoy', dot: 'bg-success', text: 'text-success' },
    limited: { label: 'Pocos horarios', dot: 'bg-warning', text: 'text-warning' },
    unavailable: { label: 'Sin cupos', dot: 'bg-text-muted', text: 'text-text-muted' },
  }[status ?? 'available'];

  return (
    <div className={`flex items-center justify-center gap-1.5 text-xs font-semibold ${config.text}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </div>
  );
}

export default function DoctorCard({ doctor, index = 0 }: Props) {
  const style = SPECIALTY_STYLES[doctor.specialty] ?? DEFAULT_STYLE;

  return (
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
        className="flex h-full flex-col overflow-hidden transition-shadow duration-300 transition-premium group-hover:shadow-glow bg-white"
      >
        {/* Cabecera superior de la Card */}
        <div className="h-28 w-full relative overflow-hidden">
          {doctor.coverImage ? (
            <img
              src={doctor.coverImage}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${style.bgGradient}`} />
          )}
        </div>

        {/* Cuerpo de la Card */}
        <div className="relative px-6 pb-6 pt-12 text-center flex flex-col items-center flex-1">
          {/* Avatar superpuesto */}
          <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10">
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

          <h3 className="text-lg font-bold text-text mb-1.5">{doctor.name}</h3>

          <Badge variant="default" className={style.badgeClass}>
            {doctor.specialty}
          </Badge>

          <div className="mt-4 w-full space-y-2">
            {/* Ubicación */}
            <div className="flex items-center justify-center gap-1.5 text-sm text-text-muted">
              <MapPin className="h-4 w-4 shrink-0 text-text-muted/60" aria-hidden="true" />
              <span>{doctor.location}</span>
            </div>

            {/* Disponibilidad */}
            <AvailabilityIndicator status={doctor.availability || 'available'} />

            {/* Experiencia */}
            <p className="text-xs text-text-muted">
              {doctor.experience} años de experiencia
            </p>
          </div>
        </div>

        {/* Botón inferior */}
        <div className="mt-auto border-t border-border p-4">
          <Link
            href={`/perfil?id=${doctor.id}`}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 transition-premium hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] ${style.buttonClass}`}
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            View Profile
          </Link>
        </div>
      </Card>
    </motion.article>
  );
}
