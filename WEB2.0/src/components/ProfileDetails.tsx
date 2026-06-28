interface ProfileDetailsProps {
  about: string;
  tags: string[];
  services: { title: string; desc: string }[];
}

export default function ProfileDetails({ about, tags, services }: ProfileDetailsProps) {
  // Datos simulados para la galería basados en la imagen dada
  const galleryImages = [
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400", // Consultorio / Clínica moderna
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400", // Enfoque profesional / Diagnóstico
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400"  // Centro médico / Instalaciones
  ];

  return (
    <div className="space-y-6">
      
      {/* Resumen Ejecutivo / Acerca de mí */}
      <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-dark/5">
        <h2 className="text-base font-bold text-brand-dark mb-3 tracking-tight">Resumen Profesional</h2>
        <p className="text-brand-dark/75 text-sm leading-relaxed mb-5">
          Especialista enfocado en el diagnóstico avanzado y abordajes mínimamente invasivos. Interconsultor activo para casos complejos y colaboración clínica interinstitucional.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span key={i} className="bg-slate-100 text-slate-700 text-[11px] px-2.5 py-1 rounded-md font-medium border border-slate-200/60">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Áreas de Enfoque Clínico (Antes Servicios) */}
      <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-dark/5">
        <h2 className="text-base font-bold text-brand-dark mb-4 tracking-tight">Áreas de Práctica Especializada</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, i) => (
            <article key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-200 transition-all">
              <h3 className="font-bold text-slate-900 text-xs tracking-tight mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                {service.title}
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal pl-3">{service.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* NUEVA SECCIÓN: Galería Profesional */}
      <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-dark/5">
        <h2 className="text-base font-bold text-brand-dark mb-4 tracking-tight">Galería Profesional</h2>
        <div className="grid grid-cols-3 gap-3">
          {galleryImages.map((imgUrl, i) => (
            <div key={i} className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50">
              <img 
                src={imgUrl} 
                alt={`Instalación profesional ${i + 1}`} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* NUEVA SECCIÓN: Reseñas Verificadas */}
      <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-xs border border-brand-dark/5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-brand-dark tracking-tight">Reseñas de Clientes</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Basado en 120 opiniones verificadas</p>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
            Ver todas
          </button>
        </div>

        {/* Tarjeta de Reseña Individual */}
        <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-brand-white font-bold text-xs shadow-xs">
                M
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-none">María Fernanda L.</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Directora de Operaciones, TechCorp</p>
              </div>
            </div>
            {/* Estrellas de Calificación */}
            <div className="flex items-center gap-0.5 text-amber-400 text-xs">
              ★ ★ ★ ★ ★
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed italic pl-0.5">
            "El Dr. Ayala nos asesoró de manera impecable durante nuestra reciente ronda de inversión. Su atención al detalle y capacidad para negociar términos complejos fueron fundamentales para el éxito del proceso. Totalmente recomendado para temas corporativos de alto nivel."
          </p>
        </div>
      </section>

    </div>
  );
}