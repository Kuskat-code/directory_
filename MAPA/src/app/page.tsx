import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import HeroVideo from '@/src/features/directory/components/HeroVideo';
import EasternMapSection from '@/src/features/directory/components/EasternMapSection';
import FeaturesSection from '@/src/components/FeaturesSection';
import PricingSection from '@/src/components/PricingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="flex flex-col">
        <HeroVideo />
        <EasternMapSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}