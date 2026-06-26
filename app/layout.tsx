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
      <body>
        <Nav />
        <GlobalEffects />
        {children}
        <footer className="site-footer">
          <span className="logo">AOS<span>.</span></span>
          <nav className="site-footer__links" aria-label="Links sociales">
            <a href="https://www.linkedin.com/in/agust%C3%ADn-oyarz%C3%BAn-4452b82a8/" target="_blank" rel="noopener">LinkedIn ↗</a>
            <a href="https://www.behance.net/agustnoyarzun" target="_blank" rel="noopener">Behance ↗</a>
            <a href="mailto:agustin.oyarzun@mail.udp.cl">Email</a>
          </nav>
          <span>Santiago, Chile &mdash; {new Date().getFullYear()}</span>
        </footer>
      </body>
    </html>
  );
}
