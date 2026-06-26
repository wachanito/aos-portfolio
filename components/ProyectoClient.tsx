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
        <p className="pw-gate__hint">Este proyecto está protegido. Ingresa la contraseña para acceder.</p>
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
  const videoRef      = useRef<HTMLVideoElement>(null);
  const mediaRef      = useRef<HTMLDivElement>(null);
  const phraseRef     = useRef<HTMLDivElement>(null);
  const climaxNumRef  = useRef<HTMLDivElement>(null);
  const hideTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing,      setPlaying]      = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(1);
  const [muted,        setMuted]        = useState(false);
  const [showControls, setShowControls] = useState(true);

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

  // Video player events
  useEffect(() => {
    if (!unlocked || p.mediaTipo !== 'video') return;
    const v = videoRef.current;
    if (!v) return;
    function onPlay()  { setPlaying(true); }
    function onPause() { setPlaying(false); setShowControls(true); }
    function onTime()  { setCurrentTime(v!.currentTime); }
    function onDur()   { if (isFinite(v!.duration)) setDuration(v!.duration); }
    function onVol()   { setVolume(v!.volume); setMuted(v!.muted); }
    v.addEventListener('play',           onPlay);
    v.addEventListener('pause',          onPause);
    v.addEventListener('timeupdate',     onTime);
    v.addEventListener('durationchange', onDur);
    v.addEventListener('volumechange',   onVol);
    return () => {
      v.removeEventListener('play',           onPlay);
      v.removeEventListener('pause',          onPause);
      v.removeEventListener('timeupdate',     onTime);
      v.removeEventListener('durationchange', onDur);
      v.removeEventListener('volumechange',   onVol);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [unlocked, p.mediaTipo]);

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

  function resetHideTimer() {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowControls(true);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 2500);
  }
  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); resetHideTimer(); } else { v.pause(); }
  }
  function handleMouseMove() { if (playing) resetHideTimer(); }
  function handleMouseLeave() {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) setShowControls(false);
  }
  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  }
  function changeVolume(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current;
    if (!v) return;
    const val = parseFloat(e.target.value);
    v.volume = val;
    v.muted  = val === 0;
  }
  function toggleMute() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted && v.volume === 0) v.volume = 0.5;
  }
  function fmt(s: number) {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }
  const progress = duration ? (currentTime / duration) * 100 : 0;
  const ctrlVis  = showControls || !playing;

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
        {p.mediaTipo === 'video' ? (
          <div className={mediaClass} data-media onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="proyecto-media__inner">
              <video ref={videoRef} loop playsInline preload="metadata"
                poster={p.posterUrl}
                src={p.mediaUrl || undefined}
                onClick={togglePlay}
                style={{ cursor: 'pointer' }}
              />
            </div>

            <button
              className={`proyecto-play${playing ? ' is-hidden' : ''}`}
              type="button"
              aria-label={playing ? 'Pausar' : 'Reproducir'}
              onClick={togglePlay}
            >
              <span className="ring"><i /></span>
            </button>

            <span className="proyecto-media__badge proyecto-media__badge--top">
              <span className="tri-right" style={{ borderLeftColor: '#0f0f0f' }} />Video · Videocaso
            </span>

            <div className={`proyecto-vbar${ctrlVis ? ' is-visible' : ''}`}>
              <button className="proyecto-vbar__pp" type="button" onClick={togglePlay}
                aria-label={playing ? 'Pausar' : 'Reproducir'}>
                {playing
                  ? <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><rect x="0" y="0" width="4" height="14"/><rect x="8" y="0" width="4" height="14"/></svg>
                  : <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor"><path d="M0 0l12 7L0 14z"/></svg>
                }
              </button>

              <div className="proyecto-vbar__progress" onClick={seek}
                role="slider" aria-label="Progreso"
                aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
                <div className="proyecto-vbar__filled" style={{ width: `${progress}%` }} />
              </div>

              <span className="proyecto-vbar__time">{fmt(currentTime)} / {fmt(duration)}</span>

              <button className="proyecto-vbar__mute" type="button" onClick={toggleMute}
                aria-label={muted || volume === 0 ? 'Activar sonido' : 'Silenciar'}>
                {muted || volume === 0
                  ? <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><path d="M0 4h3l5-3v12L3 10H0V4z"/><path d="M11 5l4 4m0-4l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
                  : volume < 0.5
                  ? <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><path d="M0 4h3l5-3v12L3 10H0V4z"/><path d="M11 4.5a4 4 0 0 1 0 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                  : <svg width="16" height="14" viewBox="0 0 16 14" fill="currentColor"><path d="M0 4h3l5-3v12L3 10H0V4z"/><path d="M11 4.5a4 4 0 0 1 0 5M13.5 2a7 7 0 0 1 0 10" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/></svg>
                }
              </button>

              <input type="range" className="proyecto-vbar__vol" min="0" max="1" step="0.01"
                value={muted ? 0 : volume}
                onChange={changeVolume}
                aria-label="Volumen"
              />
            </div>
          </div>
        ) : (
          <div className={mediaClass} data-media ref={mediaRef}>
            <div className="proyecto-media__inner" data-media-inner>
              {p.mediaUrl ? <img src={p.mediaUrl} alt={p.titulo} /> : null}
            </div>
            <span className="proyecto-media__badge">Media de apertura · Board</span>
          </div>
        )}
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
