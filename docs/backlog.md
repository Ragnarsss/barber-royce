# Backlog — barber-royce

Fecha: 2026-10-12
Estado: activo. Fuente oficial de planificación técnica.

## 1. Objetivo del backlog

Llevar el sitio a producción en Vercel con datos del negocio correctos,
sin bloqueantes de despliegue, y dejar el código ordenado para mantenerlo:
un solo sistema de estilos, animaciones que no castigan el rendimiento,
errores contenidos y verificación automática en cada PR.

El **para qué** de cada ticket está en
[`historias-usuario.md`](./historias-usuario.md); el **qué verificable**,
en [`rf-rnf-catalogo.md`](./rf-rnf-catalogo.md). Aquí está el **cómo** y
el orden.

## 2. Convenciones y priorización

- **ID:** `BR-NNN`, correlativo. Nunca se reutiliza ni se renumera. Un
  ticket descartado se tacha y queda con `Estado: Descartado` o
  `Absorbido (por BR-XXX)`.
- **Prioridad:**
  - `P0`: bloquea el despliegue a producción.
  - `P1`: no bloquea, pero debe estar antes o justo después del primer
    despliegue (rendimiento, robustez, CI).
  - `P2`: mejora de mantenibilidad o calidad.
  - `P3`: deseable, diferible.
- **Esfuerzo:** `XS` (< 1 h) · `S` (1–4 h) · `M` (4 h – 1 día) · `L`
  (> 1 día; se parte si se puede).
- **Estado:** `Propuesta` · `Bloqueada (motivo)` · `En curso` ·
  `Hecho (AAAA-MM-DD, rama → master)` · `Descartado` · `Absorbido`.
- **Rama:** `tipo/br-nnn-descripcion-corta`.

### Plantilla de ficha

```markdown
### BR-NNN — <Título descriptivo>

- Prioridad: P1 · Esfuerzo: S · Depende de: BR-XXX
- Estado: Propuesta
- Historia de usuario: HU-MOD-NNN (CA-01, CA-02)   ← o "no aplica — <motivo>"
- RF/RNF: `RF-MOD-NNN`, `RNF-CAT-NNN`              ← o "no aplica — <motivo>"

**Origen (AAAA-MM-DD):** <qué disparó el ticket>

Alcance:
1. ...

Criterios de aceptación:
1. <verificable> (HU-XXX CA-0N).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-nnn).
```

Un bug agrega **Causa:** y **Arreglo:**. Un cambio de alcance se agrega
fechado: `> **Alcance ajustado (AAAA-MM-DD, decisión del usuario):** …`.

## 3. Backlog por épicas

### Épica A — Proceso y organización

#### BR-001 — Ordenar la documentación y el proceso de trabajo

- Prioridad: P1 · Esfuerzo: M · Depende de: —
- Estado: Hecho (2026-10-12, rama `docs/br-001-organizacion-proceso` → master, PR #3)
- Historia de usuario: no aplica — proceso interno, sin superficie de usuario.
- RF/RNF: no aplica — proceso interno.

**Origen (2026-10-12):** antes del despliegue, la documentación estaba
dispersa en 8 Markdown y 3 `.tsx` en la raíz (~6.800 líneas), sin
`CLAUDE.md`, sin historias de usuario ni requisitos formales.

Alcance:
1. `docs/` con `engineering-guidelines.md`, `architecture.md` (ADRs),
   `backlog.md`, `registro-construccion.md`, `historias-usuario.md`,
   `casos-uso.md` y `rf-rnf-catalogo.md`.
2. Documentos anteriores movidos a `docs/archivo/` con un índice; el
   backlog anterior migrado (§8).
3. `CLAUDE.md`, `AGENTS.md`, `.claude/skills/` y `.claude/agents/`.
4. `.github/pull_request_template.md` con el checklist de la DoD.
5. ESLint ignora `docs/` (las guías `.tsx` archivadas no son código de la
   app).

Criterios de aceptación:
1. Ningún documento de planificación queda suelto en la raíz salvo
   `README.md`, `CLAUDE.md` y `AGENTS.md`.
2. Todo ticket de este backlog cita su HU y su RF/RNF, o dice por qué no
   aplica.
3. Cada skill y agente de `.claude/` aparece en `AGENTS.md`.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-001).

#### BR-032 — Actualizar el README

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-001
- Estado: Propuesta
- Historia de usuario: HU-OPS-001 (CA-02)
- RF/RNF: no aplica — documentación.

**Origen (2026-10-12):** el README dice puerto 5173 (es 8888), "CSS Modules
/ Tailwind (TBD)", variables de entorno que nadie usa, `react-snap` que no
está instalado y dos URLs de GitHub distintas.

Alcance:
1. Stack real, comandos, estructura resumida y enlaces a `docs/` y
   `CLAUDE.md`.
2. Sección de despliegue (Vercel, previews, rollback).

Criterios de aceptación:
1. Siguiendo solo el README, alguien levanta el sitio en local y sabe cómo
   se despliega.

---

### Épica B — Bloqueantes de despliegue

#### BR-002 — Configurar Vercel: rewrite SPA, cabeceras de seguridad y caché

- Prioridad: P0 · Esfuerzo: S · Depende de: —
- Estado: Hecho (2026-10-12, rama `feat/br-002-vercel` → master, PR #7)
- Historia de usuario: HU-OPS-001 (CA-02, CA-03), HU-EXP-003 (CA-01)
- RF/RNF: `RF-OPS-001`, `RNF-CONF-001`, `RNF-SEG-001`

**Origen (2026-10-12):** no existe configuración de hosting. Sin rewrite,
recargar `/servicios` da 404.

Alcance:
1. `vercel.json` con rewrite de todas las rutas a `/index.html`.
2. Cabeceras: CSP (permitiendo el iframe de Google Maps y los dominios que
   realmente se usan), HSTS, `X-Content-Type-Options`, `Referrer-Policy`,
   `Permissions-Policy`, `frame-ancestors 'none'`.
3. `Cache-Control: public, max-age=31536000, immutable` para `/assets/*`.
4. Proyecto conectado en Vercel con preview por PR y producción desde
   `master`; dominio configurado.

Criterios de aceptación:
1. Recargar las 7 rutas en el preview responde la app (CP-CONF-001).
2. `curl -I` muestra las 6 cabeceras y securityheaders.com da A o más
   (CP-SEG-001).
3. La CSP no rompe el mapa, las fuentes ni las imágenes (consola sin
   violaciones de CSP).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-002).

#### BR-003 — Página 404 con identidad de marca

- Prioridad: P0 · Esfuerzo: S · Depende de: BR-030 (solo para el test)
- Estado: Hecho (2026-10-12, rama `feat/br-003-pagina-404` → master, PR #7; test en `BR-030`)
- Historia de usuario: HU-EXP-003 (CA-02)
- RF/RNF: `RF-NAV-002`, `RNF-CONF-001`

**Origen (2026-10-12):** no hay `<Route path="*">`; una URL desconocida
muestra el layout vacío.

Alcance:
1. `NotFoundPage` con enlace al inicio y botón de reserva, `noindex` y
   título propio. Animación de entrada sutil (patrón 404 de RadarOP),
   respetando reduced motion.
2. Ruta comodín en el router.

Criterios de aceptación:
1. `/no-existe` muestra la 404 con ambos enlaces (CP-NAV-002).
2. Test de render de la ruta comodín.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-003).

#### BR-004 — Dejar `npm run lint` sin errores

- Prioridad: P0 · Esfuerzo: S · Depende de: BR-001
- Estado: Hecho (2026-10-12, rama `fix/br-004-lint-limpio` → master, PR #7)
- Historia de usuario: HU-OPS-001 (CA-01)
- RF/RNF: `RNF-MANT-001`

**Origen (2026-10-12):** el lint fallaba con 20 errores. Tras mover las
guías `.tsx` a `docs/` (`BR-001`) quedan 8, en `ui/button.tsx`,
`ui/tabs.tsx`, `contexts/LenisContext.tsx` y
`contexts/ScrollProgressContext.tsx`.

Alcance:
1. `LenisContext`: quitar el `setState` síncrono en el efecto y separar
   los hooks del Provider (react-refresh).
2. `ScrollProgressContext`: se elimina (código muerto, ver `BR-025`).
3. `ui/button.tsx` y `ui/tabs.tsx`: corregir o retirar según `BR-023`.

Criterios de aceptación:
1. `npm run lint -- --max-warnings=0` termina sin errores ni warnings.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-004).

#### BR-005 — Datos del negocio con una sola fuente de verdad y valores reales

- Prioridad: P0 · Esfuerzo: M · Depende de: —
- Estado: Bloqueada (faltan los datos reales del dueño)
- Historia de usuario: HU-INFO-002 (CA-02), HU-RES-001 (CA-03), HU-RES-002 (CA-01, CA-02, CA-03)
- RF/RNF: `RF-RES-001`, `RF-RES-002`, `RF-INFO-003`, `RNF-DATOS-001`

**Origen (2026-10-12):** teléfono de ejemplo `(123) 456-7890`; el WhatsApp
mostrado (`+56 9 1234 5678`) no coincide con el del enlace; dos emails
distintos; horarios contradictorios; redes distintas entre
`constants.ts` e `index.html`; la URL de AgendaPro repetida en 4
componentes.

Alcance:
1. Pedir y confirmar con el dueño, por sucursal: teléfono, WhatsApp, email,
   horario por día, redes, coordenadas y URL de reserva de AgendaPro
   (pregunta abierta de HU-RES-001 RN-02).
2. `src/config/` como fuente única: `CONTACT`, `SCHEDULE` por día,
   `SOCIAL_MEDIA`, `BOOKING_URL` (o una por sucursal), tipados `as const`.
3. Navbar, CTA1, CTA2, Footer y Ubicación leen de ahí.
4. Test que falla si aparece un literal de teléfono, email o
   `agendapro.com` fuera de `src/config/` y `locationsData.ts`.
5. Navbar, CTA1 y CTA2 usan la constante `BOOKING` (creada en `BR-003`).
   **Hecho en `BR-007`** (2026-10-12); la URL de AgendaPro ya existe una
   sola vez en `src/config/constants.ts`, con test.

> **Alcance ajustado (2026-10-12):** al revisar los orígenes para la CSP
> (`BR-002`) apareció que el `mapUrl` de la sucursal de Coquimbo en
> `locationsData.ts` apunta a coordenadas de Bogotá (`4.6789, -74.0719`),
> un placeholder. Se agrega: embed real de Google Maps para cada sucursal.

Criterios de aceptación:
1. CP-DATOS-001 y CP-RES-002 pasan.
2. Cambiar la URL de reserva exige editar una sola línea (HU-RES-001 CA-03).

#### BR-006 — Corregir SEO técnico: JSON-LD, sitemap, `og:locale`, manifest

- Prioridad: P0 · Esfuerzo: S · Depende de: BR-005
- Estado: Propuesta
- Historia de usuario: HU-SEO-001 (CA-01, CA-02, CA-03), HU-INFO-005 (CA-03)
- RF/RNF: `RF-SEO-001`, `RF-SEO-002`, `RF-SEO-003`, `RNF-SEO-002`

**Origen (2026-10-12):** JSON-LD con `addressCountry: "ES"`, `postalCode:
"Coquimbo"`, `geo` 0,0, imagen `/royce-barber-logo.png` inexistente,
`aggregateRating` estático, `ReserveAction` a `/#reservar` (no existe),
sábado en dos horarios y FAQ copiado a mano; `og:locale es_ES`; sitemap sin
`/nosotros` ni `/preguntas-frecuentes`; manifest con colores blancos en un
sitio oscuro; `/productos` sin `SEOHelmet`.

Alcance:
1. JSON-LD de las dos sucursales generado desde `src/config/` (en build o
   con `SEOHelmet`), sin rating estático y con la acción de reserva hacia
   AgendaPro.
2. `FAQPage` generado desde `faqData.ts`.
3. `og:locale es_CL`; `sitemap.xml` con las 7 rutas, generado desde
   `ROUTES`.
4. `site.webmanifest` con `theme_color`/`background_color` oscuros e
   iconos `any` además de `maskable`.
5. `ProductsPage` usa `SEOHelmet`.

Criterios de aceptación:
1. CP-SEO-001, CP-SEO-002 y CP-SEO-003 pasan.
2. Test que compara el JSON-LD con `src/config/` (CP-SEO-002-N).

#### BR-007 — Enlaces externos y de reserva seguros y correctos

- Prioridad: P0 · Esfuerzo: XS · Depende de: —
- Estado: En curso (rama `fix/br-007-enlaces-seguros`; hecho en local, falta confirmar en el preview)
- Historia de usuario: HU-RES-001 (CA-02)
- RF/RNF: `RF-RES-001`, `RNF-SEG-002`

**Origen (2026-10-12):** CTA1 y CTA2 usan `<Link to="https://…"
target="_blank">` sin `rel`; CTA1 usa `<a href="/servicios">`, que recarga
toda la página.

Alcance:
1. Enlaces externos como `<a>` con `rel="noopener noreferrer"`.
2. Enlaces internos con `<Link>`.

Criterios de aceptación:
1. Ningún `target="_blank"` sin `rel` en `src/` (CP-SEG-002).
2. Ir de la home a `/servicios` desde CTA1 no recarga la página.

> **Alcance ajustado (2026-10-12):** ya no depende de `BR-005`: la URL de
> AgendaPro ya existe como `BOOKING.url` (creada en `BR-003`), así que se
> usa aquí. Los datos de contacto reales siguen en `BR-005`.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-007).

#### BR-008 — Reemplazar imágenes de Unsplash por fotos propias optimizadas

- Prioridad: P0 · Esfuerzo: M · Depende de: —
- Estado: Bloqueada (faltan las fotos del dueño)
- Historia de usuario: HU-INFO-001 (RN-02), HU-INFO-004 (CA-01)
- RF/RNF: `RF-INFO-001`, `RF-INFO-002`, `RNF-PERF-004`

**Origen (2026-10-12):** servicios y productos enlazan imágenes de
`images.unsplash.com`: riesgo de licencia y de disponibilidad, y no pasan
por la optimización del build.

Alcance:
1. Fotos reales en `src/assets/`, optimizadas a AVIF y WebP con el script
   existente.
2. Si una foto no está a tiempo, un placeholder propio de marca (no una
   imagen de terceros).

Criterios de aceptación:
1. Ninguna petición a `images.unsplash.com` en el preview (CP-PERF-004).

> **Hallazgo (2026-10-12):** la foto de `CTA2` (`cta2_crew.png`) mide solo
> 455 × 705 px y se muestra estirada como fondo a pantalla completa
> (1280 px y más): se ve borrosa. Al pedir las fotos propias, incluir una
> versión de al menos 1920 px de ancho para esa sección.

#### BR-009 — Decidir qué hace el botón "Comprar" de productos

- Prioridad: P1 · Esfuerzo: XS · Depende de: —
- Estado: Propuesta (decisión del usuario pendiente)
- Historia de usuario: HU-INFO-004 (CA-03, RN-01)
- RF/RNF: `RF-INFO-002`

**Origen (2026-10-12):** el botón "Comprar" de `/productos` no hace nada y
los precios tienen formato de dólares.

Alcance:
1. Decidir entre: consultar por WhatsApp con el producto prellenado,
   "Disponible en el local" sin botón, u ocultar la página hasta tener
   catálogo real.
2. Precios en CLP.

Criterios de aceptación:
1. Ningún botón visible sin acción (HU-INFO-004 RN-01).

#### BR-010 — Preparar variables de entorno sin secretos

- Prioridad: P1 · Esfuerzo: XS · Depende de: —
- Estado: Propuesta
- Historia de usuario: HU-OPS-001 (CA-03)
- RF/RNF: `RNF-SEG-002`

**Origen (2026-10-12):** `.gitignore` cubre `*.local` pero no `.env`; el
README promete variables que no existen.

Alcance:
1. `.env`, `.env.*` (salvo `.env.example`) en `.gitignore`.
2. `.env.example` vacío y documentado (hoy no se usa ninguna variable).

Criterios de aceptación:
1. `git check-ignore .env` lo reporta como ignorado.

---

### Épica C — Robustez y errores

#### BR-019 — Error boundaries con `react-error-boundary` y `PageError`

- Prioridad: P1 · Esfuerzo: S · Depende de: —
- Estado: Hecho (2026-10-12, rama `feat/br-019-error-boundaries` → master, PR #11)
- Historia de usuario: HU-EXP-003 (CA-03)
- RF/RNF: `RF-NAV-003`

**Origen (2026-10-12):** boundary propio de clase; la home y el layout no
tienen boundary; el prop `onError` no se usa.

Alcance:
1. `react-error-boundary` con un `PageError` de marca (mensaje y
   "Reintentar"), patrón de RadarOP.
2. Boundary por ruta (incluida la home) dentro del layout, para que navbar
   y footer sigan funcionando, y uno global de último recurso.
3. `onError` único que registra con `console.error`.
4. Se elimina el `ErrorBoundary` de clase.

Criterios de aceptación:
1. Forzar un error en una sección deja navbar y footer operativos y
   muestra el fallback (CP-NAV-003).
2. Test del fallback con un componente que lanza.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-019).

#### BR-020 — Recuperación ante un chunk inexistente tras un despliegue

- Prioridad: P1 · Esfuerzo: S · Depende de: BR-019
- Estado: Hecho (2026-10-12, rama `feat/br-020-recuperacion-chunks` → master, PR #12; CP-CONF-002 se comprueba en el próximo despliegue)
- Historia de usuario: HU-EXP-003 (CA-04)
- RF/RNF: `RF-NAV-003`, `RNF-CONF-002`

**Origen (2026-10-12):** tras un redeploy, una pestaña abierta que pide un
chunk viejo cae en el fallback o en blanco.

Alcance:
1. Escuchar `vite:preloadError` y recargar una sola vez (marca en
   `sessionStorage`, envuelta en `try/catch`).
2. Si vuelve a fallar, mostrar el `PageError` de `BR-019`.

Criterios de aceptación:
1. CP-CONF-002 pasa en el preview.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-020).

---

### Épica D — Sistema de estilos (ADR-002)

#### BR-021 — Una sola fuente de tokens de diseño

- Prioridad: P2 · Esfuerzo: M · Depende de: —
- Estado: Propuesta
- Historia de usuario: no aplica — deuda técnica sin cambio visible.
- RF/RNF: `RNF-MANT-003`

**Origen (2026-10-12):** cuatro fuentes de tokens que se pisan:
`styles/tokens/`, `styles/variables.css` (se importa después y
sobrescribe), `src/index.css` de shadcn y `COLORS` en `constants.ts`.
Valores sin sentido para un sitio oscuro (`--color-background-primary:
#ffffff`, `--color-primary-500: #1a1a1a`).

Alcance:
1. `styles/tokens/` como única fuente; los valores que realmente se ven
   hoy pasan ahí con nombres semánticos (`--color-brand`, `--color-surface`,
   `--color-text`).
2. Se eliminan `variables.css`, `src/index.css` y `COLORS`.
3. `color-mix()` para hover, foco y selección; `:focus-visible` global
   (patrón de RadarOP).

Criterios de aceptación:
1. Capturas de las 7 rutas antes y después sin diferencias visibles.
2. Una búsqueda de `variables.css` y `COLORS` no devuelve resultados.

#### BR-022 — Reemplazar colores hex escritos a mano por tokens

- Prioridad: P2 · Esfuerzo: M · Depende de: BR-021
- Estado: Propuesta
- Historia de usuario: no aplica — deuda técnica sin cambio visible.
- RF/RNF: `RNF-MANT-003`

**Origen (2026-10-12):** unos 120 hex en los CSS Modules (`#ffffff` ×52,
`#1a1a1a` ×23, `#d52323` ×22) y estilos inline con colores en
`ScrollProgressBar.tsx` y en el fallback del `ErrorBoundary`.

Alcance:
1. Cada hex pasa a `var(--token)`.
2. Estilos inline de color pasan a CSS Modules.

Criterios de aceptación:
1. El agente `design-tokens-auditor` no reporta hex fuera de
   `styles/tokens/`.

#### BR-023 — Retirar Tailwind, shadcn y sus componentes `ui/*`

- Prioridad: P2 · Esfuerzo: L · Depende de: BR-021
- Estado: Propuesta
- Historia de usuario: no aplica — deuda técnica (ADR-002).
- RF/RNF: `RNF-MANT-003`, `RNF-PERF-005`

**Origen (2026-10-12):** Tailwind y shadcn están instalados pero
`src/index.css` no se importa; `button`, `card`, `input`, `progress` y
`tabs` de `ui/` usan clases Tailwind que probablemente no generan CSS.
Tienen ~10 consumidores (Benefits, Features, Reviews, Services,
LocationCard, LocationTabs, Layout, Loading, ErrorFallback, AboutPage).

Alcance:
1. Revisar consumidor por consumidor qué estilos se ven realmente.
2. Componentes base propios con CSS Modules donde hagan falta (`Button`,
   `Card`); `Tabs` sobre `@radix-ui/react-tabs` con estilos propios.
3. Desinstalar `tailwindcss`, `@tailwindcss/vite`, `shadcn`,
   `class-variance-authority`, `tailwind-merge`, `tw-animate-css`, `clsx`
   si queda sin uso; borrar `components.json`, `lib/utils.ts` y el plugin
   de Vite.

Criterios de aceptación:
1. Capturas de las 7 rutas sin diferencias visibles.
2. `npm ls tailwindcss` vacío; el build no incluye CSS de Tailwind.

#### BR-024 — Breakpoints unificados, mobile-first

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-021
- Estado: Propuesta
- Historia de usuario: HU-EXP-001 (CA-03)
- RF/RNF: `RNF-COMP-001`

**Origen (2026-10-12):** media queries con 768, 968, 1024, 640, 1200 y
1600 px, mezclando `max-width` y `min-width`.

Alcance:
1. Conjunto cerrado de breakpoints (640, 768, 1024, 1280) documentado en
   `styles/tokens/breakpoints.css`.
2. Media queries con `min-width` (mobile-first).

Criterios de aceptación:
1. CP-COMP-001 pasa en 360, 768, 1280 y 1920 px.

---

### Épica E — Animación y scroll

#### BR-014 — Lenis sin fugas ni observadores globales

- Prioridad: P1 · Esfuerzo: M · Depende de: BR-004
- Estado: En curso (rama `feat/br-014-lenis-sin-fugas`; hecho en local, falta verificar en el preview)
- Historia de usuario: HU-EXP-001 (CA-02)
- RF/RNF: `RNF-PERF-006`

**Origen (2026-10-12):** `useLenis` observa todo `document.body` con un
`MutationObserver` y llama a `lenis.resize()` en cada cambio de `style`
(framer-motion muta `style` en cada frame); `useLenisScroll` pierde el
cleanup del reintento; `useLenisScrollActive` no se suscribe si Lenis no
existe al montar; varios hooks leen `window.lenis`.

Alcance:
1. Patrón `useLenis` de RadarOP: un `ResizeObserver` acotado, limpieza al
   desmontar.
2. Todos los consumidores leen la instancia del contexto; se elimina
   `window.lenis` y su `declare global` duplicado.
3. `useScrollToSection` con offset del navbar y recurso a
   `scrollIntoView` si Lenis no está.

Criterios de aceptación:
1. Ningún listener ni observer queda vivo tras desmontar (test del hook).
2. Una búsqueda de `window.lenis` en `src/` no devuelve resultados.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-014).

#### BR-015 — Cero re-renders por scroll

- Prioridad: P1 · Esfuerzo: M · Depende de: BR-014
- Estado: En curso (rama `feat/br-015-sin-rerender-scroll`; hecho en local, falta medir en el preview)
- Historia de usuario: HU-EXP-001 (CA-02)
- RF/RNF: `RNF-PERF-006`

**Origen (2026-10-12):** `useLenisScroll` hace `setState` en cada evento de
scroll; `ScrollProgressBar`, `SocialProof1`, `SocialProof2` y `CTA2` se
re-renderizan a ~60 fps.

Alcance:
1. Pasar el progreso y la dirección de scroll a `MotionValue`
   (`useScroll`, `useMotionValueEvent` solo cuando cambia un umbral).
2. `ScrollProgressBar` con `scaleX` sobre un `MotionValue` (patrón de
   RadarOP).

Criterios de aceptación:
1. CP-PERF-006: el Profiler no registra renders de esos componentes
   mientras se hace scroll.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-015).

#### BR-016 — Parallax liviano y variantes compartidas

- Prioridad: P1 · Esfuerzo: M · Depende de: BR-015
- Estado: En curso (rama `feat/br-016-parallax-liviano`; parte 1 y 2 hechas en local; falta medir en el preview; parte 3 pendiente de decisión)
- Historia de usuario: HU-EXP-001 (CA-01, CA-02)
- RF/RNF: `RNF-PERF-003`, `RNF-PERF-006`

**Origen (2026-10-12):** `useParallaxLayers` crea siempre 12
`useTransform` por sección aunque use 2; `SocialProof1` suma 11
transforms y ~19 `motion.div` decorativos.

Alcance:
1. `useParallaxLayers` crea solo las capas que se piden.
2. Variantes compartidas `fadeUp`, `fadeIn`, `scaleIn`, `staggerContainer`
   con una curva común, entrada con `whileInView` + `once` (patrón de
   RadarOP) en `animations.config.ts`.
3. Reducir los decorativos de `SocialProof1` a los que se ven.
   **Pendiente (2026-10-12):** requiere ver la sección renderizada para
   decidir cuáles se pueden quitar sin cambiar el diseño; no se hizo a
   ciegas. Se redujo lo que es visualmente idéntico (transforms
   compartidos en x e y).

Criterios de aceptación:
1. CP-PERF-003 y CP-PERF-006 pasan en la home.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-016).

#### BR-017 — Respetar `prefers-reduced-motion` en JavaScript

- Prioridad: P1 · Esfuerzo: S · Depende de: —
- Estado: En curso (rama `feat/br-017-reduced-motion`; hecho en local, falta verificar en el preview)
- Historia de usuario: HU-EXP-002 (CA-02)
- RF/RNF: `RNF-A11Y-003`

**Origen (2026-10-12):** la preferencia solo se aplica en CSS; el parallax
de framer-motion y Lenis la ignoran.

Alcance:
1. `MotionConfig reducedMotion="user"` en la raíz.
2. Con `useReducedMotion()`: sin parallax (transform fijo) y sin Lenis.

Criterios de aceptación:
1. CP-A11Y-003 pasa en las 7 rutas.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-017).

#### BR-018 — Transiciones de página

- Prioridad: P3 · Esfuerzo: S · Depende de: BR-017
- Estado: Propuesta
- Historia de usuario: HU-EXP-001
- RF/RNF: no aplica — mejora visual sin requisito propio.

**Origen (2026-10-12):** patrón de RadarOP (`AnimatePresence mode="wait"`
por `pathname`, fundido corto, desactivado con reduced motion). Absorbe el
ex `B010` (shared layout transitions).

Alcance:
1. Fundido de 150–200 ms entre rutas.

Criterios de aceptación:
1. Con reduced motion no hay transición; CLS y TBT no empeoran.

---

### Épica F — Rendimiento e imágenes

#### BR-011 — Ruta crítica del LCP

- Prioridad: P1 · Esfuerzo: S · Depende de: —
- Estado: En curso (rama `perf/br-011-ruta-critica-lcp`; hecho en local, falta confirmar en el preview)
- Historia de usuario: HU-EXP-001 (CA-01)
- RF/RNF: `RNF-PERF-001`, `RNF-PERF-004`

**Origen (2026-10-12):** `index.html` precarga
`/src/assets/hero_model_left_profile.png` (~1 MB), que el `<picture>` no
usa: descarga doble en la ruta del LCP. En todos los `<picture>` el WebP va
antes que el AVIF (el AVIF nunca se usa) y el `<img>` de respaldo apunta
al PNG original.

Alcance:
1. Quitar ese preload; precargar la imagen que de verdad es el LCP
   (`imagesrcset` del AVIF) o confiar en `fetchpriority="high"`.
2. ~~Orden `<source>` AVIF → WebP~~; `<img>` de respaldo en WebP.

> **Alcance ajustado (2026-10-12):** el orden AVIF → WebP **no se aplica**.
> Al medir, cada AVIF pesa entre 3 % y 28 % más que el WebP del mismo
> tamaño (hero 104 KB frente a 101 KB; fondo de Benefits 77 KB frente a
> 65 KB), así que ponerlo primero empeoraba la carga. Los `<source>` AVIF,
> que ningún navegador elegía, se eliminan junto con los archivos y la
> generación en el script.
3. Evaluar el preload de Montserrat 400/700 (ex `P002`) con medición.

Criterios de aceptación:
1. El PNG del hero no aparece en Network y el preload coincide con el
   `<picture>` (test `lcpPreload.test.ts`).
2. CP-PERF-001 (LCP ≤ 2,5 s) **no se alcanza con este ticket**: tras
   quitar el PNG el LCP baja de 7,5 s a 3,7 s en Lighthouse móvil local,
   pero el resto es retraso de render por el JavaScript inicial. Pasa a
   `BR-035`.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-011).

#### BR-035 — Separar los vendors del chunk de la app

- Prioridad: P1 · Esfuerzo: S · Depende de: BR-011
- Estado: En curso (rama `perf/br-035-js-inicial-home`; hecho en local, falta confirmar en el preview)
- Historia de usuario: HU-EXP-001 (CA-01)
- RF/RNF: `RNF-PERF-005`

**Origen (2026-10-12):** tras `BR-011`, Lighthouse móvil local mide LCP
3,7 s con la imagen ya descargada a los 0,5 s: retraso de render
3.277 ms. Se sospechó del JavaScript inicial de la home.

> **Alcance ajustado (2026-10-12, por medición):** el ticket nació como
> "cargar con `lazy()` las secciones bajo el pliegue". Se probó y se
> **descartó**: las siete secciones pesan 20 KB sin minificar, el LCP no
> se movió (3,5 s antes y después) y el TBT solo bajó ~30 ms. El análisis
> del chunk `index` (663 KB sin minificar) mostró dónde estaba el peso:
> **541 KB eran `react-dom`**, que `manualChunks` en forma de objeto dejaba
> en el chunk de la app. El ticket pasa a corregir eso.

Alcance:
1. `manualChunks` como función: `react`, `react-dom`, `react-router*` y
   `scheduler` en `react-vendor`; `framer-motion`, `motion-*` y `lenis` en
   `animation-vendor`; iconos y utilidades de clases en `ui-vendor`.
2. Medir la línea base de `RNF-PERF-005`.

Criterios de aceptación:
1. El chunk de la app baja de ~240 KB a ~79 KB sin minificar y `react-dom`
   queda en `react-vendor` (test `manualChunks.test.ts`).
2. JavaScript de la carga inicial ≤ 200 KB gzip (CP-PERF-005): 160 KB.
3. Un cambio solo en el código de la app no cambia el hash de
   `react-vendor` ni de `animation-vendor` (se comprueba en el segundo
   despliegue).

El LCP ≤ 2,5 s **no se resuelve aquí**: la causa es renderizar solo en el
cliente. Ver evidencia en `BR-034`.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-035).

#### BR-012 — Optimizar las imágenes que quedaron fuera

- Prioridad: P1 · Esfuerzo: S · Depende de: BR-011
- Estado: En curso (rama `perf/br-012-imagenes-pendientes`; hecho en local, falta confirmar en el preview)
- Historia de usuario: HU-EXP-001 (CA-01)
- RF/RNF: `RNF-PERF-002`, `RNF-PERF-004`

**Origen (2026-10-12):** `cta2_crew.png` (531 KB) sin optimizar y animando
`scale` + `filter`; logo del footer en PNG de 48 KB sin `width`/`height`;
~6 MB de PNG originales versionados; `service1.png` y `react.svg` sin uso.

Alcance:
1. Pasar todas las imágenes de contenido por el script de optimización,
   con variantes por ancho (`srcset`/`sizes`, ex `P014`).
2. `width`/`height` en toda `<img>` (ex `P003`).
3. Borrar los assets sin uso.

Criterios de aceptación:
1. CP-PERF-002 y CP-PERF-004 pasan en las 7 rutas. **Salvedad:** las
   imágenes de servicios, productos y equipo siguen viniendo de
   Unsplash hasta `BR-008`, así que esa parte de CP-PERF-004 (ninguna
   petición a dominios de terceros) no puede cumplirse aquí.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-012).

#### BR-013 — CSS crítico sin parpadeo

- Prioridad: P1 · Esfuerzo: S · Depende de: —
- Estado: En curso (rama `perf/br-013-css-critico`; hecho en local, falta confirmar en el preview)
- Historia de usuario: HU-EXP-001 (CA-01)
- RF/RNF: `RNF-PERF-001`, `RNF-PERF-002`

**Origen (2026-10-12):** el `asyncCSSPlugin` de `vite.config.ts` convierte
**todos** los `<link rel=stylesheet>` en `preload` + `onload`, incluido el
CSS de la home: riesgo de contenido sin estilo (FOUC) y de CLS. Absorbe el
ex `P015` (critical CSS).

Alcance:
1. Medir con y sin el plugin.
2. Dejar bloqueante el CSS de la carga inicial y diferir solo el de rutas
   lazy, o retirar el plugin si no aporta. **Resultado: se retira** (el
   plugin solo tocaba el CSS principal del `index.html`; los CSS de rutas
   lazy los gestiona Vite aparte).
3. Si cambia o se retira el `onload` inline del plugin, actualizar o
   quitar su hash en la CSP de `vercel.json` (`BR-002`). **Hecho:**
   `script-src 'self'`.

Criterios de aceptación:
1. Sin FOUC visible en una carga con CPU 4x y 4G lenta; CP-PERF-001 y
   CP-PERF-002 no empeoran.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-013).

---

### Épica G — SEO y accesibilidad

#### BR-033 — Accesibilidad del menú móvil, imágenes y formularios

- Prioridad: P2 · Esfuerzo: S · Depende de: —
- Estado: Propuesta
- Historia de usuario: HU-EXP-002 (CA-01, CA-03)
- RF/RNF: `RNF-A11Y-001`, `RNF-A11Y-002`

**Origen (2026-10-12):** el menú móvil usa `role="menu"` sin `menuitem` ni
gestión de foco; el logo del footer tiene `alt="Logo"`; el buscador de
productos no tiene label. Absorbe el ex `S007`.

Alcance:
1. Menú móvil como *disclosure* (`aria-expanded`, `aria-controls`), foco al
   abrir, Escape para cerrar y foco de vuelta al botón.
2. `alt` descriptivos; `label` visible u oculto en el buscador.

Criterios de aceptación:
1. CP-A11Y-001 y CP-A11Y-002 pasan.

> **Hallazgo (2026-10-12):** en el footer, el título "Barber Royce" se ve
> oscuro sobre fondo oscuro (casi ilegible; incumple `RNF-A11Y-004`).
> Corregir su color en este ticket.

#### BR-034 — Spike: prerender de rutas para SEO

- Prioridad: P1 · Esfuerzo: M · Depende de: BR-006
- Estado: Propuesta (spike)
- Historia de usuario: HU-SEO-001 (CA-01)
- RF/RNF: `RNF-SEO-003`

**Origen (2026-10-12):** es una SPA; un crawler sin JavaScript solo ve los
metadatos de la home. Google ejecuta JS, pero otros (WhatsApp, Facebook al
compartir un enlace) no.

> **Evidencia nueva (2026-10-12) → sube a P1:** además de SEO, es la
> palanca real del LCP. Con la imagen del hero ya descargada a los
> 0,5 s, Lighthouse móvil mide un retraso de render de 3.277 ms hasta
> que React monta (LCP 3,5-3,7 s; objetivo 2,5 s). Ni quitar el PNG
> (`BR-011`), ni diferir CSS (`BR-013`), ni dividir la home (`BR-035`)
> lo mueven; con HTML prerenderizado el hero se pinta en el primer
> pintado.

Alcance:
1. Evaluar prerender estático de las 7 rutas en el build (plugin de
   prerender o SSG con React Router) frente a dejarlo como está.
2. Registrar la decisión como ADR en `architecture.md`.

Criterios de aceptación:
1. ADR escrito con la medición (HTML inicial de cada ruta, costo de build,
   impacto en la hidratación). Si se adopta, se abre el ticket de
   implementación.

---

### Épica H — Calidad y CI

#### BR-025 — Eliminar código muerto y dependencias sin uso

- Prioridad: P2 · Esfuerzo: M · Depende de: BR-014
- Estado: Propuesta
- Historia de usuario: no aplica — deuda técnica.
- RF/RNF: `RNF-MANT-003`

**Origen (2026-10-12):** ~1000 líneas sin consumidores, casi todas del
commit `49e46d8`.

Alcance:
1. Borrar `components/animations/` (SmoothParallax,
   DirectionAwareElement), `common/Button/`, `sections/Services/`,
   `ScrollProgressContext` + `useScrollProgressHooks`,
   `useOptimizedParallax`, `useRAFThrottle`, `useWillChange`,
   `useLenisInView`, `App.css`, `styles/shared/page.css`, helpers sin uso
   de `routes.ts`, `animations.config.ts` y `performance.constants.ts`.
2. Desinstalar `honeycomb-grid`, `@fontsource-variable/montserrat` y el
   `@radix-ui/react-tabs` duplicado; declarar o eliminar
   `@radix-ui/react-progress`.

Criterios de aceptación:
1. CP-MANT-003 pasa; `npm run build` y las 7 rutas siguen iguales.

#### BR-026 — Generar las rutas desde `ROUTES`

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-003, BR-019
- Estado: Propuesta
- Historia de usuario: HU-EXP-002
- RF/RNF: `RF-NAV-001`

**Origen (2026-10-12):** `<Routes>` en `App.tsx` repite a mano lo que
`ROUTES` ya declara. Absorbe los ex `B020`, `A003`.

Alcance:
1. `ROUTES` incluye el componente lazy de cada ruta; `<Routes>` se arma
   recorriéndolo, con boundary por ruta (`BR-019`) y la 404 (`BR-003`).

Criterios de aceptación:
1. Test: cada entrada de `ROUTES` tiene una ruta renderizable y nada más.

#### BR-027 — Ordenar `data/`, `types/` e iconos

- Prioridad: P2 · Esfuerzo: S · Depende de: —
- Estado: Propuesta
- Historia de usuario: no aplica — deuda técnica.
- RF/RNF: `RNF-MANT-003`

**Origen (2026-10-12):** pares `heroData.ts`/`.tsx`, `benefitsData`,
`featuresData` con el mismo nombre; constantes de runtime en
`types/*.types.ts`; `Location/*` importa el CSS Module de una página; SVG
inline repetidos en `ServicesPage`, `ProductsPage` y `CTA2`. Absorbe el ex
`B012`.

Alcance:
1. Un archivo de datos por tema; las constantes salen de `types/`.
2. `Location/` con su propio CSS Module.
3. SVG inline → `lucide-react` o `components/icons`.

Criterios de aceptación:
1. Ningún import con extensión explícita `.tsx` en `src/`; ningún
   componente importa el CSS Module de otro.

#### BR-028 — Prettier, `.editorconfig` y alias `@/` obligatorio

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-004
- Estado: Propuesta
- Historia de usuario: no aplica — herramientas de desarrollo.
- RF/RNF: `RNF-MANT-001`

**Origen (2026-10-12):** sin formatter; mezcla de 2 y 4 espacios; imports
relativos y con alias mezclados. Patrón de RadarOP.

Alcance:
1. `.prettierrc` y `.editorconfig`; script `format`; formateo de todo `src/`
   en un commit aparte.
2. Regla `import/no-relative-parent-imports` (`eslint-plugin-import`).

Criterios de aceptación:
1. `npx prettier --check src` y `npm run lint` pasan.

#### BR-030 — Vitest y Testing Library con los primeros tests

- Prioridad: P1 · Esfuerzo: M · Depende de: —
- Estado: Hecho (2026-10-12, rama `test/br-030-vitest` → master, PR #8)
- Historia de usuario: HU-OPS-001 (CA-01)
- RF/RNF: `RNF-MANT-002`

**Origen (2026-10-12):** no hay ningún test.

Alcance:
1. Vitest + jsdom + Testing Library + jest-dom; scripts `test`,
   `test:run`, `test:coverage`.
2. Primeros tests: rutas desde `ROUTES`, 404, enlaces externos con `rel`,
   datos del negocio consistentes.
3. Medir la línea base de cobertura y fijarla como umbral.

Criterios de aceptación:
1. `npm run test:run` en verde; umbral de cobertura configurado.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-030).

#### BR-029 — CI en GitHub Actions

- Prioridad: P1 · Esfuerzo: S · Depende de: BR-004, BR-030
- Estado: Hecho (2026-10-12, rama `ci/br-029-github-actions` → master, PR #9)
- Historia de usuario: HU-OPS-001 (CA-01)
- RF/RNF: `RF-OPS-002`, `RNF-MANT-001`, `RNF-SEG-003`

**Origen (2026-10-12):** no hay CI.

Alcance:
1. `.github/workflows/ci.yml` en `push` y `pull_request`: `npm ci`,
   `lint --max-warnings=0`, `tsc -b`, `test:coverage`, `build`,
   `npm audit --omit=dev --audit-level=high`.
2. Protección de `master` exigiendo el check.

Criterios de aceptación:
1. CP-OPS-002 pasa con un PR de prueba roto a propósito.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-029).

#### BR-031 — Lighthouse CI con umbrales bloqueantes

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-029, BR-002
- Estado: Propuesta
- Historia de usuario: HU-EXP-001 (CA-01), HU-EXP-002 (CA-04)
- RF/RNF: `RNF-A11Y-001`, `RNF-SEO-001`, `RNF-PERF-001`, `RNF-PERF-002`

**Origen (2026-10-12):** `lighthouserc.json` existe con todo en `warn` y
nadie lo ejecuta. Absorbe el ex `P010`.

Alcance:
1. Job que corre Lighthouse contra el preview de Vercel (o `vite preview`)
   en las 7 rutas, perfil móvil.
2. Accesibilidad y SEO ≥ 0,95 bloquean; rendimiento avisa (patrón de
   RadarOP).

Criterios de aceptación:
1. Un PR que baja la accesibilidad de 0,95 queda en rojo.

## 4. Diferido — no forma parte del despliegue

Cada ítem tiene su **disparador**: la condición que obliga a revisarlo.

| Tema | Origen | Disparador |
|---|---|---|
| Reserva propia (TanStack Query, Zustand, react-hook-form + zod, `AppError` completo de RadarOP, confeti de "reserva confirmada") | ADR-001 | Se decide dejar AgendaPro. |
| Analítica (GA4 o Vercel Analytics) y Search Console | ex checklist §6 | Primer despliegue en producción; requiere decidir proveedor y aviso de cookies. |
| Monitoreo de errores (Sentry o similar) | ADR-005 | Primer error reportado por un cliente que no se vio en los logs. |
| Galería de Instagram en SocialProof2 | ex `B001` | El dueño la pide y hay una cuenta con publicaciones constantes. |
| PWA (manifest completo, service worker, offline, instalación) | ex `W001`..`W005` | Evidencia de visitas recurrentes que justifiquen la instalación. |
| React Compiler | ex `P019` | Versión estable compatible con el plugin SWC. |
| Partir componentes grandes en subcomponentes | ex `B018` | Cuando un ticket toque ese componente. |

## 5. Definition of Done

Ver [`engineering-guidelines.md`](./engineering-guidelines.md) §6. La
skill `cerrar-ticket` la aplica.

## 6. Tablero resumido

Orden sugerido: P0 de la épica B → P1 → P2 → P3.

| ID | Título | Épica | Prioridad | Esfuerzo | Estado | Depende de |
|---|---|---|---|---|---|---|
| BR-001 | Ordenar documentación y proceso | A | P1 | M | Hecho | — |
| BR-002 | Vercel: rewrite, cabeceras, caché | B | P0 | S | Hecho | — |
| BR-003 | Página 404 | B | P0 | S | Hecho | BR-030 (test) |
| BR-004 | Lint sin errores | B | P0 | S | Hecho | BR-001 |
| BR-005 | Datos del negocio: fuente única y reales | B | P0 | M | Bloqueada | — |
| BR-006 | SEO técnico | B | P0 | S | Propuesta | BR-005 |
| BR-007 | Enlaces externos seguros | B | P0 | XS | En curso | — |
| BR-008 | Fotos propias en lugar de Unsplash | B | P0 | M | Bloqueada | — |
| BR-009 | Decidir botón "Comprar" | B | P1 | XS | Propuesta | — |
| BR-010 | Variables de entorno | B | P1 | XS | Propuesta | — |
| BR-011 | Ruta crítica del LCP | F | P1 | S | En curso | — |
| BR-012 | Imágenes pendientes | F | P1 | S | En curso | BR-011 |
| BR-035 | Separar vendors del chunk de la app | F | P1 | S | En curso | BR-011 |
| BR-013 | CSS crítico | F | P1 | S | En curso | — |
| BR-014 | Lenis sin fugas | E | P1 | M | En curso | BR-004 |
| BR-015 | Cero re-renders por scroll | E | P1 | M | En curso | BR-014 |
| BR-016 | Parallax liviano y variantes | E | P1 | M | En curso | BR-015 |
| BR-017 | Reduced motion en JS | E | P1 | S | En curso | — |
| BR-018 | Transiciones de página | E | P3 | S | Propuesta | BR-017 |
| BR-019 | Error boundaries | C | P1 | S | Hecho | — |
| BR-020 | Recuperación de chunks | C | P1 | S | Hecho | BR-019 |
| BR-021 | Fuente única de tokens | D | P2 | M | Propuesta | — |
| BR-022 | Hex → tokens | D | P2 | M | Propuesta | BR-021 |
| BR-023 | Retirar Tailwind y shadcn | D | P2 | L | Propuesta | BR-021 |
| BR-024 | Breakpoints unificados | D | P2 | S | Propuesta | BR-021 |
| BR-025 | Código muerto y dependencias | H | P2 | M | Propuesta | BR-014 |
| BR-026 | Rutas desde `ROUTES` | H | P2 | S | Propuesta | BR-003, BR-019 |
| BR-027 | Ordenar data, types e iconos | H | P2 | S | Propuesta | — |
| BR-028 | Prettier y alias | H | P2 | S | Propuesta | BR-004 |
| BR-029 | CI en GitHub Actions | H | P1 | S | Hecho | BR-004, BR-030 |
| BR-030 | Vitest y primeros tests | H | P1 | M | Hecho | — |
| BR-031 | Lighthouse CI | H | P2 | S | Propuesta | BR-029, BR-002 |
| BR-032 | Actualizar README | A | P2 | S | Propuesta | BR-001 |
| BR-033 | Accesibilidad | G | P2 | S | Propuesta | — |
| BR-034 | Spike prerender | G | P1 | M | Propuesta (spike) | BR-006 |

Los IDs `BR-011` a `BR-034` no siguen el orden de las épicas porque se
asignaron en el orden en que se detectaron; nunca se renumeran.

## 7. Regla de gobernanza

1. Todo bug o trabajo descubierto durante la construcción se agrega aquí
   con el siguiente ID correlativo, en su épica (skill `nuevo-ticket`).
2. Ningún ticket P0/P1 se cierra sin sus criterios de aceptación
   verificados en el preview.
3. Todo ticket cita la `HU-XXX` que lo origina, o dice por qué no aplica.
   Si la HU no existe, se escribe **antes** de cerrar.
4. Todo ticket cita su `RF/RNF`, o dice por qué no aplica. Si el
   requisito no está en el catálogo, se agrega antes de cerrar.
5. Las notas de construcción van a
   [`registro-construccion.md`](./registro-construccion.md), no a la ficha:
   la ficha es planificación, el registro es bitácora.
6. Este backlog es la fuente oficial de planificación técnica. Lo que no
   está aquí no está planificado.

## 8. Migración del backlog anterior (2026-10-12)

El backlog anterior está en [`archivo/BACKLOG.md`](./archivo/BACKLOG.md).
Destino de cada ítem abierto o con efecto vigente:

| ID anterior | Tema | Destino |
|---|---|---|
| P001, P012 | Imágenes WebP/AVIF con `<picture>` | Hecho con defectos → `BR-011` |
| P002 | Preload de fuentes | `BR-011` (evaluar con medición) |
| P003 | `width`/`height` del logo | `BR-012` |
| P004, P005, P007 | `useRAFThrottle`, `will-change` dinámico, `useOptimizedParallax` | Construidos sin conectar → se eliminan en `BR-025`; el objetivo lo cubren `BR-015`/`BR-016` |
| P006 | Consolidar `useTransform` en SocialProof1 | `BR-016` |
| P008 | Constantes de rendimiento | Hecho; lo que no se usa se elimina en `BR-025` |
| P009 | CSS containment | Hecho (`085186b`) |
| P010 | Lighthouse CI | `BR-031` |
| P011 | Monitor de rendimiento en desarrollo | Descartado: DevTools alcanza (YAGNI) |
| P013 | Precompresión Brotli | Descartado: Vercel comprime en el edge (ADR-003) |
| P014 | Imágenes responsive por ancho | `BR-012` |
| P015 | CSS crítico | `BR-013` |
| P016, P017, P018 | Quitar memo innecesarios | Hecho (`R001`..`R003`) |
| P019 | React Compiler | Diferido (§4) |
| B002, B003 | Overflow del parallax, estilos de Features/Reviews | Integrados en el PR #2; revisar en `BR-016` |
| S001, S004, S005, S009 | Meta tags, JSON-LD, sitemap, títulos | Hechos con defectos → `BR-006` |
| S002, S003, S006, S008 | OG image, favicons, robots, skip link | Hechos (manifest → `BR-006`) |
| S007 | ARIA completo | `BR-033` |
| B001 | Galería de Instagram | Diferido (§4) |
| B004, B005, B006 | Variantes y enfoque de animación | `BR-016` |
| B007 | Hover/tap de CSS a framer-motion | Descartado: las transiciones CSS son más baratas (§9 de la guía) |
| B008 | Sistema de orquestación de animaciones | Descartado: sin caso observado (regla de dos veces) |
| B009 | `useMemo` en animaciones | Hecho (`R002`) |
| B010 | Shared layout transitions | `BR-018` |
| B011 | Documentación de animaciones | `architecture.md` §5 |
| B012 | SVG inline a iconos | `BR-027` |
| B013 | Tipos en archivos propios | Hecho (`S001` de marzo) |
| B014 | Centralizar constantes | Hecho parcial → `BR-005` |
| B015, B017, B019 | Composición, hooks de presentación, compound components | Descartados como tickets genéricos: se aplican cuando un ticket concreto lo pida |
| B016 | DRY en lógica repetida | Absorbido por los tickets de cada caso |
| B018 | Partir componentes grandes | Diferido (§4) |
| B020, A003 | Utilidades de navegación | `BR-026` |
| B021 | Barrel exports | Descartado: empeoran el tree-shaking y no hay problema observado |
| B022 | Capa de data fetching | Diferido con la reserva propia (§4) |
| A001 | Configuración de navegación | Hecho (`getNavRoutes`) |
| A002 | `useScrollTracking` | `BR-015` |
| W001..W005 | PWA | Diferido (§4) |

## 9. Documentos relacionados

- [`historias-usuario.md`](./historias-usuario.md)
- [`casos-uso.md`](./casos-uso.md)
- [`rf-rnf-catalogo.md`](./rf-rnf-catalogo.md)
- [`registro-construccion.md`](./registro-construccion.md)
- [`engineering-guidelines.md`](./engineering-guidelines.md)
- [`architecture.md`](./architecture.md)
