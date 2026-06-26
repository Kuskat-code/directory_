import { Suspense } from 'react';
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ProfileContent from '@/src/components/ProfileContent';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <Header />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="min-h-screen bg-brand-light flex items-center justify-center">
            <div className="text-gray-400 text-sm font-semibold">Cargando perfil...</div>
          </div>
        }>
          <ProfileContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}