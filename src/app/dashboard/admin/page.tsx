import { redirect } from 'next/navigation';
import { getAuthenticatedRole } from '@/src/lib/auth';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export default async function AdminDashboardPage() {
  const { user, role } = await getAuthenticatedRole();

  if (!user || role !== 'admin') {
    redirect('/');
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl max-w-md text-center">
          <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Consola de Administrador
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-4">Panel de Control</h1>
          <p className="text-sm text-gray-500 mt-2">
            Bienvenido, {user.email}. Tienes acceso total para auditar la base de datos de SaaS Directory.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
