import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import HeroVideo from '@/src/features/directory/components/HeroVideo';
import PricingSection from '@/src/components/PricingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex flex-col">
        <HeroVideo />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}