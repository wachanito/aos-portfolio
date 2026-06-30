import { certs } from '@/data/content';

export default function Certificaciones() {
  return (
    <section id="certificaciones" className="certificaciones">
      <div className="aos-section">
        <div className="cert-head" data-reveal>
          <span className="aos-eyebrow"><span className="aos-eyebrow__dot" />Formación certificada</span>
          <div className="aos-section-head">
            <h2 className="aos-title">Credenciales.</h2>
            <span className="aos-underline" data-underline />
          </div>
        </div>

        <div className="cert-grid">
          {certs.map((c, i) => {
            let cls = 'cert-card';
            if ((c as any).soon)  cls += ' cert-card--soon';
            else if (c.ongoing)   cls += ' cert-card--ongoing';
            return (
              <div key={c.name} className={cls} data-reveal data-reveal-delay={String(100 + i * 70)}>
                <div className="cert-card__logo">
                  <span className="cert-card__abbr">{c.abbr}</span>
                </div>
                <div className="cert-card__body">
                  <p className="cert-card__name">{c.name}</p>
                </div>
                <div className="cert-card__foot">
                  <span className="cert-card__issuer">{c.issuer}</span>
                  <span className={`cert-card__status${c.ongoing ? ' cert-card__status--ongoing' : ''}`}>
                    {c.ongoing ? 'EN CURSO ◌' : (c as any).soon ? '···' : 'CERTIFICADO'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
