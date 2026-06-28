'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Search, UserCircle } from 'lucide-react';

const EASE = [0.4, 0, 0.2, 1] as const;

const cards = [
  {
    icon: Search,
    title: 'Encontrar especialistas',
    desc: 'Busca médicos por especialidad y ubicación.',
  },
  {
    icon: MessageCircle,
    title: 'Contacto inmediato',
    desc: 'Conecta directamente por WhatsApp.',
  },
  {
    icon: UserCircle,
    title: 'Perfiles profesionales',
    desc: 'Conoce experiencia, horarios y servicios.',
  },
];

export default function ValuePropositionSection() {
  return (
    <section
      id="por-que"
      aria-labelledby="value-heading"
      className="bg-white px-4 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          id="value-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-heading text-center font-bold text-text"
        >
          ¿Por qué usar MedDirectorio?
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
                className="text-center"
              >
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[var(--radius-card)] bg-secondary text-primary">
                  <Icon className="h-10 w-10" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-text">{card.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-text-muted">{card.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
