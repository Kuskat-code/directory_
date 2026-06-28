'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Activity,
  Baby,
  Brain,
  Droplets,
  Heart,
  HeartHandshake,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { LANDING_SPECIALTIES } from '@/src/lib/constants';

const EASE = [0.4, 0, 0.2, 1] as const;

const iconMap = {
  stethoscope: Stethoscope,
  heart: Heart,
  baby: Baby,
  brain: Brain,
  activity: Activity,
  droplets: Droplets,
  sparkles: Sparkles,
  'heart-handshake': HeartHandshake,
} as const;

export default function SpecialtiesSection() {
  return (
    <section
      id="especialidades"
      aria-labelledby="specialties-heading"
      className="bg-white px-4 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          id="specialties-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-heading text-center font-bold text-text"
        >
          Especialidades médicas
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-base text-text-muted">
          Encuentra al especialista que necesitas, organizado de forma clara y sencilla.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {LANDING_SPECIALTIES.map((spec, i) => {
            const Icon = iconMap[spec.icon];
            return (
              <motion.div
                key={spec.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
              >
                <Link
                  href={`/directorio?specialty=${encodeURIComponent(spec.name)}`}
                  className="group flex flex-col items-center rounded-[var(--radius-card)] border border-border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-card)] bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <span className="mt-4 text-sm font-semibold leading-snug text-text md:text-base">
                    {spec.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
