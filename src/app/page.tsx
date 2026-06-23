// src/app/page.tsx
import Header from '@/src/components/Header';
import Footer from '@/src/components/Footer';
import HeroVideo from '@/src/features/directory/components/HeroVideo';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Header fuera del main */}
      <Header />
      
      {/* 2. Main content */}
      <main className="flex flex-col">
        <HeroVideo />
      </main>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
}
