import ProfileHero from './ProfileHero';
import ProfileDetails from './ProfileDetails';
import ProfileSidebar from './ProfileSidebar';

export default function ProfileContent() {
  // Datos 100% médicos, estructurados de forma ejecutiva y profesional
  const doctorData = {
    name: "Dr. Roberto Ayala M.",
    title: "Especialista en Cardiología Intervencionista y Alta Complejidad",
    location: "San Salvador, El Salvador",
    experience: "15+ Años de Práctica Clínica",
    rating: "4.9",
    reviewsCount: 120,
    about: "Cardiólogo intervencionista certificado con subespecialidad en procedimientos endovasculares complejos y soporte circulatorio avanzado. Enfocado en la colaboración interinstitucional y resolución de casos críticos mediante medicina basada en evidencia.",
    tags: [
      "Cardiología Intervencionista", 
      "Angioplastia Coronaria", 
      "Cateterismo Cardíaco", 
      "Terapia Endovascular", 
      "Insuficiencia Cardíaca"
    ],
    services: [
      { 
        title: "Intervencionismo Coronario Avanzado", 
        desc: "Resolución de oclusiones crónicas totales, angioplastias de alta complejidad y colocación de stents medicados de última generación." 
      },
      { 
        title: "Diagnóstico Hemodinámico Integral", 
        desc: "Evaluación invasiva de presiones intracardíacas, cateterismo izquierdo/derecho y estudios de reserva de flujo fraccional (FFR)." 
      },
      { 
        title: "Consultas de Segunda Opinión Médica", 
        desc: "Evaluación expedita y discusión de casos clínicos complejos para médicos referentes y juntas médicas hospitalarias." 
      },
      { 
        title: "Manejo de Cardiopatía Estructural", 
        desc: "Abordajes mínimamente invasivos para valvulopatías, incluyendo implante de válvula aórtica transcatéter (TAVI)." 
      }
    ],
    schedule: [
      { days: "Lunes - Viernes", hours: "8:00 AM - 5:00 PM" },
      { days: "Sábado (Casos Urgentes)", hours: "8:00 AM - 12:00 MD" },
      { days: "Domingo", hours: "Solo Emergencias Hospitalarias", closed: false }
    ],
    address: "Complejo Médico Clínico, Torre 2, Nivel 6, Consultorio 604, San Salvador, El Salvador."
  };

  return (
    <div className="w-full">
      {/* Banner con foto de entorno clínico/corporativo moderno */}
      <div 
        className="h-72 w-full relative bg-cover bg-center pt-24" 
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200')` }}
      >
        <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[2px]" />
      </div>

      {/* Margen controlado para que encaje milimétricamente bajo la barra superior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Bloque Izquierdo: Información Clínica Principal */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileHero {...doctorData} />
            <ProfileDetails 
              about={doctorData.about} 
              tags={doctorData.tags} 
              services={doctorData.services} 
            />
          </div>
          
          {/* Bloque Derecho: Horarios Médicos e Infraestructura */}
          <ProfileSidebar 
            schedule={doctorData.schedule} 
            address={doctorData.address} 
          />
        </div>
      </div>
    </div>
  );
}