'use client';

import { useState, useRef } from 'react';

export default function Contacto() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.closest('.field')?.classList.add('is-active', 'is-focus');
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.target.closest('.field');
    field?.classList.remove('is-focus');
    if (!e.target.value.trim()) field?.classList.remove('is-active');
  }
  function handleInput(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = e.currentTarget.closest('.field');
    field?.classList.toggle('is-active', e.currentTarget.value.trim().length > 0);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) { setStatus('sent'); setTimeout(() => setStatus('idle'), 2200); return; }
    setStatus('sending');
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { setStatus('sent'); form.reset(); setTimeout(() => setStatus('idle'), 3500); }
      else setStatus('error');
    } catch { setStatus('error'); }
  }

  const btnLabel = status === 'sending' ? 'Enviando…' : status === 'sent' ? 'Enviado — gracias' : status === 'error' ? 'Error — intentar de nuevo' : 'Enviar';

  return (
    <section id="contacto" className="contacto">
      <div className="aos-section">
        <div className="contacto__head">
          <span className="aos-eyebrow"><span className="aos-eyebrow__dot" />Hablemos</span>
          <div className="aos-section-head">
            <h2 className="aos-title">Hablem<span className="accent">os.</span></h2>
            <span className="aos-underline" data-underline />
          </div>
        </div>

        <div className="contacto-available">
          <span className="contacto-available__dot" aria-hidden="true" />
          <span>Disponible para proyectos</span>
        </div>

        <div className="contacto-layout">
          <form ref={formRef} className="contacto-form" noValidate onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="Nuevo mensaje desde el portfolio de Agustín Oyarzún" />

            <label className="field">
              <span className="field__label">Nombre</span>
              <input className="field__input" type="text" name="nombre" autoComplete="name" required onFocus={handleFocus} onBlur={handleBlur} onInput={handleInput} />
            </label>
            <label className="field">
              <span className="field__label">Email</span>
              <input className="field__input" type="email" name="email" autoComplete="email" required onFocus={handleFocus} onBlur={handleBlur} onInput={handleInput} />
            </label>
            <label className="field">
              <span className="field__label">Mensaje</span>
              <textarea className="field__input" name="mensaje" rows={3} required onFocus={handleFocus as any} onBlur={handleBlur as any} onInput={handleInput as any} />
            </label>

            <button type="submit" className={`contacto-submit${status === 'sent' ? ' is-sent' : ''}`} disabled={status === 'sending'}>
              <span>{btnLabel}</span>
              <span className="arr" aria-hidden="true">&#8594;</span>
            </button>
          </form>

          <div className="contacto-aside">
            <a className="contacto-wa" href="https://wa.me/56964939070" target="_blank" rel="noopener">
              <span style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="contacto-wa__k">WhatsApp directo</span>
                <span className="contacto-wa__v">Escríbeme por WhatsApp</span>
              </span>
              <span className="contacto-wa__arr" aria-hidden="true">&#8594;</span>
            </a>

            <div className="contacto-mail">
              <span className="contacto-mail__k">Email</span>
              <a className="contacto-mail__v" href="mailto:agustin.oyarzun@mail.udp.cl">
                agustin.oyarzun<wbr />@mail.udp.cl
              </a>
            </div>

            <div className="contacto-social">
              <a href="https://www.linkedin.com/in/agust%C3%ADn-oyarz%C3%BAn-4452b82a8/" target="_blank" rel="noopener">
                <span>LinkedIn</span><span aria-hidden="true">&#8599;</span>
              </a>
              <a href="https://www.behance.net/agustnoyarzun" target="_blank" rel="noopener">
                <span>Behance</span><span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
