const DEFAULT_SITE_URL = 'http://localhost:3000';

export const siteConfig = {
  name: 'Directorio Médico El Salvador',
  title: 'Directorio Médico de El Salvador | Especialistas verificados',
  description:
    'Busca médicos y especialistas verificados en El Salvador por especialidad, ubicación y disponibilidad.',
  url: process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL,
};

export function getSiteUrl(path = '/') {
  return new URL(path, siteConfig.url);
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
