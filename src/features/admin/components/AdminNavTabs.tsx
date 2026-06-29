import React from 'react';
import { Users, FolderMinus, ShieldAlert, CreditCard, ClipboardList } from 'lucide-react';

interface AdminNavTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminNavTabs({ activeTab, setActiveTab }: AdminNavTabsProps) {
  const tabs = [
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'categories', label: 'Categorías', icon: FolderMinus },
    { id: 'moderation', label: 'Moderación', icon: ShieldAlert },
    { id: 'billing', label: 'Facturación', icon: CreditCard },
    { id: 'logs', label: 'Registro del Sistema', icon: ClipboardList },
  ];

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 pb-0 mb-6 overflow-x-auto whitespace-nowrap">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors relative -mb-px ${
              isActive
                ? 'text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-t-lg'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-teal-500' : 'text-gray-400'}`} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}