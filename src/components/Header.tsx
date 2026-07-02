'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';
import {
  getCurrentUserSession,
  signOutAction,
  type UserSessionData,
} from '@/src/features/profile/profile.actions';

function getNavLinks(role: UserSessionData['role'] | null) {
  const links: { label: string; href: string }[] = [];

  if (role === 'paciente') {
    links.push({ label: 'Home', href: '/dashboard/paciente' });
  } else if (role === 'doctor' || role === 'admin') {
    links.push({ label: 'Home', href: '/dashboard/doctor' });
  } else {
    links.push({ label: 'Inicio', href: '/' });
  }

  links.push({ label: 'Directorio', href: '/directorio' });

  if (role !== 'paciente') {
    links.push({ label: 'Precios', href: '/precios' });
  }

  if (role === 'admin') {
    links.push({ label: 'Admin', href: '/admin' });
  }

  return links;
}

function isNavLinkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Auth States
  const [user, setUser] = useState<UserSessionData | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  const role = user?.role ?? null;
  const navLinks = getNavLinks(role);
  const isHeroPage = pathname === '/';
  const hasSolidBg = scrolled || !isHeroPage || menuOpen;

  useEffect(() => {
    const handleScroll = () => {
      const nextScrolled = window.scrollY > 20;
      setScrolled(nextScrolled);
      if (nextScrolled) {
        setMenuOpen(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    async function loadSession() {
      const response = await getCurrentUserSession();
      if (response.success && response.data) {
        setUser(response.data);
        setProfileAvatar(response.data.avatar);
      } else {
        setUser(null);
        setProfileAvatar(null);
      }
    }
    void loadSession();

    window.addEventListener('auth-change', loadSession);
    return () => {
      window.removeEventListener('auth-change', loadSession);
    };
  }, [pathname]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOutAction();
    setUser(null);
    setProfileAvatar(null);
    setDropdownOpen(false);

    if (pathname === '/perfil' || pathname.startsWith('/dashboard') || pathname === '/configuracion') {
      router.push('/');
    } else {
      router.refresh();
    }
  };

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out',
        hasSolidBg ? 'bg-white/95 shadow-md backdrop-blur-md' : 'bg-transparent shadow-none',
      ].join(' ')}
    >
      <nav aria-label="Navegación principal">
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

          <div className="absolute right-6 hidden md:block">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Avatar con dropdown solo para doctores */}
                {role === 'doctor' ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-teal-500 transition-all hover:ring-teal-600 active:scale-95 shadow-sm"
                      title="Opciones de perfil"
                    >
                      <Image
                        src={profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Doctor')}`}
                        alt="Foto de perfil"
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-2 shadow-lg"
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            href={`/perfil?id=${user.id}`}
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Personalizar
                          </Link>
                          <Link
                            href="/configuracion"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Configurar
                          </Link>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                              type="button"
                              onClick={handleSignOut}
                              className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                              Cerrar sesión
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={role === 'admin' ? '/admin' : '#'}
                    className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-teal-500 transition-all hover:ring-teal-600 active:scale-95 shadow-sm"
                    title={role === 'admin' ? 'Ir al panel admin' : 'Mi cuenta'}
                  >
                    <Image
                      src={profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Usuario')}`}
                      alt="Foto de perfil"
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </Link>
                )}
                {role !== 'doctor' && (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 transition-premium active:scale-[0.98] border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/20"
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 transition-premium active:scale-[0.98] border ${
                  hasSolidBg
                    ? 'bg-teal-600 text-white border-teal-600 hover:bg-teal-700 shadow-md hover:shadow-lg'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/20'
                }`}
                onClick={() => router.push('?auth=login')}
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
            {user ? (
              <>
                {role === 'doctor' && (
                  <>
                    <li>
                      <Link
                        href={`/perfil?id=${user.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="block text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors"
                      >
                        Personalizar
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/configuracion"
                        onClick={() => setMenuOpen(false)}
                        className="block text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors"
                      >
                        Configurar
                      </Link>
                    </li>
                  </>
                )}
                <li className="flex items-center gap-3 py-2 border-t border-gray-100">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-teal-500">
                    <Image
                      src={profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Usuario')}`}
                      alt="Foto de perfil"
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="font-semibold text-gray-700">{user.name}</span>
                </li>
                <li>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    Cerrar sesión
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Button
                  className="w-full"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push('?auth=login');
                  }}
                >
                  Iniciar sesión
                </Button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
