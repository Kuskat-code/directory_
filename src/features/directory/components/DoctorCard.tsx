'use client';
import { motion } from 'framer-motion';
import type { Doctor } from '@/src/lib/constants';

interface Props {
  doctor: Doctor;
  index?: number;
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <span className="inline-flex items-center gap-0.5 text-yellow-400" aria-label={`${rating} estrellas`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <span key={i} className="text-sm">★</span>;
        if (i === full && hasHalf) return <span key={i} className="text-sm">★</span>;
        return <span key={i} className="text-sm text-gray-300">★</span>;
      })}
    </span>
  );
}

export default function DoctorCard({ doctor, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow p-6 flex flex-col items-center text-center"
    >
      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-4 ring-2 ring-gray-100">
        <img
          src={doctor.avatar}
          alt={doctor.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
      <p className="text-sm text-brand-accent font-medium mt-0.5">{doctor.specialty}</p>

      <div className="flex items-center gap-2 mt-3">
        <StarRating rating={doctor.rating} />
        <span className="text-sm font-medium text-gray-700">{doctor.rating}</span>
        <span className="text-xs text-gray-400">({doctor.reviews})</span>
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
        <span>📍</span>
        <span>{doctor.location}</span>
      </div>

      <p className="text-xs text-gray-400 mt-1">{doctor.experience} años de experiencia</p>

      <button className="mt-4 w-full py-2.5 px-4 bg-brand-teal text-white text-sm font-medium rounded-xl hover:brightness-110 transition-all active:scale-[0.98]">
        Ver perfil
      </button>
    </motion.div>
  );
}
