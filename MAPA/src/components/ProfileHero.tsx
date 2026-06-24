import type { SpecialtyInfo } from '@/src/lib/constants';

interface ProfileHeroProps {
  name: string;
  title: string;
  location: string;
  experience: string;
  rating: string;
  reviewsCount: number;
  avatar: string;
  theme: SpecialtyInfo;
}

export default function ProfileHero({ 
  name, 
  title, 
  location, 
  experience, 
  rating, 
  reviewsCount,
  avatar,
  theme
}: ProfileHeroProps) {
  return (
    <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-dark/5 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left bg-white">
      {/* Avatar personalizado */}
      <div className="w-28 h-28 bg-slate-100 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0">
        <img 
          src={avatar} 
          alt={name} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight">{name}</h1>
          <span className="text-brand-accent text-xl font-bold" title="Perfil Verificado">✓</span>
        </div>
        
        {/* Color de especialidad dinámico */}
        <p className={`font-semibold mt-1 text-sm md:text-base ${theme.textColor}`}>
          {title}
        </p>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mt-4 text-xs text-brand-dark/60 font-semibold">
          <span className="flex items-center gap-1">📍 {location}</span>
          <span className="flex items-center gap-1">💼 {experience}</span>
          <span className="flex items-center gap-1">⭐ {rating} ({reviewsCount} Reseñas)</span>
        </div>
      </div>
    </section>
  );
}