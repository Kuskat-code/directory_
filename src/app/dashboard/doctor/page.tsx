import { requireRole } from '@/src/lib/auth';
import Footer from '@/src/components/Footer';
import DoctorDashboard from '@/src/components/dashboard/DoctorDashboard';

export default async function DoctorDashboardPage() {
  await requireRole(['doctor', 'admin'], '/?auth=login');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 md:pt-24">
        <DoctorDashboard />
      </main>
      <Footer />
    </div>
  );
}
