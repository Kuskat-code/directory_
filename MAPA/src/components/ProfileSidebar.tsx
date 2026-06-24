'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SpecialtyInfo } from '@/src/lib/constants';

interface ProfileSidebarProps {
  name: string;
  phone: string;
  schedule: { days: string; hours: string; closed?: boolean }[];
  address: string;
  theme: SpecialtyInfo;
}

export default function ProfileSidebar({ name, phone, schedule, address, theme }: ProfileSidebarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [selectedHour, setSelectedHour] = useState('10:00 AM');
  const [patientName, setPatientName] = useState('');

  const daysOptions = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const hoursOptions = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  // Formatear el teléfono para el enlace de WhatsApp
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Por favor, ingresa el nombre del paciente.');
      return;
    }

    const messageText = `Hola ${name}, deseo agendar una consulta médica.
Detalles de la Cita:
- Paciente: ${patientName}
- Día: ${selectedDay}
- Horario: ${selectedHour}
- Ubicación: ${address}

Quedo atento a su confirmación. ¡Muchas gracias!`;

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappUrl, '_blank');
    setIsModalOpen(false);
    setPatientName('');
  };

  const handleWhatsAppDirect = () => {
    const directMessage = `Hola ${name}, me comunico a través del directorio médico. Deseo hacerle una consulta general.`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(directMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* CTA de Asesoría Médica */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-brand-dark/5">
        <h2 className="text-base font-extrabold text-brand-dark text-center mb-1">
          ¿Desea programar una consulta?
        </h2>
        <p className="text-xs text-brand-dark/60 text-center mb-6">
          Contacte al especialista de forma directa y sin intermediarios.
        </p>
        <div className="space-y-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className={`w-full text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99] ${theme.accentColor}`}
          >
            📅 Agendar Cita
          </button>
          <button 
            onClick={handleWhatsAppDirect}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99]"
          >
            💬 Contactar WhatsApp
          </button>
        </div>
      </section>

      {/* Horario de Atención */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-brand-dark/5">
        <h2 className="text-sm font-extrabold text-brand-dark mb-4 flex items-center gap-2">
          🕒 Horario de Atención
        </h2>
        <div className="space-y-3 text-xs">
          {schedule.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-1 border-b border-brand-dark/5 last:border-0">
              <span className="font-semibold text-brand-dark/70">{item.days}</span>
              <span className={`font-extrabold ${item.closed ? 'text-red-500' : 'text-brand-dark'}`}>
                {item.hours}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Ubicación */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-brand-dark/5">
        <h2 className="text-sm font-extrabold text-brand-dark mb-3 flex items-center gap-2">
          📍 Ubicación
        </h2>
        <div className="w-full h-32 bg-slate-100 rounded-xl mb-3 border border-brand-dark/10 flex items-center justify-center text-brand-dark/40 text-xs font-semibold">
          📍 Consultorio en {address.split(',')[1] || 'Oriente'}
        </div>
        <p className="text-xs text-brand-dark/70 leading-relaxed font-semibold">{address}</p>
      </section>

      {/* MODAL DE CITAS DIRECTO (Ideal para adultos mayores de 60 años) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 md:p-8 shadow-2xl relative border border-gray-150"
            >
              {/* Botón Cerrar */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>

              <h3 className="text-xl font-extrabold text-brand-dark pr-6">
                Agendar Consulta Médica
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Completa los datos rápidos para generar la solicitud en WhatsApp.
              </p>

              <form onSubmit={handleWhatsAppBooking} className="mt-6 space-y-5">
                {/* Nombre del Paciente */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Nombre del Paciente
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-400 transition-all font-semibold"
                  />
                </div>

                {/* Selección de Día */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Seleccionar Día
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {daysOptions.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedDay === day
                            ? `${theme.textColor} ${theme.borderColor} ${theme.bgColor} border-2`
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selección de Horario */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-2">
                    Horario Preferente
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {hoursOptions.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setSelectedHour(hour)}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                          selectedHour === hour
                            ? `${theme.textColor} ${theme.borderColor} ${theme.bgColor} border-2`
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Botón de Confirmación Principal */}
                <button
                  type="submit"
                  className="w-full mt-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  💬 Confirmar cita por WhatsApp
                </button>

                <p className="text-[10px] text-center text-gray-400 font-semibold leading-relaxed">
                  Al confirmar, se abrirá WhatsApp con el mensaje estructurado listo para enviar al especialista.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}