'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';
import {
  getCurrentUserSession,
  signOutAction,
  type UserSessionData,
} from '@/src/features/profile/profile.actions';

// Links se definen dinámicamente dentro del componente por rol

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

  // Auth States
  const [user, setUser] = useState<UserSessionData | null>(null);
  const [profileAvatar, setProfileAvatar] = useState<string | null>(null);

  const isHeroPage = pathname === '/';
  const hasSolidBg = scrolled || !isHeroPage || menuOpen;

  const getNavLinks = () => {
    if (!user) {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Directorio', href: '/directorio' },
        { label: 'Precios', href: '/precios' },
        { label: 'Soporte', href: '/soporte' },
      ];
    }
    if (user.role === 'paciente') {
      return [
        { label: 'Home', href: '/dashboard/paciente' },
        { label: 'Directorio', href: '/directorio' },
      ];
    }
    if (user.role === 'doctor') {
      return [
        { label: 'Home', href: '/dashboard/doctor' },
        { label: 'Directorio', href: '/directorio' },
        { label: 'Precios', href: '/precios' },
      ];
    }
    if (user.role === 'admin') {
      return [
        { label: 'Home', href: '/dashboard/doctor' },
        { label: 'Directorio', href: '/directorio' },
        { label: 'Precios', href: '/precios' },
        { label: 'Admin', href: '/dashboard/admin' },
      ];
    }
    return [
      { label: 'Inicio', href: '/' },
      { label: 'Directorio', href: '/directorio' },
    ];
  };

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

  // Auth Hook (Safe server-side session loading, reactive to pathname and auth-change events)
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

  const handleSignOut = async () => {
    await signOutAction();
    // Limpiamos los estados de inmediato para reactividad instantánea en pantalla
    setUser(null);
    setProfileAvatar(null);
    
    if (pathname === '/perfil') {
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
            {getNavLinks().map((link) => {
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
              user.role === 'doctor' ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-teal-500 transition-all hover:ring-teal-600 active:scale-95 shadow-sm cursor-pointer"
                    title="Menú de usuario"
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
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 z-20">
                        <Link
                          href={`/perfil?id=${user.id}`}
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Personalizar
                        </Link>
                        <Link
                          href="/configuracion"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Configurar
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            handleSignOut();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100 cursor-pointer"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : user.role === 'paciente' ? (
                <div className="flex items-center gap-4">
                  <div className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-teal-500 shadow-sm">
                    <Image
                      src={profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Paciente')}`}
                      alt="Foto de perfil"
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 transition-premium active:scale-[0.98] border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/20 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-teal-500 shadow-sm">
                    <Image
                      src={profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Admin')}`}
                      alt="Foto de perfil"
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 transition-premium active:scale-[0.98] border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/20 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )
            ) : (
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 transition-premium active:scale-[0.98] border cursor-pointer ${
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
            {getNavLinks().map((link) => {
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
                <li className="flex items-center gap-3 py-2 border-t border-gray-100">
                  {user.role === 'doctor' ? (
                    <div className="flex flex-col gap-2 w-full">
                      <Link
                        href={`/perfil?id=${user.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 font-semibold text-gray-700"
                      >
                        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-teal-500">
                          <Image
                            src={profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Doctor')}`}
                            alt="Foto de perfil"
                            fill
                            sizes="40px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span>Mi Perfil</span>
                      </Link>
                      <Link
                        href="/configuracion"
                        onClick={() => setMenuOpen(false)}
                        className="block py-1 text-sm font-semibold text-gray-600 hover:text-teal-600"
                      >
                        Configurar
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 font-semibold text-gray-700">
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
                      <span>{user.name} ({user.role})</span>
                    </div>
                  )}
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
