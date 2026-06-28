'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BadgeCheck, MapPin, MessageCircle } from 'lucide-react';
import { EXAMPLE_DOCTORS, FEATURED_DOCTOR_IDS } from '@/src/lib/constants';

const EASE = [0.4, 0, 0.2, 1] as const;

function whatsAppUrl(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

export default function FeaturedDoctorsSection() {
  const doctors = FEATURED_DOCTOR_IDS.map((id) =>
    EXAMPLE_DOCTORS.find((d) => d.id === id),
  ).filter(Boolean);

  return (
    <section
      id="medicos"
      aria-labelledby="doctors-heading"
      className="bg-secondary px-4 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          id="doctors-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="text-heading text-center font-bold text-text"
        >
          Médicos destacados
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-base text-text-muted">
          Conoce a los especialistas que forman parte de nuestro directorio.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor, i) => {
            if (!doctor) return null;
            const isVerified = doctor.verified !== false;

            return (
              <motion.article
                key={doctor.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
                className="flex flex-col rounded-[var(--radius-card)] border border-border bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-secondary">
                    <Image
                      src={doctor.avatar}
                      alt={`Foto de ${doctor.name}`}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-text">{doctor.name}</h3>
                    <p className="mt-0.5 text-sm font-medium text-primary">{doctor.specialty}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
                      <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {doctor.location}
                    </div>
                  </div>
                </div>

                {isVerified && (
                  <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-[9999px] bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Médico verificado
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={whatsAppUrl(doctor.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-success px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-success/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                  <Link
                    href={`/perfil?id=${doctor.id}`}
                    className="inline-flex flex-1 items-center justify-center rounded-[var(--radius-button)] border border-border px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Ver perfil
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/directorio"
            className="inline-flex items-center justify-center rounded-[var(--radius-button)] bg-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Ver todos los especialistas
          </Link>
        </div>
      </div>
    </section>
  );
}
