'use client';

import { useState } from 'react';
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
import { EASE, LANDING_SPECIALTIES } from '@/src/lib/constants';

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

const DOUBLE_SPECIALTIES = [...LANDING_SPECIALTIES, ...LANDING_SPECIALTIES];

export default function SpecialtiesSection() {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      id="especialidades"
      aria-labelledby="specialties-heading"
      className="relative overflow-hidden bg-white px-4 py-20 md:py-28"
    >
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-infinite {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end px-4"
        >
          <div>
            <h2
              id="specialties-heading"
              className="text-heading font-bold text-text text-3xl md:text-4xl"
            >
              Especialidades médicas
            </h2>
            <p className="mt-2 text-text-muted">
              Encuentra al especialista que necesitas, organizado de forma clara y sencilla.
            </p>
          </div>
        </motion.div>

        <div
          className="relative w-full overflow-hidden py-4"
          style={{
            maskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, white 15%, white 85%, transparent)'
          }}
        >
          <div
            className="animate-marquee-infinite flex w-max gap-4 transition-all md:gap-6"
            style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {DOUBLE_SPECIALTIES.map((spec, i) => {
              const Icon = iconMap[spec.icon as keyof typeof iconMap] || Stethoscope;
              return (
                <div
                  key={`${spec.name}-${i}`}
                  className="w-[200px] md:w-[240px] shrink-0"
                >
                  <Link
                    href={`/directorio?specialty=${encodeURIComponent(spec.name)}`}
                    className="group flex flex-col items-center rounded-[var(--radius-card)] border border-border bg-white p-6 text-center shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary h-full"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-card)] bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" suppressHydrationWarning />
                    </div>
                    <span className="mt-4 text-sm font-semibold leading-snug text-text md:text-base line-clamp-2">
                      {spec.name}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
