import { Users, TrendingUp, Activity } from 'lucide-react';

const stats = [
  {
    title: "Total Usuarios",
    value: "12,450",
    change: "↗ 8%",
    desc: "Profesionales y clientes activos.",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    badgeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Ingresos Mensuales",
    value: "$45.2k",
    change: "↗ 12%",
    desc: "Procedente de suscripciones premium.",
    icon: TrendingUp,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    badgeColor: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Sesiones Activas",
    value: "842",
    change: "En vivo",
    desc: "Usuarios conectados en este momento.",
    icon: Activity,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
    badgeColor: "text-teal-600 bg-teal-50",
  },
];

export function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-start">
            <div className={`shrink-0 w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{stat.title}</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-2xl font-bold text-gray-900 leading-none">{stat.value}</span>
                <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-md ${stat.badgeColor}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-snug">{stat.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}