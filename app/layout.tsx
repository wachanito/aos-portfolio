import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import GlobalEffects from '@/components/GlobalEffects';

export const metadata: Metadata = {
  title: 'Agustín Oyarzún — Estratega Digital',
  description: 'Portfolio de Agustín Oyarzún. Estrategia digital, datos y contenido que mueve el indicador. Santiago de Chile.',
  openGraph: {
    title: 'Agustín Oyarzún — Estratega Digital',
    description: 'Portfolio de Agustín Oyarzún. Estrategia digital, datos y contenido que mueve el indicador.',
    siteName: 'AOS Portfolio',
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Agustín Oyarzún — Estratega Digital',
    description: 'Portfolio de Agustín Oyarzún. Estrategia digital, datos y contenido que mueve el indicador.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Preload critical fonts to eliminate render-blocking */}
        <link rel="preload" href="/fonts/anton-v27-latin-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/courier-prime-v11-latin-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/courier-prime-v11-latin-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <Nav />
        <GlobalEffects />
        {children}
        <footer className="site-footer">
          <span className="logo">AOS<span>.</span></span>
          <span>Santiago, Chile &mdash; {new Date().getFullYear()}</span>
        </footer>
      </body>
    </html>
  );
}
