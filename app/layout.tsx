import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import GlobalEffects from '@/components/GlobalEffects';

export const metadata: Metadata = {
  title: 'Agustín Oyarzún — Estratega Digital',
  description: 'Portfolio de Agustín Oyarzún. Estratega digital, publicidad UDP, Santiago de Chile.',
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
          <span>Santiago, Chile &mdash; {new Date().getFullYear()}</span>
        </footer>
      </body>
    </html>
  );
}
