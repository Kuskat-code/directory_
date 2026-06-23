import Link from 'next/link';
import { PROFESSIONS } from '@/src/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">DirectorioPro</h2>
          <p className="text-sm text-gray-400">
            El directorio profesional líder del país. Conectando talento con oportunidades.
          </p>
          <p className="text-xs text-gray-500 mt-4">
            © 2024 DirectorioPro El Salvador. El directorio profesional líder del país.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-brand-white">Profesiones</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            {PROFESSIONS?.slice(0, 4).map((prof) => (
              <li key={prof.id}>
                <Link href={`/directory?profession=${prof.id}`} className="hover:text-white transition">
                  {prof.id.charAt(0).toUpperCase() + prof.id.slice(1)}s
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-brand-white">Legal</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4 text-brand-white">Soporte</h3>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            <li><Link href="/contact" className="hover:text-white transition">Contact Support</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
