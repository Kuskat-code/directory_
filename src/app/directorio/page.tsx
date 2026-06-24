import { Suspense } from 'react';
import DirectorioContent from './DirectorioContent';

export default function DirectorioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary/40 flex items-center justify-center">
        <div className="text-text-muted text-sm">Cargando...</div>
      </div>
    }>
      <DirectorioContent />
    </Suspense>
  );
}
