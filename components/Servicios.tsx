'use client';

import { useState, useRef, useLayoutEffect } from 'react';
import { servicios } from '@/data/content';

export default function Servicios() {
  const [open, setOpen] = useState<number | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    servicios.forEach((_, i) => {
      const panel = panelRefs.current[i];
      const inner = innerRefs.current[i];
      if (!panel || !inner) return;
      if (i === open) {
        panel.style.height = inner.scrollHeight + 'px';
      } else {
        panel.style.height = '0px';
      }
    });
  }, [open]);

  return (
    <section id="servicios" className="servicios">
      <div className="aos-section">
        <div className="servicios__head" data-reveal>
          <div className="aos-section-head">
            <h2 className="aos-title">Servic<span className="accent">ios.</span></h2>
            <span className="aos-underline" data-underline />
          </div>
        </div>

        <div className="servicios-list" role="list">
          {servicios.map((s, i) => (
            <div key={i} className={`servicio-row${open === i ? ' is-open' : ''}`} data-reveal data-reveal-delay={String(100 + i * 90)}>
              <button
                className="servicio-row__head"
                type="button"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="servicio-row__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="servicio-row__name">{s.nombre}</span>
                <span className="servicio-row__sign">+</span>
              </button>
              <div className="servicio-row__panel" ref={el => { panelRefs.current[i] = el; }}>
                <div className="servicio-row__panel-inner" ref={el => { innerRefs.current[i] = el; }}>
                  <p>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
