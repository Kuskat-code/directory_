'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Directorio', href: '/directorio' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Soporte', href: '/soporte' },
];

export default function Header() {
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3">
      <nav className="w-full max-w-[96%] mx-auto bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-sm rounded-full px-5 py-2.5 flex items-center justify-between gap-4">

        <Link href="/" className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-gradient-to-br from-brand-accent to-blue-700 rounded-lg"></div>
          <span className="hidden sm:inline">DirectorioPro</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? 'bg-brand-accent/10 text-brand-accent'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="relative flex-1 max-w-xs hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar profesionales..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-100 text-sm rounded-full pl-9 pr-4 py-1.5 outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="text-gray-500 hover:text-brand-accent transition-colors text-lg">🔔</button>
          <div className="w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
        </div>
      </nav>
    </header>
  );
}
