import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import HeroSection from '@/src/components/HeroSection';
import BranchesMapSection from '@/src/features/directory/components/BranchesMapSection';
import FeaturesSection from '@/src/components/FeaturesSection';
import PricingSection from '@/src/components/PricingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFA]">
      <Header />
      <main className="flex flex-col">
        <HeroSection />
        <BranchesMapSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
