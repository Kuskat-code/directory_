'use client';
import { motion } from 'framer-motion';

const features = [
  {
    icon: '📋',
    title: 'Directorio Completo',
    desc: 'Accede a una amplia base de profesionales verificados en todas las especialidades.',
  },
  {
    icon: '🔍',
    title: 'Búsqueda Inteligente',
    desc: 'Encuentra al profesional ideal con filtros avanzados por especialidad, ubicación y más.',
  },
  {
    icon: '🤝',
    title: 'Conexión Directa',
    desc: 'Conecta directamente con los profesionales y agenda citas de forma sencilla.',
  },
];

const stats = [
  { value: '500+', label: 'Profesionales' },
  { value: '15+', label: 'Especialidades' },
  { value: '98%', label: 'Satisfacción' },
  { value: '1K+', label: 'Clientes' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function FeaturesSection() {
  return (
    <>
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4"
          >
            ¿Por qué DirectorioPro?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-500 text-center max-w-2xl mx-auto mb-12"
          >
            La plataforma más confiable para encontrar profesionales en El Salvador
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{s.value}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
