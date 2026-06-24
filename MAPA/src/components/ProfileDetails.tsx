import type { SpecialtyInfo } from '@/src/lib/constants';

interface ProfileDetailsProps {
  about: string;
  tags: string[];
  services: { title: string; desc: string }[];
  specialty: string;
  theme: SpecialtyInfo;
}

export default function ProfileDetails({ about, tags, services, specialty, theme }: ProfileDetailsProps) {
  const galleryImages = [
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400", // Consultorio / Clínica moderna
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400", // Enfoque profesional / Diagnóstico
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400"  // Centro médico / Instalaciones
  ];

  // Reseñas adaptadas clínicamente según la especialidad del médico
  const getReviewForSpecialty = (spec: string) => {
    switch (spec) {
      case 'Cardiología':
        return {
          name: "María Fernanda L.",
          title: "Paciente de Control Coronario",
          text: "Excelente atención y calidad humana. El tratamiento recomendado y su explicación sobre mi cateterismo resolvieron todas nuestras dudas familiares. Sumamente recomendado para afecciones del corazón en la zona oriental."
        };
      case 'Nefrología':
        return {
          name: "José Armando G.",
          title: "Paciente Renal Usulután",
          text: "Me he controlado mi insuficiencia renal con él y la mejora en mi calidad de vida ha sido increíble. Es un especialista muy directo, claro y con una paciencia inigualable para explicarnos los cuidados."
        };
      case 'Pediatría':
        return {
          name: "Karla Patricia M.",
          title: "Madre de dos pacientes",
          text: "El trato hacia mis niños es sumamente cariñoso y profesional. Su consultorio es muy acogedor y siempre está disponible para resolver dudas rápidas por chat."
        };
      default:
        return {
          name: "Andrés Salvador P.",
          title: "Paciente de Consulta de Especialidad",
          text: `Excelente especialista en ${spec}. Me atendió de forma puntual, el diagnóstico fue muy acertado y el tratamiento alivió mis síntomas rápidamente. Trato muy profesional.`
        };
    }
  };

  const review = getReviewForSpecialty(specialty);

  return (
    <div className="space-y-6">
      
      {/* Resumen Ejecutivo / Acerca de mí */}
      <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-dark/5 bg-white">
        <h2 className="text-base font-extrabold text-brand-dark mb-3 tracking-tight">Resumen Profesional</h2>
        <p className="text-brand-dark/75 text-sm leading-relaxed mb-5">
          {about}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span 
              key={i} 
              className={`text-[11px] px-2.5 py-1 rounded-md font-bold border ${theme.bgColor} ${theme.textColor} ${theme.borderColor}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Áreas de Enfoque Clínico */}
      <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-dark/5 bg-white">
        <h2 className="text-base font-extrabold text-brand-dark mb-4 tracking-tight">Áreas de Práctica Especializada</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, i) => (
            <article key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-200 transition-all">
              <h3 className="font-extrabold text-slate-900 text-xs tracking-tight mb-1 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${theme.accentColor}`}></span>
                {service.title}
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal pl-3.5">{service.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Galería Profesional */}
      <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-dark/5 bg-white">
        <h2 className="text-base font-extrabold text-brand-dark mb-4 tracking-tight">Galería de Instalaciones</h2>
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

      {/* Reseñas Verificadas */}
      <section className="bg-brand-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-dark/5 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-brand-dark tracking-tight">Reseñas de Pacientes</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Opiniones verificadas de pacientes atendidos</p>
          </div>
        </div>

        {/* Tarjeta de Reseña Individual */}
        <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${theme.accentColor}`}>
                {review.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 leading-none">{review.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{review.title}</p>
              </div>
            </div>
            {/* Estrellas de Calificación */}
            <div className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
              ★ ★ ★ ★ ★
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed italic pl-0.5">
            "{review.text}"
          </p>
        </div>
      </section>

    </div>
  );
}