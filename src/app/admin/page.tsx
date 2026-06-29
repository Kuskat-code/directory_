"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, UserPlus } from 'lucide-react';
import { AdminStats } from '@/src/features/admin/components/AdminStats';
import { AdminNavTabs } from '@/src/features/admin/components/AdminNavTabs';
import { AdminDirectoryTable } from '@/src/features/admin/components/AdminDirectoryTable';
import { AdminCategoriesTab } from '@/src/features/admin/components/AdminCategoriesTab';
import { AdminModerationTab } from '@/src/features/admin/components/AdminModerationTab';
import { AdminBillingTab } from '@/src/features/admin/components/AdminBillingTab';
import { AdminLogsTab } from '@/src/features/admin/components/AdminLogsTab';
import { AdminModerationCard } from '@/src/features/admin/components/AdminModerationCard';

const TAB_TITLES: Record<string, { heading: string; subheading: string }> = {
  users:      { heading: 'Vista General de Usuarios', subheading: 'Monitorea el estado del sistema, listados profesionales y elementos de moderación activos.' },
  categories: { heading: 'Categorías del Directorio', subheading: 'Gestiona las categorías profesionales disponibles en la plataforma.' },
  moderation: { heading: 'Moderación y Aprobaciones', subheading: 'Revisa perfiles pendientes, reseñas reportadas y solicitudes de verificación.' },
  billing:    { heading: 'Facturación y Pagos', subheading: 'Historial de transacciones y estado de suscripciones en la plataforma.' },
  logs:       { heading: 'Registro del Sistema', subheading: 'Auditoría de eventos, accesos y errores registrados por la plataforma.' },
};

const WIDE_TABS = new Set(['moderation', 'logs']);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const { heading, subheading } = TAB_TITLES[activeTab] ?? TAB_TITLES.users;
  const isWide = WIDE_TABS.has(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-700 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Navegación superior */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            Volver al Inicio
          </Link>
        </div>

        {/* Encabezado Principal */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-xs font-semibold tracking-wide uppercase border border-teal-100">
                Admin
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 transition-all duration-200">{heading}</h1>
            <p className="text-sm text-gray-400 mt-1 transition-all duration-200">{subheading}</p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
              <Download className="w-4 h-4 text-gray-400" />
              Exportar
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
              <UserPlus className="w-4 h-4" />
              Invitar Profesional
            </button>
          </div>
        </div>

        {/* Tarjetas de Métricas */}
        <AdminStats />

        {/* Pestañas de Navegación */}
        <AdminNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Contenedor Principal */}
        <div className={`grid grid-cols-1 gap-6 ${isWide ? '' : 'lg:grid-cols-3'}`}>
          <div className={isWide ? '' : 'lg:col-span-2'}>
            {activeTab === 'users'      && <AdminDirectoryTable />}
            {activeTab === 'categories' && <AdminCategoriesTab />}
            {activeTab === 'moderation' && <AdminModerationTab />}
            {activeTab === 'billing'    && <AdminBillingTab />}
            {activeTab === 'logs'       && <AdminLogsTab />}
          </div>

          {!isWide && (
            <div className="space-y-6">
              <AdminModerationCard />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
