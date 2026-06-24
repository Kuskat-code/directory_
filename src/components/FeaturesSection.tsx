'use client';

import { motion } from 'framer-motion';
import { SectionContainer } from '@/src/components/ui/SectionContainer';
import { Card } from '@/src/components/ui/Card';

const EASE = [0.4, 0, 0.2, 1] as const;

function DirectoryIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true">
      <rect x="8" y="12" width="48" height="40" rx="8" className="fill-secondary stroke-primary" strokeWidth="2" />
      <circle cx="24" cy="28" r="6" className="fill-primary/20 stroke-primary" strokeWidth="2" />
      <path d="M36 26h16M36 32h12M36 38h14" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 44h48" className="stroke-primary/30" strokeWidth="2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true">
      <circle cx="28" cy="28" r="16" className="fill-secondary stroke-primary" strokeWidth="2" />
      <path d="M40 40l14 14" className="stroke-accent" strokeWidth="3" strokeLinecap="round" />
      <path d="M22 28h12M28 22v12" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TrustIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" aria-hidden="true">
      <path d="M32 8l20 8v16c0 12-8 22-20 24-12-2-20-12-20-24V16l20-8z" className="fill-secondary stroke-primary" strokeWidth="2" />
      <path d="M24 32l6 6 12-14" className="stroke-success" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const features = [
  {
    icon: DirectoryIcon,
    title: 'Directorio verificado',
    desc: 'Accede a cientos de medicos certificados en todas las especialidades de El Salvador.',
  },
  {
    icon: SearchIcon,
    title: 'Busqueda inteligente',
    desc: 'Filtra por especialidad, ubicacion y valoraciones para encontrar al especialista ideal.',
  },
  {
    icon: TrustIcon,
    title: 'Confianza garantizada',
    desc: 'Resenas autenticas, perfiles completos y disponibilidad en tiempo real para decidir con seguridad.',
  },
];

const stats = [
  { value: '500+', label: 'Especialistas' },
  { value: '15+', label: 'Especialidades' },
  { value: '98%', label: 'Satisfaccion' },
  { value: '10K+', label: 'Pacientes' },
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
            Salud de confianza, tecnologia moderna
          </h2>
          <p className="text-subheading mt-4 text-text-muted">
            La plataforma medica mas completa de El Salvador, disenada para pacientes exigentes y profesionales de excelencia.
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

      <section
        aria-label="Estadisticas de la plataforma"
        className="gradient-primary px-4 py-16 md:py-20"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-white md:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-white/75">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

