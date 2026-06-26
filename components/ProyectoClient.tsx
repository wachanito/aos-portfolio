'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Proyecto } from '@/lib/types';

interface Props {
  proyecto: Proyecto;
  prev: Proyecto;
  next: Proyecto;
}

function PasswordGate({ titulo, onUnlock }: { titulo: string; onUnlock: () => void }) {
  const [val, setVal] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (val === 'Becker123') { onUnlock(); }
    else { setError(true); setTimeout(() => setError(false), 1800); }
  }

  return (
    <div className="proyecto-password-wrap">
      <form className="pw-gate" onSubmit={handleSubmit}>
        <span className="pw-gate__eyebrow"><span className="pw-gate__lock">&#9632;</span> CONFIDENCIAL</span>
        <h1 className="pw-gate__title">{titulo}</h1>
        <p className="pw-gate__hint">Este proyecto está protegido. Ingresá la contraseña para acceder.</p>
        {error && <p className="pw-gate__error">Contraseña incorrecta</p>}
        <div className="pw-gate__field">
          <input
            type="password" placeholder="Contraseña" autoComplete="current-password"
            value={val} onChange={e => setVal(e.target.value)}
          />
          <button type="submit">Entrar <span aria-hidden="true">&#8594;</span></button>
        </div>
      </form>
    </div>
  );
}

function parseMetric(valor: string) {
  const m = valor.trim().match(/^([^\d.,\-]*)\s*(-?[\d.,]+)(.*)$/u);
  if (m) {
    const num = m[2].replace(',', '.');
    return { prefix: m[1].trim(), value: parseFloat(num), suffix: m[3], decimals: num.includes('.') ? 1 : 0, raw: valor };
  }
  return { prefix: '', value: 0, suffix: '', decimals: 0, raw: valor };
}

export default function ProyectoClient({ proyecto: p, prev, next }: Props) {
  const [unlocked, setUnlocked] = useState(!p.password);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLDivElement>(null);
  const climaxNumRef = useRef<HTMLDivElement>(null);

  // Check localStorage for saved unlock
  useEffect(() => {
    if (p.password && typeof window !== 'undefined') {
      if (localStorage.getItem(`unlocked_${p.slug}`) === '1') setUnlocked(true);
    }
  }, [p.password, p.slug]);

  function handleUnlock() {
    setUnlocked(true);
    if (typeof window !== 'undefined') localStorage.setItem(`unlocked_${p.slug}`, '1');
  }

  // Reveals + underlines
  useEffect(() => {
    if (!unlocked) return;
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-revealed'); io.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    items.forEach(el => io.observe(el));
    const underlines = document.querySelectorAll<HTMLElement>('[data-underline]');
    const uio = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-drawn'); uio.unobserve(e.target); } }),
      { threshold: 0.4 }
    );
    underlines.forEach(el => uio.observe(el));
    return () => { io.disconnect(); uio.disconnect(); };
  }, [unlocked]);

  // Phrase reveal
  useEffect(() => {
    if (!unlocked || !phraseRef.current) return;
    const el = phraseRef.current;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { el.classList.add('is-revealed'); io.disconnect(); } }),
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [unlocked]);

  // Count-up
  useEffect(() => {
    if (!unlocked || !climaxNumRef.current || p.tipoClimax !== 'numerico' || !p.climaxNums?.length) return;
    const el = climaxNumRef.current;
    const main = parseMetric(p.climaxNums[0].valor);
    function format(v: number) {
      const n = main.decimals > 0 ? v.toFixed(main.decimals).replace('.', ',') : String(Math.round(v));
      return main.prefix + n + main.suffix;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const dur = 1600, start = performance.now();
        function ease(t: number) { return 1 - Math.pow(1 - t, 3); }
        function tick(now: number) {
          const t = Math.min(1, (now - start) / dur);
          el.textContent = format(ease(t) * main.value);
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [unlocked, p]);

  // Parallax
  useEffect(() => {
    if (!unlocked || p.mediaTipo === 'video') return;
    const media = mediaRef.current;
    if (!media) return;
    const inner = media.querySelector<HTMLElement>('[data-media-inner]');
    if (!inner) return;
    function onScroll() {
      if (!media) return;
      if (window.innerWidth <= 600) { inner!.style.transform = ''; return; }
      const r = media.getBoundingClientRect();
      const prog = (r.top + r.height / 2) / window.innerHeight - 0.5;
      inner!.style.transform = `translateY(${prog * -36}px)`;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [unlocked, p.mediaTipo]);

  // Lightbox
  useEffect(() => {
    if (!unlocked) return;
    const box = document.createElement('div'); box.className = 'aos-lightbox';
    box.innerHTML = '<button class="aos-lightbox__close" aria-label="Cerrar">&times;</button><img class="aos-lightbox__img" src="" alt="">';
    document.body.appendChild(box);
    const img = box.querySelector<HTMLImageElement>('.aos-lightbox__img')!;
    const btn = box.querySelector<HTMLButtonElement>('.aos-lightbox__close')!;
    function openLb(src: string) { img.src = src; box.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
    function closeLb() { box.classList.remove('is-open'); document.body.style.overflow = ''; setTimeout(() => { img.src = ''; }, 260); }
    const imgs = document.querySelectorAll<HTMLImageElement>('.proyecto-gallery__cell img');
    imgs.forEach(el => el.addEventListener('click', () => openLb(el.src)));
    btn.addEventListener('click', closeLb);
    box.addEventListener('click', e => { if (e.target === box) closeLb(); });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLb(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.removeChild(box); document.removeEventListener('keydown', onKey); };
  }, [unlocked]);

  if (!unlocked) return <PasswordGate titulo={p.titulo} onUnlock={handleUnlock} />;

  const mainNum = p.tipoClimax === 'numerico' && p.climaxNums?.length ? parseMetric(p.climaxNums[0].valor) : null;
  const extras  = p.climaxNums?.slice(1) ?? [];
  const mediaClass = `proyecto-media${p.mediaTipo === 'video' ? ' proyecto-media--video' : p.boardFit === 'contain' ? ' proyecto-media--natural' : ''}`;

  function renderGallery(imgs: string[], extraClass = '') {
    const cols = imgs.length >= 3 ? '3' : imgs.length === 2 ? '2' : '1';
    return (
      <div className={`proyecto-gallery proyecto-gallery--accion proyecto-gallery--${cols}${imgs.length === 1 ? ' proyecto-gallery--solo' : ''} ${extraClass}`}>
        {imgs.map((url, i) => <div key={i} className="proyecto-gallery__cell"><img src={url} alt="" /></div>)}
      </div>
    );
  }

  function renderArticle(eyebrow: string, heading: string, body: string, extraClass = '', gallery?: string[]) {
    return (
      <article className={`proyecto-article ${extraClass}`} data-reveal>
        <div className="proyecto-article__grid">
          <div>
            <span className="proyecto-article__eyebrow">{eyebrow}</span>
            <h2 className="proyecto-article__h" dangerouslySetInnerHTML={{ __html: heading }} />
            <span className="proyecto-article__rule" />
          </div>
          <div className="proyecto-article__body">
            <p>{body}</p>
            {gallery && gallery.length > 0 && renderGallery(gallery)}
          </div>
        </div>
      </article>
    );
  }

  const insightEyebrow = p.insight ? '[ 02 — El insight ]' : '';
  const accionEyebrow  = p.insight ? '[ 03 — La gran idea ]' : '[ 02 — Estrategia y ejecución ]';
  const accionHeading  = p.insight ? 'La gran<br>idea' : 'La<br>Acción';
  const resEyebrow     = p.insight ? '[ 04 — La ambición ]' : '[ 03 — Desenlace ]';

  return (
    <article className="proyecto" style={{ '--accent': 'var(--clr-red)' } as React.CSSProperties}>
      <Link href="/#trabajos" className="proyecto-back">
        <span className="arr" aria-hidden="true">&#8592;</span> Volver a trabajos
      </Link>

      <div className="proyecto-wrap">
        <header className="proyecto-header">
          <span className="proyecto-header__num">{p.numero}</span>
          <h1 className={`proyecto-header__title${p.titulo.length > 12 ? ' proyecto-header__title--condensed' : ''}`}>{p.titulo}</h1>
          {p.rol && <span className="proyecto-header__badge">{p.rol}</span>}
        </header>

        {p.tags && (
          <div className="proyecto-metatags">
            {p.tags.split('·').map(t => <span key={t}>{t.trim()}</span>)}
          </div>
        )}
      </div>

      <div className="proyecto-media-wrap">
        <div className={mediaClass} data-media ref={mediaRef}>
          <div className="proyecto-media__inner" data-media-inner>
            {p.mediaTipo === 'video' ? (
              <video ref={videoRef} loop playsInline preload="metadata"
                poster={p.posterUrl}
                src={p.mediaUrl || undefined} />
            ) : p.mediaUrl ? (
              <img src={p.mediaUrl} alt={p.titulo} />
            ) : null}
          </div>
          {p.mediaTipo === 'video' ? (
            <>
              <button className="proyecto-play" data-play type="button" aria-label="Reproducir"
                onClick={() => { const v = videoRef.current; if (v) v.paused ? v.play() : v.pause(); }}>
                <span className="ring"><i /></span>
              </button>
              <span className="proyecto-media__badge proyecto-media__badge--top">
                <span className="tri-right" style={{ borderLeftColor: '#0f0f0f' }} />Video · Videocaso
              </span>
            </>
          ) : (
            <span className="proyecto-media__badge">Media de apertura · Board</span>
          )}
        </div>
      </div>

      {p.esPropuesta && (
        <div className="proyecto-banner">
          Propuesta de concurso — pensamiento estratégico. Las cifras mencionadas son objetivos, no resultados ejecutados.
        </div>
      )}

      <div className="proyecto-narrative">
        {renderArticle('[ 01 — Punto de partida ]', 'El<br>Reto', p.reto)}
        {p.insight && renderArticle(insightEyebrow, 'El<br>Insight', p.insight, 'proyecto-article--insight')}
        {renderArticle(accionEyebrow, accionHeading, p.accion, '', p.galeria)}
        {renderArticle(resEyebrow, 'El<br>Resultado', p.resultado)}
      </div>

      {/* Clímax */}
      {p.tipoClimax === 'numerico' && mainNum && (
        <section className="proyecto-climax">
          <div className="proyecto-climax__num" ref={climaxNumRef}>
            {mainNum.prefix}0{mainNum.suffix}
          </div>
          <div className="proyecto-climax__label">{p.climaxNums![0].label}</div>
          {extras.length > 0 && (
            <div className="proyecto-substats">
              {extras.map((ex, i) => (
                <div key={i} className="proyecto-substats__cell">
                  <div className="proyecto-substats__num">{ex.valor}</div>
                  <div className="proyecto-substats__label">{ex.label}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {p.tipoClimax === 'frase' && p.climaxFrase && (
        <section className="proyecto-climax">
          <div className="proyecto-climax__phrase" ref={phraseRef} data-phrase>{p.climaxFrase}</div>
          {p.climaxSublabel && <div className="proyecto-climax__label">{p.climaxSublabel}</div>}
        </section>
      )}

      {/* Galería secundaria */}
      {p.galeria2 && p.galeria2.length > 0 && (
        <section className="proyecto-secondary">
          <span className="proyecto-secondary__eyebrow">[ Galería del proyecto ]</span>
          {(() => {
            const cols = p.galeria2!.length >= 3 ? '3' : p.galeria2!.length === 2 ? '2' : '1';
            return (
              <div className={`proyecto-gallery proyecto-gallery--${cols}`}>
                {p.galeria2!.map((url, i) => (
                  <div key={i}>
                    <div className="proyecto-gallery__cell"><img src={url} alt="" /></div>
                    <span className="proyecto-gallery__cell__label">Click para agrandar</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
      )}

      {/* Prev / Next */}
      <nav className="proyecto-pnav">
        <Link href={`/proyectos/${prev.slug}`}>
          <span className="proyecto-pnav__k"><span className="arr" aria-hidden="true">&#8592;</span> Proyecto anterior</span>
          <span className="proyecto-pnav__title">{prev.titulo}</span>
        </Link>
        <Link href={`/proyectos/${next.slug}`} className="is-next">
          <span className="proyecto-pnav__k">Proyecto siguiente <span className="arr" aria-hidden="true">&#8594;</span></span>
          <span className="proyecto-pnav__title">{next.titulo}</span>
        </Link>
      </nav>
    </article>
  );
}
