'use client';

import { qa, skillGroups, skillsExtra } from '@/data/content';

export default function SobreMi() {

  return (
    <section id="sobre-mi" className="sobremi">
      <div className="aos-section">
        <div className="sobremi__head" data-reveal>
          <span className="aos-eyebrow"><span className="aos-eyebrow__dot" />Agustín Oyarzún</span>
          <div className="aos-section-head">
            <h2 className="aos-title">Sobre <span className="accent">Mí.</span></h2>
            <span className="aos-underline" data-underline />
          </div>
        </div>

        <div className="sobremi-layout">
          <div className="sobremi-photo-col" data-reveal data-reveal-delay="100">
            <div className="sobremi-photo" data-photo>
              <img src="/img/foto-agustin.webp" alt="Agustín Oyarzún" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
              <span className="sobremi-photo__badge">Agustín O.</span>
            </div>
          </div>

          <div className="sobremi-interview">
            {qa.map((pair, i) => (
              <div key={i} className="qa" data-reveal>
                <div className="qa__q">
                  <span className="mark">P&nbsp;—&nbsp;</span>
                  <span data-qtext>{pair.q}</span>
                </div>
                <div className="qa__a">
                  <span className="mark">R&nbsp;—&nbsp;</span>{pair.a}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="sobremi-data" data-reveal>
          <div className="sobremi-data__item">
            <span className="sobremi-data__k">Ubicación</span>
            <span className="sobremi-data__v">Santiago, CL</span>
          </div>
          <div className="sobremi-data__item">
            <span className="sobremi-data__k">Estudio</span>
            <span className="sobremi-data__v">Publicidad · UDP</span>
          </div>
          <div className="sobremi-data__item">
            <span className="sobremi-data__k">Enfoque</span>
            <span className="sobremi-data__v">Marketing y Medios</span>
          </div>
        </div>

        <div className="sobremi-skills">
          {Object.entries(skillGroups).map(([label, items], gi) => (
            <div key={label} className="sobremi-skills__group" data-reveal data-reveal-delay={String(gi * 80)}>
              <span className="sobremi-data__k">{label}</span>
              <div className="sobremi-skills__list">
                {items.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            </div>
          ))}
          {skillsExtra.length > 0 && (
            <div className="sobremi-skills__group sobremi-skills__group--extra">
              <div className="sobremi-skills__list">
                {skillsExtra.map(s => <span key={s} className="skill-tag">{s}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
