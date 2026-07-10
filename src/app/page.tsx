import Footer from '@/src/components/Footer';
import HeroSection from '@/src/components/HeroSection';
import FeaturesSection from '@/src/components/FeaturesSection';
import OrienteMapSection from '@/src/components/landing/OrienteMapSection';
import SpecialtiesSection from '@/src/components/landing/SpecialtiesSection';
import NewsCarousel from '@/src/components/NewsCarousel';
import PricingSection from '@/src/components/PricingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-col">
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <OrienteMapSection />
        <SpecialtiesSection />
        <NewsCarousel />
        <div id="pricing">
          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
