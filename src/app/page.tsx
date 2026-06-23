import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import HeroVideo from '@/src/features/directory/components/HeroVideo';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex flex-col">
        <HeroVideo />
      </main>
      <Footer />
    </div>
  );
}
