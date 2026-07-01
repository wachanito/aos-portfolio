'use client';

import { useState, useRef } from 'react';

type FieldErrors = { nombre?: string; email?: string; mensaje?: string };

export default function Contacto() {
  const [status,     setStatus]     = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors,     setErrors]     = useState<FieldErrors>({});
  const [touched,    setTouched]    = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);

  function handleFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.closest('.field')?.classList.add('is-active', 'is-focus');
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const field = e.target.closest('.field');
    field?.classList.remove('is-focus');
    if (!value.trim()) field?.classList.remove('is-active');
    setTouched(t => ({ ...t, [name]: true }));
    setErrors(prev => ({ ...prev, ...validateField(name, value) }));
  }
  function handleInput(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const el = e.currentTarget;
    const field = el.closest('.field');
    field?.classList.toggle('is-active', el.value.trim().length > 0);
    if (touched[el.name]) setErrors(prev => ({ ...prev, ...validateField(el.name, el.value) }));
  }

  function validateField(name: string, value: string): FieldErrors {
    if (name === 'nombre') return { nombre: value.trim() ? undefined : 'El nombre es obligatorio' };
    if (name === 'email')  return { email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? undefined : 'Ingresa un email válido' };
    if (name === 'mensaje') return { mensaje: value.trim() ? undefined : 'El mensaje es obligatorio' };
    return {};
  }

  function validateAll(form: HTMLFormElement): FieldErrors {
    const d = new FormData(form);
    return {
      nombre:  String(d.get('nombre') ?? '').trim() ? undefined : 'El nombre es obligatorio',
      email:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.get('email') ?? '').trim()) ? undefined : 'Ingresa un email válido',
      mensaje: String(d.get('mensaje') ?? '').trim() ? undefined : 'El mensaje es obligatorio',
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const allErrors = validateAll(form);
    setTouched({ nombre: true, email: true, mensaje: true });
    setErrors(allErrors);
    if (Object.values(allErrors).some(Boolean)) return;
    const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
    if (!endpoint) { setStatus('sent'); form.reset(); setTouched({}); setErrors({}); setTimeout(() => setStatus('idle'), 2200); return; }
    setStatus('sending');
    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (res.ok) { setStatus('sent'); form.reset(); setTouched({}); setErrors({}); setTimeout(() => setStatus('idle'), 3500); }
      else setStatus('error');
    } catch { setStatus('error'); }
  }

  const btnLabel = status === 'sending' ? 'Enviando…' : status === 'sent' ? 'Enviado — gracias' : status === 'error' ? 'Error — intentar de nuevo' : 'Enviar';

  return (
    <section id="contacto" className="contacto">
      <div className="aos-section">
        <div className="contacto__head" data-reveal>
          <div className="aos-section-head">
            <h2 className="aos-title">Hablem<span className="accent">os.</span></h2>
            <span className="aos-underline" data-underline />
          </div>
        </div>

        <div className="contacto-available" data-reveal data-reveal-delay="100">
          <span className="contacto-available__dot" aria-hidden="true" />
          <span>Disponible para proyectos</span>
        </div>

        <div className="contacto-layout">
          <form ref={formRef} className="contacto-form" data-reveal data-reveal-delay="150" noValidate onSubmit={handleSubmit}>
            <input type="hidden" name="_subject" value="Nuevo mensaje desde el portfolio de Agustín Oyarzún" />

            <label className={`field${errors.nombre && touched.nombre ? ' has-error' : ''}`}>
              <span className="field__label">Nombre</span>
              <input className="field__input" type="text" name="nombre" autoComplete="name" onFocus={handleFocus} onBlur={handleBlur} onInput={handleInput} />
              {errors.nombre && touched.nombre && <span className="field__error">{errors.nombre}</span>}
            </label>
            <label className={`field${errors.email && touched.email ? ' has-error' : ''}`}>
              <span className="field__label">Email</span>
              <input className="field__input" type="email" name="email" autoComplete="email" onFocus={handleFocus} onBlur={handleBlur} onInput={handleInput} />
              {errors.email && touched.email && <span className="field__error">{errors.email}</span>}
            </label>
            <label className={`field${errors.mensaje && touched.mensaje ? ' has-error' : ''}`}>
              <span className="field__label">Mensaje</span>
              <textarea className="field__input" name="mensaje" rows={3} onFocus={handleFocus as any} onBlur={handleBlur as any} onInput={handleInput as any} />
              {errors.mensaje && touched.mensaje && <span className="field__error">{errors.mensaje}</span>}
            </label>

            <button type="submit" className={`contacto-submit${status === 'sent' ? ' is-sent' : ''}`} data-magnetic="0.35" disabled={status === 'sending'}>
              <span>{btnLabel}</span>
              <span className="arr" aria-hidden="true">&#8594;</span>
            </button>
          </form>

          <div className="contacto-aside" data-reveal data-reveal-delay="250">
            <a className="contacto-wa" href="https://wa.me/56964939070" target="_blank" rel="noopener noreferrer" data-magnetic="0.25">
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
              <a href="https://www.linkedin.com/in/agust%C3%ADn-oyarz%C3%BAn-4452b82a8/" target="_blank" rel="noopener noreferrer">
                <span>LinkedIn</span><span aria-hidden="true">&#8599;</span>
              </a>
              <a href="https://www.behance.net/agustnoyarzun" target="_blank" rel="noopener noreferrer">
                <span>Behance</span><span aria-hidden="true">&#8599;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
