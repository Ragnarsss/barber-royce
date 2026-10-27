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
- Estado: En curso (rama `docs/br-032-readme`; README reescrito; falta que alguien lo siga desde cero)
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

> **Requisito añadido (2026-10-12, desde `BR-041`):** el `FAQPage` del
> JSON-LD debe generarse desde `siteContent.faq` (`src/content/siteContent.ts`),
> no copiarse a mano.

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
- Estado: Hecho (2026-10-17, rama `feat/br-009-quitar-boton-comprar` → master, PR #31; verificado por el usuario en producción)
- Historia de usuario: HU-INFO-004 (CA-03, RN-01)
- RF/RNF: `RF-INFO-002`

**Origen (2026-10-12):** el botón "Comprar" de `/productos` no hace nada y
los precios tienen formato de dólares.

> **Decisión del usuario (2026-10-15):** se **quita el botón «Comprar»**: por
> ahora el sitio no vende productos. De las tres opciones de abajo gana una
> cuarta, la más simple: sin botón ni acción. La página sigue mostrando los
> productos con su precio. Si más adelante se quiere consultar o comprar, será
> un ticket nuevo.

Alcance:
1. ~~Decidir entre: consultar por WhatsApp con el producto prellenado,
   "Disponible en el local" sin botón, u ocultar la página hasta tener
   catálogo real.~~ Decidido: quitar el botón (ver arriba).
2. Precios en CLP (ya hecho: `formatClp` en la hoja).
3. Quitar el botón, su ícono de carrito y el CSS que queda sin uso en
   `ProductsPage`.

Criterios de aceptación:
1. Ningún botón visible sin acción (HU-INFO-004 RN-01): `/productos` no tiene
   ningún botón «Comprar» (test en `contentWiring.test.tsx`).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-009).

#### BR-010 — Preparar variables de entorno sin secretos

- Prioridad: P1 · Esfuerzo: XS · Depende de: —
- Estado: Hecho (2026-10-12, rama `chore/br-010-variables-entorno`; se verifica en el CI, no depende del preview)
- Historia de usuario: HU-OPS-001 (CA-03)
- RF/RNF: `RNF-SEG-002`

**Origen (2026-10-12):** `.gitignore` cubre `*.local` pero no `.env`; el
README promete variables que no existen.

Alcance:
1. `.env`, `.env.*` (salvo `.env.example`) en `.gitignore`.
2. `.env.example` vacío y documentado (hoy no se usa ninguna variable).

Criterios de aceptación:
1. `git check-ignore .env` lo reporta como ignorado.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-010).

#### BR-066 — El respaldo del enlace de reserva apunta a un subdominio que no existe

- Prioridad: P1 · Esfuerzo: XS · Depende de: —
- Estado: Hecho (2026-10-15, rama `feat/br-058-065-landing-y-equipo` → master, PR #29; verificado por el usuario en producción)
- Historia de usuario: HU-RES-001 (CA-02, CA-03)
- RF/RNF: `RF-RES-001`, `RNF-DATOS-001`

**Origen (2026-10-14):** el usuario avisó de que el enlace de reserva no servía
y dio el bueno. En la hoja (`negocio`, `reservas.url`) ya estaba bien
(`https://roycespa.site.agendapro.com/cl/sucursal/400965`), pero el valor de
respaldo del repo (`src/config/constants.ts:31` y la plantilla
`docs/contenido/negocio.csv`) usaba `barberiaroyc.site.agendapro.com`, que no
existe: AgendaPro lo redirige a su página comercial.

**Causa:** el subdominio del respaldo se escribió mal o quedó de un nombre
anterior de la cuenta de AgendaPro. Con la hoja funcionando no se notaba; si la
hoja fallaba, todos los botones de reservar llevaban a la página general de
AgendaPro.

**Arreglo:** el respaldo usa la dirección real de la hoja y la plantilla se
regenera desde él.

Criterios de aceptación:
1. `BUSINESS.booking.url` (respaldo) es `https://roycespa.site.agendapro.com/cl/sucursal/400965`
   y la plantilla `negocio.csv` coincide (HU-RES-001 CA-03, `RNF-DATOS-001`).
2. Ninguna dirección con `barberiaroyc` queda fuera de `docs/archivo/`.

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

#### BR-045 — Títulos invisibles sobre fondo oscuro (404, error de página, privacidad)

- Prioridad: P0 · Esfuerzo: S · Depende de: —
- Estado: En curso (rama `fix/br-045-titulos-ilegibles`; hecho en local; el defecto de la 404 sigue en producción hasta integrarlo)
- Historia de usuario: HU-EXP-003 (CA-02, CA-03), HU-EXP-002
- RF/RNF: `RF-NAV-002`, `RF-NAV-003`, `RNF-A11Y-004`

**Origen (2026-10-12):** al verificar visualmente el aviso de consentimiento
(`BR-037`) apareció que su título no se veía. Una captura de la 404 de
producción confirmó el mismo defecto: `h1` en `rgb(23,23,23)` sobre fondo
`rgb(23,23,23)` (contraste 1,0). Es un error mío de `BR-003` y `BR-019`.

**Causa:** `styles/global.css` fija el color de `h1`-`h6` con
`var(--color-text-primary)` (oscuro). Los títulos de `NotFoundPage`,
`PageError` y `ConsentBanner` viven sobre un fondo oscuro y su `.title` no
redefinía el color. La página de privacidad (`BR-044`) tenía el mismo
problema en el título y en los párrafos: supuse un fondo claro y es oscuro
(`--color-brand-background`).

**Arreglo:**
1. `color: var(--color-white)` en el `.title` de `NotFoundPage`, `PageError`
   y `ConsentBanner`.
2. `PrivacyPage`: texto, títulos y enlaces claros sobre el fondo oscuro.
3. Test de contraste en Chrome real, ruta por ruta (`contrast.e2e.test.ts`),
   y guarda estática del CSS de `PageError` (no se alcanza desde ninguna
   ruta).

> **Lección:** Lighthouse **no** detectó este defecto: el audit
> `color-contrast` de la 404 de producción dio "OK" (axe lo deja como
> "incompleto" por la animación). El gate de accesibilidad de `BR-031` no
> sustituye a este test.

Criterios de aceptación:
1. Ningún texto de ninguna ruta tiene contraste < 1,5 con su fondo sólido
   (`contrast.e2e.test.ts`).
2. Con los CSS anteriores el test falla en la 404 y en la privacidad.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-045).

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
- Estado: Propuesta (tramo de la landing hecho el 2026-10-22, PR #42; falta el resto del sitio)
- Historia de usuario: no aplica — deuda técnica sin cambio visible.
- RF/RNF: `RNF-MANT-003`

**Origen (2026-10-12):** unos 120 hex en los CSS Modules (`#ffffff` ×52,
`#1a1a1a` ×23, `#d52323` ×22) y estilos inline con colores en
`ScrollProgressBar.tsx` y en el fallback del `ErrorBoundary`.

Alcance:
1. Cada hex pasa a `var(--token)`.
2. Estilos inline de color pasan a CSS Modules.

> **Alcance ajustado (2026-10-22, decisión del usuario):** por ahora solo la landing. Salió de la segunda auditoría
> de SVG. Son 34 colores escritos a mano:
> - CTA2: 20.
> - Reviews: 5.
> - Hero: 1.
> - Navbar: 8 (se ve en la portada, aunque es compartida).
>
> Pasan a los tokens de `src/styles/tokens/`, y las transparencias a `color-mix()`. El `#332a2b` de CTA2 pasa a
> `--color-brand-section-bg` (`#332b2b`, una unidad de diferencia en el verde). `BR-021` (fuente única de tokens)
> sigue pendiente: este tramo no lo necesita, porque usa los tokens ya fijados por ADR-002. El resto del sitio
> queda para después.

Criterios de aceptación:
1. El agente `design-tokens-auditor` no reporta hex fuera de
   `styles/tokens/`.
2. (Tramo de la landing) Ningún CSS Module de Hero, Reviews, CTA2 ni Navbar tiene hex ni `rgb()`/`rgba()` (lo
   comprueba un test), y la portada se ve igual que antes.

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

- Prioridad: P2 · Esfuerzo: S · Depende de: — (antes `BR-021`; ver el alcance ajustado)
- Estado: Propuesta
- Historia de usuario: HU-EXP-001 (CA-03)
- RF/RNF: `RNF-COMP-001`, `RNF-MANT-004`

**Origen (2026-10-12):** media queries con 768, 968, 1024, 640, 1200 y
1600 px, mezclando `max-width` y `min-width`.

Alcance:
1. Conjunto cerrado de breakpoints (640, 768, 1024, 1280) documentado en
   `styles/tokens/breakpoints.css`.
2. Media queries con `min-width` (mobile-first).

Criterios de aceptación:
1. CP-COMP-001 pasa en 360, 768, 1280 y 1920 px.

> **Alcance ajustado (2026-10-18), decisión del usuario:** migrar **todo**
> el CSS a mobile-first y adoptarlo como patrón obligatorio, para que la deuda
> no se enrede más. Se descartó la alternativa de limitarse a cerrar los
> cortes y escribir mobile-first solo en el código nuevo. El usuario eligió:
> el conjunto **640, 769, 1025 y 1280 px**, este ticket como base con un
> ticket por grupo de archivos (`BR-080` a `BR-083`), y dejar el principio
> escrito en `CLAUDE.md`, en un ADR nuevo y en las skills y el agente
> `design-tokens-auditor`. **Deja de depender de `BR-021`:** los cortes se
> escriben como literales en `@media` (las variables CSS no funcionan ahí) y
> en `src/config/breakpoints.ts`, no dependen de unificar las fuentes de
> tokens.
>
> Origen del ajuste: la auditoría responsive del handoff
> (`docs/handoff-movil-2026-10-18.md`, H15 y H16). Cuenta 31 bloques
> `max-width` de ancho en 32 archivos CSS, `min-width: 768px` que choca con
> `max-width: 768px` justo a 768 px, y media queries repetidas como texto en
> `Hero.tsx`, `CTA1.tsx`, `CardCarousel.tsx`, `Navbar.tsx` y
> `usePinnedScene.ts`.
>
> Alcance nuevo (el de arriba queda reemplazado):
> 1. **Conjunto cerrado:** base móvil sin `@media`; `(min-width: 640px)`,
>    `(min-width: 769px)` (escritorio, el corte principal),
>    `(min-width: 1025px)` y `(min-width: 1280px)`; y
>    `(min-height: 720px)`, solo combinado con 769 para las escenas fijas.
>    Documentado en `src/styles/tokens/breakpoints.css` (con las variables
>    alineadas al conjunto) y con nombre en `src/config/breakpoints.ts`
>    (`MEDIA`), que es lo que usa `useMediaQuery`.
> 2. **Test** (`RNF-MANT-004`): recorre los `.css` de `src/` y falla si
>    aparece un `max-width` de ancho en un `@media` o un corte fuera del
>    conjunto. Mientras dure la migración, lleva una lista de archivos
>    pendientes que solo puede achicarse: cada ticket de grupo saca los suyos,
>    y un archivo nuevo o ya migrado que vuelva a `max-width` falla.
> 3. **Reglas:** ADR-009 en `architecture.md`, regla dura en `CLAUDE.md`
>    (regla 5), `engineering-guidelines.md`, skill `diseno-visual` y chequeo
>    4 de `design-tokens-auditor`.
> 4. Este ticket no migra secciones: eso lo hacen `BR-080` a `BR-083`. Cierra
>    cuando los cuatro estén hechos y la lista de pendientes quede vacía.
>
> Criterios de aceptación nuevos:
> 1. `src/config/breakpoints.ts` exporta las queries del conjunto y
>    ningún archivo de `src/` escribe una media query de ancho como texto
>    suelto (test).
> 2. El test de cortes está en verde con la lista de pendientes, y falla si se
>    agrega un `max-width` de ancho a un archivo que no está en ella (se
>    prueba).
> 3. ADR-009, la regla 5 de `CLAUDE.md`, `engineering-guidelines.md`,
>    `diseno-visual` y `design-tokens-auditor` dicen lo mismo.
> 4. Al cierre: lista de pendientes vacía y CP-COMP-001 en 320, 390, 640,
>    768, 769, 1024, 1025, 1280 y 1920 px.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-024).


#### BR-046 — Leer la hoja desde `.env` y en desarrollo

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-040
- Estado: Hecho (2026-10-14, rama `feat/br-046-env-local` → master, PR #15)
- Historia de usuario: HU-CNT-001
- RF/RNF: `RNF-CONF-003`

**Origen (2026-10-13):** el usuario pidió un `.env` para cargar las variables de
la hoja. Al revisarlo se vio que el plugin solo leía las variables del sistema y
que `npm run dev` nunca leía la hoja: ni un `.env` ni el servidor local
servían para verla. Además el README no decía de dónde se sacan los valores.

Alcance:
1. El plugin lee `.env` / `.env.local` (con `loadEnv`); las variables del
   sistema, si no están vacías, ganan.
2. `npm run dev` lee la hoja una vez al arrancar (un cambio en la hoja pide
   reiniciar). Los tests no leen `.env` ni salen a la red.
3. README: sección «De dónde sacar las variables»; `.env.example` actualizado.

Criterios de aceptación:
1. Con `CONTENT_SHEET_ID` y `CONTENT_SHEET_GIDS` en `.env`, `npm run dev` muestra
   el contenido de la hoja. **Esta prueba la hace el usuario** con su hoja real.
2. Sin `.env` el sitio sigue usando el respaldo y no hace ninguna petición.

#### BR-047 — El navegador relee la hoja: cambios sin desplegar

- Prioridad: P1 · Esfuerzo: M · Depende de: BR-040
- Estado: Hecho (2026-10-14, rama `feat/br-047-contenido-en-vivo` → master, PR #16)
- Historia de usuario: HU-CNT-001 (CA-06, CA-07)
- RF/RNF: `RF-CNT-006`, `RNF-CONF-003`, `RNF-SEG-004`

**Origen (2026-10-13):** el usuario esperaba que un cambio en la hoja se viera
sin volver a desplegar. El diseño de `BR-040` lee la hoja solo al construir
(`ADR-008`), así que cada cambio exigía un redeploy. El usuario eligió leerla
también desde el navegador, sabiendo que lo publicado en la hoja es público.

Alcance:
1. El build lee la hoja como hasta ahora y deja el contenido como punto de
   partida y respaldo; además entrega al navegador el identificador y los gid
   (`virtual:site-sheet`).
2. `ContentProvider` muestra ese contenido y, al terminar de cargar la página,
   pide el CSV, lo valida con el mismo código y lo reemplaza. Una pestaña que
   falla conserva el contenido del build. El código de lectura se carga con
   `import()` solo si hay hoja.
3. Las páginas leen con `useSiteContent()` / `useSiteText()`.
4. CSP: `connect-src` permite `docs.google.com` y `*.googleusercontent.com`.
5. `ADR-008` actualizado con fecha; `HU-CNT-001` con CA-06 y CA-07 (CA-05
   reemplazado).

Criterios de aceptación:
1. Cambiar un nombre en la hoja y recargar el sitio lo muestra sin reconstruir
   (e2e en Chrome real).
2. Con la hoja caída o con una fila inválida, el sitio muestra el contenido del
   build.
3. Sin hoja configurada no hay peticiones a Google ni código de lectura en la
   página inicial.
4. **Lo comprueba el usuario** en producción: definir las dos variables en
   Vercel, desplegar una vez, editar la hoja y ver el cambio a los 5 o 6 minutos.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-047).

---

#### BR-048 — Datos de contacto, sucursales y redes desde la hoja

- Prioridad: P1 · Esfuerzo: M · Depende de: BR-047
- Estado: Hecho (2026-10-14, rama `feat/br-048-negocio-desde-la-hoja` → master, PR #17)
- Historia de usuario: HU-CNT-003
- RF/RNF: `RF-CNT-007`, `RNF-DATOS-001`

**Origen (2026-10-13):** el usuario pidió que también se editen desde la hoja
los datos de la página de ubicación y contacto, los enlaces a WhatsApp y
AgendaPro, y los del footer (redes sociales, etc.). Hoy viven en `src/config/`
y `src/data/locationsData.ts`, y `CLAUDE.md` (regla 4) y `RNF-DATOS-001` los
fijan ahí: **esto cambia esa regla, por decisión del usuario**.

Decisiones tomadas por defecto el 2026-10-13 (el usuario dijo «procedamos»;
**por confirmar**):
1. Dos pestañas: `negocio` (clave/valor: teléfono, WhatsApp y su mensaje,
   correo, enlace y texto de reservas, cuatro horarios, tres redes) y
   `sucursales` (id, nombre, dirección, ciudad, teléfono, correo, WhatsApp,
   mapa y tres horarios). El dueño escribe lo que ve una persona; los enlaces
   (`tel:`, `mailto:`, WhatsApp) los arma el sitio.
2. `index.html` (JSON-LD, meta) y el sitemap son estáticos: **no cambian con
   la hoja**, solo al desplegar. Los valores de origen siguen en
   `src/config/constants.ts` y `src/data/locationsData.ts`.
3. Validación: teléfono de 8 a 15 dígitos, correo con `@` y punto, enlaces
   solo `https://`, mapa solo de Google Maps (lo que permite la CSP). Un valor
   inválido rechaza **toda** la pestaña y conserva lo anterior.
4. Cambios de datos visibles: `CONTACT.whatsapp.display` pasa de
   `+56 9 1234 5678` (de muestra) a `+56 9 3109 4222`, el número al que ya
   apuntaba el enlace; y `tel:+1234567890` pasa a `tel:1234567890`, para que el
   enlace salga del mismo número que se muestra (siguen siendo de muestra hasta
   `BR-005`).

Criterios de aceptación:
1. Cambiar un teléfono o una URL de AgendaPro en la hoja se ve en el sitio sin
   desplegar, en la página de ubicación y en el footer (e2e en Chrome real).
2. Un valor inválido conserva el dato del build y avisa en el registro.
3. **Lo comprueba el usuario:** crear las pestañas `negocio` y `sucursales` desde
   las plantillas, publicarlas, agregar sus `gid` a `CONTENT_SHEET_GIDS`, y ver el
   cambio de un teléfono en el footer.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-048).


#### BR-080 — Mobile-first: navbar, footer y estilos globales

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-024
- Estado: Propuesta
- Historia de usuario: no aplica — refactor sin cambio visible (decisión del usuario, 2026-10-18).
- RF/RNF: `RNF-MANT-004`, `RNF-COMP-001`

**Origen (2026-10-18):** el usuario decidió migrar todo el CSS a mobile-first
(`BR-024`). Este grupo: `Navbar.module.css`, `Footer.module.css`
(`max-width: 968px`), `styles/global.css`, `styles/mixins.css` (7 bloques,
con `767px` y `min-width: 768px`), `styles/performance.css` y
`styles/shared/page.css`; y el `resize` con `innerWidth > 768` de
`Navbar.tsx:23`, que pasa a `useMediaQuery(MEDIA…)`.

Alcance:
1. Base móvil sin `@media` y escritorio con los cortes del conjunto de
   `BR-024`; los archivos del grupo salen de la lista de pendientes del test.
2. **Sin cambio visual**, salvo donde un corte fuera del conjunto se mueve al
   más cercano (968 → 1025 en el footer). Esa franja se documenta.
3. Los arreglos de la navbar del handoff (H1, H2, H3) **no** entran aquí:
   van en su propio ticket, sobre esta base.

Criterios de aceptación:
1. Capturas antes y después iguales en 320, 390, 768, 769, 1024, 1025,
   1280 y 1920 px, en la home y en `/ubicacion`, con el menú móvil abierto y
   cerrado. Las únicas diferencias son las de la franja documentada.
2. El test de cortes (`RNF-MANT-004`) pasa sin estos archivos en la lista de
   pendientes.
3. CP-COMP-001: sin scroll horizontal entre 320 y 1920 px.


#### BR-081 — Mobile-first: secciones de la home

- Prioridad: P2 · Esfuerzo: M · Depende de: BR-024
- Estado: Propuesta
- Historia de usuario: no aplica — refactor sin cambio visible (decisión del usuario, 2026-10-18).
- RF/RNF: `RNF-MANT-004`, `RNF-COMP-001`, `RNF-PERF-002`

**Origen (2026-10-18):** migración a mobile-first (`BR-024`). Este grupo:
los módulos de Hero (4 bloques), CTA1 (2), SocialProof1 (4), Benefits (3),
Reviews (2), Features (2), SocialProof2 (4, con 1200 y 1600 px) y CTA2 (1);
las queries de JS de `Hero.tsx:40` (se lee una vez en un `useState`, no
reacciona al rotar), `CTA1.tsx:57` y `usePinnedScene.ts:13`, que pasan a
`MEDIA`.

Alcance:
1. Base móvil y escritorio con `min-width: 769px` (y 1025 o 1280 donde hoy
   hay 1024, 1200 o 1600). Los archivos salen de la lista de pendientes.
2. **Sin cambio visual** en la home ni en las escenas fijas, salvo las franjas
   de cortes que se mueven (1200 y 1600 de SocialProof2), documentadas.
3. Los arreglos de escenas fijas en escritorio bajo (H4) y los huecos
   verticales (H5) del handoff van en tickets propios.

Criterios de aceptación:
1. Capturas antes y después iguales en 320, 390, 768, 769, 1024, 1025,
   1280 y 1920 px de cada sección, y en tres puntos del recorrido de cada
   escena fija a 1440 px. Solo cambian las franjas documentadas.
2. Los tests existentes de cada sección siguen en verde (los que leen el
   bloque `max-width: 768px` se reescriben contra el bloque nuevo, con la
   misma intención).
3. CLS de la home sin cambios (Lighthouse móvil, alternado con `master`).


#### BR-082 — Mobile-first: páginas internas

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-024
- Estado: Propuesta
- Historia de usuario: no aplica — refactor sin cambio visible (decisión del usuario, 2026-10-18).
- RF/RNF: `RNF-MANT-004`, `RNF-COMP-001`

**Origen (2026-10-18):** migración a mobile-first (`BR-024`). Este grupo:
`AboutPage`, `FAQPage`, `LocationPage` (con `max-width: 968px`),
`ServicesPage` y `PageHero`.

Alcance:
1. Base móvil y escritorio con los cortes del conjunto; 968 → 1025 en
   `LocationPage`, documentado. Los archivos salen de la lista de pendientes.
2. Sin cambio visual. El carrusel de Servicios (H8) y el desborde de
   `/nosotros` (H7) van en tickets propios.

Criterios de aceptación:
1. Capturas antes y después iguales en 320, 390, 768, 769, 1024, 1025,
   1280 y 1920 px de `/nosotros`, `/faq`, `/ubicacion` y `/servicios`.
2. El test de cortes pasa sin estos archivos en la lista de pendientes.


#### BR-083 — Mobile-first: componentes comunes

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-024
- Estado: Propuesta
- Historia de usuario: no aplica — refactor sin cambio visible (decisión del usuario, 2026-10-18).
- RF/RNF: `RNF-MANT-004`, `RNF-COMP-001`

**Origen (2026-10-18):** migración a mobile-first (`BR-024`). Este grupo:
`CardCarousel` (CSS y su `matchMedia` propio en `CardCarousel.tsx:24,51`),
`Honeycomb`, `HoneycombPage`, `ModalDialog`, `BarberProfileDialog` (los
cuatro con `min-width: 768px`, que choca a 768 px) y `CatastrophicError`
(`max-width: 640px`).

Alcance:
1. Base móvil y los cortes del conjunto; `min-width: 768px` → 769 (cambia
   solo el ancho de 768 px exacto, documentado). `CardCarousel` usa
   `useMediaQuery(MEDIA…)` en vez de su propio `matchMedia`.
2. Sin cambio visual fuera de 768 px exacto.

Criterios de aceptación:
1. Capturas antes y después iguales en 320, 390, 769, 1024 y 1920 px de los
   carruseles de la home, `/equipo` con la ficha abierta, `/productos` y la
   pantalla de error. A 768 px se ve la versión móvil (antes, mezclada).
2. El test de cortes pasa con la lista de pendientes vacía si este es el
   último grupo.

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

#### BR-049 — El smooth scroll no se percibe y su implementación tiene redundancias

- Prioridad: P1 · Esfuerzo: S · Depende de: BR-014, BR-017
- Estado: Hecho (2026-10-13, rama `fix/br-049-smooth-scroll` → master, PR #19)
- Historia de usuario: HU-EXP-001 (CA-02)
- RF/RNF: `RNF-PERF-006`, `RNF-A11Y-003`

**Origen (2026-10-13):** el dueño del sitio no ve el efecto de Lenis; el
scroll se siente igual que el nativo. Revisión del código:
`useLenis.ts:11` fija `duration: 0.25`; `reset.css:67` deja
`html { scroll-behavior: smooth }` (el comentario de `global.css:15` dice
que se removió); no se importa `lenis/dist/lenis.css`.

**Causa:**
1. Con `duration: 0.25` la interpolación dura 250 ms y no se distingue del
   scroll nativo.
2. El `scroll-behavior: smooth` nativo se suma al de Lenis: dos suavizados
   sobre el mismo desplazamiento. Lenis exige `scroll-behavior: auto`
   mientras está activo, y eso lo resuelve `lenis.css`.
3. Redundancias que no producen el defecto pero sí complejidad:
   - loop `requestAnimationFrame` manual (Lenis trae `autoRaf`);
   - `ResizeObserver` sobre `body` que duplica `autoResize: true`;
   - dos mecanismos de "listo" (`rAF` en el hook y `setTimeout` de 100 ms
     con un segundo `resize()` en `LenisContext`);
   - `setLenisInstance(null)` en el cleanup;
   - `useLenis` (crea la instancia) y `useLenisContext` (la consume) tienen
     nombres que se confunden.

**Arreglo:**
1. `duration` con un valor perceptible (~1,2 s), en la constante de config.
2. Importar `lenis/dist/lenis.css` y quitar `scroll-behavior: smooth` de
   `reset.css`; sin Lenis (reduced motion o fallo) el scroll vuelve a ser
   nativo sin suavizado.
3. `autoRaf: true`, sin loop manual; sin `ResizeObserver` propio (confirmar
   contra Lenis 1.3 que `autoResize` cubre el alto del contenido).
4. Un solo punto de "listo": el hook publica la instancia y `isReady` se
   deriva de ella, sin `setTimeout` ni segundo `resize()`.
5. Renombrar el hook que crea la instancia (p. ej. `useLenisInstance`) y
   quitar el `setState` del cleanup.
6. Se conserva `prefers-reduced-motion` sin Lenis (BR-017) y sin leer
   `window.lenis`.
7. La config de Lenis se tipa con `LenisOptions`, y la práctica queda en
   `engineering-guidelines.md` §14 y en el agente `calidad-codigo-auditor`
   (decisión del 2026-10-13).

Criterios de aceptación:
1. Con movimiento normal, `html` tiene la clase `lenis` y una rueda de
   ratón produce un desplazamiento interpolado de ≥ 1 s (verificado en el
   preview de Vercel).
2. Con `prefers-reduced-motion: reduce` no se crea Lenis y el scroll es
   nativo, sin `scroll-behavior: smooth` (CP-A11Y-003).
3. Ningún listener, observer ni `rAF` queda vivo tras desmontar (test del
   hook, `HU-EXP-001 CA-02`).
4. `ScrollToTop` y la navegación por anclas siguen funcionando en las 7
   rutas.
5. CP-PERF-006 no empeora.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-049).

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
> Corregir su color en este ticket. También el `h2` rojo "¿Ya te decidiste
> a andar con el flow?" de `CTA2` mide contraste 2,72 sobre su fondo
> (WCAG pide 3 para texto grande).

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
- Estado: Propuesta (tramo de íconos hecho el 2026-10-22, PR #42; faltan data/, types/ y el CSS de Location)
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

> **Alcance ajustado (2026-10-22, decisión del usuario):** suma lo encontrado en la segunda auditoría de SVG de la
> landing. 7 de los 12 íconos de `src/components/icons/index.tsx` repiten íconos de `lucide-react` (Phone, Email,
> MapPin, Clock, Search, ShoppingCart y ExternalLink) y pasan a lucide. Quedan solo los de marca (WhatsApp,
> Instagram, Facebook, Twitter y TikTok), que lucide no trae. El SVG en línea de `CTA2.tsx` es el `MessageCircle`
> de lucide. Se hace después de `BR-094`.
>
> **Resultado (2026-10-22):** ShoppingCart, ExternalLink y Twitter no los usaba nadie y se eliminaron. El ícono de
> WhatsApp que ya existía (Footer, Ubicación y CTA2) era el globo de chat genérico, no el logo.
> **Decisión del usuario (2026-10-22):** ponerle el logo real de WhatsApp (Simple Icons, CC0), con relleno.

Criterios de aceptación:
1. Ningún import con extensión explícita `.tsx` en `src/`; ningún
   componente importa el CSS Module de otro.
2. `src/components/icons` exporta solo íconos de marca, y ningún componente dibuja en línea un ícono que trae
   lucide.

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
   **Límite conocido (2026-10-12, `BR-045`):** el audit de contraste de
   Lighthouse no detectó un título invisible en producción; este gate no
   reemplaza a `contrast.e2e.test.ts`.

Criterios de aceptación:
1. Un PR que baja la accesibilidad de 0,95 queda en rojo.

#### BR-095 — Los e2e de Chrome real no corren en paralelo

- Prioridad: P2 · Esfuerzo: S · Depende de: —
- Estado: Hecho (2026-10-22, rama `chore/br-095-e2e-en-serie` → master, PR #42; verificado por el usuario en producción)
- Historia de usuario: no aplica — calidad de la suite de tests.
- RF/RNF: `RNF-MANT-002`

**Origen (2026-10-22):** desde `BR-091` hay dos e2e que compilan el sitio y abren Chrome real
(`contrast.e2e.test.ts` y `fixedShapes.e2e.test.ts`), y Vitest los corre en paralelo con el resto de la suite. En
local, el `afterAll` de `contrast.e2e.test.ts` se colgó en 2 de 4 corridas completas: el archivo figura como
fallido aunque sus 892 pruebas pasan. Darle 30 s no lo resolvió. Solos, juntos o con la suite sin
`fixedShapes.e2e.test.ts`, pasan siempre. El CI no lo muestra.

> **Decisión del usuario (2026-10-22):** ticket aparte, después de la parte de la landing de `BR-022`.

**Línea base (2026-10-22):** de las 7 corridas completas de esa sesión que no fallaron por un bug real, 4 marcaron un
archivo e2e como fallido por un `afterAll` que superó su plazo (10 s por defecto; 30 s en una de ellas) y 3 pasaron.

**Causa (corregida durante el ticket):** la primera hipótesis, que era el paralelismo con las pruebas de unidades, no
alcanzó. Con solo el proyecto e2e, un archivo a la vez, dos archivos se colgaron en la primera corrida y en las 7
siguientes (6 con los tiempos del cierre a la vista) pasaron, con el cierre de Chrome en ~170 ms. El cuelgue
aparece cuando la máquina está ocupada (otro build, otro Chrome, otras sesiones): cerrar Chrome y el servidor pasa
de los 10 s por defecto. Es lentitud, no un bloqueo.

Alcance:
1. Los `*.e2e.test.ts` van en un proyecto propio de Vitest (entorno `node`), un archivo a la vez, con plazos
   holgados de prueba y de cierre (60 s y 120 s). El resto de la suite sigue igual.
2. Si los e2e pueden compartir una sola compilación del sitio y un solo Chrome, se evalúa como mejora (no se hizo).

Criterios de aceptación:
1. Cinco corridas seguidas de `npm run test:run` en local terminan en verde, sin archivos fallidos.
2. `npm run test:coverage` y el CI siguen funcionando igual.

**Verificación (2026-10-22, local):**
- Cinco corridas seguidas de `npm run test:run`: 85 archivos y 898 pruebas en verde cada vez, sin archivos fallidos
  (antes, 4 de 7 se colgaban). Duración de 64 a 166 s.
- `npm run test:coverage`: 898 pruebas en verde y cobertura de 86,9 % en sentencias, 91,0 % en ramas, 87,9 % en
  funciones y 86,9 % en líneas, sobre los umbrales (73 / 83 / 77 / 73).
- Pendiente: que el CI de GitHub corra igual con los dos proyectos (se ve al abrir el PR).

### Épica I — Medición y privacidad

> **Origen de la épica (2026-10-12):** pedido del usuario. El ítem diferido
> "Analítica" de la §4 tenía como disparador el primer despliegue en
> producción, que ya ocurrió. Decisiones por defecto en `ADR-007`, **por
> confirmar con el usuario**. Todo es opt-in por variables de entorno: sin
> variables, el sitio no carga ni muestra nada nuevo.

#### BR-036 — Vercel Analytics, activable por variable

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-010
- Estado: En curso (rama `feat/br-036-vercel-analytics`; código hecho en local, faltan los pasos manuales del usuario)
- Historia de usuario: HU-MED-001 (CA-01, CA-02, CA-03)
- RF/RNF: `RF-MED-001`, `RNF-PRIV-001`, `RNF-PERF-007`, `RNF-SEG-004`

**Origen (2026-10-12):** pedido del usuario: ver cuántas personas visitan
el sitio.

Alcance:
1. Dependencia `@vercel/analytics`.
2. Un componente que carga Analytics solo si `VITE_VERCEL_ANALYTICS` es
   `true`, de forma diferida (después del evento `load`), para no afectar el
   LCP. Sin la variable, el código de Analytics no entra al bundle de
   producción.
3. `.env.example` documenta la variable.

Criterios de aceptación:
1. Un build sin la variable no contiene `/_vercel/insights` (HU-MED-001 CA-01).
2. Con la variable `true`, la home pide el script de insights y la visita se
   ve en el panel (CA-02). **Manual:** habilitar Analytics en Vercel.
3. LCP y TBT dentro de los umbrales de `RNF-PERF-007` (CA-03).

**Pasos manuales (del usuario):** Vercel → proyecto → Analytics → Enable;
definir `VITE_VERCEL_ANALYTICS=true` en Settings → Environment Variables
(Production) y volver a desplegar.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-036).

#### BR-044 — Política de privacidad (borrador)

- Prioridad: P2 · Esfuerzo: S · Depende de: —
- Estado: En curso (rama `feat/br-044-politica-privacidad`; hecho en local; el texto está por validar)
- Historia de usuario: HU-MED-003 (CA-05)
- RF/RNF: `RF-MED-005`

**Origen (2026-10-12):** el consentimiento de `BR-037` necesita una página
a la que enlazar.

Alcance:
1. Página `/privacidad` con `noindex`, enlazada desde el footer: qué datos
   se recogen (solo si GA está activo), para qué, quién los trata, cookies
   y cómo cambiar la elección, y contacto.
2. Los datos del responsable (razón social, correo) salen de
   `src/config/constants.ts`.

> **Pendiente de validación:** el texto es un borrador técnico, no
> asesoría legal. Debe revisarlo el dueño o un abogado antes de activar
> Google Analytics en producción (Ley 19.628 y su actualización, Ley
> 21.719).

Criterios de aceptación:
1. `/privacidad` carga, tiene `noindex` y los 4 apartados (CP-MED-005).
2. Test de render.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-044).

#### BR-037 — Consentimiento y Google Analytics 4

- Prioridad: P2 · Esfuerzo: M · Depende de: BR-044, BR-030
- Estado: En curso (rama `feat/br-037-consentimiento-ga4`; código hecho en local, faltan los pasos manuales del usuario)
- Historia de usuario: HU-MED-003 (CA-01, CA-02, CA-03, CA-04), HU-MED-002 (CA-01, CA-02)
- RF/RNF: `RF-MED-002`, `RF-MED-003`, `RF-MED-005`, `RNF-PRIV-001`, `RNF-PERF-007`, `RNF-SEG-004`, `RNF-A11Y-002`

**Origen (2026-10-12):** pedido del usuario: Google Analytics.

Alcance:
1. Estado de consentimiento (`aceptado` | `rechazado` | `sin decidir`) en
   `localStorage` con degradación sin storage, expuesto con un hook y
   `useSyncExternalStore`.
2. Cargador de GA4: solo si existe `VITE_GA_MEASUREMENT_ID` **y** hay
   consentimiento; Consent Mode v2 en `denied` por defecto; el script se
   inyecta con el DOM (sin script inline) para no abrir la CSP.
3. Aviso de consentimiento accesible, con "Aceptar" y "Rechazar" del mismo
   peso, que no tapa el navbar ni mueve el contenido (CLS 0); solo se
   monta si GA está configurado.
4. "Preferencias de privacidad" en el footer; al rechazar se detiene la
   medición y se borran las cookies `_ga*`.
5. CSP: `script-src` suma `https://www.googletagmanager.com`;
   `connect-src` suma `https://www.google-analytics.com` y
   `https://*.analytics.google.com`; `img-src` suma
   `https://www.google-analytics.com`. Sigue sin `unsafe-inline`.

Criterios de aceptación:
1. Sin ID, o sin aceptar: 0 peticiones a Google y 0 cookies `_ga*`
   (CP-MED-002, CP-PRIV-001), con tests.
2. El aviso tiene los dos botones iguales y se usa solo con teclado
   (CP-MED-003).
3. CSP sin `unsafe-inline` ni `unsafe-eval` (CP-SEG-004).

**Pasos manuales (del usuario):** crear la propiedad GA4 y copiar el ID
`G-XXXXXXXXXX`; definir `VITE_GA_MEASUREMENT_ID` en Vercel (Production);
validar el texto de `/privacidad`; volver a desplegar.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-037).

#### BR-038 — Eventos de conversión y vistas por ruta

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-037
- Estado: En curso (rama `feat/br-038-eventos-conversion`; código hecho en local; falta ver los eventos en GA4 con un ID real)
- Historia de usuario: HU-MED-002 (CA-02, CA-03, CA-04)
- RF/RNF: `RF-MED-004`, `RNF-PRIV-001`

**Origen (2026-10-12):** medir si la web capta clientes.

Alcance:
1. `trackEvent(nombre, params)` que no hace nada sin consentimiento.
2. `page_view` por cada cambio de ruta (la app es una SPA y GA4 no lo
   detecta solo).
3. `reserve_click`, `whatsapp_click` y `phone_click` con `section` (navbar,
   hero, cta1, cta2, footer, ubicación, 404), sin datos personales y sin
   retrasar la navegación del enlace.

Criterios de aceptación:
1. Con consentimiento, 3 rutas = 3 `page_view`; cada clic genera su evento
   (CP-MED-004), con tests.
2. Sin consentimiento, 0 eventos.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-038).

### Épica J — Contenido editable desde una hoja de cálculo

> **Origen de la épica (2026-10-12):** pedido del usuario: actualizar la
> información estática (catálogo de servicios y productos, títulos)
> desde una hoja de Google. Diseño y alternativas descartadas en
> `ADR-008`: la hoja se lee **al construir** (el sitio sigue siendo
> estático, `ADR-001`), publicada como CSV, con un respaldo versionado.

#### BR-039 — Núcleo de contenido: CSV, validación y respaldo

- Prioridad: P2 · Esfuerzo: M · Depende de: BR-030
- Estado: En curso (rama `feat/br-039-contenido-nucleo`; hecho en local; sin pasos manuales)
- Historia de usuario: HU-CNT-001 (CA-02, CA-03)
- RF/RNF: `RF-CNT-002`, `RF-CNT-003`, `RNF-CONF-003`, `RNF-DATOS-002`

**Origen (2026-10-12):** base común de la épica, sin red ni Vite, para
poder probarla entera.

Alcance:
1. Lector de CSV (comillas, comas y saltos de línea dentro de una celda).
2. Esquemas de `servicios`, `productos`, `equipo`, `preguntas` y `textos`
   (campos obligatorios, precio entero CLP, largos máximos, ids únicos).
3. Función pura `resolveContent(csvPorPestaña, snapshot)` que valida cada
   pestaña por separado, usa el respaldo de las inválidas o ausentes y
   devuelve también los avisos (pestaña, fila, campo).
4. Respaldo (`snapshot`) inicial con el contenido actual de `src/data`.

Criterios de aceptación:
1. Una fila sin precio rechaza solo esa pestaña y el aviso nombra pestaña,
   fila y campo (CP-CNT-002).
2. Con pestañas ausentes, el resultado es igual al respaldo (CP-CNT-003).
3. El respaldo cumple el mismo esquema (CP-DATOS-002).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-039).

#### BR-040 — Descarga de la hoja al construir

- Prioridad: P2 · Esfuerzo: M · Depende de: BR-039
- Estado: En curso (rama `feat/br-040-descarga-hoja-build`; código hecho en local; faltan los pasos manuales del usuario)
- Historia de usuario: HU-CNT-001 (CA-01, CA-02, CA-05)
- RF/RNF: `RF-CNT-001`, `RF-CNT-003`, `RNF-CONF-003`, `RNF-SEG-004`

**Origen (2026-10-12):** conectar la hoja sin romper el build.

Alcance:
1. Plugin de Vite que, al construir, descarga cada pestaña publicada
   (`CONTENT_SHEET_ID` y un `gid` por pestaña, **no** `VITE_*`: son de
   build), con tiempo máximo de 10 s por pestaña.
2. Pasa los CSV a `resolveContent` y expone el resultado como módulo
   virtual (`virtual:site-content`) que consumen los componentes.
3. Cualquier fallo (red, 404, timeout, hoja inválida) cae al respaldo y
   deja el aviso en el log; el build nunca falla por la hoja. Sin las
   variables, no hace ninguna petición.
4. El sitio publicado no habla con Google Sheets (CA-05).

Criterios de aceptación:
1. Con la hoja caída, con una pestaña inválida y con timeout, el build
   termina bien (CP-CONF-003), con tests del plugin y un servidor falso.
2. Sin variables: 0 peticiones (CP-CNT-001).

**Pasos manuales (del usuario):** crear la hoja con las pestañas de las
plantillas (`BR-041`); Archivo → Compartir → Publicar en la web (cada
pestaña en CSV); copiar el id de publicación y los `gid`; definir las
variables en Vercel (`CONTENT_SHEET_ID`, `CONTENT_SHEET_GIDS`). Guía en
`BR-043`.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-040).

#### BR-041 — Servicios, productos, equipo y preguntas desde el contenido generado

- Prioridad: P2 · Esfuerzo: M · Depende de: BR-040
- Estado: En curso (rama `feat/br-041-catalogo-desde-contenido`; hecho en local; sin pasos manuales)
- Historia de usuario: HU-CNT-001 (CA-01, CA-04)
- RF/RNF: `RF-CNT-004`, `RNF-DATOS-002`, `RNF-PERF-001`

**Origen (2026-10-12):** que los componentes lean la hoja y no listas
escritas a mano.

Alcance:
1. Servicios, productos, equipo y preguntas frecuentes leen el contenido
   generado; `src/data` deja de tener esas listas.
2. Formato de precio `$15.000` a partir del entero CLP (cierra el
   formato USD de productos, `BR-009`, en su parte de formato).
3. Plantillas CSV en `docs/contenido/` (una por pestaña) para importarlas
   en Google Sheets.
4. ~~El JSON-LD de preguntas sale del mismo contenido~~ → **se traslada a
   `BR-006`** (2026-10-12): el JSON-LD vive en `index.html` y se corrige ahí
   junto con los demás errores de SEO técnico; hacerlo aquí lo dejaría a
   medias. Requisito para `BR-006`: el `FAQPage` debe salir de
   `siteContent.faq`.

Criterios de aceptación:
1. Cambiar el respaldo cambia lo que muestra el sitio (CP-CNT-004).
2. Las plantillas CSV pasan el esquema.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-041).

#### BR-042 — Textos y títulos desde la pestaña `textos`

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-041
- Estado: Hecho (2026-10-14, rama `feat/br-042-textos-desde-hoja` → master, PR #13)
- Historia de usuario: HU-CNT-002 (CA-01, CA-02, CA-03)
- RF/RNF: `RF-CNT-005`, `RNF-CONF-003`

**Origen (2026-10-12):** "headings, etc." del pedido.

Alcance:
1. `text(clave, porDefecto)` sobre el contenido generado; largo máximo por
   clave.
2. Empezar con un conjunto acotado de claves (título y subtítulo de la
   portada y títulos de sección). Los textos con saltos de línea o
   negritas dentro del JSX quedan fuera hasta definir cómo se editan.

Criterios de aceptación:
1. Una clave en la hoja cambia el texto; una ausente deja el original; una
   demasiado larga se rechaza con aviso (CP-CNT-005).

> **Alcance ajustado (2026-10-12):** el conjunto inicial son las 13 claves
> de la home (`src/content/texts.ts`): título del Hero, título y subtítulo
> de `CTA1`, `SocialProof1/2`, `Reviews` y `Features`, título de
> `Benefits` y de `CTA2`. Quedan fuera los textos con formato dentro de la
> frase (el subtítulo del Hero y el de `CTA2`, con negritas) y el
> subtítulo de `Benefits` (es una frase abierta que continúa en las
> tarjetas). Los títulos de las demás páginas (`PageHero`) quedan para una
> segunda tanda.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-042).

#### BR-043 — Guía para publicar contenido desde la hoja

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-040
- Estado: Hecho (2026-10-14, rama `docs/br-043-guia-contenido-hoja` → master, PR #13)
- Historia de usuario: HU-CNT-001 (CA-04)
- RF/RNF: no aplica — documentación de un proceso manual.

**Origen (2026-10-12):** el usuario ejecuta los pasos manuales al volver.

Alcance:
1. `docs/contenido-hoja.md`: cómo crear la hoja desde las plantillas,
   publicarla como CSV, obtener los identificadores, definir las
   variables en Vercel y crear el `deploy hook`.
2. Publicación automática opcional con Google Apps Script
   (`onEdit` → `deploy hook`) con límite de frecuencia, como bloque de
   código dentro de la guía (no se versiona como script del repo).
3. Qué hacer cuando el log del build avisa de una fila inválida.

Criterios de aceptación:
1. Siguiendo solo la guía, el dueño cambia un precio y lo ve publicado
   (CU-CNT-001). **Esta prueba la hace el usuario** al volver (es el cierre
   de la épica J).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-043).

### Épica L — Prueba social real

La home tiene dos secciones de confianza que hoy son de muestra: la parrilla de
fotos de `SocialProof2` (íconos de cámara) y las reseñas (tres textos en
`src/data/reviewsData.ts`). El usuario pidió el 2026-10-14 conectarlas a
Instagram y a las reseñas de Google. Ambas dependen de cuentas y servicios de
terceros, así que cada ticket empieza por una decisión de arquitectura
(¿se lee al construir, en una función de Vercel o en el navegador?), que se
registra en un ADR nuevo antes de escribir código.

#### BR-051 — Parrilla de fotos con las publicaciones reales de Instagram

- Prioridad: P2 · Esfuerzo: L (se parte al decidir el enfoque) · Depende de: —
- Estado: Bloqueada (falta la cuenta de Instagram profesional de la barbería y su acceso, y la decisión de arquitectura del paso 1)
- Historia de usuario: HU-INFO-006 (CA-01 .. CA-05)
- RF/RNF: `RF-INFO-008`, `RNF-PERF-004`, `RNF-SEG-002`, `RNF-SEG-004`, `RNF-PRIV-001`, `RNF-CONF-003`

**Origen (2026-10-14):** el usuario pidió conectar la parrilla de fotos a
Instagram para que la prueba social deje de ser de muestra. Hoy
`src/components/sections/SocialProof2/SocialProof2.tsx` pinta la parrilla con el
ícono `Camera` en cada casilla, sin ninguna foto. Cumple el disparador del
diferido «Galería de Instagram en SocialProof2» (§4, ex `B001`).

**Lo que hay que saber antes de decidir** (a confirmar en la documentación
vigente de Meta al iniciar, porque cambia seguido):
- La API «Basic Display» de Instagram dejó de funcionar a fines de 2024. Hoy
  hace falta una **cuenta profesional** (empresa o creador), una **app de Meta**
  y un **token de acceso** que vence (los de larga duración duran unos 60 días y
  hay que renovarlos).
- El token es un **secreto**: no puede ir en una variable `VITE_*` ni llegar al
  navegador (regla 9 de `CLAUDE.md`, `RNF-SEG-002`).
- Las direcciones de las imágenes que entrega Instagram **caducan**: no se pueden
  guardar para siempre.

**Enfoques posibles** (paso 1: elegir uno y registrarlo en un ADR):
1. **Al construir (recomendado):** como la hoja (`ADR-008`), un plugin descarga
   las últimas publicaciones con el token (variable de build sin `VITE_`),
   **descarga y optimiza las fotos** y las sirve el propio sitio. Sin peticiones
   del visitante a Meta, sin tocar la CSP ni la política de privacidad, y las
   fotos pasan por la misma optimización que el resto. Contra: las fotos nuevas
   aparecen con el siguiente build, así que necesita un build programado (por
   ejemplo, diario con un Cron de Vercel y un deploy hook) y renovar el token
   antes de que venza.
2. **Función de Vercel:** una función con el token devuelve la lista con caché.
   Fotos al día sin reconstruir, pero las imágenes vienen del CDN de Instagram:
   hay que abrir la CSP (`img-src`) y mencionarlo en la política de privacidad, y
   es el primer código de servidor del proyecto (revisa `ADR-001`).
3. **Widget de terceros** (servicios que se ocupan del token): rápido de poner,
   pero suma un script externo, costo mensual, abrir la CSP y otro proveedor que
   ve a los visitantes.

Alcance (con el enfoque 1; se ajusta si se elige otro):
1. ADR nuevo con el enfoque elegido y las alternativas descartadas.
2. Variables de build `INSTAGRAM_*` documentadas en `.env.example` y en el
   README, sin prefijo `VITE_`; un test que falle si el token aparece en el build.
3. Lectura de las N publicaciones más recientes (N = casillas de la parrilla),
   descarga de las fotos, versiones optimizadas con dimensiones fijas (sin CLS) y
   texto alternativo desde la descripción, recortada (RN-02).
4. `SocialProof2` muestra las fotos; cada una es un `<a target="_blank"
   rel="noopener noreferrer">` a su publicación (regla 8).
5. Respaldo: si Instagram falla, el build no se rompe y usa las últimas fotos
   guardadas o, si no hay, una invitación a seguir la cuenta (no los íconos).
6. Build programado y procedimiento para renovar el token (o su automatización),
   escritos para el dueño.

Criterios de aceptación:
1. Con la cuenta conectada, la parrilla de la home muestra las publicaciones más
   recientes y cada una abre su publicación (HU-INFO-006 CA-01, CA-02; CP-INFO-008).
2. Con Instagram caído o sin configurar, la sección muestra el respaldo y el build
   termina bien (HU-INFO-006 CA-03; CP-CONF-003).
3. Lighthouse móvil sobre el preview: LCP y CLS no empeoran frente a `master`;
   ninguna foto supera el peso de RNF-PERF-004 (HU-INFO-006 CA-04; CP-PERF-004).
4. El token no aparece en ningún archivo del build (HU-INFO-006 CA-05; CP-SEG-002).

Preguntas para el usuario (no las resuelvo yo):
1. ¿La cuenta `@barberia.royce` es profesional (empresa o creador)? ¿Quién tiene
   acceso para crear la app de Meta y autorizarla?
2. ¿Cuánto puede tardar una foto nueva en aparecer en el sitio (minutos, un día)?
   Eso decide entre el enfoque 1 y el 2.
3. ¿Cuántas fotos se muestran? Hoy la parrilla tiene 5 casillas.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-051).

#### BR-052 — Reseñas reales de Google en la home

- Prioridad: P2 · Esfuerzo: M · Depende de: BR-006
- Estado: Bloqueada (falta el acceso a Google Cloud con facturación o a la ficha de Google de la barbería, y la decisión de arquitectura del paso 1)
- Historia de usuario: HU-INFO-003 (CA-03 .. CA-06, RN-01, RN-02)
- RF/RNF: `RF-INFO-009` (reemplaza a `RF-INFO-007`), `RNF-SEG-002`, `RNF-SEG-004`, `RNF-PRIV-001`, `RNF-PERF-004`

**Origen (2026-10-14):** el usuario pidió conectar las reseñas a las de Google
para que la prueba social deje de ser de muestra. Hoy
`src/components/sections/Reviews/Reviews.tsx` muestra tres reseñas escritas en
`src/data/reviewsData.ts` («Carlos M.», «Miguel R.», «Juan P.»), que no son reales:
`HU-INFO-003` CA-03 y RN-01 no se cumplen. Además `index.html` publica un
`aggregateRating` fijo (4,6 con 15 reseñas) que no sale de ninguna fuente; lo
quita `BR-006`.

**Lo que hay que saber antes de decidir** (a confirmar en la documentación y
las condiciones vigentes de Google al iniciar, porque cambian):
- **Places API (New), Place Details:** con el identificador del lugar devuelve la
  calificación promedio, el número de reseñas y **como máximo 5 reseñas**,
  elegidas por Google (no todas). Necesita un proyecto de Google Cloud **con
  facturación** y una clave de API; el campo de reseñas está en un nivel de
  precio alto, con un tramo gratis mensual.
- Las condiciones de Google Maps Platform **limitan guardar** el contenido de
  Places (salvo el identificador del lugar): guardar las reseñas en el repo o en
  el build por mucho tiempo puede no estar permitido. Hay que mostrar la
  **atribución a Google** y el autor de cada reseña.
- **Google Business Profile API:** da todas las reseñas de la ficha propia, pero
  pide autorización del dueño (OAuth) y una solicitud de acceso que Google aprueba.
- Las pautas de datos estructurados de Google no aceptan, para un negocio local,
  calificaciones copiadas de otros sitios: **no** se agrega `aggregateRating` al
  JSON-LD con estos datos.

**Enfoques posibles** (paso 1: elegir uno y registrarlo en un ADR):
1. **Función de Vercel con caché corta (recomendado si hay facturación):** la
   clave queda en el servidor, la función pide Place Details y responde con caché
   (por ejemplo, unas horas). El navegador pide a la propia función: la CSP solo
   necesita las fotos de perfil de los autores (o no se muestran). Es el primer
   código de servidor del proyecto (revisa `ADR-001`).
2. **Desde el navegador con una clave restringida por dominio:** sin servidor,
   pero la clave queda visible (está pensada para eso si se restringe, aunque
   igual pueden abusar de la cuota), hay que abrir la CSP a Google y mencionarlo
   en la política de privacidad.
3. **Al construir:** como la hoja. El más rápido para el visitante, pero choca
   con el límite de guardar contenido de Places; solo si las condiciones lo
   permiten con builds frecuentes.
4. **Selección manual en la hoja:** el dueño copia algunas reseñas de Google en
   una pestaña `reseñas`, con el enlace a cada una. Sin costo ni claves y con el
   mecanismo que ya existe, pero no es automático y elegir solo las mejores
   puede no reflejar la ficha real (choca con el espíritu de RN-01).

Alcance (con el enfoque 1; se ajusta si se elige otro):
1. ADR nuevo con el enfoque elegido y las alternativas descartadas.
2. Identificador del lugar (`place_id`) de la ficha de la barbería en
   `src/config/` (una ficha por sucursal si hay dos).
3. Función que pide Place Details (calificación, número de reseñas y reseñas),
   con la clave solo en el servidor, caché y tiempo máximo.
4. `Reviews` muestra las reseñas de Google: autor, calificación, texto sin editar
   (RN-02), fecha relativa y la atribución a Google; un enlace «Ver todas las
   reseñas» a la ficha (regla 8).
5. Sin conexión o con Google caído: se oculta la sección o se muestra solo el
   enlace a la ficha. Se eliminan las reseñas de muestra de `reviewsData.ts`.
6. Política de privacidad y CSP actualizadas si el enfoque lo exige (`BR-044`).

Criterios de aceptación:
1. Con la ficha conectada, la sección muestra reseñas de Google con autor,
   calificación y atribución (HU-INFO-003 CA-04; CP-INFO-009).
2. «Ver todas las reseñas» abre la ficha de la barbería en Google Maps
   (HU-INFO-003 CA-05).
3. Con Google caído o sin configurar, no aparece ninguna reseña de muestra y la
   sección no se ve rota (HU-INFO-003 CA-06).
4. La clave de API no aparece en ningún archivo del build, salvo que el ADR elija
   el enfoque 2 con una clave restringida (CP-SEG-002).
5. El JSON-LD no lleva `aggregateRating` con datos de Google (HU-INFO-003 RN-01).

Preguntas para el usuario (no las resuelvo yo):
1. ¿La barbería tiene ficha en Google (una por sucursal)? ¿Quién la administra?
2. ¿Aceptas un proyecto de Google Cloud con facturación activa (con tramo gratis
   y alertas de gasto), o prefieres el enfoque sin costo de la hoja (4)?
3. Con máximo 5 reseñas elegidas por Google, ¿alcanza, o quieres mostrar más
   (eso exige la Business Profile API)?

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-052).

---

### Épica K — Dirección visual y micro-interacciones

Serie de mejoras estéticas sección por sección (tipografía de marca, fondos
con profundidad, micro-interacciones), pedida por el dueño el 2026-10-14. Cada
sección es su propio ticket y empieza por el hero.

#### BR-050 — Hero: tipografía de marca

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-042, BR-043
- Estado: Hecho (2026-10-14, rama `feat/br-050-hero-tipografia-de-marca` → master, PR #22)
- Historia de usuario: HU-EXP-004 (CA-01 .. CA-05)
- RF/RNF: `RNF-PERF-001`, `RNF-PERF-002`, `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-004`

**Origen (2026-10-14):** el dueño quiere un sitio más llamativo y pidió partir
por el hero, dándole al nombre una fuente y un tamaño especiales. Hoy el
`<h1>` es una sola cadena de la hoja (`hero.titulo`, valor por defecto en
`src/content/texts.ts:16`: `"Barbería Royce,\nprofesionalismo, pasión y arte."`)
con Montserrat 700, `clamp(2.5rem, 5vw, 4rem)` y `text-transform: capitalize`
(`Hero.module.css:33-41`): la marca pesa lo mismo que el lema y sale
"Pasión **Y** Arte".

Decisiones tomadas el 2026-10-14 (el usuario respondió «dale vamos»; el
**tipo de fuente final está por confirmar**):
1. El nombre de la marca es identidad fija: sale de `src/config/` (`SITE`) y
   deja de formar parte de `hero.titulo` (ver el ajuste de arriba). La hoja conserva solo el lema.
2. Dirección tipográfica propuesta: «ROYCE» protagonista en una fuente de
   display condensada (Anton o Bebas Neue); «Barbería» pequeña en versalitas con
   tracking encima. Alternativas descartadas por ahora: serif de alto
   contraste (Playfair Display, Cormorant) y blackletter (Pirata One).

> **Alcance ajustado (2026-10-14):** el lema pasa a una clave nueva,
> `hero.lema`, en vez de reutilizar `hero.titulo`. La hoja real todavía tiene en
> `hero.titulo` el título entero («Barbería Royce, …»); si se reutilizara la
> clave, al desplegar la marca saldría duplicada hasta que el dueño editara la
> celda. Con una clave nueva la celda vieja se ignora con un aviso y el lema usa
> su texto por defecto, sin coordinar el orden de nada. Sigue siendo la decisión
> del 2026-10-14 (marca en config, lema en la hoja); cambia solo el nombre de la
> clave. Máximo del lema: 60 caracteres (antes 120).

Alcance:
1. Jerarquía en el hero: marca (clamp ≈ 8–10 rem en escritorio), lema y
   beneficios. «Barbería» en Montserrat, en versalitas y con tracking.
2. Fuente de display autoalojada con `@fontsource` (como Montserrat), con
   `font-display: swap`, subset latino y precarga solo si se mide que
   ayuda (`P002`/`BR-011`).
3. El nombre sale de `SITE` en `src/config/constants.ts` (se agregan sus
   partes: «Barbería» y «Royce»); `hero.lema` es el lema (clave nueva), se
   quita `text-transform: capitalize` y se ajustan el valor por defecto, el
   respaldo (`src/content/snapshot/`, lo hace el desarrollador), el
   `textos.csv` de plantilla y `docs/contenido-hoja.md` (BR-043), con el largo
   máximo y un aviso de cuánto cabe.
4. Micro-efecto de entrada: las letras suben desde una máscara y un destello
   rojo recorre «ROYCE» una vez. `MotionValue`/variants de framer-motion, sin
   `setState` por scroll; con `prefers-reduced-motion` el texto aparece
   completo y estático.
5. Colores y tamaños nuevos como tokens en `src/styles/tokens/`, sin hex en el
   módulo; el título conserva su `<h1>` semántico y el nombre accesible
   completo para lectores de pantalla.

Criterios de aceptación:
1. En la portada el nombre de la marca domina visualmente y el lema queda en
   segundo nivel (HU-EXP-004 CA-01).
2. Lighthouse móvil sobre el preview de Vercel: LCP y CLS no empeoran frente
   a `master` y la fuente no produce saltos de texto (HU-EXP-004 CA-02,
   CP-PERF-001, CP-PERF-002).
3. Con `prefers-reduced-motion: reduce` el título aparece completo y sin
   animación (HU-EXP-004 CA-03, CP-A11Y-003).
4. Cambiar `hero.lema` en la hoja cambia solo el lema, sin romper el diseño
   ni tocar la marca; un lema más largo que el máximo se rechaza con aviso
   (HU-EXP-004 CA-04, CP-CNT-005).
5. El nombre cabe sin desbordar en 360, 768 y 1440 px y el contraste cumple
   `contrast.e2e.test.ts` en ambos esquemas (HU-EXP-004 CA-05, CP-A11Y-004).
6. El nombre de la marca aparece una sola vez en el repo como dato
   (`SITE`) y un test lo compara con el del hero (`RNF-DATOS-001`).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-050).

Los tickets `BR-053` a `BR-057` salen de la sesión del 2026-10-14. El usuario
aprobó el orden: **skill → loader → fondos → tarjetas**, la dirección **A** para
las tarjetas y usar «Royce» (no el monograma) en el loader; el «RR» en vector
queda para cuando lo consiga.

#### BR-053 — Skill `diseno-visual` y flujo de SVG

- Prioridad: P2 · Esfuerzo: S · Depende de: BR-050
- Estado: Hecho (2026-10-14, rama `docs/br-053-skill-diseno-visual` → master)
- Historia de usuario: no aplica — proceso y herramientas de trabajo.
- RF/RNF: no aplica — documentación de un proceso.

**Origen (2026-10-14):** el usuario pide con frecuencia el mismo rol (diseñador
de sitios de marketing «award winning», sección por sección) y propuso volverlo
una skill. En `C:\Users\Cristian\Documents\alienskilez-web\.claude\skills\svg-workflow`
hay una skill de SVG que cubre limpieza, `pathLength="1"` y el bug de los
comentarios con `--`.

Alcance:
1. `.claude/skills/diseno-visual/SKILL.md`: el rol; el proceso por sección
   (diagnóstico, tres direcciones, elegir, ticket, implementar, verificar); las
   restricciones del proyecto (tokens, `MotionValue` y nunca `setState` por
   scroll, `prefers-reduced-motion`, presupuesto de LCP/CLS/TBT con línea base,
   WCAG 2.3.1 para parpadeos, la regla de pedir ticket antes de código).
2. Portar `svg-workflow` a `.claude/skills/svg-workflow`, adaptada a este repo
   (sin Tailwind, con tokens y CSS Modules).
3. Registrar ambas en `AGENTS.md`.

Criterios de aceptación:
1. Pedir «mejoremos la sección X» carga la skill y propone tres direcciones antes
   de escribir código.
2. `AGENTS.md` lista las dos skills nuevas y coincide con `.claude/`
   (lo verifica `backlog-governance`).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-053).

#### BR-054 — Loader de neón (letrero «Barber Royce»)

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-050, BR-053
- Estado: Hecho (2026-10-14, rama `feat/br-054-loader-neon` → master, PR #26)
- Historia de usuario: HU-EXP-004 (CA-06, CA-07)
- RF/RNF: `RNF-PERF-001`, `RNF-PERF-002`, `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-005`

**Origen (2026-10-14):** el usuario quiere un loader como el de alienskilez-web
(`Preloader.tsx`), pero con un SVG animado como un letrero de neón: empieza
apagado, se enciende, parpadea como defectuoso y entra. Hoy el hero espera a
Lenis y se ve vacío un instante.

Decisiones tomadas el 2026-10-14 (**por confirmar**: la frecuencia, porque el
usuario no la eligió):
1. Se usa «ROYCE» y no el monograma «RR» (ver `BR-057`).
2. Se muestra **una vez por sesión** (`sessionStorage`, con `try/catch`), no en
   cada carga: la web es de captación y cada segundo cuenta.

> **Alcance ajustado (2026-10-14, decisión del usuario):** primer uso de la
> skill `diseno-visual`. El diagnóstico mostró que el hueco real está **antes
> del JavaScript**: `index.html` trae un `#root` vacío y el primer pintado móvil
> llega a 2,9 s (Lighthouse simulado), mientras que con el JS cargado el hero
> aparece en menos de 1 s. Un loader en React (modelo alienskilez) no taparía
> ninguna espera. El usuario eligió la **dirección A** de tres:
> 1. **Neón en línea en `index.html`** (SVG + CSS en línea; la CSP permite
>    estilos en línea pero no scripts): se pinta antes del JS sobre fondo
>    charcoal, se enciende y parpadea mientras carga el sitio. Al montar React
>    da un último parpadeo, sale y dispara la entrada del hero.
> 2. Dura **lo que la carga real**, con un mínimo (~1 s, para que se lea el
>    encendido) y un máximo. Si el JS no llega, el CSS lo retira solo al
>    máximo: nunca tapa el sitio para siempre. Con eso **la frecuencia se
>    resuelve sola** (con caché casi no se ve) y se descarta `sessionStorage`.
> 3. **Diseño:** inspirado en el letrero de neón real de la barbería («Barber
>    Royce» en letra manuscrita, una tijera y un marco de líneas rectas), no en
>    «ROYCE» en Anton. Asset **provisorio**: una fuente manuscrita libre
>    convertida a trazados con un comando directo, la tijera de `lucide-react` y
>    el marco dibujado a mano. El definitivo, calcado del letrero real, pasa a
>    `BR-057`.
> 4. Con `prefers-reduced-motion`, el letrero aparece encendido y quieto, y sale
>    sin parpadeo.
>
> Criterios que reemplazan al 1 y al 2: el letrero se ve desde el primer
> pintado (antes del JS); dura al menos el mínimo y nunca más que el máximo;
> una interacción lo acorta; sin JS se retira solo al máximo.

> **Alcance ajustado (2026-10-14, decisión del usuario, tras la primera
> medición):** el diagnóstico tenía una premisa errónea: el CSS que bloquea el
> render frena también al letrero, así que el FCP móvil sigue en 3,0 s y el
> letrero no tapa «unos 3 s» de pantalla vacía, sino el tramo corto entre su
> aparición (~0,4 s) y la del sitio (~0,75 s). Con el mínimo de 1,2 s en cada
> carga, el LCP móvil de laboratorio pasó de 5,0 s a 6,5 s (FCP 3,0 s y CLS 0
> iguales; TBT 120–140 ms). El usuario eligió la **opción 1**: el mínimo
> completo (1,2 s) solo en la **primera carga de la sesión** (`sessionStorage`,
> con `try/catch`); en las siguientes el letrero sale en cuanto React monta.
> **Regresión aceptada por escrito:** en la primera visita de una sesión el LCP
> de laboratorio empeora ~1,5 s (en la vida real, hasta ~0,8 s con conexión
> rápida y casi nada con conexión lenta, donde el JS tarda más que el mínimo).
> Se prefirió una entrada con carácter de marca a esa décima de segundo. Lo que
> pide el criterio 5 pasa a: CLS y TBT no empeoran, y el LCP solo empeora en la
> primera visita de la sesión, en la medida medida aquí.

Alcance:
1. SVG de «ROYCE» con contornos sacados de Anton, como asset en `src/assets/`
   (flujo de `BR-053`), con trazos sin relleno que leen como tubo de neón.
2. Secuencia en CSS: apagado, encendido con parpadeo irregular (una letra más
   defectuosa), resplandor estable, un último parpadeo y salida. Resplandor con
   varios `drop-shadow` (núcleo claro, halo rojo con tokens); el parpadeo anima
   `opacity` de una capa borrosa, no el radio del blur.
3. Duración máxima ~2 s, como variable CSS fuente de verdad atada por test a una
   constante de TypeScript.
4. Se salta con `pointerdown`, `keydown`, `wheel` o `touchstart`; bloquea el
   scroll mientras corre; `aria-hidden`; con `prefers-reduced-motion` no se monta.
5. Al salir dispara la entrada del hero (`isReady` de `Hero.tsx`).
6. Un fallo del almacenamiento de sesión no impide ver el sitio.

Criterios de aceptación:
1. La secuencia se ve y dura ≤ 2 s; una interacción la salta (HU-EXP-004 CA-06).
2. En la misma sesión, el letrero ya no espera el mínimo: sale en cuanto React monta
   (HU-EXP-004 CA-06).
3. Con `prefers-reduced-motion: reduce` no se monta y no hay parpadeos
   (HU-EXP-004 CA-07, CP-A11Y-003).
4. No hay más de 3 destellos por segundo (CP-A11Y-005).
5. CLS y TBT móviles no empeoran frente a la línea base medida antes, y el LCP solo empeora en la primera visita de la sesión (ver el ajuste de arriba)
   (CP-PERF-001, CP-PERF-002, CP-PERF-003).
6. La entrada del hero arranca cuando el loader sale, sin pantalla vacía.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-054).

#### BR-055 — Hero: fondos con profundidad

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-050
- Estado: Hecho (2026-10-14, rama `feat/br-055-fondos-hero` → master, PR #27)
- Historia de usuario: HU-EXP-004 (CA-08)
- RF/RNF: `RNF-PERF-001`, `RNF-PERF-003`, `RNF-A11Y-003`

**Origen (2026-10-14):** los fondos del hero son seis triángulos planos con
`clip-path` en tres capas con parallax (`Hero.module.css`); no tienen textura,
luz ni reacción al cursor, y en móvil se ocultan todos (`display: none`), así
que el hero móvil queda de un solo color.

Alcance:
1. Grano fino sobre el rojo y el charcoal, y degradados en los triángulos.
2. Filo de luz de 1 px en las diagonales.
3. Haz de luz que sigue al cursor con `MotionValue` y resorte, solo con
   `(pointer: fine)`; nada de `setState` por `pointermove` ni por scroll.
4. En móvil, una forma geométrica simple en vez de ocultar los fondos.
5. Con `prefers-reduced-motion`, fondo estático y sin seguimiento.
6. Colores y valores como tokens, sin hex nuevos.

Criterios de aceptación:
1. El fondo muestra profundidad en escritorio y en móvil, y el haz sigue al
   cursor sin re-renders (HU-EXP-004 CA-08).
2. Con reducir movimiento no hay seguimiento (CP-A11Y-003).
3. LCP, CLS y TBT móviles no empeoran frente a la línea base (CP-PERF-001,
   CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-055).

#### BR-056 — Hero: tarjetas de beneficios (vidrio con esquinas cortadas)

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-050, BR-055
- Estado: Hecho (2026-10-14, rama `feat/br-056-tarjetas-hero` → master, PR #28)
- Historia de usuario: HU-EXP-004 (CA-09)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-004`

**Origen (2026-10-14):** las tres tarjetas son píldoras blancas lisas
(`.benefit`, `Hero.module.css`) entre formas angulares: legibles pero genéricas.
El usuario eligió la dirección **A** entre dos propuestas.

> **Alcance ajustado (2026-10-14):** en escritorio las tarjetas ya están en
> pantalla al cargar, así que una entrada «ligada al scroll» no se vería. La
> entrada sigue siendo la de carga (escalonada, tras el letrero de `BR-054`) y
> el scroll les da **profundidad al salir**: cada tarjeta sube un poco más que la
> anterior (`cardDepthRange`). En móvil no hay profundidad (quedan bajo el
> pliegue y se montarían sobre el texto). El `backdrop-filter` queda solo en
> escritorio. El vidrio se compone sobre el borde de la propia tarjeta (blanco
> translúcido en reposo, rojo con el cursor): el test de contraste modela esa
> capa en los dos estados. Se quitó `cursor: pointer`: las tarjetas no son
> enlaces.

Alcance:
1. Chaflán con `clip-path` en las esquinas, fondo translúcido y borde fino; el
   texto pasa a claro y se verifica el contraste.
2. Entrada ligada al scroll con `useScroll`/`MotionValue` (Lenis), y en móvil por
   entrada en pantalla; hover en escritorio con una luz que barre la tarjeta.
3. `backdrop-filter` solo si la medición en móvil lo permite; si no, fondo
   translúcido sin desenfoque.
4. Con `prefers-reduced-motion`, tarjetas estáticas.

Criterios de aceptación:
1. Las tarjetas reaccionan al scroll o al cursor (HU-EXP-004 CA-09).
2. El texto cumple contraste ≥ 4,5:1 sobre el fondo en escritorio y móvil, en
   ambos esquemas (CP-A11Y-004, `contrast.e2e.test.ts`).
3. TBT y fluidez de scroll no empeoran (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-056).

#### BR-057 — Loader con el letrero real en vector

- Prioridad: P3 · Esfuerzo: S · Depende de: BR-054
- Estado: Bloqueada (falta el «RR» en vector: hoy solo hay `royce-barber-logo.png` y un `favicon.svg` de 130 KB trazado de un raster)
- Historia de usuario: HU-EXP-004 (CA-06)
- RF/RNF: `RNF-PERF-001`, `RNF-A11Y-005`

**Origen (2026-10-14):** el usuario intentará conseguir el monograma «RR» en
vector; mientras tanto el loader usa «ROYCE» (`BR-054`).

> **Alcance ajustado (2026-10-14, decisión del usuario):** el loader de `BR-054`
> se inspira en el letrero de neón real («Barber Royce» manuscrito, tijera y
> marco) con un asset provisorio. Este ticket pasa a ser **el letrero real en
> vector**: el usuario lo calca a mano (trazos de una sola línea, como los
> tubos) y lo entrega; el «RR» queda como alternativa si lo consigue. Sigue
> bloqueado hasta tener el vector.

Alcance:
1. Reemplazar o acompañar a «ROYCE» por el «RR» en el loader, con el mismo flujo
   de SVG y la misma secuencia de neón.

Criterios de aceptación:
1. El loader muestra el «RR» como tubo de neón con los criterios de `BR-054`,
   sin cambiar su duración ni sus protecciones.


#### BR-058 — CTA1: barras de luz hexagonales, foto enmarcada y botón de reserva

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-054, BR-056
- Estado: Hecho (2026-10-15, rama `feat/br-058-cta1` → master, PR #29; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-10)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-A11Y-005`, `RNF-DATOS-001`

**Origen (2026-10-14):** auditoría de CTA1 con la skill `diseno-visual`.
Diagnóstico: la foto se sale de la figura blanca; lo «rosado» detrás de la foto
es el rojo de marca al 30 % sobre blanco; el botón de reservar es un botón
blanco estándar que no destaca; en móvil la foto tapa el título y el fondo
queda plano (las formas se ocultan). Deuda: `will-change: transform` fijo en 7
capas (`CTA1.module.css:141` y siguientes), colores escritos a mano (el fondo
es `#332a2b` y el token del charcoal es `#332b2b`), CSS muerto
(`.content::before`, `.imageWrapper`, `background-*` en `.ctaImage`) y el
nombre de la marca literal en el `alt` (`CTA1.tsx:96`).

Decisiones del usuario (2026-10-14): **se conservan las formas hexagonales y la
superposición de capas** (los hexágonos vienen de las barras de luz
hexagonales del techo de la barbería). Se descartó cambiarlas por diagonales.

Alcance:
1. La foto, contenida dentro de la figura blanca (mismo polígono).
2. La pieza rosada pasa a rojo de marca sólido y a forma hexagonal.
3. Gesto memorable: un par de hexágonos como **tubo de luz** (contorno con
   resplandor blanco cálido, como las barras del techo) que se encienden una
   vez cuando la sección entra en pantalla, con un parpadeo corto.
4. Botón de reservar con chaflán (como las tarjetas de `BR-056`) y leve
   seguimiento del cursor (`MotionValue`, solo con ratón); el secundario, en
   contorno con el mismo corte.
5. Móvil: la foto no tapa el título y queda una forma en vez de un fondo plano.
6. Deuda: `will-change` solo durante el scroll (patrón `isAnimating` del hero);
   colores y valores a tokens; borrar el CSS muerto; el `alt` con `SITE.name`.

Criterios de aceptación:
1. La foto no se sale de la figura blanca en escritorio (HU-EXP-004 CA-10).
2. Las barras de luz se encienden una vez al entrar la sección, con ≤ 3
   destellos por segundo (CP-A11Y-005); con reducir movimiento aparecen
   encendidas y quietas (CP-A11Y-003).
3. El texto y los botones cumplen contraste ≥ 4,5:1 (CP-A11Y-004) en
   escritorio y móvil; en móvil la foto no se superpone al título.
4. Ningún color escrito a mano en `CTA1.module.css` ni la marca literal en
   `CTA1.tsx` (tests; `RNF-DATOS-001`).
5. TBT y CLS móviles no empeoran frente a la línea base (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-058).


#### BR-059 — Navbar: resplandor de neón blanco al pasar el cursor

- Prioridad: P3 · Esfuerzo: XS · Depende de: BR-058
- Estado: Hecho (2026-10-15, rama `feat/br-059-navbar-neon` → master, PR #29; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-11)
- RF/RNF: `RNF-A11Y-003`, `RNF-A11Y-004`

**Origen (2026-10-14):** al ver las barras de luz hexagonales de CTA1 (`BR-058`),
el usuario pidió que los enlaces de la navbar tengan ese mismo resplandor de
neón blanco al pasar el cursor. Hoy el hover solo cambia el rojo por un rojo más
brillante (`Navbar.module.css:99`).

Alcance:
1. Hover y foco de teclado en los enlaces de escritorio: el texto pasa a blanco
   con un resplandor de neón (núcleo blanco y halo rojo), con transición corta.
2. El mismo resplandor con foco de teclado en el menú móvil.
3. Con `prefers-reduced-motion`, sin transición. Colores en tokens.

Criterios de aceptación:
1. Al pasar el cursor o enfocar con teclado un enlace, se ve el resplandor
   blanco (HU-EXP-004 CA-11).
2. El texto en hover y foco cumple contraste ≥ 4,5:1 sobre la navbar
   (CP-A11Y-004).
3. Con reducir movimiento no hay transición (CP-A11Y-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-059).


#### BR-062 — SocialProof1: corte láser cinematográfico y disparos por pistas

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-058
- Estado: Hecho (2026-10-15, rama `feat/br-062-social-proof-laser` → master, PR #29; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-14)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-A11Y-005`, `RNF-DATOS-001`

**Origen (2026-10-14):** el usuario siente que al efecto láser de SocialProof1
«le falta». Diagnóstico con `diseno-visual`: los 5 rayos se diseñaron como
diagonales cruzadas (`rotate(-45deg)`, `SocialProof1.module.css:247`), pero
`style={{ x, y }}` de framer-motion escribe su propio `transform` y pisa la
rotación, así que se ven horizontales y su desplazamiento casi no se percibe.
Deuda: 52 colores escritos a mano, 5 `will-change` fijos, la marca literal en
la cita y en el `alt`, y `#999999` sobre blanco (2,8:1, bajo el mínimo).

Decisiones del usuario (2026-10-14): dirección **B** (disparos por pistas) más un
**revelado cinematográfico con scrub** (avanza y retrocede con el scroll).

Alcance:
1. Corte de la foto: un panel del color del fondo la cubre y se retira en
   diagonal con un láser en su borde, ligado al scroll; después, el corte
   cruzado de la tarjeta desde el lado contrario (juntos dibujan una X).
2. Al terminar el corte de la foto, su marco rojo se enciende una vez.
3. Ambiente: haces cortos viajan por pistas diagonales tenues con el scroll
   (la pista rota por CSS y el haz se mueve en su eje: sin pisar la rotación).
4. Subrayado láser del título que se dibuja al entrar.
5. Solo `transform` y `opacity` (nada de `clip-path` animado). En móvil, el
   corte ocurre una vez al entrar en pantalla. Con reducir movimiento, todo
   revelado y quieto.
6. Deuda: colores a tokens, sin `will-change` fijo, sin la marca literal, el
   gris del distintivo con contraste suficiente.

Criterios de aceptación:
1. Con el scroll, la foto y la tarjeta se revelan con el corte láser y se
   vuelven a tapar al subir; a mitad de la sección ya están reveladas
   (HU-EXP-004 CA-14).
2. Los rayos se ven diagonales y sus haces viajan por las pistas.
3. Con reducir movimiento todo aparece revelado, sin haces ni destellos
   (CP-A11Y-003); el encendido del marco no pasa de 3 destellos por segundo
   (CP-A11Y-005).
4. Sin colores escritos a mano ni marca literal (tests; `RNF-DATOS-001`); el
   texto de la tarjeta cumple 4,5:1 (CP-A11Y-004).
5. TBT y CLS móviles no empeoran frente a `master` con el mismo `.env`,
   midiendo alternado (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-062).


#### BR-064 — Benefits: fiel al Figma («Beneficios v2») con íconos que se dibujan

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-062
- Estado: Hecho (2026-10-15, rama `feat/br-064-benefits-figma` → master, PR #29; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-16)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-DATOS-001`

**Origen (2026-10-14):** el usuario encuentra la sección «un poco charra» y
compartió el Figma «Beneficios v2». La implementación se alejó del diseño: la
foto queda tapada por un rojo al 85 % (en Figma el rojo es una franja diagonal
y la foto se ve clara, con la chaqueta «BARBER RR ROYCE»), el fondo es un gris
fuera de la paleta (`#3a3a3a`), los textos de las tarjetas están mal copiados
y sin las negritas del diseño, los íconos no son los del diseño (silla de
barbero, persona con estrella), en móvil no hay foto, el subtítulo trae la marca
literal y las tarjetas usan `Card` de shadcn (`BR-023`).

Decisiones del usuario (2026-10-14): seguir el Figma y sumar un solo gesto: los
íconos se dibujan solos con un trazo al entrar la tarjeta. Por defecto (no se
eligió): los textos quedan en el código, no en la hoja; la silla y la persona
con estrella se dibujan como íconos propios de trazo.

Alcance:
1. Fondo charcoal de la marca; franja roja diagonal entre el contenido y la
   foto; la foto sin velo rojo.
2. Tarjetas blancas como en Figma, sin shadcn, con los textos del diseño y sus
   negritas; íconos: tijera, silla de barbero y persona con estrella.
3. Entrada escalonada de las tarjetas y trazo de los íconos (`pathLength`); con
   reducir movimiento, todo visible y dibujado.
4. «ofreciendo:» con dos puntos (continúa en las tarjetas); la marca desde
   `SITE.name`; colores a tokens.
5. Móvil: la foto con la franja también se ve.

> **Alcance ajustado (2026-10-14, decisión del usuario):** más deleite con el
> scroll. (1) La franja roja entra deslizándose en diagonal desde abajo y se
> asienta cuando la sección queda centrada; (2) la foto parte un poco ampliada y
> se asienta a su tamaño (Ken Burns ligado al scroll); (3) al pasar el ratón por
> una tarjeta, su ícono se vuelve a dibujar. Scrub (avanza y retrocede), solo
> `transform`; con reducir movimiento todo queda quieto en su posición final.
> Se descartó la inclinación 3D de las tarjetas para no recargar.

Criterios de aceptación:
1. La foto se ve clara, con la franja roja diagonal, en escritorio y en móvil
   (HU-EXP-004 CA-16).
2. Las tarjetas muestran los textos del Figma con sus negritas, y sus íconos
   se dibujan al entrar; con reducir movimiento aparecen dibujados
   (CP-A11Y-003).
3. El texto de las tarjetas cumple 4,5:1 (CP-A11Y-004); sin colores escritos a
   mano, sin la marca literal y sin `@/components/ui/card` (tests).
4. TBT y CLS móviles no empeoran frente a `master` con el mismo `.env`,
   midiendo alternado (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-064).


#### BR-065 — SocialProof2: parrilla bento con las proporciones del Figma

- Prioridad: P3 · Esfuerzo: S · Depende de: BR-064
- Estado: Hecho (2026-10-15, rama `feat/br-065-bento-instagram` → master, PR #29; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-17)
- RF/RNF: `RNF-PERF-002`, `RNF-A11Y-003`

**Origen (2026-10-14):** el usuario siente rara la parrilla «Clientes felices,
estilos impecables» en escritorio y compartió el Figma «Prueba social 2». Le
gustan el fondo y las figuras; el problema son las dimensiones de los
recuadros. Hoy son cinco recuadros verticales y angostos (`grid-template-columns:
repeat(3, 1fr)` con filas de 13rem, `SocialProof2.module.css:230`) en una
columna estrecha y centrada. En Figma son recuadros apaisados en tres columnas de
distinto ancho; cada una de las dos primeras parte sus fotos a distinta altura
(grande arriba y chica abajo, y al revés) y la tercera es una foto alta; el
bloque de texto es más ancho y alineado a la izquierda; las esquinas son rectas.
El zoom del hover usa `transform` y la entrada de framer lo pisa.

Alcance:
1. Bento con las proporciones del Figma en escritorio y tablet, y una versión
   de dos columnas en móvil.
2. Texto más ancho, alineado a la izquierda, como en Figma.
3. Cada recuadro recorta su contenido con `object-fit: cover`: cuando
   `BR-051` traiga las fotos de Instagram, cualquier proporción calza.
4. Hover con la propiedad `scale` (no `transform`); colores a tokens.
5. No se tocan el fondo ni las figuras.

Criterios de aceptación:
1. En escritorio la parrilla reproduce las proporciones del Figma; en móvil
   queda en dos columnas sin recuadros angostos (HU-EXP-004 CA-17).
2. Sin saltos de contenido (CP-PERF-002); con reducir movimiento, sin zoom.
3. Sin colores escritos a mano en el bento (test).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-065).

Los tickets `BR-060` y `BR-063` salen del pedido del usuario del 2026-10-14:
rediseñar `/equipo` según su diseño en Figma (dos capturas: el panal y el modal
abierto). La dirección visual ya viene dada por ese diseño, así que no se
proponen tres direcciones; la skill `diseno-visual` se usa para el diagnóstico
y la verificación. Se parte en dos porque junto sería de esfuerzo L.

#### BR-060 — Equipo: panal de hexágonos con el líder destacado

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-058
- Estado: Hecho (2026-10-15, rama `feat/br-060-equipo-panal` → master, PR #29; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-12)
- RF/RNF: `RF-INFO-004`, `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-004`

**Origen (2026-10-14):** hoy `/equipo` (`TeamPage.tsx`) muestra los hexágonos en
una grilla de dos filas alineadas a la izquierda, con mucho espacio vacío a la
derecha, sobre un fondo casi plano; el líder es un poco más grande, con un
borde rojo apenas visible, y el resto de los marcos son grises. El diseño en
Figma del usuario es un **panal**: dos filas de hexágonos de puntas arriba, la
segunda desplazada medio hexágono y encajada en la primera, sobre las
diagonales roja y charcoal del hero; cada hexágono con un marco grueso, el del
líder rojo y más grande, los demás blancos. Los hexágonos vienen de las barras
de luz del techo de la barbería (`BR-058`).

> **Alcance ajustado (2026-10-14, decisión del usuario):** la banda «Nuestro
> equipo» de `PageHero` se reemplaza por un título compacto en Anton sobre el
> mismo fondo del panal; sigue siendo el `<h1>`. Además, el líder aparece sin
> animación de entrada, porque su foto es el LCP de la página y la entrada lo
> retrasaba (ver el registro).
>
> **Regresión aceptada por escrito (2026-10-14, decisión del usuario):** el CLS
> móvil de `/equipo` pasa de 0 a 0,0006 porque el texto centrado del título se
> corre al llegar Anton. Está muy por debajo del umbral de 0,1; el criterio 5
> se da por cumplido con esa salvedad.
>
> **Alcance ajustado (2026-10-14, pedido del usuario):** el panal se agranda en
> escritorio (hexágonos de hasta 17,5 rem, antes 12,5) y **todos los hexágonos
> vecinos quedan a la misma distancia**: el líder se veía más lejos de la fila
> de abajo (35,8 px) que los demás entre sí (10,8–12 px). Criterio nuevo: la
> separación entre cualquier par de vecinos es la misma en todos los anchos
> (12 px en escritorio, 8 px en móvil), y un test geométrico lo exige para
> equipos de 1 a 10 barberos.

Alcance:
1. Panal de hexágonos de puntas arriba (`clip-path`), segunda fila desplazada
   medio hexágono, centrado en la página y armado para cualquier cantidad de
   barberos (5 hoy). En móvil, un panal más angosto (2 por fila) sin
   desbordar.
2. Marco grueso en cada hexágono (capa del mismo polígono detrás de la foto):
   blanco para el equipo, rojo de marca y de mayor tamaño para el líder
   (`isLead`, columna `lider` que ya existe).
3. Fondo de diagonales roja y charcoal como el del hero, en el módulo de la
   página (sin tocar los archivos del hero).
4. Al pasar el cursor o enfocar con teclado, se ve el nombre (como hoy) y el
   marco se enciende con el resplandor de neón blanco de `BR-059`. Cada
   hexágono es un `<button>` con nombre accesible, listo para abrir el modal de
   `BR-063`.
5. Entrada escalonada al entrar en pantalla; con `prefers-reduced-motion`,
   estática y sin transición. Colores y medidas en tokens, sin hex.

Criterios de aceptación:
1. En escritorio, `/equipo` muestra el panal centrado, con la segunda fila
   encajada medio hexágono, el líder más grande con marco rojo y el resto con
   marco blanco (HU-EXP-004 CA-12).
2. Al pasar el cursor o enfocar con teclado un hexágono, se lee el nombre
   del barbero con contraste ≥ 4,5:1 (CP-A11Y-004, `contrast.e2e.test.ts`).
3. En 360, 768 y 1440 px el panal no desborda ni produce scroll horizontal.
4. Con reducir movimiento no hay animación de entrada ni transición
   (CP-A11Y-003).
5. CLS y TBT móviles no empeoran frente a la línea base de `master`
   (CP-PERF-003).
6. Ningún color escrito a mano en el módulo de la página (ADR-002).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-060).

#### BR-063 — Equipo: ficha de cada barbero en un modal

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-060
- Estado: Hecho (2026-10-15, rama `feat/br-063-ficha-barbero` → master, PR #29; verificado por el usuario en producción)
- Historia de usuario: HU-INFO-003 (CA-07), HU-EXP-004 (CA-15)
- RF/RNF: `RF-INFO-010`, `RF-CNT-002`, `RNF-A11Y-002`, `RNF-A11Y-003`, `RNF-A11Y-004`

**Origen (2026-10-14):** el usuario quiere que, al hacer clic en un hexágono, se
abra la ficha del barbero, según su diseño en Figma: la foto a la izquierda
ocupando un tercio, un degradado de la foto hacia el negro y, en la zona
oscura, el nombre en grande, chips con las especialidades y una descripción.
Hoy la pestaña `equipo` no tiene especialidades ni descripción
(`docs/contenido/equipo.csv`); el usuario está de acuerdo en agregar esas
columnas a la plantilla y a la hoja.

> **Alcance ajustado (2026-10-14, decisión del usuario):** la ficha se
> enriquece con contenido. (1) Textos de **ejemplo** para los cinco barberos
> en el respaldo (especialidades, descripción, frase y trabajos), que el dueño
> reemplaza en la hoja. (2) Contenido nuevo, cada uno con una columna
> opcional en `equipo`: botón **«Reservar con…»** (`reserva`, enlace propio
> del barbero; vacío = el enlace general de AgendaPro; se rastrea como
> `reserve_click` con sección `equipo`), **Instagram** del barbero
> (`instagram`), **fotos de sus trabajos** (`trabajos`, hasta 3) y una
> **frase** (`frase`, hasta 120 caracteres); además, la experiencia como un
> dato grande cuando empieza con un número. Sin Instagram de ejemplo (un
> usuario inventado podría ser la cuenta real de otra persona). Las fotos de
> ejemplo de trabajos reutilizan las de Unsplash del sitio: la CSP solo
> admite imágenes propias o de Unsplash.
>
> **Alcance ajustado (2026-10-14, decisión del usuario):** la ficha muestra
> también los **días de atención** (columna `dias`: días sueltos, nombres
> completos o rangos como `Lun a Vie`; se ven como una semana con esos días
> encendidos) y la **sucursal** (columna `sucursal`, con el `id` de la pestaña
> `sucursales`; una o varias). Un `id` que no existe rechaza la pestaña
> `equipo`. Para eso las sucursales pasan a tener `id` en el contenido
> (`Location.id`), y `resolveContent` lee `sucursales` antes que `equipo`. El
> usuario descartó, por ahora, el horario por día.

Alcance:
1. Columnas nuevas y **opcionales** en la pestaña `equipo`: `especialidades`
   (lista separada por comas, con un máximo de chips y de largo por chip) y
   `descripcion` (texto con largo máximo). Se actualizan el esquema
   (`src/content/schemas.ts`), el tipo `TeamMember`, la plantilla CSV,
   `docs/contenido-hoja.md` y el respaldo (`src/content/snapshot/`, lo hace el
   desarrollador). Una hoja sin esas columnas sigue siendo válida.
2. Modal de la ficha: foto al 33 % con degradado hacia el contenido, nombre en
   grande (`--font-family-display`), cargo y experiencia, chips de
   especialidades y descripción. Si faltan especialidades o descripción, esa
   parte no se muestra. Chaflán con `clip-path` como el resto del sitio.
   En móvil, la foto pasa arriba como franja y el texto debajo.
3. Accesibilidad: `role="dialog"`, `aria-modal`, `aria-labelledby` con el
   nombre, foco atrapado, Escape y un botón de cerrar lo cierran, y el foco
   vuelve al hexágono que lo abrió. El fondo no se desplaza mientras está
   abierto (Lenis se detiene y se reanuda).
4. Entrada y salida del modal con framer-motion; con `prefers-reduced-motion`,
   sin animación.

Criterios de aceptación:
1. Al hacer clic en un hexágono (o Enter/Espacio con el foco en él), se abre la
   ficha de ese barbero con foto, nombre, especialidades y descripción
   (HU-INFO-003 CA-07, CP-INFO-010).
2. Con el modal abierto, Tab no sale del modal; Escape lo cierra y el foco
   vuelve al hexágono; el fondo no se desplaza (HU-EXP-004 CA-15,
   CP-A11Y-002).
3. Una fila de `equipo` sin especialidades ni descripción se valida y su
   ficha se ve sin huecos; un chip o una descripción más largos que el
   máximo rechazan la pestaña con aviso de fila y campo (CP-CNT-002).
4. El texto del modal cumple contraste ≥ 4,5:1 sobre el degradado y el negro
   (CP-A11Y-004).
5. Con reducir movimiento, el modal aparece y se cierra sin animación
   (CP-A11Y-003).
6. El test de la guía de la hoja nombra los campos nuevos (`BR-043`).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-063).

El usuario pidió (2026-10-15) rehacer el catálogo de `/productos` trasladando el
panal y las tarjetas del equipo, con scroll infinito. Se parte en dos para poder
ver y aprobar el panal antes de sumar la carga progresiva (el esfuerzo junto
sería L). El botón «Comprar» salió aparte, en `BR-009`.

#### BR-067 — Productos: catálogo en panal con hover y ficha

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-060, BR-063, BR-009
- Estado: Hecho (2026-10-17, rama `feat/br-067-productos-panal` → master, PR #31; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-18), HU-INFO-004 (CA-01, CA-02)
- RF/RNF: `RF-INFO-011`, `RF-INFO-002`, `RNF-PERF-003`, `RNF-A11Y-002`, `RNF-A11Y-003`, `RNF-A11Y-004`

**Origen (2026-10-15):** el usuario compartió el Figma de «Productos»: un panal de
hexágonos con marco blanco sobre las diagonales roja y charcoal del hero, y
hexágonos grises debajo (lo que falta por cargar). Hoy el catálogo es una
grilla de tarjetas rectangulares con buscador y filtros (`ProductsPage.tsx`),
6 productos y fotos de 400 × 300.

Decisiones del usuario (2026-10-15):
1. El marco rojo del Figma es **el estado del cursor o del foco**: todos los
   hexágonos tienen marco blanco y no hay producto destacado (sin columna nueva
   en la hoja).
2. **Se mantienen el buscador y los filtros de categoría**: al filtrar, el
   panal se reacomoda.
3. Se trasladan también las «tarjetas» del equipo: nombre y precio al pasar el
   cursor y una **ficha de producto** al hacer clic.

Alcance:
1. Panal **sin líder**: todos los hexágonos del mismo tamaño, en filas fijas
   (3 en escritorio y 2 en móvil) a ras unos de otros y con la misma distancia,
   como el del equipo (`BR-060`). Se generaliza la geometría de `honeycomb.ts`
   con una función de filas fijas: fijas, para que sumar productos
   (`BR-068`) no reacomode los que ya están.
2. Fondo con las diagonales del equipo y el título compacto; los filtros quedan
   arriba del panal.
3. Marco blanco; con cursor o foco de teclado, marco rojo con el resplandor de
   neón de la navbar. Se ven el nombre y el precio sobre la foto.
4. **Ficha del producto** en un diálogo accesible: foto grande, categoría en
   un chip, nombre en Anton, descripción y precio, **sin botón de compra**
   (`BR-009`). El comportamiento (foco atrapado, Escape, foco de vuelta, Lenis
   detenido) se extrae de `BarberProfileDialog` a una pieza compartida, en vez
   de copiarlo.
5. Buscar o filtrar reacomoda el panal con una transición corta; sin
   resultados, el estado vacío con acción para limpiar (CP-INFO-002).
6. Con `prefers-reduced-motion`, sin transiciones. Colores y medidas en
   tokens.

Criterios de aceptación:
1. `/productos` muestra todos los productos en panal, a ras y con la misma
   distancia en 360, 768 y 1440 px; un test geométrico lo exige para catálogos
   de 1 a 30 productos (HU-EXP-004 CA-18).
2. Al pasar el cursor o enfocar con teclado un hexágono se ven el nombre y el
   precio con contraste ≥ 4,5:1 (CP-A11Y-004).
3. Clic, Enter o Espacio abre la ficha con foto, categoría, nombre, descripción
   y precio; Escape la cierra, el foco vuelve al hexágono y el fondo no se
   desplaza; no hay botón de compra (CP-INFO-011, CP-A11Y-002).
4. Buscar por texto y filtrar por categoría siguen funcionando y el panal
   queda sin huecos (HU-INFO-004 CA-02).
5. Sin scroll horizontal; con reducir movimiento, sin animación
   (CP-A11Y-003).
6. TBT y CLS móviles no empeoran frente a `master` y la primera foto visible no
   retrasa el LCP (CP-PERF-003).
7. Ningún color escrito a mano en los módulos nuevos (ADR-002).

> **Alcance ajustado (2026-10-15):** al construirlo salieron cuatro cosas que
> el alcance no decía. (1) El panal, el diálogo y la página del equipo pasan a
> **componentes compartidos** (`Honeycomb`, `ModalDialog`, `HoneycombPage` en
> `components/common/`): el repo no permite importar el CSS de otro componente,
> y copiarlos eran ~300 líneas. (2) La hoja trae productos con **el mismo
> nombre** (34 copias de «Kit Completo» con ids distintos), así que el producto
> pasa a llevar su **`id`** (`Product.id`, de la columna `id` que ya existía) y
> es la clave. (3) Las diagonales van en una **banda de una pantalla** y debajo
> el fondo es liso, como en el Figma; con el alto en porcentaje de la página, el
> triángulo rojo se movía al cambiar de fuente y daba CLS 0,08. (4) Si la foto
> falta o la dirección falla (4 de las 6 de Unsplash dan 404, `BR-008`), el
> hexágono muestra su nombre y precio siempre, en vez de quedar vacío.
>
> **Regresión aceptada por escrito (2026-10-15, decisión del usuario):** el LCP
> móvil de `/productos` pasa de ~3,9 s (un párrafo de texto) a ~5,0 s (una foto
> del panal), y por arrastre el TBT mediana sube de 78 a 150 ms porque el TTI
> llega más tarde. Es estructural: la foto grande que pide el diseño se
> descubre recién cuando el JavaScript pinta la página. Se descartó que sea la
> decodificación de la foto o la sombra de cada hexágono. El criterio 6 se da por
> cumplido con esa salvedad, como la de `BR-054`.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-067).

#### BR-068 — Productos: carga progresiva (scroll infinito)

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-067
- Estado: Hecho (2026-10-17, rama `feat/br-068-productos-scroll-infinito` → master, PR #31; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-19)
- RF/RNF: `RF-INFO-011`, `RNF-PERF-003`, `RNF-A11Y-002`, `RNF-A11Y-003`

**Origen (2026-10-15):** el usuario pidió «scroll infinito» para el catálogo. En
el Figma, debajo del panal hay hexágonos grises: lo que falta por cargar. El
usuario eligió la **carga progresiva** (y no un bucle sin fin). Hoy hay 6
productos, así que no cargará nada más hasta que el catálogo crezca.

Alcance:
1. Se muestra un primer lote de 12 productos (múltiplo de 3 y de 2, para que
   las filas queden completas en escritorio y en móvil). Al acercarse al final
   se suma el siguiente lote: un `IntersectionObserver` sobre un centinela
   cambia el estado solo cuando lo cruza; nunca un `setState` por scroll.
2. Mientras queden productos por mostrar, la fila siguiente aparece como
   **hexágonos grises de relleno** (decorativos, `aria-hidden`) que reservan su
   lugar; al cargar se reemplazan con una entrada escalonada.
3. Buscar o filtrar reinicia el conteo a un lote. Si todo cabe en un lote, no
   hay centinela ni relleno.
4. Accesibilidad: una región `aria-live="polite"` anuncia «Se cargaron N
   productos más», y un botón «Ver más productos» queda disponible para quien
   no puede llegar al final con el desplazamiento (teclado y lectores de
   pantalla).
5. Con `prefers-reduced-motion`, sin animación en la carga.

Criterios de aceptación:
1. Con más de 12 productos, se ven 12 y, al llegar al final, aparecen los
   siguientes sin saltos de la página (HU-EXP-004 CA-19).
2. Con 12 o menos no hay centinela, relleno ni botón.
3. Cambiar de filtro o buscar vuelve a un lote.
4. «Ver más productos» carga el siguiente lote con el teclado y la región
   anuncia cuántos llegaron (CP-A11Y-002).
5. Los hexágonos de relleno reservan su espacio: CLS 0 al cargar un lote
   (CP-PERF-003).
6. El scroll no provoca re-renders: el estado cambia solo al cruzar el
   centinela (test).

> **Decisión de construcción (2026-10-15):** el lote se pide cuando el final
> del relleno entra en pantalla (margen 0), no antes. Con un margen de 400 px
> el lote llegaba antes de que el relleno asomara y los hexágonos grises, que
> el Figma sí muestra, nunca se veían. El relleno son 6 hexágonos (dos filas de
> escritorio, tres de móvil) y el escalonado de la entrada se reinicia cada 6,
> para que un lote nuevo no espere a los anteriores. Con los 40 productos de
> la hoja actual, el catálogo carga 12, 24, 36 y 40.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-068).


#### BR-061 — Hero y CTA1 en móvil: fieles al Figma

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-056, BR-058, BR-059
- Estado: Hecho (2026-10-18, rama `feat/br-061-hero-cta1-mobile` → master, PR #33; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-13)
- RF/RNF: `RNF-PERF-002`, `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-DATOS-001`

**Origen (2026-10-17):** el usuario compartió los Figma «Resumen Mobile» y
«CTA 1 Mobile» (390 px). La vista móvil actual se aleja de ambos:
- Navbar: el logo es la imagen `royce-barber-logo` y la hamburguesa queda a
  la derecha; el botón «Agendar Sesión» se oculta en móvil
  (`Navbar.module.css:239`). En el Figma, la hamburguesa es roja y va a la
  izquierda, luego «ROYCE» en blanco sobre «BARBERÍA» en rojo, y a la derecha
  un botón chico blanco con texto rojo.
- Hero: el fondo es un triángulo a todo el ancho y la foto queda en el flujo
  (`Hero.module.css:490`). En el Figma, la foto ocupa toda la pantalla con un
  velo oscuro, el texto va alineado a la izquierda, bajo el título hay una
  línea blanca gruesa y, debajo, un párrafo.
- CTA1: el texto va centrado sobre un hexágono rojo, la foto en una figura
  bajo el texto y los botones a todo el ancho (`CTA1.module.css:266`). En el
  Figma, el fondo es charcoal, la foto de perfil queda a la derecha y recortada
  detrás del texto, el texto se alinea a la izquierda, lleva la misma línea
  blanca, el párrafo abre con su primera frase en negrita y hay un botón blanco
  «Agendar Ahora» con ícono rojo.

Decisiones del usuario (2026-10-17):
- Hero: se mantiene el «ROYCE» gigante (prefijo, marca y lema, `BR-050`), en
  vez del título en Montserrat del Figma.
- Hero: no se agrega el botón «Agendar Ahora» del Figma, porque reservar ya
  queda a mano con «Agendar Sesión» en la navbar móvil. En su lugar van las
  tres tarjetas de beneficios (`BR-056`), en un formato compacto que ocupe ese
  espacio.
- CTA1: fiel al Figma, pero se mantiene «Conocer Servicios» como segundo
  botón.
- Hero: más aire entre el título, la línea, el párrafo y las tarjetas, como se
  ve en el Figma (el usuario, 2026-10-17).

> **Alcance ajustado (2026-10-17, decisión del usuario con el Figma):** en
> móvil, el fondo del Hero pasa a ser la foto a pantalla completa y **reemplaza
> al triángulo** que fijó `BR-055` (HU-EXP-004 CA-08, parte móvil). El fondo
> sigue sin ser un color plano. En escritorio CA-08 no cambia.
>
> **Foto del Hero móvil:** `src/assets/hero_mobile.png` (2439 × 2556 px, sin
> velo, exportada del Figma por el usuario el 2026-10-17). Se ve algo suave a
> pantalla completa porque el original del Figma ya era chico; cuando haya una
> original en mayor resolución, solo se cambia el archivo. El velo negro al
> 60 % del Figma va por CSS con un token. El mismo `<picture>` del Hero elige la
> foto móvil (`<source media>`) y `index.html` precarga solo una de las dos con
> `media` excluyentes (`lcpPreload.test.ts`). La primera exportación (271 px,
> con el velo incorporado) se descartó.
>
> **CTA1 móvil (2026-10-17, el usuario):** usa la foto del Hero de escritorio
> (`hero_model_left_profile`, los mismos archivos que el Hero) para que el
> modelo se vea bien, en vez de `cta1_model`. Es un `<source media>` en el
> mismo `<picture>`; la foto carga solo en móvil y de forma diferida.

Alcance (solo `max-width: 768px`; el escritorio no cambia):
1. Navbar: hamburguesa roja a la izquierda; la marca en texto, en dos líneas
   («ROYCE» y «BARBERÍA», desde `SITE.brand`); botón «Agendar Sesión» chico,
   blanco con texto rojo, a la derecha.
2. Hero: la foto a pantalla completa con un velo oscuro; texto alineado a la
   izquierda; línea blanca gruesa bajo el título; el párrafo; las tarjetas
   compactas debajo. Sin el triángulo móvil de `BR-055`.
3. CTA1: fondo charcoal sin hexágonos; la foto a la derecha, recortada, detrás
   del texto; línea blanca bajo el título; la primera frase del subtítulo en
   negrita (el texto sigue en la hoja); «Agendar Ahora» blanco con ícono rojo
   y, debajo, «Conocer Servicios».
4. Colores con tokens; la marca desde `SITE.brand`, nunca literal.

Criterios de aceptación:
1. A 390 px, la navbar, el Hero y CTA1 reproducen los Figma con las
   decisiones de arriba (HU-EXP-004 CA-13).
2. A 1440 px nada cambia frente a `master` (capturas).
3. El texto sobre la foto cumple 4,5:1 (CP-A11Y-004); con reducir movimiento
   no hay animación de entrada (CP-A11Y-003).
4. Sin colores escritos a mano ni marca literal (tests; `RNF-DATOS-001`); los
   tests existentes del Hero, CTA1 y la Navbar siguen en verde.
5. CLS y TBT móviles no empeoran frente a `master` con el mismo `.env`,
   midiendo alternado (CP-PERF-002, CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-061).


#### BR-069 — Tarjetas unificadas con el vidrio del Hero: Beneficios y Reseñas

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-056, BR-064
- Estado: Hecho (2026-10-18, rama `feat/br-069-tarjetas-unificadas` → master, PR #33; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-20)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-DATOS-001`

**Origen (2026-10-17):** al recorrer la home en móvil (390 px), las tarjetas de
«Estilo que te acompaña» y de «Lo que dicen nuestros clientes» son blancas,
redondeadas y van apiladas de a una, y no se parecen a las tarjetas de vidrio
con esquinas cortadas del Hero (`BR-056`). El usuario pidió unificarlas para
que den más deleite y tengan juego con las tarjetas de arriba. Avanzamos por
pasos: primero Beneficios, luego Reseñas. «Innovación y calidad en cada
detalle» queda para un paso posterior. Los fondos y las franjas quedan fuera
por ahora (el usuario quiere ver primero algo distinto), y la foto entre
Beneficios y Reseñas se mantiene porque funciona como puente.

Decisiones del usuario (2026-10-17):
- Estilo: el vidrio oscuro con esquinas cortadas del Hero.
- Alcance: móvil y escritorio.
- Orden: Beneficios y después Reseñas.

> **Alcance ajustado (2026-10-17):** `BR-064` dejó las tarjetas de Beneficios
> blancas por fidelidad al Figma «Beneficios v2». Por decisión del usuario,
> pasan al vidrio del Hero. La franja roja, la foto y los íconos que se
> dibujan de `BR-064` no cambian.

Alcance:
1. Los valores de la tarjeta (vidrio, borde, tamaño del corte) se vuelven
   tokens compartidos en `src/styles/tokens/`, hoy viven solo en
   `Hero.module.css`. El Hero conserva su aspecto.
2. Beneficios: tarjetas de vidrio oscuro con dos esquinas cortadas y texto
   blanco; el ícono conserva su trazo.
3. Reseñas: las mismas tarjetas, con sus estrellas y su texto.
4. La entrada y el hover de cada sección se mantienen; con reducir movimiento
   no se agrega ninguna animación.

Criterios de aceptación:
1. En «Estilo que te acompaña» y en «Lo que dicen nuestros clientes» las
   tarjetas son de vidrio oscuro con esquinas cortadas, como las del Hero, en
   móvil y en escritorio (HU-EXP-004 CA-20).
2. El texto de las tarjetas cumple 4,5:1 sobre el fondo más claro posible
   (CP-A11Y-004).
3. Con reducir movimiento no hay animación nueva (CP-A11Y-003).
4. Los valores de la tarjeta salen de tokens compartidos y las tarjetas no
   traen colores escritos a mano (tests; ADR-002); el Hero se ve igual.
5. CLS y TBT móviles no empeoran frente a `master` con el mismo `.env`,
   midiendo alternado (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-069).


#### BR-070 — Beneficios y Reseñas en móvil: carrusel con snap

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-069
- Estado: Hecho (2026-10-18, rama `feat/br-070-carrusel-snap` → master, PR #33; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-21)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-002`, `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-DATOS-001`

**Origen (2026-10-17):** al recorrer la home en móvil (390 px), «Estilo que te
acompaña» y «Lo que dicen nuestros clientes» suman casi 1.900 px de tarjetas
apiladas de a una, el mismo patrón repetido tres veces con «Innovación y calidad».
Entre las direcciones que se propusieron, el usuario quería el carrusel
horizontal con snap (la dirección C) y lo pidió de nuevo después de unificar las
tarjetas (`BR-069`).

Decisiones del usuario (2026-10-17):
- Secciones: «Estilo que te acompaña» y «Lo que dicen nuestros clientes».
  «Innovación y calidad» queda fuera por ahora.
- Solo móvil: en escritorio las tarjetas siguen en grilla.

Alcance (solo `max-width: 768px`):
1. Las tarjetas van en una fila horizontal con `scroll-snap`, cada una al ~82 %
   del ancho para que asome la siguiente; sin barra de desplazamiento.
2. La tarjeta que se ve queda a tamaño completo y las demás un poco más chicas
   (propiedad `scale`: `opacity` la escribe framer en línea en las tarjetas de
   entrada y pisaría el CSS), sin `setState` por scroll: un
   `IntersectionObserver` cambia un atributo cuando otra tarjeta pasa a ser la
   visible, como el centinela de `BR-068`.
3. Puntos de posición debajo, que son botones: cambian de tarjeta sin gesto de
   arrastre (WCAG 2.5.1) y dicen cuál es la actual.
4. La fila es una región enfocable con nombre: con el teclado se recorre con las
   flechas.
5. Con reducir movimiento: el snap se mantiene (es funcional), pero sin
   desplazamiento suave ni atenuado animado.
6. Un solo componente compartido, para no repetir la lógica en las dos secciones.

Criterios de aceptación:
1. En móvil, ambas secciones muestran sus tarjetas en una fila que se desliza con
   snap, y la siguiente asoma (HU-EXP-004 CA-21).
2. En escritorio nada cambia: siguen en grilla (capturas a 1440 px).
3. Los puntos son botones con nombre y la fila se recorre con el teclado; axe sin
   violaciones graves (CP-A11Y-002).
4. Sin `setState` por scroll (test) y solo `transform`/`opacity` en lo animado.
5. Con reducir movimiento no hay desplazamiento suave ni atenuado animado
   (CP-A11Y-003).
6. Sin colores escritos a mano (tests; ADR-002).
7. CLS y TBT móviles no empeoran frente a `master` con el mismo `.env`,
   midiendo alternado (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-070).


#### BR-071 — Beneficios en móvil: foto puente con dos cuñas rojas

- Prioridad: P3 · Esfuerzo: XS · Depende de: BR-064
- Estado: Hecho (2026-10-18, rama `feat/br-071-foto-puente` → master, PR #33; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-22)
- RF/RNF: `RNF-PERF-003`, `RNF-DATOS-001`

**Origen (2026-10-17):** en móvil, la foto entre «Estilo que te acompaña» y «Lo
que dicen nuestros clientes» (la chaqueta «BARBER ROYCE») lleva una sola cuña
roja arriba, de 72 px (`Benefits.module.css`, `.imageBackground::before`). El
usuario decidió mantener la foto como puente entre las dos secciones y pidió que
tenga dos figuras: la cuña de arriba a la izquierda, más grande, y otra abajo a
la derecha, en espejo (dibujó la forma sobre una captura).

Decisión del usuario (2026-10-17): dos cuñas rojas en la foto puente; solo móvil,
que es donde existe esa foto.

> **Prueba (2026-10-17, a pedido del usuario):** tras dejar la foto como puente
> con las dos cuñas (commit `d7e20b3`), el usuario quiso verla **de fondo de la
> sección**, detrás del texto y las tarjetas, en vez de como puente. Se probó en
> un commit aparte, con un velo de charcoal al 72 % para que el texto se lea y
> las cuñas a la altura de la sección (24 % y 14 %). La sección pasa de ~1.100 px
> a ~640 px. Queda por decidir cuál de las dos versiones se queda; la otra se
> descarta con un `git revert` del commit de la prueba.

Alcance (solo `max-width: 768px`):
1. Cuña de arriba a la izquierda, más alta que la actual.
2. Cuña nueva abajo a la derecha, en espejo: borde diagonal que sube hacia la
   derecha.
3. El tamaño de cada cuña sale de una variable CSS al comienzo de la regla, para
   ajustarlo a ojo.
4. La foto, su recorte y el escritorio no cambian.

Criterios de aceptación:
1. La foto puente muestra las dos cuñas rojas, con la chaqueta «BARBER ROYCE»
   legible (HU-EXP-004 CA-22).
2. En escritorio nada cambia.
3. Sin colores escritos a mano (test; ADR-002).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-071).


#### BR-072 — Innovación y calidad: tarjetas de vidrio y carrusel en móvil

- Prioridad: P3 · Esfuerzo: S · Depende de: BR-069, BR-070
- Estado: Hecho (2026-10-18, rama `feat/br-072-innovacion-tarjetas` → master, PR #33; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-23)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-002`, `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-DATOS-001`

**Origen (2026-10-17):** «Innovación y calidad en cada detalle» (la sección
`Features`, las características del servicio) quedó fuera de `BR-069` y
`BR-070`, que cubrieron Beneficios y Reseñas. El usuario pidió ahora que reciba
lo mismo. Hoy sus tarjetas son blancas, usan el componente `Card`, miden 17,5 rem
de alto con mucho vacío adentro y van apiladas; su CSS trae colores escritos a
mano (`#1a1a1a`, `#d52323`, `rgba(...)`); y la última tarjeta se corta contra el
borde de la sección en móvil, porque el parallax de `AnimatedGridSection` baja el
contenedor hasta un 10 % y la sección tiene `overflow: hidden`.

Decisión del usuario (2026-10-17): lo mismo que a las otras dos secciones, tarjetas
de vidrio (móvil y escritorio, como `BR-069`) y carrusel con snap (solo móvil,
como `BR-070`). Por defecto (no se eligió): el ícono sigue el estilo de las
tarjetas del Hero, un cuadrado rojo con esquinas cortadas y el ícono blanco.

Alcance:
1. Tarjetas de vidrio con esquinas cortadas y los tokens compartidos; texto
   blanco; sin el componente `Card`.
2. Ícono en un cuadrado rojo con esquinas cortadas, como el del Hero.
3. En móvil, el carrusel con snap de `BR-070` (`carouselLabel` en
   `AnimatedGridSection`) y el contenedor a todo el ancho.
4. En móvil, sin el parallax del contenedor: arregla la tarjeta cortada.
5. Todos los colores de la sección a tokens.

Criterios de aceptación:
1. Las tarjetas son de vidrio oscuro con esquinas cortadas, en móvil y escritorio
   (HU-EXP-004 CA-23).
2. En móvil se deslizan con snap, asoma la siguiente y los puntos son botones con
   nombre; en escritorio siguen en grilla (CP-A11Y-002).
3. Ninguna tarjeta queda cortada por el borde de la sección en móvil.
4. El texto cumple 4,5:1 (CP-A11Y-004); con reducir movimiento no hay animación
   nueva (CP-A11Y-003).
5. Sin colores escritos a mano en `Features.module.css` (test; ADR-002).
6. CLS y TBT móviles no empeoran frente a `master` con el mismo `.env`,
   midiendo alternado (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-072).


#### BR-073 — Reseñas: carrusel también en escritorio, con 3 visibles y profundidad

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-070
- Estado: Hecho (2026-10-18, rama `feat/br-073-resenas-carrusel-escritorio` → master, PR #33; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-24)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-002`, `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-DATOS-001`

**Origen (2026-10-17):** `BR-070` dejó las reseñas como carrusel solo en móvil. El
usuario pidió que exista también en escritorio, porque con las reseñas de
Google (`BR-052`) van a ser hasta 5 (Places devuelve como máximo 5), y que muestre
3 a la vez, de forma elegante y con deleite ligado al scroll.

Decisiones del usuario (2026-10-17): snap con profundidad (no una sección fija
atrapando el scroll): avanza de a una tarjeta; la del centro va más grande y las
dos de los lados más chicas y atenuadas según su posición.

Por defecto (no se eligió): hoy `reviewsData` trae solo 3 reseñas de ejemplo y
**no se inventan 2 más** (serían reseñas falsas presentadas como reales). Con 3 o
menos, las tres caben a la vez: no hay nada que desplazar, así que no se muestran
flechas ni puntos. El comportamiento con 5 se prueba con datos de prueba y queda
listo para cuando `BR-052` entregue las reseñas reales.

> **Alcance ajustado (2026-10-17, decisión del usuario):** se agregan 2 reseñas
> más de ejemplo («Andrés V.» y «Felipe S.», como las otras tres) para ver el
> carrusel de escritorio con 5. Siguen siendo provisorias y falsas: `BR-052` las
> reemplaza por las de Google, y no se agrega `aggregateRating` con estos datos.
> Se anotó en `reviewsData.ts`. Antes de publicar, conviene que sean reemplazadas
> o retiradas: mostrar como reales opiniones inventadas puede incumplir las normas
> de publicidad y de protección al consumidor.

Alcance:
1. `CardCarousel` pasa a admitir un modo de escritorio (`desktopVisible`): fila
   con snap que muestra N tarjetas; el modo móvil de `BR-070` no cambia.
2. Flechas anterior y siguiente, puntos (uno por posición posible), teclado
   (flechas), rueda o trackpad horizontal, y arrastre con el ratón.
3. Profundidad en escritorio con una animación CSS ligada al scroll de la fila
   (`animation-timeline: view()`): sin JavaScript ni `setState` por scroll, solo
   `scale` y `opacity`. Donde el navegador no la soporta, las tarjetas se ven
   iguales entre sí.
4. Con reducir movimiento: sin la profundidad animada y sin desplazamiento suave.

Criterios de aceptación:
1. En escritorio, con más de 3 reseñas, se ven 3 a la vez, la del centro destacada,
   y se avanza de a una con snap (HU-EXP-004 CA-24).
2. Con 3 reseñas o menos no hay flechas ni puntos y las tres se ven.
3. Flechas, puntos y teclado cambian de tarjeta; las flechas se deshabilitan en
   los extremos; axe sin violaciones graves (CP-A11Y-002).
4. Sin `setState` por scroll (test) y solo `transform`/`opacity` animados.
5. Con reducir movimiento no hay profundidad animada ni desplazamiento suave
   (CP-A11Y-003).
6. En móvil nada cambia respecto de `BR-070`.
7. CLS y TBT no empeoran frente a `master` con el mismo `.env`, midiendo alternado
   (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-073).


#### BR-074 — Beneficios: revelado con el scroll (enfoque, giro de 360° y latido)

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-069
- Estado: Hecho (2026-10-18, rama `feat/br-074-beneficios-revelado` → master, PR #33 y `fix/br-074-tarjetas-estaticas-en-movil`, PR #34; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-25)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-A11Y-005`

**Origen (2026-10-17):** el usuario quiere más deleite visual con el scroll en
«Estilo que te acompaña»: que el título y el subtítulo aparezcan desenfocados y
se enfoquen al bajar; que el contenido de las tarjetas también; que cada tarjeta
dé un giro de 360° y muestre su contenido; y que el ícono dé un pequeño latido, de
acercarse y alejarse.

Decisiones del usuario (2026-10-17): el giro es sobre el eje vertical, como una
moneda.

> **Alcance ajustado (2026-10-17, decisión del usuario, tras ver la primera
> versión):**
> 1. **Todo va ligado al scroll** (avanza y retrocede), no como una animación que
>    corre una vez al entrar: la primera versión solo ataba al scroll el título y el
>    subtítulo.
> 2. **El desenfoque se ve de verdad:** antes era un resplandor leve. Ahora el texto
>    se ve solo borroso (radio 18 px el título, 10 px el subtítulo, 14 px las
>    tarjetas) durante la primera mitad y recién después se enfoca.
> 3. **Secuencia:** todo se ve borroso (los títulos y las tres tarjetas, a la vista);
>    se enfocan los títulos; la primera tarjeta gira, se revela y su ícono late
>    mientras las otras dos siguen borrosas; después la segunda; después la tercera.
>    Cada tarjeta tiene su propio tramo, sin superponerse.
> 4. **La sección queda fija** en pantalla mientras se revela (escritorio, sin reducir
>    movimiento): el scroll avanza la secuencia en vez de subir la sección y dejarla
>    cortada. En móvil no se fija. Al terminar, la página sigue.
> 4b. **Los títulos quedan fuera del desenfoque (2026-10-17, el usuario):** el `h2`
>    de la sección se ve siempre nítido; el desenfoque es del subtítulo, las
>    tarjetas y la foto.
> 5. **Regla para toda la landing:** el usuario quiere este mismo patrón (escena fija
>    y animaciones ligadas al scroll y a la pantalla) en las demás secciones. Se
>    trabaja sección por sección, cada una con su ticket; el primero es
>    «Respaldados por los mejores» (`SocialProof1`) y su corte láser.
> 6. **Las tarjetas no se revelan en móvil (2026-10-18, el usuario):** el giro, el
>    desenfoque, el trazo del ícono y el latido existen solo en escritorio, con la
>    sección fija. En móvil las tarjetas se ven siempre de frente, nítidas y quietas
>    (en el carrusel de `BR-070`). El subtítulo sí sigue enfocándose con el scroll.

Alcance:
1. Título y subtítulo: el enfoque va ligado al scroll (`useScroll`, scrub). El
   desenfoque no se anima por su radio (la skill `diseno-visual` lo desaconseja):
   hay una copia del texto ya desenfocada, oculta para lectores de pantalla, y
   lo que se anima es su `opacity`.
2. Tarjetas: al entrar, giran 360° sobre el eje vertical (con perspectiva) y, en
   el mismo giro, su contenido pasa de desenfocado a enfocado, con la misma
   técnica de la copia desenfocada.
3. Ícono: un latido (acercarse y alejarse, dos pulsos) cuando termina el giro. Una
   sola vez: nada que parpadee ni se repita (CP-A11Y-005).
4. La entrada escalonada y el trazo de los íconos de `BR-064` se mantienen.
5. Con reducir movimiento: todo aparece enfocado y quieto, sin giro ni latido.

Criterios de aceptación:
1. Al bajar a la sección, el título y el subtítulo pasan de desenfocados a
   enfocados con el scroll, y se ven nítidos al terminar (HU-EXP-004 CA-25).
2. Cada tarjeta gira 360° sobre el eje vertical y termina de frente con su
   contenido enfocado; su ícono da un latido una sola vez.
3. Los lectores de pantalla leen cada texto una sola vez (la copia desenfocada
   es `aria-hidden`) (CP-A11Y-002).
4. Con reducir movimiento no hay giro, latido ni desenfoque (CP-A11Y-003); ningún
   efecto pasa de 3 destellos por segundo (CP-A11Y-005).
5. Solo se anima `transform` y `opacity` (test); el texto cumple 4,5:1 una vez
   enfocado (CP-A11Y-004).
6. CLS y TBT móviles no empeoran frente a `master` con el mismo `.env`, midiendo
   alternado (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-074).


#### BR-075 — Respaldados por los mejores: escena fija, corte láser y revelado con el scroll

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-062, BR-074
- Estado: Hecho (2026-10-18, rama `feat/br-075-prueba-social-fija` → master, PR #33; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-26)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-002`, `RNF-A11Y-003`, `RNF-A11Y-005`

**Origen (2026-10-17):** el usuario quiere para toda la landing el patrón de
`BR-074` (sección fija en pantalla y animaciones ligadas al scroll), y pidió
empezar por «Respaldados por los mejores» (`SocialProof1`) y su show de láseres. Hoy
la sección sube con la página mientras el láser corta la foto y la tarjeta
(`BR-062`), y el corte se ve a medias y cortado por el borde de la pantalla. Además
pidió que, una vez concluido el láser, la imagen y el texto estén desenfocados y se
revelen con el scroll.

Decisiones del usuario (2026-10-17): sección fija mientras ocurre todo; después del
láser, la imagen y el texto se ven borrosos y se enfocan con el scroll. El título
(`h2`) queda fuera del desenfoque, siempre nítido. El texto del testimonio se
desenfoca más (22 px) y empieza a enfocarse cuando la foto ya terminó, no a la vez.

Alcance (solo escritorio, sin reducir movimiento; en móvil la sección no cambia):
1. Contenedor alto con la sección pegada arriba (`position: sticky`), como `BR-074`.
2. El corte láser, los haces, el subrayado y el destello del marco pasan a seguir una
   sola línea de tiempo: el avance del recorrido fijo, no el scroll de cada elemento.
3. Cuando el láser termina, el título, el subtítulo, la foto y el texto del
   testimonio están desenfocados y se enfocan con el scroll, uno tras otro. La foto
   lleva una copia desenfocada (decorativa, `aria-hidden`) que se cruza con la nítida.
4. Con reducir movimiento: sin sección fija, sin láser y todo nítido.
5. Las piezas comunes con `BR-074` pasan a un lugar compartido (el texto que se enfoca,
   la rampa y el hook de la sección fija), en vez de copiarse.

Criterios de aceptación:
1. En escritorio, la sección queda fija mientras el láser corta la foto y la tarjeta
   y luego se enfocan los textos y la foto; después la página sigue (HU-EXP-004 CA-26).
2. Todo avanza y retrocede con el scroll.
3. Los lectores de pantalla leen cada texto una sola vez (copias `aria-hidden`)
   (CP-A11Y-002).
4. Con reducir movimiento no hay sección fija, láser ni desenfoque (CP-A11Y-003); el
   destello del marco no pasa de 3 por segundo (CP-A11Y-005).
5. En móvil nada cambia respecto de `BR-062`.
6. CLS y TBT móviles no empeoran frente a `master` con el mismo `.env`, midiendo
   alternado (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-075).


#### BR-076 — Respaldados por los mejores: lens flare en lugar de los láseres

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-075
- Estado: Hecho (2026-10-18, rama `feat/br-076-lens-flare` → master, PR #33; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-27)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-005`

**Origen (2026-10-17):** al ver la escena fija de `BR-075`, el usuario propuso
reemplazar los láseres por un efecto de lens flare: los hexágonos del fondo ya se
mueven un poco y le pareció que quedaría mejor que las líneas láser. Los destellos
secundarios de un lente real salen con la forma del diafragma, que muy a menudo es
hexagonal, así que el flare conversa con los hexágonos del fondo.

Decisiones del usuario (2026-10-17): lens flare en vez de los láseres, solo en
escritorio (la sección móvil no cambia), con el flare viajando por el borde del
corte que revela la foto y la tarjeta; se retiran las pistas láser con sus haces.

Alcance (solo escritorio, con la sección fija de `BR-075`):
1. Un flare cálido y contenido: núcleo blanco cálido, un halo con el rojo de la marca
   y cuatro fantasmas hexagonales alineados sobre un eje diagonal. Solo degradados y
   formas; se anima `transform` y `opacity`, sin `mix-blend-mode`.
2. El flare viaja con el borde de cada panel de corte (el de la foto y el de la
   tarjeta, que viene del lado contrario), aparece y se apaga junto con su corte.
3. Se retiran las tres pistas láser con sus haces y la línea láser del borde del
   panel. Los paneles, el recorrido fijo y el revelado posterior no cambian.
4. Con reducir movimiento: sin flare (ya no hay corte ni sección fija).

Criterios de aceptación:
1. En escritorio, un flare con fantasmas hexagonales viaja con el borde del corte de
   la foto y de la tarjeta y se apaga al terminar; ya no hay pistas ni haces láser
   (HU-EXP-004 CA-27).
2. El flare es decorativo (`aria-hidden`), su movimiento es suave y no pasa de 3
   destellos por segundo (CP-A11Y-005).
3. Con reducir movimiento no hay flare (CP-A11Y-003).
4. Solo `transform` y `opacity`, sin `mix-blend-mode`, y sin colores escritos a mano
   (tests; ADR-002).
5. En móvil nada cambia.
6. CLS y TBT no empeoran frente a `master` con el mismo `.env`, midiendo alternado
   (CP-PERF-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-076).


#### BR-077 — Escenas fijas: scroll más pesado (la rueda más lenta en toda la página)

- Prioridad: P3 · Esfuerzo: XS · Depende de: BR-074, BR-075
- Estado: Hecho (2026-10-18, rama `feat/br-077-scroll-pesado` → master, PR #33; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-28)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`

**Origen (2026-10-17):** al probar las escenas fijas (`BR-074`, `BR-075`), el usuario
siente que el scroll se puede pasar muy rápido y entonces el efecto no se nota. Propuso
hacer más «pesado» el scroll aprovechando el smooth de Lenis. Con un trackpad o una
rueda con inercia, una sola pasada de dedo cruza todo el recorrido fijo (unos 1.600 a
1.800 px) en una fracción de segundo.

Decisión del usuario (2026-10-17): hacer el scroll más pesado, aprovechando el smooth de
Lenis.

> **Alcance ajustado (2026-10-18, decisión del usuario):** la primera versión
> (commit `6d5f868`) limitaba la velocidad de la rueda solo dentro de las escenas
> fijas, con el gancho `virtualScroll` de Lenis, y alargaba los recorridos a
> 360vh y 380vh. Se deshizo (revert `910b463`) por simplicidad: en su lugar, un
> solo número al crear Lenis baja la velocidad de la rueda para **toda** la página,
> a un punto medio (`wheelMultiplier` 0,6). Los recorridos vuelven a 280vh y 300vh.
> Mediciones de la primera versión: dentro de la escena, una pasada de 12.000 px
> pedidos en 1 s avanzaba unos 914 px, contra 2.800 a 3.100 px fuera de ella.

Alcance (vigente):
1. Al crear Lenis (`useCreateLenis`), `wheelMultiplier: 0.6`: la rueda y el trackpad
   avanzan el 60 % de lo normal en todas las secciones.
2. El teclado, el arrastre de la barra y el toque no cambian (el multiplicador solo
   afecta a la rueda).
3. Sin Lenis (reducir movimiento) no cambia nada.

Criterios de aceptación:
1. Con la rueda, el scroll avanza más despacio que antes, pero sin sentirse trabado
   (HU-EXP-004 CA-28).
2. El teclado y el toque siguen funcionando igual (CP-A11Y-002).
3. Con reducir movimiento no hay smooth scroll ni cambio (CP-A11Y-003).

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-077).


#### BR-078 — Respaldados por los mejores en móvil: tarjeta con la forma de escritorio y revelado con desenfoque

- Prioridad: P3 · Esfuerzo: S · Depende de: BR-075
- Estado: Hecho (2026-10-18, rama `feat/br-078-prueba-social-movil` → master, PR #35; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-29)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-002`, `RNF-A11Y-003`, `RNF-A11Y-004`

**Origen (2026-10-18):** en móvil, «Respaldados por los mejores» muestra la tarjeta del
testimonio como un rectángulo redondeado apilado bajo la foto, sin relación con la
versión de escritorio (`SocialProof1.module.css`, `.testimonialCard` con
`clip-path: none` en el bloque móvil), y sin el desenfoque de `BR-075`, que solo
existe con la sección fija. El usuario pidió el desenfoque en la imagen y en el texto
también en móvil, y que la tarjeta se vea con la forma y el solape de escritorio.

Decisiones del usuario (2026-10-18): desenfoque en la foto y en el texto también en
móvil; la tarjeta con la forma de escritorio, solapada con la foto.

Alcance (solo `max-width: 768px`; el escritorio no cambia):
1. La tarjeta conserva su forma de escritorio (el polígono), a la derecha y solapada
   con la parte baja de la foto, que queda por encima, como en escritorio.
2. El subtítulo, la foto y el texto del testimonio se ven borrosos y se enfocan con
   el scroll, cada uno según dónde esté en la pantalla (en móvil no hay sección fija).
   El título queda siempre nítido, igual que en escritorio.
3. Misma técnica que `BR-075`: copias desenfocadas decorativas (`aria-hidden`) y solo
   se cruza la opacidad; el desenfoque es de radio fijo.
4. Con reducir movimiento: todo nítido, sin copias.

Criterios de aceptación:
1. En móvil, la tarjeta tiene la forma de escritorio y se solapa con la foto
   (HU-EXP-004 CA-29).
2. El subtítulo, la foto y el testimonio empiezan borrosos y se enfocan con el scroll;
   el título no se desenfoca.
3. Los lectores de pantalla leen cada texto una sola vez (CP-A11Y-002) y el texto de
   la tarjeta cumple 4,5:1 (CP-A11Y-004).
4. Con reducir movimiento no hay copias desenfocadas (CP-A11Y-003).
5. En escritorio nada cambia.

**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-078).


#### BR-079 — Hero y CTA1: zoom-in marcado de las fotos con el scroll

- Prioridad: P3 · Esfuerzo: XS · Depende de: BR-061
- Estado: Hecho (2026-10-18, rama `feat/br-079-hero-zoom-in` → master, PR #35; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-30)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`

**Origen (2026-10-18):** el usuario pidió que la foto del Hero tenga un zoom-in con el
scroll, que se note bien. Hoy, en escritorio, la foto solo hace un parallax leve (escala
de 1 a 1,12 con la capa «foreground» compartida) y en móvil nada: su `transform` está
anulado con `!important` (`Hero.module.css`, `.heroImageSEO` del bloque móvil) porque el
desplazamiento vertical del parallax dejaba una franja vacía arriba.

Decisión del usuario (2026-10-18): zoom-in marcado de la foto del Hero con el scroll.
Por defecto (no se eligió): escritorio y móvil, de 1,4 y de 1,5 veces su tamaño
respectivamente, con un punto de apoyo distinto en cada uno (el rostro).

> **Alcance ajustado (2026-10-18, decisión del usuario, un mensaje después):** la
> misma idea para la foto de CTA1 («Reserva tu experiencia premium»), que hoy solo
> hace un parallax leve. Se acerca de 1 a 1,35× (escritorio, dentro de la figura
> blanca que la recorta) o 1,4× (móvil) mientras la sección cruza la pantalla
> (tramo 0,1 a 0,85 de su avance), con el punto de apoyo en el rostro.

Alcance:
1. La foto escala de 1 a 1,4× (escritorio) o 1,5× (móvil) mientras el Hero sale de la
   pantalla (`scrollYProgress` del Hero), sobre `transform` con `MotionValue`, sin
   `setState` por scroll. No se cambia la capa compartida `foreground`.
2. En móvil se quita la anulación del `transform` y el desplazamiento vertical se
   excluye por código: un zoom hacia adentro no deja huecos.
3. El punto de apoyo del zoom queda en el rostro del modelo en cada tamaño.
4. Con reducir movimiento: sin zoom.

Criterios de aceptación:
1. Al bajar, la foto del Hero se acerca de forma clara en escritorio y en móvil
   (HU-EXP-004 CA-30).
2. No quedan huecos ni franjas al hacer zoom; el texto sigue legible
   (CP-A11Y-004).
3. Con reducir movimiento la foto no hace zoom (CP-A11Y-003).
4. TBT y CLS móviles no empeoran frente a `master` con el mismo `.env`
   (CP-PERF-003).
**Notas de construcción:** ver [`registro-construccion.md`](./registro-construccion.md#br-079).


#### BR-084 — Footer: títulos invisibles, marca desde SITE y colores a tokens

- Prioridad: P1 · Esfuerzo: XS · Depende de: BR-080
- Estado: Propuesta
- Historia de usuario: no aplica — corrección de contraste y de datos sin superficie nueva (hallazgo del handoff móvil del 2026-10-18).
- RF/RNF: `RNF-A11Y-004`, `RNF-DATOS-001`

**Origen (2026-10-18):** `docs/handoff-movil-2026-10-18.md` §3 (Footer).
**Causa:** la regla global de `h1`–`h6` (`src/styles/global.css:25`) pinta los títulos con
`--color-text-primary` (`rgb(23, 23, 23)`) y `Footer.module.css` no define color para
`.title` ni `.columnTitle`: «Barber Royce», «Navegación», «Contacto» y «Síguenos» quedan
casi invisibles sobre el fondo oscuro (WCAG 1.4.3). Además la marca está escrita a mano como
«Barber Royce» (`Footer.tsx:30` y el copyright de `Footer.tsx:126`), cuando es «Royce
Barbería» y sale de `SITE.name`; y `Footer.module.css` tiene colores hex y `rgba` (ADR-002).

Alcance:
1. Los títulos del footer usan un token de texto claro.
2. La marca del título y del copyright sale de `SITE.name`. Esto cambia el texto visible
   de «Barber Royce» a «Royce Barbería»: es la marca oficial, pero se avisa al usuario.
3. Los colores hex y `rgba` de `Footer.module.css` pasan a tokens (con el mismo aspecto).
4. Un test del footer compara el título y el copyright con `SITE.name`.
5. Fuera de alcance (se anota): el `alt` «Barber Royce» del logo de `Navbar.tsx:65`, el
   texto de la descripción del footer (copy del dueño) y las áreas táctiles de los enlaces.

Criterios de aceptación:
1. Los títulos del footer cumplen 4,5:1 contra su fondo en todas las rutas (CP-A11Y-004).
2. El nombre del título y del copyright es `SITE.name` (CP-DATOS-001).
3. Sin hex ni `rgba` literales en `Footer.module.css` (ADR-002).
4. Capturas antes y después iguales salvo los títulos, en 320, 390, 769, 1025 y 1280 px.


#### BR-085 — Navbar móvil: área táctil de 44 px y menú desplazable

- Prioridad: P1 · Esfuerzo: XS · Depende de: BR-080
- Estado: Propuesta
- Historia de usuario: no aplica — corrección de accesibilidad y de usabilidad sin superficie nueva (hallazgos H2 y H3 del handoff móvil del 2026-10-18).
- RF/RNF: `RNF-A11Y-002`

**Origen (2026-10-18):** `docs/handoff-movil-2026-10-18.md` §3 (Navbar) y §4 (H2, H3), medido en Chrome.
**Causa:** la hamburguesa mide 34 × 19 px y «Agendar Sesión» 35 px de alto (mínimo 44 px,
WCAG 2.5.5); el menú móvil tiene `max-height: 500px` (`Navbar.module.css`, `.mobileMenu.open`)
para 520 px de contenido, así que en apaisado el CTA queda inalcanzable; y con el menú cerrado
sus enlaces siguen enfocables con el teclado.
**Arreglo:** `padding` y `min-height` hasta 44 px sin agrandar el ícono; `max-height` con el
alto de la pantalla y `overflow-y: auto`; `inert` mientras el menú está cerrado.

Alcance:
1. La hamburguesa y el botón de reserva de la barra miden al menos 44 × 44 px en móvil, sin
   cambiar el tamaño del ícono ni la altura de la barra.
2. El menú abierto cabe en la pantalla y se desplaza si el contenido no entra.
3. Con el menú cerrado sus enlaces no reciben foco ni los lee un lector de pantalla.
4. Fuera de alcance: la franja de 769 a 1024 px (H1) espera la decisión del usuario
   (hamburguesa hasta 1024 px o barra compacta, y etiqueta corta de «Ubicación»); el velo del
   menú, el CTA duplicado y «TEAM» (copy) son propuestas.

Criterios de aceptación:
1. Hamburguesa y botón de reserva de ≥ 44 × 44 px a 320 y 390 px (CP-A11Y-002).
2. En apaisado (360 px de alto) se llega a «FAQ» y al CTA desplazando el menú.
3. Con el menú cerrado, Tab no entra en sus enlaces.
4. Capturas antes y después iguales salvo el área táctil, en 320, 390, 769 y 1280 px.


#### BR-086 — Navbar: hamburguesa hasta 1024 px

- Prioridad: P1 · Esfuerzo: XS · Depende de: BR-085
- Estado: Propuesta
- Historia de usuario: no aplica — corrección de maquetación sin superficie nueva (hallazgo H1 del handoff móvil del 2026-10-18).
- RF/RNF: `RNF-COMP-001`

**Origen (2026-10-18):** `docs/handoff-movil-2026-10-18.md` §4 (H1), medido en Chrome: entre 769 y
unos 950 px la barra de escritorio no cabe (el logo queda con ancho 0, «Agendar Sesión» sale de la
pantalla, «UBICACIÓN Y HORARIOS» ocupa tres líneas y la barra crece a unos 110 px, el layout reserva
80); a 1024 px el logo se solapa con «NOSOTROS».

> **Decisión del usuario (2026-10-19):** mantener la hamburguesa hasta 1024 px (opción A), no una
> barra compacta. El corte de la barra completa pasa de 769 a 1025 px (`BREAKPOINTS.LG`, ADR-009).

Alcance:
1. La barra de escritorio (logo en imagen, enlaces y botón con borde) aparece desde 1025 px; de 769 a
   1024 px se ve la de móvil (hamburguesa, marca en texto, botón blanco).
2. `Navbar.tsx` cierra el menú al cruzar 1025 px (`MEDIA.lg`) y no 769.
3. La etiqueta de `/ubicacion` pasa de «UBICACIÓN Y HORARIOS» a «SUCURSALES» (`routes.ts`), en la
   navbar y en el footer, que comparten la etiqueta. Medido: a 1025 px el enlace largo ocupaba tres
   líneas (67 px) y la barra crecía a 113 px.

> **Decisión del usuario (2026-10-19):** la etiqueta corta es «Sucursales». El título de la página y
> su SEO no cambian.

Criterios de aceptación:
1. A 769, 900 y 1024 px la barra no se desborda y mide lo mismo que en móvil.
2. A 1025 y 1280 px la barra de escritorio cabe en una línea (88 px o menos), sin solapes.
3. Con el menú abierto a 1024 px y cruzando a 1025 px, el menú se cierra.
4. El test de cortes pasa (`src/styles/breakpoints.test.ts`).


#### BR-087 — Filtros, búsqueda y fichas con un mismo lenguaje: chaflán, vidrio y brillo

- Prioridad: P3 · Esfuerzo: S · Depende de: BR-067, BR-063
- Estado: Propuesta
- Historia de usuario: HU-EXP-004 (CA-31)
- RF/RNF: `RNF-A11Y-003`, `RNF-A11Y-004`, `RNF-PERF-003`

**Origen (2026-10-19):** el usuario pidió fusionar dos estilos que hoy conviven: los filtros de vidrio con
brillo rojo y línea divisoria de Servicios y Ubicación (esquinas redondeadas, `ServicesPage.module.css`,
`LocationPage.module.css`) y el chaflán de Productos y de las fichas (`ProductsPage.module.css`,
`ModalDialog.module.css`), que es plano. Quiere que el buscador de Productos y las fichas del barbero y
del producto también tengan el vidrio y el brillo.

> **Decisión del usuario (2026-10-19):** dirección 2 de la propuesta de `diseno-visual`: un solo estilo
> común, sin tocar los hexágonos del panal.

Alcance:
1. Estilo común en `src/styles/shared/glass.css` (clases `glass-chip`, `glass-field` y `glass-divider`),
   con tokens y `color-mix`, sin hex ni `rgba`: chaflán (`clip-path`), vidrio, brillo interior rojo en el
   activo (`aria-pressed` o `data-state="active"`), foco con anillo interior (el `clip-path` recorta un
   `outline`) y divisoria que se desvanece.
2. Servicios, Ubicación y Productos usan ese estilo en los filtros, las pestañas y el buscador; sus
   módulos conservan solo la maquetación.
3. `ModalDialog` gana un marco exterior con `drop-shadow` (borde que sigue el chaflán y halo rojo) y la
   ficha pasa a un negro algo translúcido; las fichas del barbero y del producto separan su encabezado
   con la divisoria. Sin `backdrop-filter` dentro del marco (un ancestro con `filter` lo anula): el fondo
   ya está desenfocado.
4. Fuera de alcance: los hexágonos del panal, la lógica de filtrado y el texto visible.

Criterios de aceptación:
1. Filtros y buscador de las tres páginas con el mismo chaflán, vidrio y brillo; el activo se distingue
   también sin color (HU-EXP-004 CA-31).
2. Texto de los filtros con contraste ≥ 4,5:1 sobre su fondo (CP-A11Y-004) y foco visible con teclado.
3. Con reducir movimiento no hay transiciones (CP-A11Y-003).
4. Capturas antes y después en 320, 390, 769 y 1280 px de `/servicios`, `/ubicacion`, `/productos` y de
   las dos fichas abiertas; TBT y LCP móviles no empeoran frente a `master` (CP-PERF-003).
5. El test de cortes y los tests de las tres páginas y de las fichas pasan.


#### BR-088 — Cabecera de página unificada: título en Anton y diagonales compactas

- Prioridad: P3 · Esfuerzo: S · Depende de: BR-087
- Estado: Propuesta
- Historia de usuario: HU-EXP-004 (CA-32)
- RF/RNF: `RNF-A11Y-004`, `RNF-PERF-003`

**Origen (2026-10-19):** el sitio tiene dos cabeceras para el mismo elemento. Equipo y Productos usan el
título en Anton sobre las diagonales roja y charcoal (`HoneycombPage`, decisión del 2026-10-14); Nosotros,
Servicios, Ubicación, Preguntas frecuentes y Privacidad siguen con la franja `PageHero` (título rosa con
degradado, 60 + 30 px de relleno, dos reflejos rojos). En móvil la franja ocupa cerca de un cuarto de la
pantalla antes del contenido.

> **Decisión del usuario (2026-10-19):** dirección 2: unificar al estilo de Productos y Equipo. Pidió además
> decidir si Servicios, Preguntas frecuentes, Ubicación, Nosotros y Privacidad llevan fondo. Criterio
> adoptado: todas llevan fondo, pero **compacto** (las diagonales cubren solo la cabecera y debajo el fondo
> es liso): un triángulo rojo de pantalla completa pondría texto y tarjetas translúcidas sobre rojo
> (contraste), y con alto fijo no hay CLS.

> **Alcance ajustado (2026-10-19, decisión del usuario, tras ver la cabecera compacta):** la misma
> cabecera con las figuras y el fondo liso debajo para **las siete páginas**, también Equipo y Productos.
> Estas dos pierden las diagonales a pantalla completa (decisión del 2026-10-14, que esta reemplaza).
> `HoneycombPage` pasa a usar `PageHero`, la variante `band` y su alto de pantalla desaparecen, y el
> buscador y los filtros de Productos llevan la divisoria de `glass-divider` (BR-087).

Alcance:
1. `PageBackdrop` (componente nuevo): los dos triángulos y el filo de luz que estaban dentro de
   `HoneycombPage`.
2. `PageHero` se rehace con `PageBackdrop` acotado a la cabecera, el título en Anton blanco y el subtítulo
   como el de `HoneycombPage`; mismo contrato (`title`, `subtitle`, `animated`) y un solo `<h1>`. Menos
   alto en móvil.
3. `HoneycombPage` usa esa cabecera y un fondo liso; sin `band`.
4. Productos: divisoria bajo el buscador y los filtros.
5. Sin cambios en el texto visible, los `<h1>` ni la lógica de las páginas.

Criterios de aceptación:
1. Las siete páginas muestran la cabecera nueva (capturas antes y después en 390 y 1280 px, también de
   las fichas de Equipo y Productos) (HU-EXP-004 CA-32).
2. En móvil la cabecera mide menos que la anterior y el contenido empieza antes.
3. El texto de la cabecera cumple 4,5:1 sobre las diagonales y `contrast.e2e.test.ts` pasa en todas las
   rutas (CP-A11Y-004).
4. Cada página tiene un solo `<h1>`; con reducir movimiento no hay entrada animada (CP-A11Y-003).
5. CLS móvil no empeora frente a `master` (CP-PERF-003).


#### BR-089 — Productos: encendido en ola, parallax interior, contador y botón de volver arriba

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-068, BR-088
- Estado: Propuesta
- Historia de usuario: HU-EXP-004 (CA-33)
- RF/RNF: `RNF-A11Y-003`, `RNF-A11Y-005`, `RNF-PERF-003`

**Origen (2026-10-19):** el usuario quiere aprovechar el scroll infinito de Productos (`BR-068`) para micro
interacciones y deleite, con parallax u otra idea creativa, y echa en falta un botón de volver arriba.
Hoy los hexágonos nuevos entran con un `scaleIn` genérico (`Honeycomb.tsx`), no hay indicación de cuántos
productos se llevan ni de cuándo termina la lista, y solo existe `ScrollToTop`, que reinicia el scroll al
cambiar de ruta.

> **Decisión del usuario (2026-10-19):** dirección 2 de la propuesta de `diseno-visual`. Por defecto (no se
> eligió): el botón es una pieza reutilizable y se monta solo en Productos.
>
> **Alcance ajustado (2026-10-19, decisión del usuario):** el botón también va en la portada; en las demás
> páginas no le interesa.

Alcance:
1. **Encendido en ola:** los hexágonos de cada lote nuevo (no los de la carga inicial) encienden su marco
   en blanco con un halo rojo una sola vez, escalonados, y vuelven al reposo. CSS, sin `setState` por scroll.
2. **Parallax interior:** en escritorio, la foto de cada hexágono se desplaza ±14 % (era ±6 %, casi imperceptible
   según el usuario, 2026-10-19; se ajusta con `PARALLAX_RANGE` en `Honeycomb.tsx`) dentro de su forma según
   su posición en pantalla (`useScroll` con `target` y `useTransform`); el hexágono no se mueve. Opt-in para
   que Equipo no cambie.
3. **Contador y final:** «Ves 12 de 24» con una barra de progreso fina bajo el panal y una marca al llegar
   al final de la lista. El aviso para lectores de pantalla (`aria-live`) no se duplica.
4. **Botón de volver arriba** (`BackToTop`, `src/components/common/`): hexágono de 3,5 rem con un anillo
   que se llena con el avance de la página; aparece pasada una pantalla; sube con Lenis (o `scrollTo` sin
   Lenis); devuelve el foco al contenido principal. Se monta en Productos.
5. Con reducir movimiento: sin ola, sin parallax y el botón sube de golpe.
6. Fuera de alcance: montar el botón en otras páginas; cambiar el tamaño del lote.

Criterios de aceptación:
1. Al llegar un lote, sus hexágonos se encienden en ola y quedan en reposo; los primeros no se animan
   (HU-EXP-004 CA-33).
2. Ningún destello supera 3 por segundo en un área grande y el halo no es una pulsación repetida
   (CP-A11Y-005).
3. Con reducir movimiento no hay ola ni parallax (CP-A11Y-003).
4. El botón mide ≥ 44 px, se alcanza con teclado, tiene nombre accesible y no tapa el aviso de privacidad.
5. TBT, CLS y LCP móviles de `/productos` no empeoran frente a la línea base, mediana de 3 (CP-PERF-003).
6. `contrast.e2e.test.ts`, lint, tipos y tests en verde.
7. **A confirmar por el usuario en el navegador:** la ola, el parallax y el anillo solo se ven en movimiento.


#### BR-090 — Productos de prueba: 50 filas con fotos de stock que cargan

- Prioridad: P3 · Esfuerzo: XS · Depende de: —
- Estado: Propuesta
- Historia de usuario: no aplica — contenido de prueba para el catálogo (el contenido real lo pone el dueño en la hoja).
- RF/RNF: `RF-INFO-002`

**Origen (2026-10-19):** 4 de las 6 fotos de producto del respaldo daban 404 en Unsplash (`BR-008`) y la hoja
de prueba repetía «Kit Completo» (precios 76 a 100) sin foto para probar el scroll infinito (`BR-068`).
El usuario pidió 50 productos, todos con imagen.

> **Decisión del usuario (2026-10-19):** usar fotos de stock de Unsplash de forma **temporal**, hasta tener las
> fotos propias de `BR-008`, que sigue bloqueada. Esto no cierra `BR-008`: sigue habiendo peticiones a
> `images.unsplash.com`.

Alcance:
1. `docs/contenido/productos.csv`: 50 filas (15 Styling, 15 Barba, 10 Cuidado, 10 Kits) con ids únicos y 17
   fotos distintas, cada una comprobada con respuesta 200 y vista una por una.
2. `src/content/snapshot/products.ts` (respaldo): las fotos de los 6 productos originales pasan a las nuevas
   (las filas 1 a 6 del CSV). El respaldo sigue con 6 productos: no lleva datos de prueba.
3. `src/test/contentWiring.test.tsx`: la plantilla de productos ya no tiene que ser idéntica al respaldo
   (BR-048). Debe empezar con exactamente las filas del respaldo y puede sumar más, y las 50 filas pasan el esquema.
4. Para la hoja: importar `productos.csv` en la pestaña `productos` (ver `docs/contenido-hoja.md`). El `gid` no
   cambia, así que las variables `CONTENT_SHEET_ID` y `CONTENT_SHEET_GIDS` tampoco.

> **Decisión del usuario (2026-10-19):** la regla de `BR-048` que exigía que cada plantilla fuera idéntica al
> respaldo le parece absurda para productos; se relaja solo ahí. Las demás pestañas la conservan.

Criterios de aceptación:
1. Los 50 productos se leen sin errores con el lector del sitio (`src/content/schemas.ts`).
2. Ninguno de los 50 hexágonos de `/productos` queda sin foto.
3. Las fotos muestran marcas reales (Bombay Shaving Company, L'Oréal, Kiehl's, Nivea…): es contenido de prueba y
   se reemplaza por fotos propias antes de publicar el catálogo real.


#### BR-091 — Hero y CTA1: figuras de fondo en SVG con geometría fija

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-055, BR-058
- Estado: Hecho (2026-10-22, rama `feat/br-091-figuras-svg-geometria-fija` → master, PR #41; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-34)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`

**Origen (2026-10-21):** en la auditoría de SVG de la landing (2026-10-19) y en las capturas del usuario a
1024×1117 y 1440×1289, las figuras de fondo del Hero y de CTA1 cambian de forma según la proporción de la
pantalla. La causa es que son `clip-path: polygon()` con porcentajes sobre cajas en `vw` × `vh`: cada punto se
estira por separado en cada eje. Así se deforman:
- Los 6 triángulos del Hero (`Hero.module.css`, `.leftTriangle*` y `.rightTriangle*`).
- Los hexágonos irregulares de CTA1 (`.textHexagon*`, de 40vw × 80vh).
- El pentágono translúcido (`.imageHexagonBackground`).
- La figura blanca que recorta la foto (`.imageHexagon`, de 50vw × 100vh).

Al usuario le gusta que los hexágonos sean irregulares, pero la irregularidad tiene que ser la diseñada, no la
que deja cada pantalla.

Medición en un build local (2026-10-21): la relación ancho/alto de las figuras de CTA1 cambia con la ventana.
- `.textHexagon` mide 0,89 a 1920×1080, 1366×768 y 1280×720; 0,80 a 1440×900; 0,56 a 1440×1289; y 0,46 a
  1024×1117 y 772×839, el doble de alto que lo diseñado.
- Las demás figuras siguen el mismo patrón. `.imageHexagonForeground` hereda la deformación por ir en % de
  `.imageHexagon`.
- Las barras de luz no se deforman: ya son un SVG dimensionado solo por el ancho.

Hay dos efectos secundarios:
- Con la figura más alta que ancha, la foto (`.ctaImage`, anclada abajo) queda con mucho blanco encima.
- El hexágono rojo mide 40vw y `.textContent` hasta 420 px más su relleno, así que bajo ~1100 px de ancho el
  texto se sale del hexágono.

> **Decisión del usuario (2026-10-21):** la forma de referencia es la que se ve a **1920×1080** (relación 0,89
> en CTA1). Prioridad P3.

**Causa:** los porcentajes de `polygon()` se resuelven contra el ancho para la x y contra el alto para la y. Si
la caja va en `vw` × `vh`, el ángulo de cada lado depende de la proporción de la ventana. El filo de luz de la
diagonal del Hero tiene el mismo problema: es un degradado `to bottom right` que solo cae en la diagonal mientras
la caja conserve su proporción.

Alcance:
1. Cada figura decorativa de estas dos secciones se dibuja como `<svg>` en línea, con un `viewBox` y puntos fijos.
   La sección recorta lo que sobra, así que la figura nunca se estira: los ángulos y la irregularidad de los
   hexágonos son iguales en cualquier proporción.
2. Una figura de referencia por forma: los puntos actuales tal como se ven a 1920×1080. Cada figura se dimensiona
   con una sola medida (ancho) y una relación fija (`viewBox` con `preserveAspectRatio`, alto automático), nunca
   con `vw` y `vh` por separado. Si hace falta, se limita para que no se pase en ventanas bajas, por ejemplo con
   `min(vw, vh * k)`.
3. El texto de CTA1 queda dentro del hexágono rojo en todo el rango de escritorio: el bloque escala con la misma
   unidad que la figura, o la figura se dimensiona a partir del bloque.
4. Se conservan las capas de parallax del Hero (fondo, media y rápida) y las de CTA1 (lenta, media y rápida). Las
   figuras que comparten capa van en un mismo `<svg>` animado con `MotionValue`; no se anima nada dentro del SVG
   en cada fotograma.
5. El filo de luz de la diagonal del Hero pasa a ser un trazo real (`<line>` o `<path>` con
   `vector-effect: non-scaling-stroke`), nítido a cualquier tamaño.
6. La figura blanca de CTA1 que recorta la foto mantiene un ángulo fijo en su punta. Puede seguir siendo un
   `clip-path` si todos sus puntos se expresan en una sola unidad, por ejemplo en `vh`. Se conservan el zoom de
   la foto (`BR-079`), su entrada con `fadeInRight` y las barras de luz tal como están.
7. Colores con tokens (`fill` y `stroke` desde CSS, sin literales en el SVG) y `aria-hidden="true"` en cada SVG
   decorativo (skill `svg-workflow`).
8. Móvil sin cambios: estas figuras siguen existiendo solo desde 769 px.
9. Fuera de alcance:
   - Los hexágonos de SocialProof1 y SocialProof2.
   - Los defectos de rotación y de efectos que el `clip-path` recorta en SocialProof1 (vistos en la misma
     auditoría).
   - Animaciones nuevas (trazos que se dibujan, cambios de forma). Se deciden después con `diseno-visual`.

Criterios de aceptación:
1. A 1920×1080, 1440×900, 1440×1289, 1366×768, 1280×720, 1024×1117, 1024×768, 900×1100 y 772×839, cada figura
   conserva su relación ancho/alto (medida con `getBoundingClientRect` sin rotación, con una tolerancia de ±2 %) y
   sus ángulos; solo cambia cuánto recorta el borde de la sección (HU-EXP-004 CA-34).
2. En esas medidas, el texto de CTA1 no se sale del hexágono rojo (lo mide `fixedShapes.e2e.test.ts`).

> **Alcance ajustado (2026-10-21, decisión del usuario):** sale del ticket la franja blanca sobre la foto de CTA1 en
> ventanas altas. No la causa la forma: la figura llena el alto y la foto se dimensiona por el ancho. El encuadre de
> la foto queda para la nueva auditoría o para `diseno-visual`.
3. El filo de luz del Hero sigue la diagonal del triángulo en esas medidas y se ve de 1 px nítido.
4. El parallax del Hero y de CTA1 se ve igual que antes al bajar, y con reducir movimiento no hay parallax
   (CP-A11Y-003).
5. Ninguna figura del Hero ni de CTA1 queda con un `clip-path` de porcentajes sobre una caja en `vw` × `vh` (lo
   comprueba un test sobre los CSS Modules).
6. TBT, CLS y LCP móviles y de escritorio de `/` no empeoran frente a la línea base medida antes del cambio,
   mediana de 3 (CP-PERF-003).
7. Lint, tipos, tests, `breakpoints.test.ts` y `contrast.e2e.test.ts` en verde.
8. **A confirmar por el usuario en el navegador:** la irregularidad de los hexágonos es la que eligió.


#### BR-092 — SocialProof1 y 2: hexágonos de fondo en SVG por capa, con borde y rotación reales

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-091
- Estado: Hecho (2026-10-22, rama `feat/br-092-hexagonos-svg-socialproof` → master, PR #41; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-35)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`

**Origen (2026-10-21):** auditoría de SVG de la landing (2026-10-19). SocialProof1 tiene 14 hexágonos y
SocialProof2 tiene 11, cada uno en su propio `motion.div` con `clip-path`. Varios no se ven como fueron
diseñados.

> **Decisión del usuario (2026-10-21):** resolver primero los hallazgos importantes (`BR-091` y este ticket) y
> después repetir la auditoría. Los colores literales de Reviews y los íconos duplicados de lucide se deciden
> tras esa nueva auditoría.

**Causa:**
1. **Se pierde la rotación.** En `SocialProof1.module.css`, `.hexagonBackground*`, `.hexagonForeground*` y
   `.hexagonSmall*` se rotan con `transform: rotate(…)`. Framer escribe el `transform` en línea (`y`, `scale`, `x`)
   y lo pisa (`SocialProof1.tsx:100-170`). En SocialProof2 no pasa porque se usa la propiedad `rotate:`.
2. **Efectos que se pagan y no se ven.** El `clip-path` recorta todo el `box-shadow` (el brillo de
   `.hexagonMiddle*` y `.hexagonForeground*`) y el `border` de los cuatro lados diagonales. Además, los 4
   `.hexagonBackground*` llevan `backdrop-filter: blur(2px)` sobre un fondo casi liso.
3. **Una transición que pelea con framer.** `transition: transform 0.1s` en `.hexagonForeground*` (SP1) y en
   `.hexagonFast1` (SP2): framer actualiza el `transform` en cada fotograma y la transición lo persigue con
   retraso.
4. **Un hexágono muy grande en móvil.** `.hexagon` de SocialProof2 mide 1000 × 1000 px y también se ve en
   móvil. Hay que medir su costo (capas y memoria en DevTools) antes de decidir.

**Arreglo:**
1. Hexágonos como `<svg>` en línea con `viewBox` fijo:
   - Un `<svg>` por capa de parallax cuando todos sus hexágonos comparten movimiento.
   - Un elemento aparte para los que tienen animación propia (opacidad según la dirección, escala según la
     velocidad, desplazamiento en x según la dirección).
   - Rotación de cada hexágono en el `transform` de su `<polygon>` (fija, no animada).
2. El borde y el brillo son un `stroke` real en los seis lados (el brillo como un segundo trazo ancho y
   translúcido, sin `filter` animado). Sin `backdrop-filter`.
3. Se quita la `transition: transform` de los elementos que mueve framer.
4. El hexágono grande de SP2: se mide antes y después y, si pesa, se dibuja solo la parte visible o se reduce en
   móvil.
5. Colores con tokens, `aria-hidden="true"` y la misma visibilidad por cortes que hoy (ADR-009).
6. Fuera de alcance: las animaciones nuevas (se deciden con `diseno-visual`), Reviews y los íconos.

Criterios de aceptación:
1. Cada hexágono de SocialProof1 muestra la rotación de su diseño y un borde continuo en sus seis lados
   (HU-EXP-004 CA-35).
2. Ningún hexágono de SP1 ni de SP2 lleva `backdrop-filter`, `box-shadow` recortado por `clip-path` ni
   `transition: transform` junto con un `transform` de framer (lo comprueba un test sobre los CSS Modules).
3. El costo de pintado y de composición al recorrer SP1 y SP2 (trace con la CPU frenada 4×, mediana de 3) no sube
   frente a la línea base.

> **Alcance ajustado (2026-10-21, decisión del usuario):** se mantiene un elemento por hexágono, sin agrupar por
> capa. El parallax desplaza cada hexágono un porcentaje de su propio alto, y la escala y el giro son sobre su propio
> centro: un grupo del tamaño de la sección cambiaría el movimiento. El antiguo criterio 3 (bajar de 25 elementos
> animados) pasa a ser el costo medido. Línea base (2026-10-21, trace al recorrer cada sección, mediana de 3):
> - SP2 en móvil @3: Paint 49 ms, Raster 73 ms, estilos 320 ms, composición 440 ms.
> - SP1 a 1440: Paint 82 ms, Raster 10 ms, estilos 268 ms, composición 290 ms.
> - SP2 a 1440: Paint 102 ms, Raster 92 ms, estilos 334 ms, composición 509 ms.
>
> El hexágono de 1000 px de SP2 no tiene capa propia en móvil: se repinta con la página al moverse.
>
> **Decisión del usuario (2026-10-21):** el brillo de los hexágonos medios y de frente de SP1 (un segundo trazo ancho
> y translúcido, sin difuminar) queda como está.
>
> **Medición tras el cambio (2026-10-21):** builds alternados, mediana de 3, ms. El total baja en las tres
> secciones, sobre todo por el recálculo de estilos, pero la composición sube en dos de ellas:
> - SP2 en móvil: total 942 → 905; composición 455 → 508.
> - SP1 a 1440: total 696 → 678; composición 311 → 393.
> - SP2 a 1440: total 1436 → 1049; composición 676 → 573.
>
> **Decisión del usuario (2026-10-22), al cerrar:** el criterio 3 se mide sobre el costo **total**. Cumple: el total
> baja en las tres secciones (−4 %, −3 % y −27 %). La composición, por separado, sube +26 % en SP1 y +12 % en SP2
> móvil, el costo del brillo que el usuario aprobó, y baja −15 % en SP2 a 1440. Si algún día pesa, se quita el
> polígono del brillo (`.glow`).
4. Con reducir movimiento no hay parallax (CP-A11Y-003).
5. TBT, CLS y LCP móviles de `/` no empeoran frente a la línea base, mediana de 3 (CP-PERF-003). Se anota el
   costo del hexágono grande de SP2 antes y después.
6. Lint, tipos, tests y `breakpoints.test.ts` en verde.
7. **A confirmar por el usuario en el navegador:** el aspecto de los hexágonos con borde y brillo.


#### BR-093 — Hero y CTA1: fotos centradas en el rostro y alto de sección acotado

- Prioridad: P3 · Esfuerzo: S · Depende de: BR-091
- Estado: Hecho (2026-10-22, rama `feat/br-091-figuras-svg-geometria-fija` → master, PR #41; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-36)
- RF/RNF: `RNF-PERF-001`, `RNF-PERF-002`, `RNF-PERF-003`

**Origen (2026-10-21):** al revisar `BR-091`, el usuario pide que las fotos del Hero y de CTA1 queden centradas en
todas las resoluciones. En escritorio, las dos secciones miden `height: 100vh`, pero sus fotos se dimensionan por el
ancho (`width: 50%` o `112%`, alto automático). Por eso:
- La foto del Hero queda pegada arriba con charcoal debajo en ventanas altas (1440×1289) y se le corta el cuello en
  ventanas bajas (1280×720).
- La de CTA1 queda pegada abajo, con una franja blanca encima en ventanas altas (la que se sacó de `BR-091`), y el
  borde derecho le corta la nuca.

> **Decisión del usuario (2026-10-21):**
> - «Centrada» significa que cada foto llena su zona (la mitad derecha del Hero, la figura blanca de CTA1) con el
>   rostro al centro: sin franjas vacías y recortando solo los bordes, nunca la cara.
> - Solo escritorio (desde 769 px): no se tocan el encuadre del Hero móvil (ajustado a mano el 2026-10-17) ni el
>   corte de CTA1 móvil del Figma.
> - Ticket propio.
> - Se acota también el alto de las dos secciones en escritorio.

**Causa:** el alto de la sección sale del alto de la ventana y el de la foto, del ancho. Cuando cambia la proporción
de la ventana, ya no se corresponden.

Alcance:
1. En escritorio, cada foto llena su zona con `object-fit: cover` y un punto de enfoque en el rostro
   (`object-position`), definido como constante junto a la del zoom (`heroZoom.ts`, `ctaZoom.ts`).
2. En escritorio, el Hero y CTA1 miden `min(100svh, 75vw)`:
   - En ventanas de 16:9, 16:10 y 4:3 llenan la pantalla, como hoy.
   - En ventanas más altas que 4:3 dejan de crecer y conservan la composición.
   - El tope (75vw, proporción 4:3) se ajusta a ojo con una variable.
3. Se conservan el zoom con el scroll (`BR-079`), el parallax, la entrada de la foto, el recorte de la figura blanca
   y las figuras de `BR-091`.
4. Móvil sin cambios.

Criterios de aceptación:
1. A 1920×1080, 1440×900, 1440×1289, 1366×768, 1280×720, 1024×1117, 1024×768, 900×1100 y 772×839, cada foto llena su
   zona sin franjas vacías y el rostro queda completo y cerca del centro de la zona (HU-EXP-004 CA-36).
2. En ventanas de 16:9, 16:10 y 4:3 las secciones siguen midiendo el alto de la ventana; en las más altas miden 75vw.
3. Con reducir movimiento no hay zoom ni parallax (CP-A11Y-003).
4. LCP, CLS y TBT móviles y de escritorio de `/` no empeoran frente a la línea base de `BR-091`, mediana de 3
   (CP-PERF-003). La foto del Hero sigue siendo el LCP con `fetchpriority="high"`.
5. Lint, tipos, tests y `breakpoints.test.ts` en verde.
6. **A confirmar por el usuario en el navegador:** el encuadre del rostro en cada foto.


#### BR-094 — Benefits: cuñas rojas con ángulo fijo

- Prioridad: P3 · Esfuerzo: XS · Depende de: BR-071
- Estado: Hecho (2026-10-22, rama `feat/br-094-cunas-angulo-fijo` → master, PR #42; verificado por el usuario en producción)
- Historia de usuario: HU-EXP-004 (CA-37)
- RF/RNF: `RNF-PERF-003`

**Origen (2026-10-21):** segunda auditoría de SVG de la landing, sobre `master` y después de `BR-091` a `BR-093`.
Las dos cuñas rojas de Benefits (`BR-071`, `Benefits.module.css`, `.imageBackground::before` y `::after`) solo
existen en móvil (desde 769 px no hay cuñas), y se deforman con el ancho de la ventana. Medido con la caja real del
fondo:

| Ventana | Cuña superior | Cuña inferior |
|---|---|---|
| 320×640 | 28,3° | 25,8° |
| 360×780, 390×844 y 430×932 | 30,2° | 27,6° |
| 600×960 | 23,3° | 21,1° |
| 768×1024 | 19,7° | 17,8° |

> **Corrección (2026-10-22):** la primera versión de esta ficha medía también ventanas de escritorio (13,5° a 28,6°),
> donde las cuñas no se pintan. Esas filas no correspondían y se quitaron.

La franja diagonal (`.band`, solo en escritorio) también cambia, de 0,9° a 2,4° respecto de la vertical, pero no
se nota.

**Causa:** el mismo problema de `BR-091`. Las cuñas son `clip-path` sobre una caja de `100% × 24%` y `65% × 14%`
de la sección, y el ancho y el alto de esa caja cambian por separado.

> **Decisión del usuario (2026-10-22):** el ángulo de referencia es el del móvil, donde se diseñaron y ajustaron
> a ojo (`BR-071`): ~30° la superior y ~28° la inferior. P3.

**Arreglo:** cada cuña fija su proporción con `aspect-ratio` y se dimensiona solo por el ancho. Así el ángulo queda
fijo y el borde de la sección recorta lo que sobra. No hace falta SVG: es un triángulo plano, sin trazo ni degradado.

Alcance:
1. La cuña superior y la inferior con el ángulo de referencia en todo el rango móvil (hasta 768 px).
2. Se conservan el color, la posición en las esquinas y las variables para ajustarlas a ojo.
3. La franja diagonal no cambia.

Criterios de aceptación:
1. En las ventanas de la tabla, el ángulo de cada cuña no varía más de 1° (HU-EXP-004 CA-37); se mide con la caja real.
2. Ningún `clip-path` de Benefits queda en porcentajes sobre una caja sin proporción fija, salvo la franja (lo
   comprueba un test sobre el CSS Module).
3. Lint, tipos, tests y `breakpoints.test.ts` en verde.
4. **A confirmar por el usuario en el navegador:** el ángulo de las cuñas.


#### BR-096 — Filos que se encienden: el borde de cada figura se dibuja

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-091, BR-092
- Estado: En curso
- Historia de usuario: HU-EXP-004 (CA-38)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-005`

**Origen (2026-10-22):** `diseno-visual` sobre la portada, ahora que las figuras de fondo son SVG (`BR-091` y `BR-092`).
Diagnóstico: hay deleite en el centro de la página (corte láser de SP1, íconos que se dibujan en Benefits, barras de
luz de CTA1) y casi nada al principio ni al final. Después del loader, el Hero es una pieza estática; los hexágonos de
CTA1, la forma más memorable de la marca, solo hacen parallax; y los polígonos de Features y Reviews están al 5–8 % de
opacidad y casi no se ven.

> **Decisión del usuario (2026-10-22):** dirección A de la propuesta («filos que se encienden»), hecha junto con
> `BR-097`; el usuario revisa todo después. Mide al final.
>
> **Por defecto (no se eligió; el usuario estaba ausente):**
> - Solo escritorio: en móvil estas figuras no existen o ya aparecen dibujadas, para no sumar JavaScript donde el TBT
>   tiene 8 ms de margen.
> - Con reducir movimiento, todo aparece ya dibujado.
> - Los trazos se dibujan una vez y quedan; no hay nada que parpadee.

**Hallazgo técnico:** `pathLength` no se lleva con `vector-effect: non-scaling-stroke`. Comprobado en Chrome: con NSS
el trazo sale siempre completo, sin importar el `stroke-dashoffset`. Por eso este ticket quita NSS del filo del Hero
(`BR-091`) y de los bordes de SP1 (`BR-092`), y fija el grosor en unidades del `viewBox`: el trazo ya no mide 1 px
exactos, sino entre 1 y 2 px según el ancho de la figura.

Alcance:
1. **Hero:** el filo de luz de la diagonal de los dos triángulos principales se traza una vez, de arriba hacia abajo,
   cuando sale el neón del loader.
2. **CTA1:** el contorno de los tres hexágonos del texto se dibuja al entrar la sección (el mismo disparador de la
   foto), con un leve desfase entre ellos. Quedan con su trazo fino ya dibujado.
3. **SocialProof1:** el borde de los 14 hexágonos se dibuja con el recorrido del láser (`sceneTimeline.ts`), y en las
   ventanas bajas, sin la sección fija, con el avance de la sección. Es scrub: al subir, se borra.
4. **Features y Reviews:** sus dos polígonos decorativos pasan de `::before`/`::after` casi invisibles a SVG con un
   trazo que se dibuja al entrar la sección.
5. La variante `edgeDraw` vive en `animations.config.ts`; solo anima `pathLength` (nunca `opacity`, que ocultaría el
   relleno de las figuras).
6. Fuera de alcance: móvil, SocialProof2 (su galería aún no tiene fotos), el brillo de SP1 y cualquier movimiento de
   las figuras (`BR-097`).

Criterios de aceptación:
1. Con la página cargada, el filo del Hero está dibujado de punta a punta; la secuencia de dibujo se ve en una
   grabación o captura intermedia (HU-EXP-004 CA-38).
2. A 1440 px, el contorno de los tres hexágonos de CTA1 pasa de 0 a 1 al entrar la sección y queda; los de SP1, con el
   avance del láser, y los de Features y Reviews al entrar.
3. Con reducir movimiento, todo se ve ya dibujado y sin animaciones (CP-A11Y-003).
4. Ningún trazo parpadea más de 3 veces por segundo: son trazos que avanzan una vez (CP-A11Y-005).
5. Ningún `vector-effect: non-scaling-stroke` queda en una figura que se dibuja (lo comprueba un test).
6. TBT, CLS y LCP móviles y de escritorio de `/` frente a la línea base de master (2026-10-22), mediana de 3
   (CP-PERF-003).
7. Lint, tipos, tests y `breakpoints.test.ts` en verde.
8. **A confirmar por el usuario en el navegador:** que el dibujo se vea bien en movimiento.

**Verificación local (2026-10-22, hecha mientras el usuario estaba ausente; falta su revisión):**
- Chrome real: el filo del Hero pasa de 0 a 1 entre ~1,2 y ~2,9 s (arranca al salir el neón); los contornos de CTA1, de
  Features y de Reviews terminan en 1 a los 772, 1024 y 1440 px; el borde de SP1 va 0 → 0,27 → 0,60 → 1 en los puntos
  2, 12, 22 y 40 % del recorrido (la fórmula da lo mismo). Con reducir movimiento, todo aparece sin trazo animado. A
  390 px no hay trazos animados y no hay desborde horizontal.
- Lint, tipos y 927 pruebas en verde (incluidos los e2e).
- **Medición** (builds alternados contra master, mediana): escritorio, LCP 1,81 → 1,85 s y TBT 10 → 13 ms; móvil,
  LCP 6,50 → 6,56 s, CLS 0 y **TBT 237 → 266 ms (5 corridas; rangos 223–282 y 247–302)**. El JavaScript comprimido
  crece solo 716 bytes (0,3 %), así que no es peso de código. Primero era +39 ms con las animaciones montadas también
  en móvil; se corrigió animando los bordes solo donde las figuras se ven (769 px, y 1025 en SP1). **Queda +29 ms
  dentro del ruido de esta máquina (la propia base varía 60 ms entre corridas), pero sin demostrar que sea cero.** El
  TBT móvil absoluto está sobre 200 ms en las dos versiones porque la máquina estaba cargada (producción: 192 ms).
  Hay que repetir contra el preview de Vercel (CP-PERF-003).


#### BR-097 — CTA1: los hexágonos se ensamblan con el scroll

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-096
- Estado: En curso
- Historia de usuario: HU-EXP-004 (CA-39)
- RF/RNF: `RNF-PERF-003`, `RNF-A11Y-003`, `RNF-A11Y-005`

**Origen (2026-10-22):** misma sesión de `diseno-visual` que `BR-096`. Los tres hexágonos irregulares de CTA1 son la
forma más memorable de la marca (los que al usuario le gustan irregulares) y hoy solo se desplazan con el parallax.

> **Decisión del usuario (2026-10-22):** dirección B, solo en CTA1, junto con `BR-096`.
>
> **Por defecto (no se eligió):** el ensamble es scrub (reversible, ligado al avance de la sección) y no una entrada
> de una sola vez; los hexágonos conservan su forma irregular y su rotación de diseño, solo llegan desfasados.

Alcance:
1. Los tres hexágonos del texto llegan desfasados y rotados, y encajan en su sitio a medida que la sección entra en
   pantalla (de 0 a 1 en la primera mitad del recorrido). Al terminar, quedan exactamente donde están hoy.
2. Las barras de luz bajan unos píxeles y se asientan junto al hexágono rojo al mismo tiempo.
3. Solo `transform`, con `MotionValue`; el desfase va en un contenedor interior, para no pisar el parallax de capa.
4. Con reducir movimiento, y en móvil (donde estas figuras no existen), no hay ensamble.
5. Fuera de alcance: los triángulos del Hero y las cuñas de Benefits.

Criterios de aceptación:
1. Con la sección alineada con la ventana, los tres hexágonos están en su posición de reposo, que es la de `BR-091`
   (HU-EXP-004 CA-39).
2. Antes de entrar la sección, los hexágonos están desfasados y rotados; el ensamble avanza y retrocede con el scroll.
3. Con reducir movimiento no hay ensamble (CP-A11Y-003), y no hay destellos (CP-A11Y-005).
4. El e2e `fixedShapes.e2e.test.ts` sigue en verde: ninguna figura se estira y el texto queda dentro del hexágono rojo.
5. TBT, CLS y LCP móviles y de escritorio frente a la línea base (CP-PERF-003).
6. Lint, tipos, tests y `breakpoints.test.ts` en verde.
7. **A confirmar por el usuario en el navegador:** que el ensamble se vea bien en movimiento.

**Verificación local (2026-10-22, hecha mientras el usuario estaba ausente; falta su revisión):**
- Chrome real a 1440×900: el desfase de los tres hexágonos baja de (−83, −65), (74, −102) y (130, 90) px al 8 % del
  recorrido a nada desde el 46 %, y las barras de luz de −37 px a 0. Con reducir movimiento y a 390 px no se monta
  ningún contenedor de ensamble; a 772 y 1024 px, sí (los tres).
- El e2e `fixedShapes.e2e.test.ts` sigue en verde en las 9 ventanas: ninguna figura se estira y el texto queda dentro del
  hexágono rojo. Lint, tipos y 927 pruebas en verde.
- Medición: ver `BR-096` (se midió junto, con el resultado de las dos).
- Distancias y giros (`CTA_ASSEMBLE` en `ctaAssemble.ts`) puestos a ojo; se ajustan en un solo lugar.



#### BR-100 — Modal de bienvenida con una mascarilla facial gratis

- Prioridad: P3 · Esfuerzo: M · Depende de: BR-037 (aviso de privacidad), BR-042 (textos de la hoja)
- Estado: Pendiente
- Historia de usuario: HU-RES-003 (CA-01 a CA-09)
- RF/RNF: `RF-RES-003`, `RF-RES-004`, `RF-CNT-008`, `RF-MED-006`, `RNF-PERF-002`, `RNF-PERF-003`, `RNF-A11Y-002` a
  `RNF-A11Y-005`, `RNF-DATOS-001`, `RNF-PRIV-001`

**Origen (2026-10-27):** pedido del usuario. Insumo: `docs/handoff-modal-promocion-2026-10-27.md`.

Alcance (decisiones del usuario del 2026-10-27, ver HU-RES-003):
1. Modal sobre `ModalDialog`, montado con `lazy()` tras la carga, en cualquier ruta, una vez por visitante (indicador en
   `localStorage` con `try/catch`), después del loader de neón y del aviso de privacidad, con ~5 s de espera.
2. Tres franjas: imagen · titular y llamado · contenido y botones (la derecha). En esta etapa la franja derecha lleva
   el texto de la oferta, la frase «Royce web» y «Reservar»; el botón «Canjear cupón» es de `BR-101`.
3. `promo.activa` y los textos del modal en la pestaña `textos` (claves nuevas en `TEXTS` y en
   `docs/contenido-hoja.md`); apagada o ausente, no se monta ni se descarga.
4. Eventos `promo_view`, `promo_close` y `reserve_click` (`section = promo`), solo con consentimiento.
5. Fuera de alcance: el formulario y el registro en la hoja (`BR-101`); validar el canje.

Criterios de aceptación: los de HU-RES-003 y, además:
1. Lint, tipos y tests en verde; `contrast.e2e.test.ts` pasa con la promoción apagada y con ella encendida y cerrada.
2. TBT, CLS y LCP móviles de `/` no empeoran frente a la línea base (mediana de 3, `RNF-PERF-003`).
3. **A confirmar por el usuario:** la dirección visual (`diseno-visual`, tres propuestas), la imagen y los textos
   finales, y las condiciones con el dueño.


#### BR-101 — Canje de la mascarilla con formulario, cupón y registro en la hoja

- Prioridad: P3 · Esfuerzo: L · Depende de: BR-100
- Estado: Bloqueado (necesita un ADR del receptor del registro y la decisión sobre `/privacidad`)
- Historia de usuario: HU-RES-004 (CA-01 a CA-07)
- RF/RNF: `RF-RES-005`, `RF-RES-006`, `RF-RES-007`, `RNF-PRIV-002`, `RNF-SEG-004`, `RNF-A11Y-002`, `RNF-DATOS-001`

**Origen (2026-10-27):** pedido del usuario: botón «Canjear cupón» que despliega un formulario dentro del modal, con
«completar» y «volver», un cupón en pantalla y un registro en una pestaña de la hoja «para evitar abusos».

**Por qué está bloqueado:** el sitio es estático (`ADR-001`). Escribir en la hoja exige un receptor externo (Google
Apps Script publicado como aplicación web, o un Google Form) y eso es un tercero nuevo: ADR nuevo, CSP (`RNF-SEG-004`),
consentimiento y actualizar `/privacidad` (`RNF-PRIV-002`). El registro permite detectar abusos, no impedirlos.

Alcance: formulario en la franja derecha (campos por decidir), cupón con el nombre y «Royce web», registro del canje,
recuerdo del canje en el navegador. Fuera de alcance: validar el canje en el local.

Criterios de aceptación: los de HU-RES-004 más el ADR aprobado antes de escribir código.

---

## 4. Diferido — no forma parte del despliegue

Cada ítem tiene su **disparador**: la condición que obliga a revisarlo.

| Tema | Origen | Disparador |
|---|---|---|
| Reserva propia (TanStack Query, Zustand, react-hook-form + zod, `AppError` completo de RadarOP, confeti de "reserva confirmada") | ADR-001 | Se decide dejar AgendaPro. |
| Search Console y monitoreo de uso en tiempo real | ex checklist §6 | Cuando haya datos de analítica (`BR-036`..`BR-038`) que justifiquen revisar la indexación. |
| ~~Analítica (GA4 o Vercel Analytics)~~ | ex checklist §6 | **Disparador cumplido (2026-10-12):** pasa a la épica I (`BR-036`..`BR-038`, `BR-044`). |
| Monitoreo de errores (Sentry o similar) | ADR-005 | Primer error reportado por un cliente que no se vio en los logs. |
| ~~Galería de Instagram en SocialProof2~~ | ex `B001` | **Disparador cumplido (2026-10-14):** el usuario la pidió; pasa a la épica L (`BR-051`). |
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
| BR-009 | Quitar el botón "Comprar" (decidido) | B | P1 | XS | Hecho | — |
| BR-010 | Variables de entorno | B | P1 | XS | Hecho | — |
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
| BR-022 | Hex → tokens | D | P2 | M | Propuesta (landing hecha) | BR-021 |
| BR-023 | Retirar Tailwind y shadcn | D | P2 | L | Propuesta | BR-021 |
| BR-024 | Breakpoints unificados, mobile-first (base de la migración) | D | P2 | S | Propuesta | — |
| BR-025 | Código muerto y dependencias | H | P2 | M | Propuesta | BR-014 |
| BR-026 | Rutas desde `ROUTES` | H | P2 | S | Propuesta | BR-003, BR-019 |
| BR-027 | Ordenar data, types e iconos | H | P2 | S | Propuesta (íconos hechos) | — |
| BR-028 | Prettier y alias | H | P2 | S | Propuesta | BR-004 |
| BR-029 | CI en GitHub Actions | H | P1 | S | Hecho | BR-004, BR-030 |
| BR-030 | Vitest y primeros tests | H | P1 | M | Hecho | — |
| BR-031 | Lighthouse CI | H | P2 | S | Propuesta | BR-029, BR-002 |
| BR-032 | Actualizar README | A | P2 | S | En curso | BR-001 |
| BR-033 | Accesibilidad | G | P2 | S | Propuesta | — |
| BR-034 | Spike prerender | G | P1 | M | Propuesta (spike) | BR-006 |
| BR-036 | Vercel Analytics por variable | I | P2 | S | En curso | BR-010 |
| BR-037 | Consentimiento y Google Analytics 4 | I | P2 | M | En curso | BR-044, BR-030 |
| BR-038 | Eventos de conversión y vistas por ruta | I | P2 | S | En curso | BR-037 |
| BR-039 | Núcleo de contenido: CSV, validación y respaldo | J | P2 | M | En curso | BR-030 |
| BR-040 | Descarga de la hoja al construir | J | P2 | M | En curso | BR-039 |
| BR-041 | Catálogo desde el contenido generado | J | P2 | M | En curso | BR-040 |
| BR-042 | Textos y títulos desde la hoja | J | P3 | M | Hecho | BR-041 |
| BR-043 | Guía para publicar desde la hoja | J | P2 | S | Hecho | BR-040 |
| BR-044 | Política de privacidad (borrador) | I | P2 | S | En curso | — |
| BR-045 | Títulos invisibles sobre fondo oscuro | C | P0 | S | En curso | — |
| BR-046 | Leer la hoja desde `.env` y en desarrollo | J | P2 | S | Hecho | BR-040 |
| BR-047 | El navegador relee la hoja: cambios sin desplegar | J | P1 | M | Hecho | BR-040 |
| BR-048 | Datos de contacto, sucursales y redes desde la hoja | J | P1 | M | Hecho | BR-047 |
| BR-049 | Smooth scroll imperceptible y redundante | E | P1 | S | Hecho | BR-014, BR-017 |
| BR-050 | Hero: tipografía de marca | K | P3 | M | Hecho | BR-042, BR-043 |
| BR-051 | Parrilla de fotos con las publicaciones de Instagram | L | P2 | L | Bloqueada | — |
| BR-052 | Reseñas reales de Google en la home | L | P2 | M | Bloqueada | BR-006 |
| BR-053 | Skill `diseno-visual` y flujo de SVG | K | P2 | S | Hecho | BR-050 |
| BR-054 | Loader de neón (letrero «Barber Royce») | K | P3 | M | Hecho | BR-050, BR-053 |
| BR-055 | Hero: fondos con profundidad | K | P3 | M | Hecho | BR-050 |
| BR-056 | Hero: tarjetas de beneficios (vidrio con esquinas cortadas) | K | P3 | M | Hecho | BR-050, BR-055 |
| BR-057 | Loader con el letrero real en vector | K | P3 | S | Bloqueada | BR-054 |
| BR-058 | CTA1: barras de luz hexagonales, foto enmarcada y botón de reserva | K | P3 | M | Hecho | BR-054, BR-056 |
| BR-059 | Navbar: resplandor de neón blanco al pasar el cursor | K | P3 | XS | Hecho | BR-058 |
| BR-060 | Equipo: panal de hexágonos con el líder destacado | K | P3 | M | Hecho | BR-058 |
| BR-061 | Hero y CTA1 en móvil: fieles al Figma | K | P3 | M | Hecho | BR-056, BR-058, BR-059 |
| BR-069 | Tarjetas unificadas con el vidrio del Hero: Beneficios y Reseñas | K | P3 | M | Hecho | BR-056, BR-064 |
| BR-070 | Beneficios y Reseñas en móvil: carrusel con snap | K | P3 | M | Hecho | BR-069 |
| BR-071 | Beneficios en móvil: foto puente con dos cuñas rojas | K | P3 | XS | Hecho | BR-064 |
| BR-072 | Innovación y calidad: tarjetas de vidrio y carrusel en móvil | K | P3 | S | Hecho | BR-069, BR-070 |
| BR-073 | Reseñas: carrusel también en escritorio, con 3 visibles y profundidad | K | P3 | M | Hecho | BR-070 |
| BR-074 | Beneficios: revelado con el scroll (enfoque, giro de 360° y latido) | K | P3 | M | Hecho | BR-069 |
| BR-075 | Respaldados por los mejores: escena fija, corte láser y revelado con el scroll | K | P3 | M | Hecho | BR-062, BR-074 |
| BR-076 | Respaldados por los mejores: lens flare en lugar de los láseres | K | P3 | M | Hecho | BR-075 |
| BR-077 | Escenas fijas: scroll más pesado (la rueda más lenta en toda la página) | K | P3 | XS | Hecho | BR-074, BR-075 |
| BR-078 | Respaldados por los mejores en móvil: tarjeta con la forma de escritorio y revelado con desenfoque | K | P3 | S | Hecho | BR-075 |
| BR-079 | Hero y CTA1: zoom-in marcado de las fotos con el scroll | K | P3 | XS | Hecho | BR-061 |
| BR-080 | Mobile-first: navbar, footer y estilos globales | D | P2 | S | Propuesta | BR-024 |
| BR-081 | Mobile-first: secciones de la home | D | P2 | M | Propuesta | BR-024 |
| BR-082 | Mobile-first: páginas internas | D | P2 | S | Propuesta | BR-024 |
| BR-083 | Mobile-first: componentes comunes | D | P2 | S | Propuesta | BR-024 |
| BR-062 | SocialProof1: corte láser cinematográfico y disparos por pistas | K | P3 | M | Hecho | BR-058 |
| BR-063 | Equipo: ficha de cada barbero en un modal | K | P3 | M | Hecho | BR-060 |
| BR-064 | Benefits: fiel al Figma con íconos que se dibujan | K | P3 | M | Hecho | BR-062 |
| BR-065 | SocialProof2: parrilla bento con las proporciones del Figma | K | P3 | S | Hecho | BR-064 |
| BR-066 | El respaldo del enlace de reserva apunta a un subdominio que no existe | B | P1 | XS | Hecho | — |
| BR-067 | Productos: catálogo en panal con hover y ficha | K | P3 | M | Hecho | BR-060, BR-063, BR-009 |
| BR-068 | Productos: carga progresiva (scroll infinito) | K | P3 | M | Hecho | BR-067 |
| BR-084 | Footer: títulos invisibles, marca desde SITE y colores a tokens | K | P1 | XS | Propuesta | BR-080 |
| BR-085 | Navbar móvil: área táctil de 44 px y menú desplazable | K | P1 | XS | Propuesta | BR-080 |
| BR-086 | Navbar: hamburguesa hasta 1024 px | K | P1 | XS | Propuesta | BR-085 |
| BR-087 | Filtros, búsqueda y fichas con un mismo lenguaje: chaflán, vidrio y brillo | K | P3 | S | Propuesta | BR-067, BR-063 |
| BR-088 | Cabecera de página unificada: título en Anton y diagonales compactas | K | P3 | S | Propuesta | BR-087 |
| BR-089 | Productos: encendido en ola, parallax interior, contador y botón de volver arriba | K | P3 | M | Propuesta | BR-068, BR-088 |
| BR-090 | Productos de prueba: 50 filas con fotos de stock que cargan | K | P3 | XS | Propuesta | — |
| BR-091 | Hero y CTA1: figuras de fondo en SVG con geometría fija | K | P3 | M | Hecho | BR-055, BR-058 |
| BR-092 | SocialProof1 y 2: hexágonos de fondo en SVG por capa, con borde y rotación reales | K | P3 | M | Hecho | BR-091 |
| BR-093 | Hero y CTA1: fotos centradas en el rostro y alto de sección acotado | K | P3 | S | Hecho | BR-091 |
| BR-094 | Benefits: cuñas rojas con ángulo fijo | K | P3 | XS | Hecho | BR-071 |
| BR-095 | Los e2e de Chrome real no corren en paralelo | H | P2 | S | Hecho | — |
| BR-096 | Filos que se encienden: el borde de cada figura se dibuja | K | P3 | M | En curso | BR-091, BR-092 |
| BR-097 | CTA1: los hexágonos se ensamblan con el scroll | K | P3 | M | En curso | BR-096 |
| BR-100 | Modal de bienvenida con una mascarilla facial gratis | K | P3 | M | Pendiente | BR-037, BR-042 |
| BR-101 | Canje de la mascarilla con formulario, cupón y registro en la hoja | K | P3 | L | Bloqueado | BR-100 |

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
