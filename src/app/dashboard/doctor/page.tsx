import { redirect } from 'next/navigation';
import { getAuthenticatedRole } from '@/src/lib/auth';
import { getCurrentUserSession } from '@/src/features/profile/profile.actions';
import DoctorDashboard from '@/src/components/dashboard/DoctorDashboard';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';

export default async function DoctorDashboardPage() {
  const { user, role } = await getAuthenticatedRole();
  
  if (!user || (role !== 'doctor' && role !== 'admin')) {
    redirect('/');
  }

  const sessionResp = await getCurrentUserSession();
  if (!sessionResp.success || !sessionResp.data) {
    redirect('/');
  }

  return (
    <>
      <Header />
      <DoctorDashboard user={sessionResp.data} />
      <Footer />
    </>
  );
}
