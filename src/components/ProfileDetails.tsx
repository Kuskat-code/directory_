import { Star } from 'lucide-react';
import type { Doctor } from '@/src/lib/constants';

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=400',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=400',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400',
];

interface ProfileDetailsProps {
  about: string;
  tags: string[];
  services: { title: string; desc: string }[];
  doctor: Doctor;
}

export default function ProfileDetails({ about, tags, services, doctor }: ProfileDetailsProps) {

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm md:p-8">
        <h2 className="mb-3 text-base font-bold text-text tracking-tight">Resumen Profesional</h2>
        <p className="mb-5 text-sm leading-relaxed text-text-muted">{about}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-[var(--radius-button)] bg-secondary px-2.5 py-1 text-[11px] font-medium text-text border border-border/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm md:p-8">
        <h2 className="mb-4 text-base font-bold text-text tracking-tight">Areas de Practica Especializada</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((service, i) => (
            <article
              key={i}
              className="rounded-[var(--radius-card)] border border-border bg-secondary/40 p-4 transition-all hover:border-primary/30 hover:bg-white"
            >
              <h3 className="mb-1 flex items-center gap-1.5 text-xs font-bold text-text tracking-tight">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {service.title}
              </h3>
              <p className="pl-3 text-[11px] leading-normal text-text-muted">{service.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm md:p-8">
        <h2 className="mb-4 text-base font-bold text-text tracking-tight">Galeria Profesional</h2>
        <div className="grid grid-cols-3 gap-3">
          {GALLERY_IMAGES.map((imgUrl, i) => (
            <div
              key={i}
              className="aspect-4/3 overflow-hidden rounded-[var(--radius-card)] border border-border/50 bg-secondary"
            >
              <img
                src={imgUrl}
                alt={`Instalacion profesional ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm md:p-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text tracking-tight">Resenas de Clientes</h2>
            <p className="mt-0.5 text-[11px] text-text-muted">
              Basado en {doctor.reviews} opiniones verificadas
            </p>
          </div>
          <button
            type="button"
            className="cursor-pointer text-xs font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Ver todas
          </button>
        </div>

        <div className="rounded-[var(--radius-card)] border border-border bg-secondary/30 p-4">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
                {doctor.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-text leading-none">Paciente Verificado</h4>
                <p className="mt-0.5 text-[10px] text-text-muted">Atencion en {doctor.specialty}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-amber-400" aria-label={`${doctor.rating} de 5 estrellas`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(doctor.rating) ? 'fill-amber-400 text-amber-400' : 'fill-border text-border'}`}
                />
              ))}
            </div>
          </div>
          <p className="pl-0.5 text-xs leading-relaxed italic text-text-muted">
            Excelente atencion y profesionalismo. El doctor me brindo un diagnostico claro y
            un tratamiento efectivo. Altamente recomendado.
          </p>
        </div>
      </section>
    </div>
  );
}
