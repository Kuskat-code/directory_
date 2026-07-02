'use client'

import { useEffect, useState, useMemo } from 'react'
import { getCurrentUserSession, type UserSessionData } from '@/src/features/profile/profile.actions'
import {
    Users, TrendingUp, Activity, ShieldCheck,
    Search, Folder, ShieldAlert, CreditCard, FileText,
    Flag, UserCheck
} from 'lucide-react'

// --- Datos de Ejemplo ---
const adminStats = [
    { title: "Total Usuarios", value: "12,450", change: "↗ 8%", desc: "Profesionales y clientes activos.", icon: Users },
    { title: "Ingresos Mensuales", value: "$45.2k", change: "↗ 12%", desc: "Suscripciones premium.", icon: TrendingUp },
    { title: "Sesiones Activas", value: "842", change: "En vivo", desc: "Usuarios conectados ahora.", icon: Activity },
]

const initialUsers = [
    { id: 1, name: 'Ana Rodríguez', email: 'ana.r@arqdesign.sv', plan: 'Premium', status: 'Activo', initials: 'AR', color: 'bg-blue-100 text-blue-700' },
    { id: 2, name: 'Carlos Méndez', email: 'cmendez.legal@mail.com', plan: 'Básico', status: 'Activo', initials: 'CM', color: 'bg-gray-100 text-gray-700' },
]

const tabs = [
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'categorias', label: 'Categorías', icon: Folder },
    { id: 'moderacion', label: 'Moderación', icon: ShieldAlert },
    { id: 'facturacion', label: 'Facturación', icon: CreditCard },
    { id: 'registro', label: 'Registro del Sistema', icon: FileText },
]

export default function AdminDashboard() {
    const [user, setUser] = useState<UserSessionData | null>(null)

    // Estados para la funcionalidad del nuevo apartado
    const [activeTab, setActiveTab] = useState('usuarios')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        async function load() {
            const res = await getCurrentUserSession()
            if (res.success && res.data) {
                setUser(res.data)
            }
        }
        void load()
    }, [])

    const firstName = user?.name?.split(' ')[0] || 'Abel'

    // Funcionalidad de filtrado de búsqueda
    const filteredUsers = useMemo(() => {
        return initialUsers.filter(u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm])

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Contenido Principal sin Nav Bar */}
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

                {/* Saludo Vistoso (Hero Banner) */}
                <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-teal-400 p-8 text-white shadow-lg sm:p-10">
                    <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-white opacity-10 blur-3xl"></div>
                    <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-teal-900 opacity-20 blur-3xl"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                ¡Bienvenido, {firstName}!
                            </h1>
                            <p className="mt-2 max-w-xl text-teal-50 text-base sm:text-lg">
                                Panel de control general. Supervisa el rendimiento y la actividad de la plataforma desde un solo lugar.
                            </p>
                        </div>
                        <ShieldCheck className="hidden h-24 w-24 text-white opacity-80 lg:block" strokeWidth={1.5} />
                    </div>
                </div>

                {/* Estadísticas */}
                <section className="mb-10">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">Resumen de Métricas</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {adminStats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="rounded-xl border border-gray-200 bg-white p-5 transition-all hover:shadow-sm">
                                    <div className="mb-3 flex items-start justify-between">
                                        <Icon className="h-5 w-5 text-teal-600" />
                                        <span className="rounded bg-teal-50 px-2 py-1 text-[11px] font-semibold tracking-wide text-teal-700">
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="mt-1 text-sm font-semibold text-gray-800">{stat.title}</p>
                                    <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{stat.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Navegación por Pestañas Interactiva */}
                <div className="mb-6 flex space-x-6 overflow-x-auto border-b border-gray-200 pb-px scrollbar-hide">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 border-b-2 pb-3 text-sm transition-colors ${isActive
                                        ? 'border-teal-500 font-semibold text-teal-600'
                                        : 'border-transparent font-medium text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Icon className="h-4 w-4" /> {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Layout de 2 Columnas */}
                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

                    {/* Columna Izquierda: Directorio Profesional */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Directorio Profesional</h3>
                                <p className="text-sm text-gray-500">Listado de usuarios registrados</p>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar usuarios, correos..."
                                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                                />
                            </div>
                        </div>

                        {/* Cabecera de la tabla */}
                        <div className="mb-2 grid grid-cols-12 gap-4 border-b border-gray-100 pb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                            <div className="col-span-6 sm:col-span-7">Nombre</div>
                            <div className="col-span-3 text-center sm:col-span-3">Plan</div>
                            <div className="col-span-3 text-right sm:col-span-2">Estado</div>
                        </div>

                        {/* Lista de Usuarios Filtrada */}
                        <div className="space-y-1">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((u) => (
                                    <div key={u.id} className="grid grid-cols-12 items-center gap-4 rounded-lg p-2 transition-colors hover:bg-gray-50">
                                        <div className="col-span-6 flex items-center gap-3 sm:col-span-7">
                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${u.color}`}>
                                                {u.initials}
                                            </div>
                                            <div className="min-w-0 overflow-hidden">
                                                <p className="truncate text-sm font-bold text-gray-900">{u.name}</p>
                                                <p className="truncate text-xs text-gray-500">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-3 text-center sm:col-span-3">
                                            <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${u.plan === 'Premium' ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {u.plan}
                                            </span>
                                        </div>
                                        <div className="col-span-3 flex items-center justify-end gap-1 sm:col-span-2 text-right">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs font-medium text-emerald-600">{u.status}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-6 text-center text-sm text-gray-500">
                                    No se encontraron usuarios que coincidan con la búsqueda.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha: Moderación */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-gray-900">Moderación</h3>
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white">
                                    3
                                </span>
                            </div>
                            <button className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                                Ver Todo
                            </button>
                        </div>

                        <div className="mb-4 rounded-xl border border-red-200 bg-white p-4 shadow-[0_2px_10px_-4px_rgba(239,68,68,0.1)]">
                            <div className="mb-2 flex items-center gap-2 text-red-500">
                                <Flag className="h-4 w-4" />
                                <h4 className="text-sm font-bold text-gray-900">Reseña Reportada</h4>
                            </div>
                            <p className="mb-3 text-sm italic text-gray-600">&ldquo;Este contratista nunca apareció y me bloqueó&hellip;&rdquo;</p>
                            <div className="mb-4 flex items-center justify-between text-xs text-gray-400">
                                <span>Destino: J. Smith</span>
                                <span>Hace 2h</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 rounded-lg border border-gray-200 bg-white py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50">
                                    Desestimar
                                </button>
                                <button className="flex-1 rounded-lg bg-red-500 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600">
                                    Eliminar
                                </button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-teal-200 bg-white p-4 shadow-[0_2px_10px_-4px_rgba(20,184,166,0.1)]">
                            <div className="mb-2 flex items-center gap-2 text-teal-600">
                                <UserCheck className="h-4 w-4" />
                                <h4 className="text-sm font-bold text-gray-900">Verificación de Perfil</h4>
                            </div>
                            <p className="mb-3 text-sm text-gray-600">
                                Aprobación pendiente para el documento &ldquo;Certificación del Colegio Médico&rdquo;.
                            </p>
                            <div className="mb-4 flex items-center justify-between text-xs text-gray-400">
                                <span>Usuario: Dr. E. Martínez</span>
                                <span>Hace 1d</span>
                            </div>
                            <button className="w-full rounded-lg bg-teal-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700">
                                Revisar Doc
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}