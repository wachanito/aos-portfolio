'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { proyectos } from '@/data/proyectos';

const links = [
  { href: '#inicio',         label: 'Inicio' },
  { href: '#trabajos',       label: 'Trabajos', hasDrop: true },
  { href: '#sobre-mi',       label: 'Sobre mí' },
  { href: '#certificaciones',label: 'Credenciales' },
  { href: '#servicios',      label: 'Servicios' },
  { href: '#contacto',       label: 'Contacto' },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active,     setActive]     = useState('');
  const [dropOpen,   setDropOpen]   = useState(false);
  const dropRef = useRef<HTMLLIElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setMobileOpen(false);
    setDropOpen(false);
    document.body.classList.remove('nav-open');
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(el, { offset: -64 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
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
              l.hasDrop ? (
                <li
                  key={l.href}
                  ref={dropRef}
                  className={`nav-item--drop${dropOpen ? ' is-open' : ''}`}
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  <a
                    href={l.href}
                    className={active === l.href ? 'is-active' : ''}
                    onClick={e => handleAnchor(e, l.href)}
                    data-glitch
                  >
                    {l.label}
                  </a>

                  <div className="nav-dropdown" role="menu">
                    {proyectos.map(p => (
                      <Link
                        key={p.slug}
                        href={`/proyectos/${p.slug}`}
                        className="nav-dropdown__item"
                        role="menuitem"
                        onClick={() => setDropOpen(false)}
                      >
                        {p.titulo}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={active === l.href ? 'is-active' : ''}
                    onClick={e => handleAnchor(e, l.href)}
                    data-glitch
                  >
                    {l.label}
                  </a>
                </li>
              )
            ))}
          </ul>
        </nav>

        <button
          className="nav-toggle"
          aria-controls="mobile-nav"
          aria-expanded={mobileOpen}
          aria-label="Abrir menú"
          onClick={() => {
            setMobileOpen(o => {
              const next = !o;
              document.body.classList.toggle('nav-open', next);
              return next;
            });
          }}
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
