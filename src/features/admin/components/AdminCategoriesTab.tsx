import React, { useState } from 'react';
import { Edit2, FolderOpen, Plus } from 'lucide-react';

const INITIAL_CATEGORIES = [
  { id: 1, name: 'Medicina General', count: 142, color: 'bg-teal-50 text-teal-700' },
  { id: 2, name: 'Cardiología', count: 38, color: 'bg-red-50 text-red-700' },
  { id: 3, name: 'Pediatría', count: 56, color: 'bg-blue-50 text-blue-700' },
  { id: 4, name: 'Neurología', count: 29, color: 'bg-purple-50 text-purple-700' },
  { id: 5, name: 'Dermatología', count: 47, color: 'bg-orange-50 text-orange-700' },
  { id: 6, name: 'Ortopedia', count: 33, color: 'bg-yellow-50 text-yellow-700' },
  { id: 7, name: 'Ginecología', count: 41, color: 'bg-rose-50 text-rose-700' },
  { id: 8, name: 'Psiquiatría', count: 22, color: 'bg-violet-50 text-violet-700' },
  { id: 9, name: 'Gastroenterología', count: 18, color: 'bg-lime-50 text-lime-700' },
  { id: 10, name: 'Oftalmología', count: 25, color: 'bg-cyan-50 text-cyan-700' },
];

export function AdminCategoriesTab() {
  const [editing, setEditing] = useState<number | null>(null);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [editValue, setEditValue] = useState('');

  const startEdit = (id: number, name: string) => {
    setEditing(id);
    setEditValue(name);
  };

  const commitEdit = (id: number) => {
    if (editValue.trim()) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: editValue.trim() } : c)),
      );
    }
    setEditing(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
        <div>
          <h3 className="font-bold text-gray-800">Categorías del Directorio</h3>
          <p className="text-xs text-gray-400 mt-0.5">{categories.length} categorías activas</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm self-start sm:self-auto">
          <Plus className="w-3.5 h-3.5" />
          Nueva Categoría
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Categoría</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Profesionales</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="group hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 flex items-center gap-3">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${cat.color.split(' ')[0]} shrink-0`}>
                    <FolderOpen className={`w-3.5 h-3.5 ${cat.color.split(' ')[1]}`} />
                  </span>
                  {editing === cat.id ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => commitEdit(cat.id)}
                      onKeyDown={(e) => e.key === 'Enter' && commitEdit(cat.id)}
                      className="text-sm font-semibold text-gray-800 border-b border-teal-400 outline-none bg-transparent w-40"
                    />
                  ) : (
                    <span className="font-semibold text-gray-800 text-sm">{cat.name}</span>
                  )}
                </td>
                <td className="py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${cat.color}`}>
                    {cat.count} profesionales
                  </span>
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => startEdit(cat.id, cat.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50/50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Edit2 className="w-3 h-3" />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
