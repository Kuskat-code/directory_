import { requireRole } from '@/src/lib/auth';
import Footer from '@/src/components/Footer';
import ConfiguracionContent from '@/src/components/configuracion/ConfiguracionContent';

export default async function ConfiguracionPage() {
  await requireRole(['paciente', 'doctor', 'admin'], '/?auth=login');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 md:pt-24">
        <ConfiguracionContent />
      </main>
      <Footer />
    </div>
  );
}
