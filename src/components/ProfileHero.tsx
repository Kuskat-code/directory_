import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';
import type { Doctor } from '@/src/lib/constants';

interface ProfileHeroProps {
  doctor: Doctor;
}

export default function ProfileHero({ doctor }: ProfileHeroProps) {
  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm md:p-8">
      <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/30 to-cyan-400/30 opacity-60 blur-md" />
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-surface ring-2 ring-secondary bg-secondary shadow-md">
            <Image
              src={doctor.avatar}
              alt={doctor.name}
              width={112}
              height={112}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-center gap-2 md:justify-start">
            <h1 className="text-2xl font-bold text-text tracking-tight">{doctor.name}</h1>
            <span className="text-accent text-lg" title="Perfil Verificado">&#10003;</span>
          </div>
          <p className="mt-1 text-sm font-medium text-primary md:text-base">{doctor.specialty}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-medium text-text-muted md:justify-start">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {doctor.location}
            </span>
            <span className="flex items-center gap-1">{doctor.experience} anos de experiencia</span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              {doctor.rating.toFixed(1)} ({doctor.reviews} Resenas)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
