'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/src/components/ui/Button';
import {
  signOutAction,
  type UserSessionData,
} from '@/src/features/profile/profile.actions';
import {
  AUTH_CHANGE_EVENT,
  getCachedUserSession,
  invalidateCachedUserSession,
} from '@/src/features/profile/lib/session-client-cache';

interface HeaderProps {
  /**
   * Session resolved server-side by HeaderServer (src/components/HeaderServer.tsx).
   * When provided the component renders the correct auth state immediately —
   * no skeleton, no async fetch on mount.
   * Omitting this prop (legacy / standalone usage) falls back to the skeleton
   * + client-side fetch path.
   */
  initialUser?: UserSessionData | null;
}

function getNavLinks(role: UserSessionData['role'] | null) {
  const links: { label: string; href: string }[] = [];

  if (role === 'paciente') {
    links.push({ label: 'Inicio', href: '/dashboard/paciente' });
  } else if (role === 'doctor') {
    links.push({ label: 'Inicio', href: '/dashboard/doctor' });
  } else if (role === 'admin') {
    links.push({ label: 'Inicio', href: '/dashboard/admin' });
  } else {
    links.push({ label: 'Inicio', href: '/' });
  }

  links.push({ label: 'Directorio Médico', href: '/directorio' });

  if (role !== 'admin' && role !== 'paciente') {
    links.push({ label: 'Planes', href: '/precios' });
  }

  return links;
}

function isNavLinkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header({ initialUser }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // When initialUser is provided by the Server Component parent, start from that value
  // immediately (no flash, no skeleton).  When it is undefined (legacy / standalone usage),
  // start from undefined so the skeleton shows until the async fetch resolves.
  const [user, setUser] = useState<UserSessionData | null | undefined>(
    initialUser !== undefined ? initialUser : undefined,
  );
  const [profileAvatar, setProfileAvatar] = useState<string | null>(
    initialUser?.avatar ?? null,
  );

  // Track whether the server already provided a resolved session so the mount
  // effect can skip the redundant initial client-side fetch.
  const hasInitialUser = useRef(initialUser !== undefined);

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
      const response = await getCachedUserSession();
      if (response.success && response.data) {
        setUser(response.data);
        setProfileAvatar(response.data.avatar);
      } else {
        setUser(null);
        setProfileAvatar(null);
      }
    }

    // Skip the initial client-side fetch when the server already resolved the
    // session — the state is already correct from `initialUser`.  We still
    // register the AUTH_CHANGE_EVENT listener so login/logout via AuthModal
    // (which can't go through the server) updates the header without a reload.
    if (!hasInitialUser.current) {
      void loadSession();
    }

    window.addEventListener(AUTH_CHANGE_EVENT, loadSession);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, loadSession);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — session only changes on explicit auth events, not on route change

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
    invalidateCachedUserSession();
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
                    className={`relative text-[1.05rem] font-medium tracking-wide transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'text-primary' : 'text-gray-700 hover:opacity-70'
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
            {user === undefined ? (
              // ── Loading skeleton ─────────────────────────────────────────────────
              // Rendered on the very first paint before the async session resolves.
              // Matches the login-button height so nothing shifts when the real UI
              // appears.  Absolutely positioned → zero CLS impact on the layout.
              <div
                className="h-10 w-28 animate-pulse rounded-[var(--radius-button)] bg-gray-200/70"
                aria-hidden="true"
              />
            ) : user ? (
              // ── Authenticated ────────────────────────────────────────────────────
              <div className="flex items-center gap-4">
                {role === 'doctor' || role === 'admin' ? (
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
                        loading="eager"
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
                          {role === 'doctor' ? (
                            <Link
                              href={`/perfil?id=${user.id}`}
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Personalizar
                            </Link>
                          ) : (
                            <Link
                              href="/dashboard/admin"
                              onClick={() => setDropdownOpen(false)}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Dashboard
                            </Link>
                          )}
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
                    href="#"
                    className="relative block h-10 w-10 overflow-hidden rounded-full ring-2 ring-teal-500 transition-all hover:ring-teal-600 active:scale-95 shadow-sm"
                    title="Mi cuenta"
                  >
                    <Image
                      src={profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'Usuario')}`}
                      alt="Foto de perfil"
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                      loading="eager"
                    />
                  </Link>
                )}
              </div>
            ) : (
              // ── Not authenticated ────────────────────────────────────────────────
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 transition-premium active:scale-[0.98] border ${hasSolidBg
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
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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
                    className={`block text-lg font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-700 hover:text-teal-600'
                      }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {user === undefined ? null : user ? (
              // ── Mobile: authenticated ──────────────────────────────────────────
              <>
                {(role === 'doctor' || role === 'admin') && (
                  <>
                    {role === 'doctor' ? (
                      <li>
                        <Link
                          href={`/perfil?id=${user.id}`}
                          onClick={() => setMenuOpen(false)}
                          className="block text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors"
                        >
                          Personalizar
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <Link
                          href="/dashboard/admin"
                          onClick={() => setMenuOpen(false)}
                          className="block text-lg font-medium text-gray-700 hover:text-teal-600 transition-colors"
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
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
                      loading="eager"
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
              // ── Mobile: not authenticated ──────────────────────────────────────
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
