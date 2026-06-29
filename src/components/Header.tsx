'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Directorio', href: '/directorio' },
  { label: 'Precios', href: '/precios' },
  { label: 'Soporte', href: '/soporte' },
];

function isNavLinkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHeroPage = pathname === '/';
  const hasSolidBg = scrolled || !isHeroPage || menuOpen;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (scrolled) setMenuOpen(false);
  }, [scrolled]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out',
        hasSolidBg ? 'bg-white/95 shadow-md backdrop-blur-md' : 'bg-transparent shadow-none',
      ].join(' ')}
    >
      <nav aria-label="Navegacion principal">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-center px-6 md:h-20">
          <ul className="hidden items-center gap-8 md:flex lg:gap-10">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative text-[1.05rem] font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive ? 'text-primary' : 'text-gray-700 hover:opacity-70'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Botones de acción (Escritorio) */}
          <div className="absolute right-6 hidden md:flex items-center gap-3">
            {/* Botón Acceso Admin Temporal */}
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                hasSolidBg && !menuOpen
                  ? 'bg-slate-800 text-white hover:bg-slate-700 shadow-sm'
                  : 'border border-white/30 bg-black/10 text-white backdrop-blur-sm hover:bg-black/20'
              }`}
            >
              Portal Admin ⚙️
            </button>

            {hasSolidBg && !menuOpen ? (
              <Button
                size="sm"
                className="whitespace-nowrap"
                onClick={() => router.push('/perfil')}
              >
                Iniciar sesión
              </Button>
            ) : (
              <button
                type="button"
                onClick={() => router.push('/perfil')}
                className="rounded-lg border border-gray-300 px-5 py-2.5 text-[1.05rem] font-semibold whitespace-nowrap text-gray-700 transition-all duration-300 hover:bg-gray-50 md:border-white md:text-white md:hover:bg-white/10"
              >
                Iniciar sesión
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="absolute right-6 flex flex-col gap-1.5 p-2 text-gray-800 transition-colors duration-300 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Cerrar menu' : 'Abrir menu'}
          >
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </button>
        </div>

        {/* Menú Desplegable (Móvil) */}
        <div
          id="mobile-nav"
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ul className="flex flex-col gap-4 bg-white/95 px-6 pb-6 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = isNavLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block text-lg font-medium transition-colors ${
                      isActive ? 'text-primary' : 'text-gray-700 hover:text-teal-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="flex flex-col gap-2 pt-2 border-t border-gray-100">
              {/* Botón Admin en Móvil */}
              <button
                type="button"
                className="w-full rounded-xl bg-slate-800 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-slate-700"
                onClick={() => {
                  setMenuOpen(false);
                  router.push('/admin');
                }}
              >
                Portal Admin ⚙️
              </button>
              
              <Button
                className="w-full"
                onClick={() => {
                  setMenuOpen(false);
                  router.push('/perfil');
                }}
              >
                Iniciar sesión
              </Button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}