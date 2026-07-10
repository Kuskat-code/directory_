'use client';

import { motion } from 'framer-motion';
import { SectionContainer } from '@/src/components/ui/SectionContainer';
import { EASE } from '@/src/lib/constants';
import { Card } from '@/src/components/ui/Card';

function DirectoryIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true" suppressHydrationWarning>
      <rect x="8" y="12" width="48" height="40" rx="8" className="fill-secondary stroke-primary" strokeWidth="2" />
      <circle cx="24" cy="28" r="6" className="fill-primary/20 stroke-primary" strokeWidth="2" />
      <path d="M36 26h16M36 32h12M36 38h14" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 44h48" className="stroke-primary/30" strokeWidth="2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true" suppressHydrationWarning>
      <circle cx="28" cy="28" r="16" className="fill-secondary stroke-primary" strokeWidth="2" />
      <path d="M40 40l14 14" className="stroke-accent" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 28h12M28 22v12" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TrustIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true" suppressHydrationWarning>
      <path d="M32 8l20 8v16c0 12-8 22-20 24-12-2-20-12-20-24V16l20-8z" className="fill-secondary stroke-primary" strokeWidth="2" />
      <path d="M24 32l6 6 12-14" className="stroke-success" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const features = [
  {
    icon: DirectoryIcon,
    title: 'Directorio verificado',
    desc: 'Accede a cientos de médicos certificados en todas las especialidades de El Salvador.',
  },
  {
    icon: SearchIcon,
    title: 'Búsqueda inteligente',
    desc: 'Filtra por especialidad, ubicación y valoraciones para encontrar al especialista ideal.',
  },
  {
    icon: TrustIcon,
    title: 'Confianza garantizada',
    desc: 'Reseñas auténticas, perfiles completos y disponibilidad en tiempo real para decidir con seguridad.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function FeaturesSection() {
  return (
    <>
      <SectionContainer aria-labelledby="features-heading">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 id="features-heading" className="text-heading font-bold text-text">
            Salud de confianza, tecnología moderna
          </h2>
          <p className="text-subheading mt-4 text-text-muted">
            La plataforma médica más completa de El Salvador, diseñada para pacientes exigentes y profesionales de excelencia.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={cardVariants} whileHover={{ y: -6, scale: 1.01 }}>
                <Card
                  hoverable
                  className="group h-full border-secondary/80 bg-gradient-to-b from-white to-secondary/30"
                >
                  <div className="mb-5 transition-transform duration-300 transition-premium group-hover:scale-110">
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold text-text">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">{feature.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </SectionContainer>
    </>
  );
}

