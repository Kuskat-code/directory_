import { Suspense } from 'react';
import DirectorioContent from './DirectorioContent';

export default function DirectorioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    }>
      <DirectorioContent />
    </Suspense>
  );
}
