'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

const EASE = [0.4, 0, 0.2, 1] as const;

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Directorio', href: '/directorio' },
  { label: 'Precios', href: '/precios' },
  { label: 'Soporte', href: '/soporte' },
];

function NavLink({
  href,
  label,
  isActive,
  onClick,
  layoutId,
  mobileMenu,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  layoutId?: string;
  mobileMenu?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative whitespace-nowrap rounded-[var(--radius-button)] font-medium tracking-wide transition-colors duration-300 transition-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        mobileMenu ? 'block w-full px-4 py-3 text-base' : 'text-[1.05rem]'
      } ${
        isActive ? 'text-primary' : 'text-gray-700 hover:opacity-70'
      }`}
    >
      {label}
      {isActive && layoutId && (
        <motion.span
          layoutId={layoutId}
          className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

function isNavLinkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHeroPage = pathname === '/';
  const hasSolidBg = scrolled || !isHeroPage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    if (!mobileOpen) return () => { document.body.style.overflow = ''; };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out',
        hasSolidBg ? 'bg-white/95 shadow-md backdrop-blur-md' : 'bg-transparent shadow-none',
      ].join(' ')}
    >
      <nav
        aria-label="Navegacion principal"
        className="relative mx-auto flex h-20 w-full max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <NavLink
                {...link}
                isActive={isNavLinkActive(pathname, link.href)}
                layoutId="nav-indicator"
              />
            </li>
          ))}
        </ul>

        <div className="absolute right-4 hidden sm:right-6 md:block lg:right-8">
          {hasSolidBg ? (
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
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-[1.05rem] font-semibold whitespace-nowrap text-gray-700 transition-all duration-300 hover:bg-gray-50"
            >
              Iniciar sesión
            </button>
          )}
        </div>

        <button
          type="button"
          className="absolute right-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-text transition-colors hover:bg-secondary md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-text/40 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegacion"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: EASE }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-white shadow-lg sm:max-w-sm md:hidden"
            >
              <div className="flex justify-end border-b border-border p-4">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-[var(--radius-button)] p-2 text-text-muted hover:bg-secondary"
                  aria-label="Cerrar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-1 p-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, ease: EASE }}
                  >
                    <NavLink
                      {...link}
                      isActive={isNavLinkActive(pathname, link.href)}
                      mobileMenu
                      onClick={() => setMobileOpen(false)}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border p-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push('/perfil');
                  }}
                >
                  Iniciar sesión
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
