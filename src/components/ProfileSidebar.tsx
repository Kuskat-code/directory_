interface ProfileSidebarProps {
  schedule: { days: string; hours: string; closed?: boolean }[];
  address: string;
}

export default function ProfileSidebar({ schedule, address }: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      {/* CTA de Asesoría */}
      <section className="bg-brand-white rounded-2xl p-6 shadow-xs border border-brand-dark/5">
        <h2 className="text-base font-bold text-brand-dark text-center mb-1">¿Necesita asesoría legal?</h2>
        <p className="text-xs text-brand-dark/60 text-center mb-6">Contacte al especialista para discutir su caso.</p>
        <div className="space-y-3">
          <button className="w-full bg-brand-accent hover:bg-brand-accent/90 text-brand-white font-bold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer shadow-xs">
            📅 Agendar Cita
          </button>
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-brand-white font-bold py-3 px-4 rounded-xl text-sm transition-colors cursor-pointer shadow-xs">
            💬 Contactar WhatsApp
          </button>
        </div>
      </section>

      {/* Horario de Atención */}
      <section className="bg-brand-white rounded-2xl p-6 shadow-xs border border-brand-dark/5">
        <h2 className="text-sm font-bold text-brand-dark mb-4 flex items-center gap-2">🕒 Horario de Atención</h2>
        <div className="space-y-3 text-xs">
          {schedule.map((item, i) => (
            <div key={i} className="flex justify-between items-center py-1 border-b border-brand-dark/5 last:border-0">
              <span className="font-medium text-brand-dark/70">{item.days}</span>
              <span className={`font-bold ${item.closed ? 'text-red-500' : 'text-brand-dark'}`}>{item.hours}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Ubicación */}
      <section className="bg-brand-white rounded-2xl p-6 shadow-xs border border-brand-dark/5">
        <h2 className="text-sm font-bold text-brand-dark mb-3 flex items-center gap-2">📍 Ubicación</h2>
        <div className="w-full h-32 bg-slate-100 rounded-xl mb-3 border border-brand-dark/10 flex items-center justify-center text-brand-dark/40 text-xs font-medium">
          [ Zona del Mapa ]
        </div>
        <p className="text-xs text-brand-dark/70 leading-relaxed font-medium">{address}</p>
      </section>
    </div>
  );
}