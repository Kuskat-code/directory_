import { redirect } from 'next/navigation';
import { getAuthenticatedRole } from '@/src/lib/auth';
import ConfiguracionContent from '@/src/components/configuracion/ConfiguracionContent';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export default async function ConfiguracionPage() {
  const { user } = await getAuthenticatedRole();

  if (!user) {
    redirect('/?auth=login');
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50/50 min-h-screen pt-20">
        <ConfiguracionContent />
      </div>
      <Footer />
    </>
  );
}
