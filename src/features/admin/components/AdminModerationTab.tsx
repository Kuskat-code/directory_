import React, { useState } from 'react';
import { Check, Clock, FileText, ShieldAlert, X } from 'lucide-react';

interface PendingProfile {
  id: number;
  name: string;
  specialty: string;
  email: string;
  initials: string;
  submittedAt: string;
  docs: string[];
  avatarBg: string;
}

const INITIAL_PROFILES: PendingProfile[] = [
  {
    id: 1,
    name: 'Dr. Fernando Guzmán',
    specialty: 'Médico General',
    email: 'f.guzman@clinica.sv',
    initials: 'FG',
    submittedAt: 'Hace 2h',
    docs: ['Cédula Profesional', 'Certificado Colegio Médico'],
    avatarBg: 'bg-teal-100 text-teal-700',
  },
  {
    id: 2,
    name: 'Dra. Valentina Cruz',
    specialty: 'Cardiología',
    email: 'v.cruz@heart.sv',
    initials: 'VC',
    submittedAt: 'Hace 5h',
    docs: ['Cédula Profesional', 'Especialidad MSPAS'],
    avatarBg: 'bg-red-100 text-red-700',
  },
  {
    id: 3,
    name: 'Dr. Alejandro Torres',
    specialty: 'Neurología',
    email: 'a.torres@neuro.sv',
    initials: 'AT',
    submittedAt: 'Hace 1d',
    docs: ['Cédula Profesional', 'Certificado Neurología'],
    avatarBg: 'bg-purple-100 text-purple-700',
  },
  {
    id: 4,
    name: 'Dra. María Portillo',
    specialty: 'Dermatología',
    email: 'm.portillo@derm.sv',
    initials: 'MP',
    submittedAt: 'Hace 2d',
    docs: ['Cédula Profesional'],
    avatarBg: 'bg-orange-100 text-orange-700',
  },
];

export function AdminModerationTab() {
  const [profiles, setProfiles] = useState(INITIAL_PROFILES);
  const [decided, setDecided] = useState<Record<number, 'approved' | 'rejected'>>({});

  const decide = (id: number, action: 'approved' | 'rejected') => {
    setDecided((prev) => ({ ...prev, [id]: action }));
    setTimeout(() => {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      setDecided((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 800);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Perfiles Pendientes de Aprobación
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {profiles.length} perfil{profiles.length !== 1 ? 'es' : ''} esperando revisión
          </p>
        </div>
      </div>

      {profiles.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-3">
            <Check className="w-6 h-6 text-emerald-500" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Todo al día</p>
          <p className="text-xs text-gray-400 mt-1">No hay perfiles pendientes de revisión.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => {
            const status = decided[profile.id];
            return (
              <div
                key={profile.id}
                className={`rounded-xl border p-4 transition-all duration-300 ${
                  status === 'approved'
                    ? 'border-emerald-200 bg-emerald-50/60 opacity-60 scale-[0.99]'
                    : status === 'rejected'
                      ? 'border-red-200 bg-red-50/60 opacity-60 scale-[0.99]'
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${profile.avatarBg}`}>
                    {profile.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="font-semibold text-gray-800 text-sm">{profile.name}</span>
                      <span className="text-xs text-gray-400">{profile.specialty}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{profile.email}</p>

                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      {profile.docs.map((doc) => (
                        <span
                          key={doc}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[11px] font-medium"
                        >
                          <FileText className="w-3 h-3" />
                          {doc}
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 ml-auto shrink-0">
                        <Clock className="w-3 h-3" />
                        {profile.submittedAt}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    disabled={!!status}
                    onClick={() => decide(profile.id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:text-red-600 hover:bg-red-50/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <X className="w-3.5 h-3.5" />
                    Rechazar
                  </button>
                  <button
                    disabled={!!status}
                    onClick={() => decide(profile.id, 'approved')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Aprobar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
