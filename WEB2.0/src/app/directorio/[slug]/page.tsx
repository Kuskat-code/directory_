import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import DirectorioContent from '../DirectorioContent';
import {
  ORIENTE_DEPARTMENT_IDS,
  ORIENTE_DEPARTMENT_MAP,
  getOrienteDepartmentByRouteSlug,
} from '@/src/lib/oriente-departments';

interface DirectorioDepartmentPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ORIENTE_DEPARTMENT_IDS.map((id) => ({
    slug: ORIENTE_DEPARTMENT_MAP[id].slug,
  }));
}

export default async function DirectorioDepartmentPage({ params }: DirectorioDepartmentPageProps) {
  const { slug } = await params;
  const department = getOrienteDepartmentByRouteSlug(slug);

  if (!department) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-secondary/40">
          <div className="text-sm text-text-muted">Cargando...</div>
        </div>
      }
    >
      <DirectorioContent
        initialLocation={department.location}
        departmentName={department.name}
      />
    </Suspense>
  );
}
