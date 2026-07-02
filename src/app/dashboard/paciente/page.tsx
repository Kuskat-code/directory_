import { redirect } from 'next/navigation';
import { getAuthenticatedRole } from '@/src/lib/auth';
import { getCurrentUserSession } from '@/src/features/profile/profile.actions';
import PacienteDashboard from '@/src/components/dashboard/PacienteDashboard';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export default async function PacienteDashboardPage() {
  const { user, role } = await getAuthenticatedRole();
  
  if (!user || role !== 'paciente') {
    redirect('/');
  }

  const sessionResp = await getCurrentUserSession();
  if (!sessionResp.success || !sessionResp.data) {
    redirect('/');
  }

  return (
    <>
      <Header />
      <PacienteDashboard user={sessionResp.data} />
      <Footer />
    </>
  );
}
