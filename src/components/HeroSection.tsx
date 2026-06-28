'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.4, 0, 0.2, 1] as const;

const videos = [
  '/videos/consultorio.mp4',
  '/videos/doctor_writting.mp4',
  '/videos/escritorio.mp4',
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="flex min-h-screen items-center bg-white px-6 pt-16 pb-16 md:px-12 md:pt-20 lg:px-20">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-6"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-teal-600">
            Oriente de El Salvador
          </span>

          <h1
            id="hero-heading"
            className="text-5xl leading-tight font-bold text-gray-900 md:text-6xl"
          >
            Directorio Médico
            <br />
            <span className="text-teal-600">Profesional</span>
          </h1>

          <p className="max-w-md text-lg text-gray-500">
            Encuentra especialistas verificados cerca de ti.
          </p>

          <div className="mt-2 flex flex-wrap gap-4">
            <Link
              href="/directorio"
              className="group inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-600/25 active:scale-95 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              Explorar directorio
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
            <Link
              href="?auth=register"
              className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-teal-500 hover:text-teal-600 hover:shadow-md active:scale-95 active:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              ¿Eres médico? Regístrate
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="flex items-center justify-center"
        >
          <div className="relative h-[220px] w-full overflow-hidden rounded-2xl bg-gray-900 shadow-2xl ring-1 ring-gray-200 md:h-[320px] md:w-[480px]">
            <video
              key={videos[current]}
              autoPlay
              muted
              playsInline
              onEnded={() => setCurrent((prev) => (prev + 1) % videos.length)}
              className="absolute inset-0 h-full w-full object-cover"
              src={videos[current]}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
