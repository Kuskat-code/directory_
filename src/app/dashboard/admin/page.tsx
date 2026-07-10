import { requireRole } from '@/src/lib/auth';
import Footer from '@/src/components/Footer';
import AdminDashboard from '@/src/components/dashboard/AdminDashboard';

export default async function AdminDashboardPage() {
  await requireRole(['admin'], '/');

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 md:pt-24">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
}
