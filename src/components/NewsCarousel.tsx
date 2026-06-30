'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
}

const NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Avances en Telemedicina y su impacto en El Salvador',
    category: 'Tecnología',
    date: '18 Jun 2026',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Nuevas herramientas digitales para clínicas independientes',
    category: 'Gestión',
    date: '12 Jun 2026',
    image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Cómo optimizar la presencia online de tu consultorio médico',
    category: 'Marketing',
    date: '5 Jun 2026',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Inteligencia artificial en el diagnóstico clínico moderno',
    category: 'Innovación',
    date: '28 May 2026',
    image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Guía para implementar un sistema de citas en línea',
    category: 'Gestión',
    date: '20 May 2026',
    image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Seguridad de datos del paciente en plataformas digitales',
    category: 'Tecnología',
    date: '14 May 2026',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=600&auto=format&fit=crop',
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const CARDS_PER_PAGE = 3;
const TOTAL_PAGES = Math.ceil(NEWS.length / CARDS_PER_PAGE);
const EASE = [0.4, 0, 0.2, 1] as const;

// ─── Slide variants (whole page slides in/out) ────────────────────────────────

const pageVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '110%' : '-110%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
    transition: { duration: 0.5, ease: EASE },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-110%' : '110%',
    opacity: 0,
    transition: { duration: 0.4, ease: EASE },
  }),
};

// ─── NewsCard ─────────────────────────────────────────────────────────────────

function NewsCard({ item, index }: { item: NewsItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm will-change-transform"
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
          {item.category}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900">
          {item.title}
        </h3>
        <div className="mt-3 flex items-center justify-between">
          <time dateTime={item.date} className="text-xs text-slate-400">
            {item.date}
          </time>
          <span className="text-xs font-medium text-teal-600">
            Leer más →
          </span>
        </div>
      </div>
    </motion.article>
  );
}

// ─── NavButton ────────────────────────────────────────────────────────────────

function NavButton({
  onClick,
  label,
  disabled,
  children,
}: {
  onClick: () => void;
  label: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

// ─── NewsCarousel ─────────────────────────────────────────────────────────────

export default function NewsCarousel() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const isPaused = useRef(false);

  const go = (dir: number) => {
    const next = (page + dir + TOTAL_PAGES) % TOTAL_PAGES;
    setDirection(dir);
    setPage(next);
  };

  // Autoplay — advances page every 5s, wraps around, pauses on hover
  useEffect(() => {
    const id = setInterval(() => {
      if (isPaused.current) return;
      setDirection(1);
      setPage((prev) => (prev + 1) % TOTAL_PAGES);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const currentCards = NEWS.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  return (
    <section
      className="relative overflow-hidden bg-white px-4 py-20 text-slate-900"
      aria-label="Últimas noticias médicas"
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Últimas noticias médicas
            </h2>
            <p className="mt-2 text-slate-500">
              Mantente al día con los avances del sector salud digital en El Salvador.
            </p>
          </div>

          {/* Arrows — top right, aligned with header */}
          <div className="flex shrink-0 items-center gap-2">
            <NavButton onClick={() => go(-1)} label="Página anterior" disabled={page === 0}>
              <ChevronLeft className="h-4 w-4" suppressHydrationWarning />
            </NavButton>
            <NavButton onClick={() => go(1)} label="Página siguiente" disabled={page === TOTAL_PAGES - 1}>
              <ChevronRight className="h-4 w-4" suppressHydrationWarning />
            </NavButton>
          </div>
        </motion.div>

        {/* ── Card grid with page slide animation ─────────────────────────── */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={page}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3"
            >
              {currentCards.map((item, i) => (
                <NewsCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Page dots ────────────────────────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-center gap-2" role="tablist">
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Página ${i + 1}`}
              onClick={() => {
                setDirection(i > page ? 1 : -1);
                setPage(i);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === page
                  ? 'h-2 w-7 bg-teal-600'
                  : 'h-2 w-2 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}