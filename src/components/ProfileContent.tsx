'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { EXAMPLE_DOCTORS } from '@/src/lib/constants';
import ProfileHero from './ProfileHero';
import ProfileDetails from './ProfileDetails';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  const doctor = useMemo(
    () => EXAMPLE_DOCTORS.find((d) => d.id === doctorId) ?? EXAMPLE_DOCTORS[0],
    [doctorId],
  );

  const services = [
    {
      title: 'Consulta Especializada',
      desc: `Atencion medica personalizada con enfasis en diagnostico preciso y plan de tratamiento integral.`,
    },
    {
      title: 'Diagnostico Avanzado',
      desc: 'Evaluacion completa utilizando tecnologia de punta para resultados precisos y confiables.',
    },
    {
      title: 'Seguimiento Continuo',
      desc: 'Monitoreo regular del progreso del tratamiento con ajustes personalizados segun sea necesario.',
    },
    {
      title: 'Teleconsulta',
      desc: 'Consultas virtuales para seguimiento y atencion primaria desde la comodidad de tu hogar.',
    },
  ];

  const schedule = [
    { days: 'Lunes - Viernes', hours: '8:00 AM - 5:00 PM' },
    { days: 'Sabado', hours: '8:00 AM - 12:00 PM' },
    { days: 'Domingo', hours: 'Solo Emergencias' },
  ];

  return (
    <div className="w-full">
      <div
        className="h-72 w-full relative bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200')`,
        }}
      >
        <div className="absolute inset-0 bg-text/20 backdrop-blur-[2px]" />
      </div>

      <div className="mx-auto -mt-14 max-w-7xl px-4 pb-16 relative z-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ProfileHero doctor={doctor} />
            <ProfileDetails
              about={
                doctor.bio ??
                `Especialista en ${doctor.specialty} con ${doctor.experience} anos de experiencia. Atencion personalizada y compromiso con la salud de sus pacientes.`
              }
              tags={[doctor.specialty, `${doctor.experience} anos experiencia`, ...(doctor.languages ?? [])]}
              services={services}
              doctor={doctor}
            />
          </div>
          <ProfileSidebar schedule={schedule} address={`${doctor.location}, El Salvador`} />
        </div>
      </div>
    </div>
  );
}
