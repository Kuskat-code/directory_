'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { label: 'Directorio', href: '/directorio' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Soporte', href: '/soporte' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = pathname === '/';

  // Escuchar el evento scroll del navegador
  useEffect(() => {
    const handleScroll = () => {
      // Ajustar el umbral al 85% del alto de pantalla (coincidiendo con el 85vh del HeroVideo)
      const threshold = window.innerHeight * 0.85;
      if (window.scrollY > threshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Ejecutar una vez al montar por si el navegador recarga con scroll activo
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determinar si activar el estilo cristalino de iPhone
  // En Home se activa al hacer scroll pasando el video. En subpáginas está activo por defecto.
  const showCrystal = !isHome || isScrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      showCrystal 
        ? 'bg-white/70 backdrop-blur-md border-b border-gray-200/20 py-3.5 shadow-xs' 
        : 'bg-transparent py-5'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-gradient-to-br from-brand-accent to-blue-700 rounded-lg"></div>
          <span className={`hidden sm:inline font-extrabold transition-colors ${
            showCrystal ? 'text-slate-800' : 'text-white'
          }`}>
            DirectorioPro
          </span>
        </Link>

        {/* Links de navegación */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                  isActive
                    ? showCrystal ? 'bg-brand-accent/10 text-brand-accent' : 'bg-white/20 text-white'
                    : showCrystal
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Perfil & Acceso Rápido */}
        <div className="flex items-center gap-3 shrink-0">
          <button className={`transition-colors text-lg cursor-pointer ${
            showCrystal 
              ? 'text-gray-500 hover:text-brand-accent' 
              : 'text-white/80 hover:text-white'
          }`}>
            🔔
          </button>
          
          <Link 
            href="/perfil"
            title="Ver mi perfil"
            className={`relative z-10 block w-7 h-7 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer border shadow-sm ${
              showCrystal ? 'border-gray-200' : 'border-white/20'
            }`}
          >
            <span className="sr-only">Perfil</span>
          </Link>
        </div>

      </div>
    </header>
  );
}