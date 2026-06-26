import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import HeroSearch from '@/src/features/directory/components/HeroSearch';
import OrienteMapSection from '@/src/components/landing/OrienteMapSection';
import SpecialtiesSection from '@/src/components/landing/SpecialtiesSection';
import FeaturesSection from '@/src/components/FeaturesSection';
import PricingSection from '@/src/components/PricingSection';

const VIDEO_URL = '/doctor_writting.mp4';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="flex flex-col">
        <HeroSearch variant="video" videoSrc={VIDEO_URL} />
        <div id="features">
          <FeaturesSection />
        </div>
        <OrienteMapSection />
        <SpecialtiesSection />
        <div id="pricing">
          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
