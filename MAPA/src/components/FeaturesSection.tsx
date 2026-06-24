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
    <section className="py-20 px-4 bg-slate-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-4"
        >
          ¿Por qué DirectorioPro?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-500 text-center max-w-2xl mx-auto mb-12 font-medium"
        >
          La plataforma más directa y confiable para encontrar profesionales en la zona oriental de El Salvador
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
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-150 hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
