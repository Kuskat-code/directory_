import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const metadata: Metadata = {
  title: 'MedDirectorio | Encuentra especialistas médicos en El Salvador',
  description:
    'Directorio médico de El Salvador. Encuentra cardiólogos, pediatras, psicólogos y más especialistas en la región Oriente. Contacto directo por WhatsApp.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={inter.variable}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
