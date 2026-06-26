'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function scramble(el: HTMLElement) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@!¿?';
  const original = el.dataset.final || el.textContent || '';
  el.dataset.final = original;
  let iter = 0;
  clearInterval((el as any)._t);
  (el as any)._t = setInterval(() => {
    el.textContent = original.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (i < iter) return original[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    iter += 0.9;
    if (iter >= original.length) { clearInterval((el as any)._t); el.textContent = original; }
  }, 34);
}

export default function GlobalEffects() {
  const router   = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const coarseRef  = useRef(false);

  // ── One-time setup: cursor, Lenis, scroll bar, glitch, page transitions ──
  useEffect(() => {
    const COARSE  = window.matchMedia('(pointer: coarse)').matches;
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    coarseRef.current = COARSE;

    // ── Page transition overlay ──
    if (!REDUCED) {
      const overlay = document.createElement('div');
      overlay.id = 'page-transition';
      document.body.appendChild(overlay);
      overlayRef.current = overlay;
      // Fade in on initial load
      overlay.classList.add('is-active');
      requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.remove('is-active')));

      // Event delegation — capture phase catches Next.js <Link> clicks before React handler
      document.addEventListener('click', (e) => {
        const a = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
        if (!a) return;
        const href = a.getAttribute('href') || '';
        // Skip anchors, mailto, tel, external, _blank
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || a.target === '_blank') return;
        if (href.startsWith('http') && !href.startsWith(window.location.origin)) return;
        // Resolve path: relative ("/proyectos/x") or absolute (full URL)
        const dest = href.startsWith('http') ? new URL(a.href).pathname : href;
        e.preventDefault();
        e.stopPropagation();
        overlay.classList.add('is-active');
        setTimeout(() => { router.push(dest); }, 320);
      }, true); // capture = true
    }

    // ── Custom cursor ──
    if (!COARSE) {
      document.documentElement.classList.add('aos-cursor');
      const dot  = document.createElement('div'); dot.className  = 'aos-cursor-dot';
      const ring = document.createElement('div'); ring.className = 'aos-cursor-ring';
      document.body.appendChild(dot); document.body.appendChild(ring);
      let rx = window.innerWidth / 2, ry = window.innerHeight / 2, cx = rx, cy = ry;
      window.addEventListener('mousemove', e => {
        rx = e.clientX; ry = e.clientY;
        dot.style.left = rx + 'px'; dot.style.top = ry + 'px';
      });
      (function loop() {
        requestAnimationFrame(loop);
        cx += (rx - cx) * 0.11; cy += (ry - cy) * 0.11;
        ring.style.left = cx + 'px'; ring.style.top = cy + 'px';
      })();
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

    // ── Glitch hover on [data-glitch] ──
    const glitchChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@!';
    if (!COARSE) {
      document.querySelectorAll<HTMLElement>('[data-glitch]').forEach(el => {
        const original = el.textContent || '';
        let timer: ReturnType<typeof setInterval>;
        el.addEventListener('mouseenter', () => {
          let iter = 0;
          clearInterval(timer);
          timer = setInterval(() => {
            el.textContent = original.split('').map((c, i) => {
              if (c === ' ') return ' ';
              if (i < iter) return original[i];
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }).join('');
            iter += 0.55;
            if (iter >= original.length) { clearInterval(timer); el.textContent = original; }
          }, 38);
        });
        el.addEventListener('mouseleave', () => { clearInterval(timer); el.textContent = original; });
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Per-route: fade-in overlay + reveals + underlines ──
  useEffect(() => {
    // Fade overlay out after each route change (triggered by router.push too)
    const overlay = overlayRef.current;
    if (overlay) {
      requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.remove('is-active')));
    }

    const COARSE = coarseRef.current || window.matchMedia('(pointer: coarse)').matches;

    // Observe only elements not yet revealed (handles returning to home page)
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)');
    const revealIO = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.transitionDelay = (el.dataset.revealDelay || '0') + 'ms';
          el.classList.add('is-revealed');
          const qt = el.querySelector<HTMLElement>('[data-qtext]');
          if (qt && !COARSE) scramble(qt);
          revealIO.unobserve(el);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    revealItems.forEach(el => revealIO.observe(el));

    const underlineItems = document.querySelectorAll<HTMLElement>('[data-underline]:not(.is-drawn)');
    const underlineIO = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-drawn'); underlineIO.unobserve(e.target); }
      }),
      { threshold: 0.4 }
    );
    underlineItems.forEach(el => underlineIO.observe(el));

    return () => { revealIO.disconnect(); underlineIO.disconnect(); };
  }, [pathname]);

  return null;
}
