import type { MetadataRoute } from 'next';
import { MEDICAL_SPECIALTIES } from '@/src/lib/constants';
import { getSiteUrl } from '@/src/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getSiteUrl('/').toString(),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: getSiteUrl('/directorio').toString(),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: getSiteUrl('/perfil').toString(),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  const specialtyRoutes = MEDICAL_SPECIALTIES.map((specialty) => ({
    url: getSiteUrl(`/directorio?specialty=${encodeURIComponent(specialty)}`).toString(),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...specialtyRoutes];
}
