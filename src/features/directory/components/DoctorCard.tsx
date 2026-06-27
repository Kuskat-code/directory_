'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import type { Doctor } from '@/src/lib/constants';
import { Badge } from '@/src/components/ui/Badge';
import { Card } from '@/src/components/ui/Card';

interface Props {
  doctor: Doctor;
  index?: number;
}

const EASE = [0.4, 0, 0.2, 1] as const;

const specialtyColors: Record<string, 'primary' | 'accent' | 'success' | 'warning'> = {
  Cardiología: 'accent',
  Pediatría: 'success',
  Dermatología: 'warning',
  Neurología: 'primary',
  Psiquiatría: 'primary',
  Ginecología: 'accent',
  'Medicina General': 'success',
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
  const badgeVariant = specialtyColors[doctor.specialty] ?? 'primary';

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
        className="flex h-full flex-col overflow-hidden transition-shadow duration-300 transition-premium group-hover:shadow-glow"
      >
        <div className="relative flex flex-col items-center px-6 pb-6 pt-8 text-center">
          <div className="relative mb-4">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/30 to-cyan-400/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-secondary bg-secondary">
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

          <h3 className="text-lg font-bold text-text">{doctor.name}</h3>

          <Badge variant={badgeVariant} className="mt-2">
            {doctor.specialty}
          </Badge>

          <div className="mt-4 w-full space-y-3">
            <div className="flex items-center justify-center gap-1.5 text-sm text-text-muted">
              <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{doctor.location}</span>
            </div>

            <AvailabilityIndicator status={doctor.availability} />

            <p className="text-xs text-text-muted">
              {doctor.experience} años de experiencia
            </p>
          </div>
        </div>

        <div className="mt-auto border-t border-border p-4">
          <Link
            href={`/perfil?id=${doctor.id}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-button)] bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 transition-premium hover:bg-primary-dark hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            View Profile
          </Link>
        </div>
      </Card>
    </motion.article>
  );
}
