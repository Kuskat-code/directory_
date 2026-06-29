import React, { useState } from 'react';
import { Activity, AlertTriangle, Info, LogIn, RefreshCw, Shield, UserPlus, XCircle } from 'lucide-react';

type Severity = 'Info' | 'Warning' | 'Error';

interface LogEntry {
  id: number;
  date: string;
  time: string;
  action: string;
  detail: string;
  severity: Severity;
  icon: React.ReactNode;
}

const LOGS: LogEntry[] = [
  { id: 1, date: '29 Jun 2026', time: '17:45', action: 'Usuario registrado', detail: 'ana.r@arqdesign.sv', severity: 'Info', icon: <UserPlus className="w-3.5 h-3.5" /> },
  { id: 2, date: '29 Jun 2026', time: '17:30', action: 'Intento de login fallido (3x)', detail: 'unknownuser@temp.mail', severity: 'Warning', icon: <LogIn className="w-3.5 h-3.5" /> },
  { id: 3, date: '29 Jun 2026', time: '16:55', action: 'Perfil actualizado', detail: 'Dr. E. Martínez → especialidad editada', severity: 'Info', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { id: 4, date: '29 Jun 2026', time: '16:20', action: 'Pago procesado', detail: '#INV-0041 — $29.00 Premium', severity: 'Info', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 5, date: '29 Jun 2026', time: '15:47', action: 'Reseña reportada', detail: 'J. Smith → objetivo: C. Méndez', severity: 'Warning', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 6, date: '29 Jun 2026', time: '14:30', action: 'Cuenta suspendida', detail: 'spammer2026@botmail.com', severity: 'Error', icon: <XCircle className="w-3.5 h-3.5" /> },
  { id: 7, date: '28 Jun 2026', time: '23:12', action: 'Backup automático completado', detail: 'DB snapshot v2026-06-28', severity: 'Info', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 8, date: '28 Jun 2026', time: '19:05', action: 'Intento de acceso no autorizado', detail: 'IP: 192.168.4.31 — ruta /admin/api', severity: 'Error', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { id: 9, date: '28 Jun 2026', time: '11:20', action: 'Perfil verificado', detail: 'Dra. Laura Fuentes — docs aprobados', severity: 'Info', icon: <Shield className="w-3.5 h-3.5" /> },
  { id: 10, date: '27 Jun 2026', time: '09:00', action: 'Sesión iniciada', detail: 'admin@directorio.sv', severity: 'Info', icon: <LogIn className="w-3.5 h-3.5" /> },
];

const SEVERITY_STYLES: Record<Severity, { badge: string; row: string; icon: string }> = {
  Info: {
    badge: 'bg-blue-50 text-blue-600 border border-blue-100',
    row: '',
    icon: 'text-blue-500',
  },
  Warning: {
    badge: 'bg-amber-50 text-amber-700 border border-amber-100',
    row: 'bg-amber-50/30',
    icon: 'text-amber-500',
  },
  Error: {
    badge: 'bg-red-50 text-red-600 border border-red-100',
    row: 'bg-red-50/30',
    icon: 'text-red-500',
  },
};

const SEVERITY_ICONS: Record<Severity, React.ReactNode> = {
  Info: <Info className="w-3 h-3" />,
  Warning: <AlertTriangle className="w-3 h-3" />,
  Error: <XCircle className="w-3 h-3" />,
};

export function AdminLogsTab() {
  const [filter, setFilter] = useState<'all' | Severity>('all');

  const filtered = filter === 'all' ? LOGS : LOGS.filter((l) => l.severity === filter);

  const counts = {
    Info: LOGS.filter((l) => l.severity === 'Info').length,
    Warning: LOGS.filter((l) => l.severity === 'Warning').length,
    Error: LOGS.filter((l) => l.severity === 'Error').length,
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-5">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-500" />
            Registro del Sistema
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Últimas {LOGS.length} entradas del log</p>
        </div>

        {/* Resumen de severidad */}
        <div className="flex items-center gap-2 shrink-0">
          {(['Info', 'Warning', 'Error'] as Severity[]).map((sev) => (
            <div key={sev} className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${SEVERITY_STYLES[sev].badge}`}>
              {SEVERITY_ICONS[sev]}
              {counts[sev]}
            </div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {(['all', 'Info', 'Warning', 'Error'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === f
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'Todos' : f}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        {filtered.map((log) => {
          const style = SEVERITY_STYLES[log.severity];
          return (
            <div
              key={log.id}
              className={`flex items-start gap-3 px-3.5 py-3 rounded-lg border border-transparent hover:border-gray-100 transition-all ${style.row}`}
            >
              {/* Timestamp */}
              <div className="shrink-0 text-right min-w-[72px]">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{log.date.slice(0, 6)}</p>
                <p className="text-xs font-bold text-gray-600 font-mono">{log.time}</p>
              </div>

              {/* Icono */}
              <div className={`shrink-0 mt-0.5 ${style.icon}`}>
                {log.icon}
              </div>

              {/* Contenido */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-snug">{log.action}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{log.detail}</p>
              </div>

              {/* Badge severidad */}
              <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${style.badge}`}>
                {SEVERITY_ICONS[log.severity]}
                {log.severity}
              </span>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No hay registros con este filtro.</p>
        )}
      </div>
    </div>
  );
}
