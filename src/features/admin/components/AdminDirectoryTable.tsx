import React from 'react';
import { Search } from 'lucide-react';

export function AdminDirectoryTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
        <div>
          <h3 className="font-bold text-gray-800">Directorio Profesional</h3>
          <p className="text-xs text-gray-400 mt-0.5">Listado de usuarios registrados</p>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar usuarios, correos..."
            className="text-xs pl-8 pr-3 py-2 border border-gray-200 rounded-lg w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-gray-700 transition-shadow"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Nombre</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Plan</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr className="group hover:bg-slate-50/60 transition-colors">
              <td className="py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Ana Rodríguez</div>
                  <div className="text-xs text-gray-400">ana.r@arqdesign.sv</div>
                </div>
              </td>
              <td className="py-3.5">
                <span className="px-2.5 py-1 bg-teal-50 text-teal-700 font-semibold text-xs rounded-full border border-teal-100">Premium</span>
              </td>
              <td className="py-3.5">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Activo
                </span>
              </td>
            </tr>
            <tr className="group hover:bg-slate-50/60 transition-colors">
              <td className="py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">CM</div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Carlos Méndez</div>
                  <div className="text-xs text-gray-400">cmendez.legal@mail.com</div>
                </div>
              </td>
              <td className="py-3.5">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 font-semibold text-xs rounded-full border border-gray-200">Básico</span>
              </td>
              <td className="py-3.5">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Activo
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}