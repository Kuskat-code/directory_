interface ProfileHeroProps {
  name: string;
  title: string;
  location: string;
  experience: string;
  rating: string;
  reviewsCount: number;
}

export default function ProfileHero({ name, title, location, experience, rating, reviewsCount }: ProfileHeroProps) {
  return (
    <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-dark/5 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
      <div className="w-28 h-28 bg-slate-200 rounded-xl overflow-hidden border-2 border-brand-white shadow-md shrink-0">
        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256" alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <h1 className="text-2xl font-bold text-brand-dark tracking-tight">{name}</h1>
          <span className="text-brand-accent text-lg" title="Perfil Verificado">✓</span>
        </div>
        <p className="text-brand-teal font-medium mt-1 text-sm md:text-base">{title}</p>
        <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mt-4 text-xs text-brand-dark/60 font-medium">
          <span className="flex items-center gap-1">📍 {location}</span>
          <span className="flex items-center gap-1">💼 {experience}</span>
          <span className="flex items-center gap-1">⭐ {rating} ({reviewsCount} Reseñas)</span>
        </div>
      </div>
    </section>
  );
}