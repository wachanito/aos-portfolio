'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const links = [
  { href: '#inicio',         label: 'Inicio' },
  { href: '#trabajos',       label: 'Trabajos' },
  { href: '#sobre-mi',       label: 'Sobre mí' },
  { href: '#certificaciones',label: 'Credenciales' },
  { href: '#servicios',      label: 'Servicios' },
  { href: '#contacto',       label: 'Contacto' },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = links.map(l => document.getElementById(l.href.slice(1))).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive('#' + e.target.id); });
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: 0 }
    );
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <header className="site-header" role="banner">
        <Link href="/" className="site-logo">
          AOS<span className="site-logo__dot">.</span>
        </Link>

        <nav className="site-nav" aria-label="Navegación principal">
          <ul className="site-nav__list">
            {links.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={active === l.href ? 'is-active' : ''}
                  onClick={e => handleAnchor(e, l.href)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="nav-toggle"
          aria-controls="mobile-nav"
          aria-expanded={mobileOpen}
          aria-label="Abrir menú"
          onClick={() => setMobileOpen(o => !o)}
        >
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
        </button>
      </header>

      <div
        id="mobile-nav"
        className={`site-nav-mobile${mobileOpen ? ' is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <ul>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} onClick={e => handleAnchor(e, l.href)}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
