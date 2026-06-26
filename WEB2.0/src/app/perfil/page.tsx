import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import ProfileContent from '@/src/components/ProfileContent';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <Header />
      {/* Eliminamos por completo el padding-top (pt) para que el banner suba hasta el borde */}
      <main className="flex-grow">
        <ProfileContent />
      </main>
      <Footer />
    </div>
  );
}