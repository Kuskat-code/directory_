import Link from 'next/link';
import { MEDICAL_SPECIALTIES } from '@/src/lib/constants';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 shadow-md py-8 text-gray-700">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Directorio </span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Especialidades</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-700/60">
            {MEDICAL_SPECIALTIES.slice(0, 5).map((spec) => (
              <li key={spec}>
                <Link
                  href={`/directorio?specialty=${encodeURIComponent(spec)}`}
                  className="transition-colors hover:text-gray-700"
                >
                  {spec}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Legal</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-700/60">
            <li><Link href="/terms" className="transition-colors hover:text-gray-700">Terminos de servicio</Link></li>
            <li><Link href="/privacy" className="transition-colors hover:text-gray-700">Politica de privacidad</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Soporte</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-700/60">
            <li><Link href="/contact" className="transition-colors hover:text-gray-700">Contactar soporte</Link></li>
            <li><Link href="/directorio" className="transition-colors hover:text-gray-700">Buscar especialistas</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-gray-200 px-4 pt-6 text-center sm:px-6 lg:px-8">
        <p className="text-xs text-gray-400">
          &copy; 2026 El Salvador. Todos los derechos reservados.
        </p>
        <p className="text-xs text-gray-400">
          Powered by{' '}
          <a
            href="https://kuskat-code.github.io/Portfolio-Kuskat/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-gray-700"
          >
            Kuskat Labs
          </a>
        </p>
      </div>
    </footer>
  );
}
