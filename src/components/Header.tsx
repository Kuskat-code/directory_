'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Stethoscope, X } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

const EASE = [0.4, 0, 0.2, 1] as const;

const navLinks = [
  { label: 'Directorio', href: '/directorio' },
  { label: 'Funciones', href: '/#features' },
  { label: 'Precios', href: '/#pricing' },
];

function Logo({ light }: { light: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2 rounded-[var(--radius-button)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label="Directorio Medico El Salvador - Inicio"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] gradient-primary shadow-md transition-transform duration-300 group-hover:scale-105">
        <Stethoscope className="h-5 w-5 text-white" aria-hidden="true" />
      </span>
      <span className={`hidden font-bold sm:block ${light ? 'text-text' : 'text-white'}`}>
        <span className="gradient-text">Med</span>
        <span className={light ? 'text-text' : 'text-white'}>Directorio</span>
      </span>
    </Link>
  );
}

function NavLink({
  href,
  label,
  isActive,
  isLight,
  onClick,
  layoutId,
}: {
  href: string;
  label: string;
  isActive: boolean;
  isLight: boolean;
  onClick?: () => void;
  layoutId?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative rounded-[var(--radius-button)] px-4 py-2 text-sm font-medium transition-colors duration-300 transition-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive
        ? isLight
          ? 'text-primary'
          : 'text-white'
        : isLight
          ? 'text-text-muted hover:text-text'
          : 'text-white/80 hover:text-white'
        }`}
    >
      {label}
      {isActive && layoutId && (
        <motion.span
          layoutId={layoutId}
          className={`absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full ${isLight ? 'bg-primary' : 'bg-cyan-300'
            }`}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHeroPage = pathname === '/';
  const isLight = scrolled || !isHeroPage;

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
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8 lg:pt-4">
        <nav
          aria-label="Navegacion principal"
          className={[
            'flex items-center justify-between gap-4 rounded-[var(--radius-card)] px-4 py-3 shadow-md transition-all duration-300 transition-premium md:px-6',
            isLight ? 'glass-nav' : 'glass-nav-dark',
          ].join(' ')}
        >
          <Logo light={isLight} />

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                isActive={
                  link.href.startsWith('/#')
                    ? false
                    : pathname === link.href || pathname.startsWith(`${link.href}/`)
                }
                isLight={isLight}
                layoutId="nav-indicator"
              />
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Button
              size="sm"
              className="whitespace-nowrap"
              onClick={() => router.push('/perfil')}
            >
              Perfil Médico
            </Button>
          </div>

          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-button)] transition-colors md:hidden ${isLight ? 'text-text hover:bg-secondary' : 'text-white hover:bg-white/10'
              }`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Cerrar menu' : 'Abrir menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

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
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-white shadow-lg md:hidden"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <Logo light />
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
                      isActive={pathname === link.href}
                      isLight
                      onClick={() => setMobileOpen(false)}
                    />
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border p-4">
                <Button variant="outline" className="w-full">
                  Perfil Medico
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
