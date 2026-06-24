'use client';
import { useSearchParams } from 'next/navigation';
import { EXAMPLE_DOCTORS, SPECIALTIES_THEMES } from '@/src/lib/constants';
import ProfileHero from './ProfileHero';
import ProfileDetails from './ProfileDetails';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileContent() {
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('id');

  // Buscar el médico en la base de datos simulada
  const activeDoctor = EXAMPLE_DOCTORS.find((d) => d.id === doctorId);

  // Médico por defecto si no se encuentra ID
  const defaultDoctor = {
    id: "default",
    name: "Dr. Roberto Ayala M.",
    specialty: "Cardiología",
    location: "San Miguel",
    phone: "+503 2661 4545",
    email: "roberto.ayala@email.com",
    experience: 15,
    rating: 4.9,
    reviews: 120,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&fit=crop",
    bio: "Cardiólogo intervencionista certificado con subespecialidad en procedimientos endovasculares complejos y soporte circulatorio avanzado. Enfocado en la colaboración interinstitucional y resolución de casos críticos en el Oriente del país.",
    certifications: ["Universidad de El Salvador", "Subespecialidad en Cardiología Intervencionista"],
    languages: ["Español", "Inglés"]
  };

  const doctor = activeDoctor || defaultDoctor;

  // Obtener el tema cromático según la especialidad del médico (psicología del color)
  const theme = SPECIALTIES_THEMES[doctor.specialty] || SPECIALTIES_THEMES['Medicina General'];

  // Datos estructurados adicionales adaptados al médico activo
  const doctorData = {
    ...doctor,
    title: `Especialista en ${doctor.specialty} y Alta Complejidad`,
    experienceText: `${doctor.experience}+ Años de Práctica Clínica`,
    reviewsCount: doctor.reviews,
    about: doctor.bio || `Especialista enfocado en la atención personalizada y tratamiento avanzado de condiciones en el área de ${doctor.specialty}.`,
    tags: [
      doctor.specialty,
      ...(doctor.certifications || []),
      "Zona Oriental",
      "Atención Profesional"
    ],
    services: [
      { 
        title: `Consulta de Especialidad en ${doctor.specialty}`, 
        desc: "Diagnóstico preciso y tratamiento adaptado a cada paciente basado en evidencia clínica de última generación." 
      },
      { 
        title: "Evaluación Médica Preventiva", 
        desc: "Chequeos integrales de rutina para prevenir complicaciones a largo plazo." 
      },
      { 
        title: "Segunda Opinión Profesional", 
        desc: "Evaluación detallada de expedientes médicos y discusión del caso con familiares." 
      }
    ],
    schedule: [
      { days: "Lunes - Viernes", hours: "8:00 AM - 5:00 PM" },
      { days: "Sábado", hours: "8:00 AM - 12:00 MD" },
      { days: "Domingo", hours: "Cerrado", closed: true }
    ],
    address: `Complejo Médico de Oriente, Calle Principal #12, ${doctor.location}, El Salvador.`
  };

  return (
    <div className="w-full">
      {/* Banner de Entorno Clínico */}
      <div 
        className="h-72 w-full relative bg-cover bg-center pt-24 animate-pulse-slow" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200')` }}
      >
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px]" />
      </div>

      {/* Margen adaptado */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Bloque Izquierdo: Información Clínica Principal */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileHero 
              name={doctorData.name}
              title={doctorData.title}
              location={doctorData.location}
              experience={doctorData.experienceText}
              rating={doctor.rating.toString()}
              reviewsCount={doctorData.reviewsCount}
              avatar={doctorData.avatar}
              theme={theme}
            />
            <ProfileDetails 
              about={doctorData.about} 
              tags={doctorData.tags} 
              services={doctorData.services} 
              specialty={doctorData.specialty}
              theme={theme}
            />
          </div>
          
          {/* Bloque Derecho: Horarios y Citas */}
          <ProfileSidebar 
            name={doctorData.name}
            phone={doctorData.phone}
            schedule={doctorData.schedule} 
            address={doctorData.address} 
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}