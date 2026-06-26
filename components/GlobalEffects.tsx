'use client';

import { useEffect } from 'react';

export default function GlobalEffects() {
  useEffect(() => {
    const COARSE  = window.matchMedia('(pointer: coarse)').matches;
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Page transition overlay ──
    if (!REDUCED) {
      const overlay = document.createElement('div');
      overlay.id = 'page-transition';
      document.body.appendChild(overlay);
      overlay.classList.add('is-active');
      requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.remove('is-active')));
      document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
        if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;
        a.addEventListener('click', e => {
          e.preventDefault();
          const dest = a.href;
          overlay.classList.add('is-active');
          setTimeout(() => { window.location.href = dest; }, 380);
        });
      });
    }

    // ── Custom cursor ──
    if (!COARSE) {
      document.documentElement.classList.add('aos-cursor');
      const dot  = document.createElement('div'); dot.className  = 'aos-cursor-dot';
      const ring = document.createElement('div'); ring.className = 'aos-cursor-ring';
      document.body.appendChild(dot); document.body.appendChild(ring);
      let rx = window.innerWidth / 2, ry = window.innerHeight / 2, cx = rx, cy = ry;
      window.addEventListener('mousemove', e => { rx = e.clientX; ry = e.clientY; dot.style.left = rx + 'px'; dot.style.top = ry + 'px'; });
      (function loop() { requestAnimationFrame(loop); cx += (rx - cx) * 0.11; cy += (ry - cy) * 0.11; ring.style.left = cx + 'px'; ring.style.top = cy + 'px'; })();
    }

    // ── Lenis smooth scroll ──
    async function initLenis() {
      if (REDUCED) return;
      const { default: Lenis } = await import('lenis');
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      function raf(t: number) { lenis.raf(t); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      (window as any).lenis = lenis;
    }
    initLenis();

    // ── Scroll progress bar ──
    const bar = document.createElement('div'); bar.className = 'scroll-progress';
    const fill = document.createElement('div'); fill.className = 'scroll-progress__fill';
    bar.appendChild(fill); document.body.appendChild(bar);
    function updateProgress() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.transform = `scaleY(${max > 0 ? window.scrollY / max : 0})`;
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }, []);

  return null;
}
