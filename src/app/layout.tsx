import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AccessibilityBar from "@/components/AccessibilityBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Conecta Digital — Alfabetización digital gratuita",
  description:
    "Plataforma gratuita y accesible para aprender a usar el correo, WhatsApp, trámites en línea y seguridad digital. Pensada para adultos mayores y comunidades de bajos recursos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <AccessibilityBar />
        <div id="contenido" className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}
