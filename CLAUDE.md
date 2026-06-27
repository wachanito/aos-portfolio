@AGENTS.md

# AOS Portfolio — Portafolio de Agustín Oyarzún

Portfolio personal de Agustín Oyarzún (estratega digital, Santiago CL). Next.js con `output: 'export'` (sitio completamente estático). Deploy automático: push a `main` → Vercel recoge en ~1-2 min.

**Repo:** `https://github.com/wachanito/aos-portfolio.git`

---

## Stack

- **Next.js** (static export) + TypeScript
- **GSAP** — animaciones de entrada (Hero curtain, scroll reveals)
- **Lenis** — smooth scroll (desactivado en móvil)
- **Three.js** — esfera wireframe en Hero (desactivada en móvil con `pointer: coarse`)
- **CSS custom properties** — design tokens en `globals.css`
- No hay base de datos ni backend. Todo el contenido vive en `data/`.

---

## Archivos clave

| Archivo | Qué hace |
|---|---|
| `data/proyectos.ts` | Todos los proyectos — editar aquí para cambiar contenido |
| `data/content.ts` | Skills, servicios, certificaciones, Q&A de Sobre Mí |
| `lib/types.ts` | Interface `Proyecto` — referencia al agregar campos nuevos |
| `app/globals.css` | Estilos globales + design tokens |
| `app/layout.tsx` | Layout raíz, metadata SEO, font preloads |
| `components/ProyectoClient.tsx` | Página de proyecto individual (video, galería, scroll) |
| `components/Hero.tsx` | Hero con esfera Three.js + canvas de tags |
| `components/GlobalEffects.tsx` | Lenis + cursor unificados en un solo RAF loop |
| `public/uploads/` | Todas las imágenes de proyectos (formato WebP) |
| `public/fonts/` | Fuentes locales (Anton, Courier Prime) |

---

## Convenciones

- **Imágenes siempre en WebP.** Nunca subir PNG/JPG directamente a `public/uploads/`. Convertir primero con `scripts/convert-webp.mjs`.
- **Sin comentarios innecesarios** en el código.
- **Sin `boardFit: 'contain'`** — todos los boards usan `cover` implícito.
- El campo `password` en un proyecto activa una pantalla de acceso con clave antes de mostrar el contenido.

---

## Proyectos actuales

| # | Slug | Estado | Video |
|---|---|---|---|
| 01 | `remax-inside` | Publicado | — |
| 02 | `beauty-f` | Publicado | Vimeo `1204881022` |
| 03 | `museo-de-la-publicidad` | Publicado | — |
| 04 | `suplestore` | Publicado | — |
| 05 | `becker` | Password `Becker123` | Pendiente de subir |
| 06 | `csd-colo-colo` | En desarrollo, password `colo123` | — |

---

## Agregar un proyecto nuevo

1. Agregar entrada en `data/proyectos.ts` siguiendo la interface `Proyecto` en `lib/types.ts`
2. Subir imágenes a `public/uploads/` en formato WebP
3. Si tiene video en Vimeo: usar campo `vimeoId: 'ID_DEL_VIDEO'`
4. Si tiene video propio: usar `mediaUrl: '/uploads/archivo.mp4'`
5. Si es propuesta de caso: agregar `esPropuesta: true`
6. Si está en desarrollo: agregar `enDesarrollo: true`

---

## Variables de entorno (`.env.local`)

```
NEXT_PUBLIC_FORMSPREE_ENDPOINT=   # endpoint del formulario de contacto (aún pendiente — crear cuenta en formspree.io)
```

El formulario de contacto en la sección `#contacto` muestra "Enviado — gracias" sin enviar nada hasta que se configure este endpoint.

---

## Optimizaciones ya aplicadas

- Three.js desactivado en móvil (`pointer: coarse`)
- Lenis desactivado en móvil
- Cursor + Lenis unificados en un solo `requestAnimationFrame`
- `pixelRatio` de Three.js limitado a 1.5
- Todas las imágenes en WebP (−14MB vs. originales)
- Font preloads en `<head>` para Anton y Courier Prime
- `content-visibility: auto` en secciones below-fold
- `decoding="async"` en imágenes de galería
- Listeners `mousemove` y `resize` con `{ passive: true }`

---

## Deploy

```bash
git add .
git commit -m "descripción"
git push origin main
# Vercel detecta el push y redespliega automáticamente
```
