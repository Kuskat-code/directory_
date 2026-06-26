import Footer from '@/src/components/Footer';
import LandingNavbar from '@/src/components/LandingNavbar';
import FeaturedDoctorsSection from '@/src/components/landing/FeaturedDoctorsSection';
import OrienteMapSection from '@/src/components/landing/OrienteMapSection';
import SpecialtiesSection from '@/src/components/landing/SpecialtiesSection';
import TrustSection from '@/src/components/landing/TrustSection';
import ValuePropositionSection from '@/src/components/landing/ValuePropositionSection';
import HeroVideo from '@/src/features/directory/components/HeroVideo';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface">
      <LandingNavbar variant="hero" />
      <main className="flex flex-col">
        <HeroVideo />
        <ValuePropositionSection />
        <OrienteMapSection />
        <SpecialtiesSection />
        <FeaturedDoctorsSection />
        <TrustSection />
      </main>
      <Footer />
    </div>
  );
}
