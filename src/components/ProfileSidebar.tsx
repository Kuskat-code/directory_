import { Calendar, Clock, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

interface ProfileSidebarProps {
  schedule: { days: string; hours: string; closed?: boolean }[];
  address: string;
}

export default function ProfileSidebar({ schedule, address }: ProfileSidebarProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-1 text-center text-base font-bold text-text">Agenda tu cita</h2>
        <p className="mb-6 text-center text-xs text-text-muted">
          Contacta al especialista para discutir tu caso.
        </p>
        <div className="space-y-3">
          <Button variant="primary" className="w-full">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            Agendar Cita
          </Button>
          <Button variant="accent" className="w-full">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Contactar WhatsApp
          </Button>
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-text">
          <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
          Horario de Atencion
        </h2>
        <div className="space-y-3 text-xs">
          {schedule.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-border py-1 last:border-0"
            >
              <span className="font-medium text-text-muted">{item.days}</span>
              <span className={`font-bold ${item.closed ? 'text-warning' : 'text-text'}`}>
                {item.hours}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-card)] border border-border bg-surface p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-text">
          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
          Ubicacion
        </h2>
        <div className="mb-3 flex h-32 w-full items-center justify-center rounded-[var(--radius-card)] border border-border bg-secondary text-xs font-medium text-text-muted">
          [ Mapa ]
        </div>
        <p className="text-xs font-medium leading-relaxed text-text-muted">{address}</p>
      </section>
    </div>
  );
}
