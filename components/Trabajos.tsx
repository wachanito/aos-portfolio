import Link from 'next/link';
import { proyectos } from '@/data/proyectos';

export default function Trabajos() {
  return (
    <section id="trabajos" className="trabajos">
      <div className="aos-section">
        <div className="trabajos__head" data-reveal>
          <span className="aos-eyebrow"><span className="aos-eyebrow__dot" />Selección de trabajos</span>
          <div className="aos-section-head">
            <h2 className="aos-title">Trabajos</h2>
            <span className="aos-underline" data-underline />
          </div>
          <span className="trabajos__index">[ {String(proyectos.length).padStart(2, '0')} ]</span>
        </div>

        <div className="trabajos-grid">
          {proyectos.map((p, idx) => {
            const board = p.boardUrl || p.posterUrl || p.mediaUrl || '';
            const isVideo = p.mediaTipo === 'video';
            return (
              <Link
                key={p.slug}
                className="trabajo-card"
                href={`/proyectos/${p.slug}`}
                data-reveal
                data-reveal-delay={String(idx * 80)}
                {...(isVideo ? { 'data-has-video': '' } : {})}
              >
                <div className="trabajo-card__top">
                  <span className="trabajo-card__index">{p.numero}</span>
                  <span className="trabajo-card__arrow" aria-hidden="true">&#8599;</span>
                </div>

                <div className="trabajo-card__frame">
                  {isVideo && (
                    <span className="trabajo-card__badge">
                      <span className="tri-right" />Video
                    </span>
                  )}
                  <div
                    className="trabajo-card__board trabajo-card__board--striped"
                    style={board ? { backgroundImage: `url('${board}')`, backgroundSize: p.boardFit ?? 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } : undefined}
                  >
                    {!board && <span>{isVideo ? 'Videocaso' : 'Board · miniatura'}</span>}
                    {p.enDesarrollo && (
                      <span className="trabajo-card__wip-stamp" aria-hidden="true">EN PROGRESO</span>
                    )}
                  </div>
                  {isVideo && (
                    <>
                      <div className="trabajo-card__playhint" aria-hidden="true">
                        <span className="ring"><i /></span>
                      </div>
                      <div className="trabajo-card__playhead" aria-hidden="true" />
                    </>
                  )}
                </div>

                <div className="trabajo-card__meta">
                  <div className="trabajo-card__name">{p.titulo}</div>
                  <div className={`trabajo-card__role${isVideo ? ' trabajo-card__role--accent' : ''}`}>{p.rol}</div>
                  {p.enDesarrollo && <span className="trabajo-card__wip">En curso</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
