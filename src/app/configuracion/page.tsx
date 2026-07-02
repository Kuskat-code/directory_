import { requireRole } from '@/src/lib/auth'
import Header from '@/src/components/Header'
import Footer from '@/src/components/Footer'
import ConfiguracionContent from '@/src/components/configuracion/ConfiguracionContent'

export default async function ConfiguracionPage() {
  await requireRole(['doctor', 'admin'], '/?auth=login')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20 md:pt-24">
        <ConfiguracionContent />
      </main>
      <Footer />
    </div>
  )
}
