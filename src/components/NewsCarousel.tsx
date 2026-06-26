'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

const NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Avances en Telemedicina y su impacto en El Salvador',
    excerpt:
      'La telemedicina está transformando el acceso a la salud en zonas rurales y periurbanas, reduciendo tiempos de espera y costos para los pacientes.',
    category: 'Tecnología Médica',
    date: '18 Jun 2026',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Nuevas herramientas digitales para la gestión de clínicas independientes',
    excerpt:
      'Los sistemas de gestión integrada están cambiando la eficiencia clínica, permitiendo a los médicos dedicar más tiempo a sus pacientes y menos a la administración.',
    category: 'Gestión Clínica',
    date: '12 Jun 2026',
    image:
      'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Cómo optimizar la presencia online de tu consultorio médico',
    excerpt:
      'Una estrategia digital sólida marca la diferencia entre un consultorio con agenda llena y uno que no llega a los pacientes que más lo necesitan.',
    category: 'Marketing Digital',
    date: '5 Jun 2026',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=900&auto=format&fit=crop',
  },
];

const EASE = [0.4, 0, 0.2, 1] as const;

// ─── Slide variants ───────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 340 : -340,
    opacity: 0,
    filter: 'blur(6px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: EASE },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -340 : 340,
    opacity: 0,
    filter: 'blur(6px)',
    transition: { duration: 0.35, ease: EASE },
  }),
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewsCarousel() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = NEWS.length;

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + total) % total);
  };

  const current = NEWS[index];

  return (
    <section
      className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white"
      aria-label="Últimas noticias médicas"
    >
      {/* Spherical blue glow — positioned left for visual interest */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/2 z-0 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue-500/[0.15] blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* ── Section header ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-10 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
            Novedades
          </span>
          <h2 className="text-4xl font-bold text-white">
            Últimas noticias médicas
          </h2>
          <p className="mt-3 text-slate-400">
            Mantente al día con los avances del sector salud digital en El Salvador.
          </p>
        </motion.div>

        {/* ── Carousel ───────────────────────────────────────────────────── */}
        <div className="relative flex items-center gap-4">
          {/* Left arrow */}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Noticia anterior"
            className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-800 text-slate-300 transition-all hover:border-blue-500 hover:text-blue-400"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Card stage */}
          <div className="relative min-h-[420px] flex-1 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.article
                key={current.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                whileHover={{ y: -6 }}
                className="w-full cursor-pointer overflow-hidden rounded-3xl border border-slate-700/50 bg-white shadow-lg shadow-black/30 transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden sm:h-64">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  {/* Category badge over image */}
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm shadow-sm">
                    {current.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8">
                  <h3 className="mb-3 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
                    {current.title}
                  </h3>
                  <p className="mb-5 text-sm leading-relaxed text-slate-500">
                    {current.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <time
                      dateTime={current.date}
                      className="text-xs font-medium text-slate-400"
                    >
                      {current.date}
                    </time>
                    <span className="text-xs font-semibold text-blue-600 hover:underline">
                      Leer más →
                    </span>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Siguiente noticia"
            className="z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-800 text-slate-300 transition-all hover:border-blue-500 hover:text-blue-400"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* ── Dot indicators ─────────────────────────────────────────────── */}
        <div className="mt-6 flex items-center justify-center gap-2" role="tablist">
          {NEWS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Ir a noticia ${i + 1}`}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === index
                  ? 'h-2 w-7 bg-blue-500'
                  : 'h-2 w-2 bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
