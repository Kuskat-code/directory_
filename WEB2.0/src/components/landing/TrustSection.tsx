'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TRUST_POINTS } from '@/src/lib/constants';

const EASE = [0.4, 0, 0.2, 1] as const;

export default function TrustSection() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="border-t border-border bg-white px-4 py-20 md:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          id="trust-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-heading font-bold text-text"
        >
          Un directorio en el que puede confiar
        </motion.h2>
        <p className="mt-4 text-base text-text-muted">
          Información clara, médicos reales y contacto directo. Sin complicaciones.
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2" role="list">
          {TRUST_POINTS.map((point, i) => (
            <motion.li
              key={point}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-border bg-secondary px-5 py-4 text-left"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="text-base font-medium text-text">{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
