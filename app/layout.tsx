import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Nav from '@/components/Nav';
import GlobalEffects from '@/components/GlobalEffects';
import Preloader from '@/components/Preloader';

export const metadata: Metadata = {
  metadataBase: new URL('https://agustin-oyarzun.com'),
  title: 'Agustín Oyarzún — Estratega Digital',
  description: 'Portfolio de Agustín Oyarzún. Estrategia digital, datos y contenido que mueve el indicador. Santiago de Chile.',
  openGraph: {
    title: 'Agustín Oyarzún — Estratega Digital',
    description: 'Portfolio de Agustín Oyarzún. Estrategia digital, datos y contenido que mueve el indicador.',
    url: 'https://agustin-oyarzun.com',
    siteName: 'AOS Portfolio',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AOS — Agustín Oyarzún, Estratega Digital' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agustín Oyarzún — Estratega Digital',
    description: 'Portfolio de Agustín Oyarzún. Estrategia digital, datos y contenido que mueve el indicador.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Aplica el modo invertido antes del primer paint para evitar flash */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('aos-invert')==='1')document.documentElement.classList.add('aos-invert')}catch(e){}" }} />
        {/* Preload critical fonts to eliminate render-blocking */}
        <link rel="preload" href="/fonts/anton-v27-latin-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/courier-prime-v11-latin-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/courier-prime-v11-latin-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <Preloader />
        <Nav />
        <GlobalEffects />
        {children}
        <footer className="site-footer">
          <span className="logo">AOS<span>.</span></span>
          <span>Santiago, Chile &mdash; {new Date().getFullYear()}</span>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
