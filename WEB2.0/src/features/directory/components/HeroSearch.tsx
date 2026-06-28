'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE = [0.4, 0, 0.2, 1] as const;

interface HeroSearchProps {
  videoSrc?: string;
}

export default function HeroSearch({ videoSrc = '/videos/doctor_writting.mp4' }: HeroSearchProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-4 pb-24 pt-28"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 bg-slate-900/65"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-display font-bold text-white"
        >
          Encuentra especialistas médicos de confianza en Oriente
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
          className="text-subheading mx-auto mt-6 max-w-2xl text-white/90"
        >
          Cardiólogos, pediatras, nefrólogos, psicólogos y más profesionales de salud en un solo lugar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: EASE }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/directorio"
            className="inline-flex min-w-[200px] items-center justify-center rounded-[var(--radius-button)] bg-white px-8 py-3.5 text-base font-semibold text-text shadow-md transition-all duration-300 transition-premium hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Explorar Directorio
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-w-[200px] items-center justify-center rounded-[var(--radius-button)] bg-primary px-8 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-300 transition-premium hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Soy Médico
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
