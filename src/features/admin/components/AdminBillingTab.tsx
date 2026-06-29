import React, { useState } from 'react';
import { CheckCircle2, Clock, CreditCard, TrendingUp } from 'lucide-react';

type PaymentStatus = 'Completado' | 'Pendiente' | 'Fallido';
type PlanType = 'Premium' | 'Básico';

interface Payment {
  id: string;
  client: string;
  email: string;
  plan: PlanType;
  amount: string;
  status: PaymentStatus;
  date: string;
}

const PAYMENTS: Payment[] = [
  { id: '#INV-0041', client: 'Ana Rodríguez', email: 'ana.r@arqdesign.sv', plan: 'Premium', amount: '$29.00', status: 'Completado', date: '29 Jun 2026' },
  { id: '#INV-0040', client: 'Carlos Méndez', email: 'cmendez.legal@mail.com', plan: 'Básico', amount: '$9.00', status: 'Completado', date: '28 Jun 2026' },
  { id: '#INV-0039', client: 'Dr. E. Martínez', email: 'e.martinez@med.sv', plan: 'Premium', amount: '$29.00', status: 'Pendiente', date: '28 Jun 2026' },
  { id: '#INV-0038', client: 'Laura Fuentes', email: 'lfuentes@studio.sv', plan: 'Premium', amount: '$29.00', status: 'Completado', date: '27 Jun 2026' },
  { id: '#INV-0037', client: 'Miguel Ángel Vega', email: 'm.vega@cv.sv', plan: 'Básico', amount: '$9.00', status: 'Pendiente', date: '26 Jun 2026' },
  { id: '#INV-0036', client: 'Sofía Herrera', email: 's.herrera@law.sv', plan: 'Premium', amount: '$29.00', status: 'Completado', date: '25 Jun 2026' },
  { id: '#INV-0035', client: 'Roberto Díaz', email: 'rdiaz@clinic.sv', plan: 'Básico', amount: '$9.00', status: 'Fallido', date: '24 Jun 2026' },
];

const STATUS_STYLES: Record<PaymentStatus, { badge: string; icon: React.ReactNode }> = {
  Completado: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  Pendiente: {
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  Fallido: {
    badge: 'bg-red-50 text-red-600 border-red-100',
    icon: <span className="text-[10px] font-black leading-none">✕</span>,
  },
};

const PLAN_STYLES: Record<PlanType, string> = {
  Premium: 'bg-teal-50 text-teal-700 border border-teal-100',
  Básico: 'bg-gray-100 text-gray-600 border border-gray-200',
};

export function AdminBillingTab() {
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all');

  const filtered = filter === 'all' ? PAYMENTS : PAYMENTS.filter((p) => p.status === filter);
  const totalRevenue = PAYMENTS.filter((p) => p.status === 'Completado').reduce(
    (sum, p) => sum + parseFloat(p.amount.replace('$', '')),
    0,
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-5">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-teal-500" />
            Historial de Pagos
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Últimas transacciones del sistema</p>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-teal-50 border border-teal-100 self-start shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
          <div>
            <p className="text-[10px] font-semibold text-teal-500 uppercase tracking-wide leading-none">Ingresos confirmados</p>
            <p className="text-sm font-bold text-teal-700 leading-tight">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-1.5 mb-4 flex-wrap">
        {(['all', 'Completado', 'Pendiente', 'Fallido'] as const).map((f) => (
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

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">ID</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Cliente</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Plan</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Monto</th>
              <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((payment) => {
              const statusStyle = STATUS_STYLES[payment.status];
              return (
                <tr key={payment.id} className="group hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5">
                    <span className="font-mono text-xs font-semibold text-gray-500">{payment.id}</span>
                    <div className="text-[10px] text-gray-400 mt-0.5">{payment.date}</div>
                  </td>
                  <td className="py-3.5">
                    <div className="font-semibold text-gray-800 text-sm">{payment.client}</div>
                    <div className="text-xs text-gray-400">{payment.email}</div>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${PLAN_STYLES[payment.plan]}`}>
                      {payment.plan}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-bold text-gray-800 text-sm">{payment.amount}</span>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.badge}`}>
                      {statusStyle.icon}
                      {payment.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-8">No hay registros con este filtro.</p>
        )}
      </div>
    </div>
  );
}
