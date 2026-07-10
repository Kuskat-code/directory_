import Footer from '@/src/components/Footer'
import PricingSection from '@/src/components/PricingSection'

export default function PreciosPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-20 md:pt-24">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900">Planes y Precios</h1>
            <p className="mt-2 text-lg text-gray-600">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>
          <PricingSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
