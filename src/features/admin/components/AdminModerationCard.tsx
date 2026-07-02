import React from 'react';
import { Flag, UserCheck } from 'lucide-react';

export function AdminModerationCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          Moderación
          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-semibold leading-none">3</span>
        </h3>
        <button className="text-xs text-teal-600 font-semibold hover:text-teal-800 transition-colors">Ver Todo</button>
      </div>

      <div className="space-y-3">
        {/* Ítem: Reseña reportada */}
        <div className="p-4 border-l-4 border-l-red-400 bg-red-50/40 rounded-lg border border-red-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-700 mb-1">
            <Flag className="w-3.5 h-3.5 text-red-500" />
            Reseña Reportada
          </div>
          <p className="text-gray-500 italic leading-relaxed">&ldquo;Este contratista nunca apareció y me bloqueó&hellip;&rdquo;</p>
          <div className="flex justify-between text-gray-400 mt-2">
            <span>Destino: J. Smith</span>
            <span>Hace 2h</span>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="flex-1 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-semibold transition-colors">
              Desestimar
            </button>
            <button className="flex-1 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold transition-colors">
              Eliminar
            </button>
          </div>
        </div>

        {/* Ítem: Verificación de perfil */}
        <div className="p-4 border-l-4 border-l-teal-500 bg-teal-50/30 rounded-lg border border-teal-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-gray-700 mb-1">
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            Verificación de Perfil
          </div>
          <p className="text-gray-500 leading-relaxed">Aprobación pendiente para el documento &ldquo;Certificación del Colegio Médico&rdquo;.</p>
          <div className="flex justify-between text-gray-400 mt-2">
            <span>Usuario: Dr. E. Martínez</span>
            <span>Hace 1d</span>
          </div>
          <button className="w-full mt-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-semibold transition-colors">
            Revisar Doc
          </button>
        </div>
      </div>
    </div>
  );
}