'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const EASE = [0.4, 0, 0.2, 1] as const;

const navLinks = [
  { label: 'Directorio', href: '/directorio' },
  { label: 'Especialidades', href: '/#especialidades' },
  { label: 'Departamentos', href: '/#departamentos' },
  { label: 'Soporte', href: '/contact' },
];

interface LandingNavbarProps {
  variant?: 'hero' | 'light';
}

function NavLink({
  href,
  label,
  isActive,
  onDark,
  onClick,
}: {
  href: string;
  label: string;
  isActive: boolean;
  onDark: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        'rounded-[9999px] px-4 py-2 text-sm font-medium transition-colors duration-300 transition-premium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        isActive
          ? onDark
            ? 'bg-white/15 text-white'
            : 'bg-primary/10 text-primary'
          : onDark
            ? 'text-white/85 hover:bg-white/10 hover:text-white'
            : 'text-text hover:bg-secondary hover:text-text',
      ].join(' ')}
    >
      {label}
    </Link>
  );
}

export default function LandingNavbar({ variant = 'hero' }: LandingNavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onDark = variant === 'hero' && !scrolled;
  const navStyle = onDark ? 'glass-nav-dark' : 'glass-nav';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav
          aria-label="Navegación principal"
          className={[
            'flex w-fit items-center gap-2 rounded-[9999px] px-3 py-2.5 shadow-md transition-all duration-300 transition-premium',
            navStyle,
          ].join(' ')}
          style={{ margin: '0 auto' }}
        >
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                {...link}
                onDark={onDark}
                isActive={
                  !link.href.startsWith('/#') &&
                  (pathname === link.href || pathname.startsWith(`${link.href}/`))
                }
              />
            ))}
          </div>

          <Link
            href="/contact"
            className="hidden rounded-[9999px] bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 transition-premium hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:inline-flex"
          >
            Soy Médico
          </Link>

          <button
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-[9999px] transition-colors md:hidden ${
              onDark ? 'text-white hover:bg-white/10' : 'text-text hover:bg-secondary'
            }`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-text/30 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-nav-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="fixed left-1/2 top-[4.5rem] z-50 w-fit -translate-x-1/2 rounded-[var(--radius-card)] border border-border bg-white p-4 shadow-lg md:hidden"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    {...link}
                    onDark={false}
                    isActive={pathname === link.href}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-[9999px] bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Soy Médico
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
