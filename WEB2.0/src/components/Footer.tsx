import Link from 'next/link';
import {
  ORIENTE_DEPARTMENT_IDS,
  getOrienteDepartment,
} from '@/src/lib/oriente-departments';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-text py-14 text-white">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <span className="text-xl font-bold">MedDirectorio</span>
          <p className="text-sm leading-relaxed text-white/70">
            Directorio médico de El Salvador. Ayudamos a pacientes a encontrar especialistas y a médicos a tener presencia digital profesional.
          </p>
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} MedDirectorio El Salvador
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Departamentos</h3>
          <ul className="flex flex-col gap-2 text-sm text-white/65">
            {ORIENTE_DEPARTMENT_IDS.map((id) => {
              const dept = getOrienteDepartment(id);
              return (
                <li key={id}>
                  <Link
                    href={`/directorio/${dept.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    {dept.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Enlaces</h3>
          <ul className="flex flex-col gap-2 text-sm text-white/65">
            <li><Link href="/directorio" className="transition-colors hover:text-white">Directorio</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-white">Soy Médico</Link></li>
            <li><Link href="/contact" className="transition-colors hover:text-white">Soporte</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
