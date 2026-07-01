'use client';

import { useEffect, useRef } from 'react';

const WORDS = ['DATA', 'AUDIENCIA', 'ESTRATEGIA', 'CONTENIDO', 'PERFORMANCE',
               'EMAIL MARKETING', 'ANALYTICS', 'BRANDING', 'REDES SOCIALES', 'PRODUCCIÓN'];

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbitRef  = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── GSAP entrance ──
    async function initGSAP() {
      const { gsap } = await import('gsap');

      // Esperar a que el preloader termine (con fallback por si algo falla)
      await new Promise<void>(res => {
        if ((window as any).__aosLoaded) return res();
        const on = () => { window.removeEventListener('aos:loaded', on); res(); };
        window.addEventListener('aos:loaded', on);
        setTimeout(() => { window.removeEventListener('aos:loaded', on); res(); }, 3500);
      });

      if (REDUCED) {
        document.querySelectorAll<HTMLElement>('.hero__title .word').forEach(w => { w.style.transform = 'none'; w.style.opacity = '1'; });
        const l = document.querySelector<HTMLElement>('.hero__label'); if (l) { l.style.opacity = '1'; l.style.transform = 'none'; }
        const cta = document.querySelector<HTMLElement>('.hero__cta'); if (cta) cta.style.opacity = '1';
        const hdr = document.querySelector<HTMLElement>('.site-header'); if (hdr) { hdr.style.opacity = '1'; hdr.style.transform = 'none'; }
        const cv = document.querySelector<HTMLElement>('.hero-curtain'); if (cv) cv.style.display = 'none';
        return;
      }

      // Hide nav & CTA behind the curtain so they reveal with the animation
      gsap.set('.site-header', { opacity: 0, y: -18 });
      gsap.set('.hero__cta',   { opacity: 0, y: 12  });

      const tl = gsap.timeline({ delay: 0.05 });

      // 1. Projector-start flash
      tl.to('.hero-flash', { opacity: 0.13, duration: 0.06, ease: 'none' })
        .to('.hero-flash', { opacity: 0,    duration: 0.22, ease: 'power1.out' });

      // 2. Curtain rips open (slow start → explosive finish)
      tl.to('.hero-curtain__top', { y: '-101%', duration: 0.68, ease: 'expo.in' }, 0.03);
      tl.to('.hero-curtain__bot', { y: '101%',  duration: 0.68, ease: 'expo.in' }, 0.03);

      // 3. Words slam in from above while curtain is still tearing
      tl.fromTo('.hero__title .word',
        { y: -58, scale: 1.14, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.52, stagger: 0.07, ease: 'expo.out' },
        0.42
      );

      // 4. Nav drops down
      tl.to('.site-header', { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' }, 0.52);

      // 5. Label
      tl.to('.hero__label', { opacity: 1, y: 0, duration: 0.42, ease: 'power2.out' }, 0.78);

      // 6. CTA
      tl.to('.hero__cta', { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out' }, 0.92);

      // 7. Remove curtain from paint after animation
      tl.set('.hero-curtain', { display: 'none' }, 1.1);
    }

    // ── Three.js sphere ──
    async function initSphere() {
      const canvas = canvasRef.current!;
      const orbit  = orbitRef.current;
      if (!canvas) return;

      // Skip on touch/mobile — too expensive, not worth it at small size
      if (window.matchMedia('(pointer: coarse)').matches) {
        canvas.style.display = 'none';
        if (orbit) orbit.style.display = 'none';
        return;
      }

      const THREE = await import('three');

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setClearColor(0x000000, 0);
      // Cap at 1.5 — 2x doubles GPU load on Retina screens with minimal visual gain
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 5;

      const R = 1.482, WS = 12, HS = 8;
      const linePos: number[] = [];
      for (let j = 1; j < HS; j++) {
        const phi = Math.PI * j / HS, yr = R * Math.cos(phi), rr = R * Math.sin(phi);
        for (let i = 0; i < WS; i++) {
          const t0 = 2 * Math.PI * i / WS, t1 = 2 * Math.PI * (i + 1) / WS;
          linePos.push(rr * Math.cos(t0), yr, rr * Math.sin(t0));
          linePos.push(rr * Math.cos(t1), yr, rr * Math.sin(t1));
        }
      }
      for (let ii = 0; ii < WS; ii++) {
        const theta = 2 * Math.PI * ii / WS;
        for (let jj = 0; jj < HS; jj++) {
          const p0 = Math.PI * jj / HS, p1 = Math.PI * (jj + 1) / HS;
          linePos.push(R * Math.sin(p0) * Math.cos(theta), R * Math.cos(p0), R * Math.sin(p0) * Math.sin(theta));
          linePos.push(R * Math.sin(p1) * Math.cos(theta), R * Math.cos(p1), R * Math.sin(p1) * Math.sin(theta));
        }
      }
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
      const mesh = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0x6b6762, transparent: true, opacity: 0.85 }));
      scene.add(mesh);

      type V3 = InstanceType<typeof THREE.Vector3>;
      const tagNodes: V3[] = [];
      [[Math.PI / 3, 0], [2 * Math.PI / 3, Math.PI / 5]].forEach(([phi, offset]) => {
        for (let k = 0; k < 5; k++) {
          const th = 2 * Math.PI * k / 5 + offset;
          tagNodes.push(new THREE.Vector3(R * Math.sin(phi) * Math.cos(th), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(th)));
        }
      });
      const ptPos = tagNodes.flatMap(v => [v.x, v.y, v.z]);
      const ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute('position', new THREE.Float32BufferAttribute(ptPos, 3));
      const verts = new THREE.Points(ptGeo, new THREE.PointsMaterial({ color: 0x5c0a12, size: 0.07 }));
      scene.add(verts);

      function updateScale() {
        const mob = window.innerWidth < 768, s = mob ? 0.62 : 1.0;
        mesh.scale.set(s, s, s); verts.scale.set(s, s, s);
        mesh.material.opacity = mob ? 0.45 : 0.85;
        camera.position.y = mob ? -0.7 : 0;
      }
      updateScale();

      function resize() {
        updateScale();
        const w = canvas.clientWidth, h = canvas.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        if (orbit) { orbit.width = orbit.clientWidth; orbit.height = orbit.clientHeight; }
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      let rawX = window.innerWidth / 2, rawY = window.innerHeight / 2;
      let mx = 0, my = 0, tx = 0, ty = 0, autoAngle = 0;
      let currentSpeed = 0.0035, targetSpeed = 0.0035;
      const scales = new Array(10).fill(1);
      function onMouseMove(e: MouseEvent) { rawX = e.clientX; rawY = e.clientY; tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; }
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const ctx = orbit ? orbit.getContext('2d') : null;
      let animId: number;

      function drawOrbit() {
        if (!ctx || !orbit || orbit.clientWidth === 0) return;
        const w = orbit.width, h = orbit.height;
        if (!w || !h) return;
        ctx.clearRect(0, 0, w, h);
        const rc = orbit.getBoundingClientRect();
        const lmx = rawX - rc.left, lmy = rawY - rc.top;
        const HOVER_R = 100;
        let hovered = -1;

        const data = tagNodes.map((orig, idx) => {
          const v = orig.clone().applyMatrix4(mesh.matrixWorld);
          const ndc = v.clone().project(camera);
          if (ndc.z > 1) return null;
          const px = (ndc.x + 1) / 2 * w, py = (-ndc.y + 1) / 2 * h;
          const near = Math.max(0, Math.min(1, (1 - ndc.z) / 2));
          const dist = Math.sqrt((lmx - px) ** 2 + (lmy - py) ** 2);
          if (dist < HOVER_R) hovered = idx;
          const prox = Math.max(0, 1 - dist / HOVER_R);
          scales[idx] += ((1 + prox * 0.5) - scales[idx]) * 0.12;
          return { px, py, near, dist, worldZ: v.z, idx };
        });

        targetSpeed = hovered >= 0 ? 0.0003 : 0.0035;

        const cv = new THREE.Vector3(0, 0, 0).applyMatrix4(mesh.matrixWorld).project(camera);
        const cpx = (cv.x + 1) / 2 * w, cpy = (-cv.y + 1) / 2 * h;
        const tp = (Date.now() % 2000) / 2000;
        ctx.save(); ctx.globalAlpha = (1 - tp) * 0.65; ctx.strokeStyle = '#5c0a12'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cpx, cpy, 3 + tp * 28, 0, Math.PI * 2); ctx.stroke(); ctx.restore();

        const isMob = window.innerWidth < 768;
        let sorted = (data.filter(Boolean) as NonNullable<typeof data[0]>[]).sort((a, b) => a.near - b.near);
        if (isMob) sorted = sorted.slice(-3);
        sorted.forEach(d => {
          const FADE = 0.35;
          const fa = d.worldZ > FADE ? 1 : d.worldZ < -FADE ? 0 : (d.worldZ + FADE) / (2 * FADE);
          if (fa < 0.02) return;
          const isHov = d.dist < HOVER_R;
          const fs = isMob ? Math.round(7 + (10 - 7) * d.near) : Math.round(10 + (14 - 10) * d.near);
          ctx.save(); ctx.translate(d.px, d.py); ctx.scale(scales[d.idx], scales[d.idx]);
          ctx.font = `700 ${fs}px "Courier Prime", monospace`;
          try { (ctx as any).letterSpacing = isMob ? '0.5px' : '1.5px'; } catch {}
          const tw = ctx.measureText(WORDS[d.idx]).width;
          const bw = tw + (isMob ? 14 : 28), bh = fs + (isMob ? 8 : 12);
          ctx.globalAlpha = isHov ? fa : (0.5 + 0.5 * d.near) * fa;
          ctx.fillStyle = isHov ? '#5c0a12' : '#3a3835';
          ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
          ctx.fillStyle = '#e8e4df'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(WORDS[d.idx], 0, 0);
          ctx.restore();
        });
      }

      let frame = 0;
      function animate() {
        if (document.hidden) { animId = requestAnimationFrame(animate); return; }
        animId = requestAnimationFrame(animate);
        frame++;
        mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
        currentSpeed += (targetSpeed - currentSpeed) * 0.028;
        autoAngle += currentSpeed;
        mesh.rotation.y = autoAngle + mx * 0.18;
        mesh.rotation.x = my * 0.12;
        verts.rotation.copy(mesh.rotation);
        renderer.render(scene, camera);
        // drawOrbit at 30fps (every other frame) — canvas 2D tags don't need 60fps
        if (frame % 2 === 0) drawOrbit();
      }
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouseMove);
        renderer.dispose();
      };
    }

    initGSAP();
    const cleanup = initSphere();
    return () => { cleanup?.then(fn => fn && fn()); };
  }, []);

  return (
    <section id="inicio" className="hero" aria-labelledby="hero-heading">
      <div className="hero-curtain" aria-hidden="true">
        <div className="hero-curtain__top" />
        <div className="hero-curtain__bot" />
      </div>
      <div className="hero-flash" aria-hidden="true" />

      <canvas ref={canvasRef} id="hero-canvas" className="hero__canvas" aria-hidden="true" />
      <canvas ref={orbitRef} id="hero-orbit" aria-hidden="true" />

      <div className="hero__content">
        <p className="hero__label">
          <span className="hero__dot" aria-hidden="true" />
          <span>Estratega Digital</span>
        </p>

        <h1 id="hero-heading" className="hero__title">
          <span className="word-clip"><span className="word">CONVIERTO</span></span>
          <span className="word-clip"><span className="word word--accent">DATA</span></span>
          <br aria-hidden="true" />
          <span className="word-clip"><span className="word">EN</span></span>
          <span className="word-clip"><span className="word">AUDIENCIA</span></span>
        </h1>

        <a href="#trabajos" className="hero__cta" data-magnetic="0.4"
           onClick={e => {
             e.preventDefault();
             const el = document.getElementById('trabajos');
             if (!el) return;
             if ((window as any).lenis) { (window as any).lenis.scrollTo(el, { offset: -64 }); }
             else { el.scrollIntoView({ behavior: 'smooth' }); }
           }}>
          <span>Ver trabajos</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="hero__bottom" aria-hidden="true">
        <span>Santiago &mdash; Chile</span>
        <span>&copy;{new Date().getFullYear()}</span>
      </div>
    </section>
  );
}
