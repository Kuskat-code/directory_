import { Suspense } from 'react';
import Footer from '@/src/components/Footer';
import ProfileContent from '@/src/components/ProfileContent';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-secondary/40 flex flex-col">
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="skeleton h-12 w-12 rounded-full" />
          </div>
        }>
          <ProfileContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}