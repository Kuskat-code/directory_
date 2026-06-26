'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import type { Doctor } from '@/src/lib/constants';
import { SPECIALTIES_THEMES } from '@/src/lib/constants';

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
        if (i < full) return <span key={i} className="text-xs">★</span>;
        if (i === full && hasHalf) return <span key={i} className="text-xs">★</span>;
        return <span key={i} className="text-xs text-gray-200">★</span>;
      })}
    </span>
  );
}

export default function DoctorCard({ doctor, index = 0 }: Props) {
  const router = useRouter();

  // Obtener el tema cromático según la especialidad del médico (psicología del color)
  const theme = SPECIALTIES_THEMES[doctor.specialty] || SPECIALTIES_THEMES['Medicina General'];

  const handleViewProfile = () => {
    router.push(`/perfil?id=${doctor.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col items-center text-center bg-white"
    >
      {/* Avatar circular con borde sutil */}
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 mb-4 ring-2 ring-slate-100 shadow-sm shrink-0">
        <img
          src={doctor.avatar}
          alt={doctor.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <h3 className="text-lg font-bold text-gray-900 leading-snug">{doctor.name}</h3>
      
      {/* Badge de Especialidad con color de psicología dinámico */}
      <span className={`text-[10px] font-extrabold mt-1.5 px-3 py-1 rounded-full border ${theme.bgColor} ${theme.textColor} ${theme.borderColor}`}>
        {doctor.specialty}
      </span>

      <div className="flex items-center gap-2 mt-3">
        <StarRating rating={doctor.rating} />
        <span className="text-xs font-bold text-gray-700">{doctor.rating}</span>
        <span className="text-[10px] text-gray-400 font-semibold">({doctor.reviews} reseñas)</span>
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 font-medium">
        <span>📍</span>
        <span>{doctor.location}</span>
      </div>

      <p className="text-[10px] text-gray-400 font-semibold mt-1">{doctor.experience} años de experiencia</p>

      {/* Botón dinámico según el tema del doctor */}
      <button 
        onClick={handleViewProfile}
        className={`mt-4 w-full py-2.5 px-4 text-white text-xs font-bold rounded-xl transition-all hover:brightness-110 active:scale-[0.97] cursor-pointer shadow-sm ${theme.accentColor}`}
      >
        Ver perfil
      </button>
    </motion.div>
  );
}
