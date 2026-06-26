import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import { MEDICAL_SPECIALTIES } from '@/src/lib/constants';

export default function Footer() {
  return (
    <footer className="mt-auto bg-text py-14 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-button)] gradient-primary">
              <Stethoscope className="h-5 w-5 text-white" aria-hidden="true" />
            </span>
            <span className="text-xl font-bold">MedDirectorio</span>
          </div>
          <p className="text-sm text-white/60">
            El directorio medico de referencia en El Salvador. Conectamos pacientes con especialistas verificados.
          </p>
          <p className="mt-2 text-xs text-white/40">
            &copy; {new Date().getFullYear()} MedDirectorio El Salvador. Todos los derechos reservados.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Especialidades</h3>
          <ul className="flex flex-col gap-2 text-sm text-white/60">
            {MEDICAL_SPECIALTIES.slice(0, 5).map((spec) => (
              <li key={spec}>
                <Link
                  href={`/directorio?specialty=${encodeURIComponent(spec)}`}
                  className="transition-colors hover:text-white"
                >
                  {spec}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Legal</h3>
          <ul className="flex flex-col gap-2 text-sm text-white/60">
            <li><Link href="/terms" className="transition-colors hover:text-white">Terminos de servicio</Link></li>
            <li><Link href="/privacy" className="transition-colors hover:text-white">Politica de privacidad</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Soporte</h3>
          <ul className="flex flex-col gap-2 text-sm text-white/60">
            <li><Link href="/contact" className="transition-colors hover:text-white">Contactar soporte</Link></li>
            <li><Link href="/directorio" className="transition-colors hover:text-white">Buscar especialistas</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
