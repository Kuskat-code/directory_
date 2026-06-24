import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Directorio Medico de El Salvador | Especialistas verificados",
  description:
    "Directorio medico premium de El Salvador. Busca especialistas verificados, compara resenas y agenda citas con confianza.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth" className={inter.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

