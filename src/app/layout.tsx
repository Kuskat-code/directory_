import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import AuthModal from "@/src/components/AuthModal";
import { getSiteUrl, siteConfig } from "@/src/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteConfig.title,
    template: "%s | Directorio Médico El Salvador",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "directorio médico el salvador",
    "médicos en el salvador",
    "especialistas médicos",
    "doctores san miguel",
    "citas médicas",
  ],
  authors: [{ name: "Directorio Médico El Salvador" }],
  creator: "Directorio Médico El Salvador",
  publisher: "Directorio Médico El Salvador",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_SV",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen">
        {children}
        <Suspense fallback={null}>
          <AuthModal />
        </Suspense>
      </body>
    </html>
  );
}
