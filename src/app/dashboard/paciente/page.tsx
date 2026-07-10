import { requireRole } from '@/src/lib/auth';
import Footer from '@/src/components/Footer';
import PacienteDashboard from '@/src/components/dashboard/PacienteDashboard';

export default async function PacienteDashboardPage() {
  await requireRole(['paciente'], '/?auth=login');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 md:pt-24">
        <PacienteDashboard />
      </main>
      <Footer />
    </div>
  );
}
