'use client';

import LandingNavbar from '@/src/components/LandingNavbar';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  return <LandingNavbar variant="light" />;
}
