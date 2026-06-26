import { HeroSection } from "@/components/hero-section";
import { LandingNavbar } from "@/components/landing-navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50">
      <LandingNavbar />
      <HeroSection />
    </main>
  );
}
