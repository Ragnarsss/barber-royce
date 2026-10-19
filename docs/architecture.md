# Arquitectura — barber-royce

Fecha: 2026-10-12
Estado: activo. Describe el estado real del código y las decisiones
tomadas. Lo que todavía no se cumple está marcado como **Gap** con su
ticket.

## 1. Qué es

Sitio web de **Royce Barbería** (Coquimbo, Chile). Es una web de captación:
presenta servicios, equipo, productos, ubicación y preguntas frecuentes, y
deriva la reserva a **AgendaPro**. No tiene backend propio, cuentas de
usuario ni formularios que envíen datos.

## 2. Stack

| Área | Tecnología |
|---|---|
| Base | React 19, TypeScript 5.9 (`strict`), Vite 7 con `@vitejs/plugin-react-swc` |
| Rutas y SEO | `react-router-dom` 7 (`BrowserRouter`, rutas lazy), `react-helmet-async` |
| Estilos | CSS Modules + tokens CSS en `src/styles/tokens/` (ADR-002) |
| Animación y scroll | `framer-motion` 12, `lenis` |
| Iconos y fuentes | `lucide-react`, Montserrat self-hosted (`@fontsource/montserrat`) |
| Imágenes | `sharp` (`scripts/optimize-images.js`, solo WebP: el AVIF pesaba más) + `vite-plugin-image-optimizer` |
| Calidad | ESLint 9 (flat config), commitizen. Tests y CI: `BR-029`, `BR-030` |
| Rendimiento | `@lhci/cli` (`lighthouserc.json`), `vite-bundle-visualizer` |
| Hosting | Vercel (ADR-003, `BR-002`) |

Comandos en [`../CLAUDE.md`](../CLAUDE.md).

## 3. Estructura

```
src/
  main.tsx, App.tsx       arranque, providers, <Routes>
  pages/                  una página por ruta + su *.module.css
  components/
    layout/               Layout, Navbar, Footer
    sections/             secciones de página (Hero, CTA1, Location, …)
    common/               ErrorBoundary, SEOHelmet, PageHero, Loading, SkipLink, ScrollToTop
    ui/                   ScrollProgressBar + restos de shadcn (se retiran, BR-023)
    icons/                SVG propios
  config/                 routes.ts, constants.ts, animations.config.ts
  content/                contenido editable (BR-039): CSV, esquemas, resolveContent, respaldo
  analytics/              Vercel Analytics, consentimiento y GA4 (ADR-007)
  contexts/               LenisContext
  hooks/                  Lenis, scroll, parallax
  data/                   contenido estático del negocio
  types/                  tipos
  styles/                 global.css, reset.css, tokens/
  assets/                 imágenes originales + optimized/ (AVIF/WebP)
vite-plugins/             plugin de Vite que lee la hoja al construir (BR-040, ADR-008)
public/                   favicons, og-image, robots.txt, sitemap.xml, manifest
docs/                     documentación del proceso (ver ../CLAUDE.md)
```

Responsabilidad de cada carpeta: [`engineering-guidelines.md`](./engineering-guidelines.md) §2.

### Rutas

`/`, `/servicios`, `/productos`, `/equipo`, `/ubicacion`, `/nosotros`,
`/preguntas-frecuentes`. Todas salvo la home cargan con `lazy()` +
`Suspense`. `src/config/routes.ts` (`ROUTES`) define label, título y
descripción de cada una.

- **Gap:** `<Routes>` en `App.tsx` está escrito a mano y no sale de
  `ROUTES` (`BR-026`).
- **Gap:** no hay ruta comodín ni página 404 (`BR-003`).

## 4. Estilos

- CSS Modules por componente y página (`*.module.css`). Es lo que
  realmente pinta la UI.
- Tokens en `src/styles/tokens/*.css` (colores, tipografía, espaciado,
  sombras, radios, transiciones, breakpoints, z-index), importados desde
  `global.css`.
- El sitio es oscuro. El rojo de marca es `#d52323`.
- **Gap:** hay cuatro fuentes de tokens que se pisan
  (`styles/tokens/`, `styles/variables.css`, `src/index.css` de shadcn,
  `COLORS` en `config/constants.ts`) y unos 120 colores hex escritos a mano
  en los módulos (`BR-021`, `BR-022`).
- **Mobile-first** con un conjunto cerrado de cortes (640, 769, 1025 y 1280
  px; `ADR-009`). Todo el CSS de `src/` ya está migrado (`BR-080` a
  `BR-083`) y `src/styles/breakpoints.test.ts` falla con cualquier
  `max-width` o corte fuera del conjunto.

## 5. Animación y scroll

- **Lenis** da el scroll suave. Se crea en `useCreateLenis()` (llamado en
  `App.tsx`) y se comparte con `LenisContext`.
- **framer-motion** anima entradas y parallax. Las variantes viven en
  `src/config/animations.config.ts`.
- El parallax por capas usa `useScroll` + `useTransform`
  (`useParallaxLayers`).

Reglas (vinculantes desde `BR-014`..`BR-017`):

1. Lo que depende del scroll se expresa como `MotionValue`; nunca un
   `setState` por evento de scroll.
2. Se crean solo los `useTransform` que la sección usa.
3. Entradas con `whileInView` + `viewport={{ once: true }}` y variantes
   compartidas (`fadeUp`, `fadeIn`, `staggerContainer`), patrón tomado de
   RadarOP.
4. `MotionConfig reducedMotion="user"` en la raíz; con
   `prefers-reduced-motion: reduce` no hay parallax ni scroll suave.
5. Nadie lee `window.lenis` (ya no existe): la instancia llega por
   `LenisContext` (`useLenisInstance`).

- La dirección y la velocidad del scroll son `MotionValue`
  (`useScrollDirection`, `useScrollSpeed` en `src/hooks/useScrollMotion.ts`)
  y los estilos se derivan con `useTransform`: el scroll no re-renderiza
  ningún componente (`BR-015`).
- El parallax por capas se arma pidiendo solo las capas que la sección
  usa (`useParallaxProgress` + `useBackgroundLayer`, `useMiddleLayer`,
  `useForegroundLayer`, `useSlowLayer`, `useFastLayer`; `BR-016`).
- Resueltos: `MutationObserver` global, `window.lenis` y fugas
  de listeners (`BR-014`); `prefers-reduced-motion` en JavaScript
  (`BR-017`); re-renders por scroll (`BR-015`).

## 6. Estado

No hay gestor de estado global (ADR-004).

- Estado local con `useState`/`useTransition`: filtros de servicios y
  productos, menú móvil, acordeón de FAQ.
- Único estado compartido: la instancia de Lenis (`LenisContext`).
- Contenido: estático, en `src/data/`.

## 7. Errores

- `react-error-boundary` en dos niveles (`BR-019`):
  - `RouteErrorBoundary` envuelve el `<Outlet />` del `Layout`: cubre
    todas las rutas (incluida la home) con un solo boundary y un
    `Suspense`; navbar y footer siguen funcionando si una página falla;
    se reinicia al cambiar de ruta. Fallback: `PageError` con
    "Reintentar" y "Volver al inicio".
  - Global en `App.tsx` con `CatastrophicError`, para errores fuera de
    las páginas (router, Lenis, layout).
  - Un único `reportError` registra los errores (hoy en consola).
- Recuperación de chunks (`BR-020`, `src/utils/chunkRecovery.ts`): ante
  `vite:preloadError` recarga una vez; si vuelve a fallar en 10 s, el
  error llega al `RouteErrorBoundary`. Depende de que `vercel.json`
  responda 404 a los assets inexistentes (`BR-002`).

## 8. SEO

- `SEOHelmet` por página (título, descripción, OG, Twitter, canonical).
- `index.html` trae metadatos base y JSON-LD (`HairSalon`, `ItemList` de
  servicios, `FAQPage`).
- `public/sitemap.xml` y `public/robots.txt`.
- **Gap:** JSON-LD con país, código postal y coordenadas incorrectos,
  imagen inexistente y FAQ duplicado a mano; sitemap sin `/nosotros` ni
  `/preguntas-frecuentes`; `ProductsPage` sin `SEOHelmet` (`BR-006`).
- **Gap:** SPA sin prerender; los crawlers que no ejecutan JS solo ven los
  metadatos de la home (`BR-034`, spike).

## 9. Decisiones de arquitectura (ADR)

### ADR-001 — Las reservas se derivan a AgendaPro

- **Contexto:** la barbería ya opera su agenda en AgendaPro. Una reserva
  propia exige backend, disponibilidad en tiempo real, notificaciones y
  datos personales.
- **Decisión (2026-10-12, decisión del usuario):** el sitio deriva toda
  reserva a la URL de AgendaPro de la sucursal. No hay reserva propia en el
  despliegue.
- **Por qué:** cero backend que operar y ningún dato personal que proteger.
  El sitio sigue siendo estático.
- **Consecuencia:** no se incorporan TanStack Query, Zustand, axios ni
  react-hook-form/zod. La URL de AgendaPro vive una sola vez en
  `src/config/` (`BR-005`).
- **Disparador para revisar:** si se decide reemplazar AgendaPro, se abre
  un análisis de requerimientos (skill `analisis-requerimientos`) y se
  retoma el patrón de capas de RadarOP (`*.api.ts` → `*.service.ts` →
  `hooks/` → `components/`, TanStack Query para el estado de servidor,
  Zustand solo para UI).

### ADR-002 — CSS Modules + tokens CSS como único sistema de estilos

- **Contexto:** conviven CSS Modules (lo que realmente pinta),
  Tailwind v4 + shadcn instalados pero sin importar (`src/index.css` no se
  carga) y cuatro fuentes de tokens.
- **Decisión (2026-10-12, decisión del usuario):** el sistema único es
  CSS Modules + tokens CSS en `src/styles/tokens/`. Se retiran Tailwind,
  shadcn, `class-variance-authority`, `tailwind-merge`, `tw-animate-css` y
  los componentes `ui/*` basados en ellos.
- **Por qué:** es lo que funciona hoy; conectar Tailwind antes del
  despliegue cambiaría el aspecto de componentes que hoy no lo usan. Menos
  riesgo y menos dependencias.
- **Consecuencia:** los ~10 consumidores de `components/ui/*` pasan a
  componentes base propios con CSS Modules. Radix se mantiene solo donde
  aporta accesibilidad (tabs) (`BR-021`..`BR-023`).
- **Patrones adoptados de RadarOP:** derivar tonos con `color-mix()`
  (hover, foco, selección), `:focus-visible` global con el color de marca.

### ADR-003 — Despliegue en Vercel

- **Decisión (2026-10-12, decisión del usuario):** producción en Vercel,
  desde `master`; un preview por PR.
- **Por qué:** rewrites SPA, cabeceras y caché declarativos en
  `vercel.json`; Brotli y CDN sin configurar; rollback con un clic.
- **Consecuencia:** `vercel.json` es parte del repo (`BR-002`). Se descarta
  la precompresión Brotli en el build (ex `P013`).

### ADR-004 — Sin gestor de estado global

- **Decisión:** `useState` local y contexto solo para Lenis.
- **Por qué:** no hay estado de servidor ni estado compartido entre rutas
  (ADR-001).
- **Disparador para revisar:** el mismo de ADR-001.

### ADR-005 — Manejo de errores proporcional a lo que puede fallar

- **Contexto:** RadarOP tiene una capa de errores tipada (`AppError`,
  catálogo de códigos y mensajes, normalizador de errores HTTP). Aquí no
  hay llamadas de red propias.
- **Decisión:** se adopta `react-error-boundary` con un `PageError` y una
  404 de marca, más la recuperación de chunks. El catálogo `AppError` se
  difiere.
- **Por qué:** regla del "ya observado dos veces"
  (`engineering-guidelines.md` §3): sin red no hay códigos de error que
  catalogar.
- **Disparador para revisar:** la primera llamada de red propia.

### ADR-006 — Proceso como documentación en el repo

- **Decisión (2026-10-12):** backlog, historias de usuario, casos de uso y
  requisitos viven en `docs/` como Markdown, con IDs `BR-NNN`, `HU-*`,
  `CU-*`, `RF-*`/`RNF-*`. La automatización con Claude Code vive en
  `.claude/` (catálogo en `AGENTS.md`).
- **Origen:** proceso de *Segunda Opinión de Build*, recortado para un
  solo repo y un sitio estático.

### ADR-007 — Analítica opt-in: Vercel Analytics y Google Analytics 4 con consentimiento

> **Estado: decidido por defecto el 2026-10-12 con el usuario ausente; por
> confirmar.**

- **Contexto:** el dueño quiere saber cuántas personas visitan el sitio y
  cuántas tocan "Reservar" (HU-MED-001, HU-MED-002). La reserva ocurre en
  AgendaPro, otro dominio, así que solo se puede medir el clic. Google
  Analytics usa cookies y envía datos a Google: en Chile aplica la Ley
  19.628 (y su actualización, Ley 21.719).
- **Decisión:**
  1. **Vercel Analytics** para visitas y rutas: no usa cookies ni
     identifica personas, no necesita aviso.
  2. **GA4** para eventos de conversión, con **Consent Mode v2 en
     `denied`** por defecto: el script de Google ni siquiera se descarga
     hasta que el visitante acepta.
  3. Ambas son **opt-in por variable de entorno** (`VITE_VERCEL_ANALYTICS`,
     `VITE_GA_MEASUREMENT_ID`). Sin variables, el sitio no carga ni muestra
     nada nuevo. Así el código se puede integrar y desplegar sin activar
     nada, y activarlo es un paso manual del usuario.
  4. El aviso de consentimiento solo existe si GA está configurado;
     "Aceptar" y "Rechazar" con el mismo peso; elección guardada y
     revocable desde el footer.
  5. Eventos sin datos personales: `page_view`, `reserve_click`,
     `whatsapp_click`, `phone_click`.
- **Por qué:** minimiza datos y riesgo legal sin renunciar a medir
  conversiones; el opt-in evita errores 404 en consola si Vercel Analytics
  no está habilitado y mantiene Lighthouse limpio.
- **Alternativas descartadas:** solo GA4 (obliga a aviso para medir
  simples visitas); Plausible o Matomo (más privados, pero otra cuenta y
  otro costo); GA4 sin consentimiento (riesgo legal).
- **Consecuencia:** la CSP suma los orígenes de Google solo para GA
  (`script-src`, `connect-src`, `img-src`), sin `unsafe-inline`. Se agrega
  la página `/privacidad` (borrador sin validar legalmente).
- **A confirmar con el usuario:** si quiere GA4 además de Vercel Analytics;
  quién valida el texto de privacidad; datos del responsable.

### ADR-008 — Contenido editable: hoja de Google leída al construir, con respaldo versionado

> **Estado: decidido por defecto el 2026-10-12 con el usuario ausente; por
> confirmar.**

- **Contexto:** el dueño quiere actualizar servicios, productos, equipo,
  preguntas y textos sin pedir un cambio de código (HU-CNT-001,
  HU-CNT-002). Hoy el contenido está en `src/data/*.ts`. `ADR-001` fija un
  sitio estático sin backend.
- **Decisión:**
  1. El contenido vive en una **hoja de cálculo de Google**, con una
     pestaña por tipo (`servicios`, `productos`, `equipo`, `preguntas`,
     `textos`), **publicada en la web como CSV**: no se usan claves ni
     cuentas de servicio.
  2. La hoja se lee **en el build** (plugin de Vite), no en el navegador:
     el sitio sigue siendo estático, indexable y rápido, y un visitante
     nunca habla con Google Sheets.
  3. Cada pestaña se **valida** con un esquema. Una pestaña inválida, o una
     hoja caída o sin configurar, **cae a un respaldo versionado** en el
     repo (`snapshot`). El build nunca falla por la hoja y nunca escribe en
     el repo.
  4. Los cambios se **publican** disparando un `deploy hook` de Vercel
     (manual, o automático con un Apps Script al editar).
  5. Los identificadores de la hoja son variables **de build** (`CONTENT_*`,
     sin prefijo `VITE_`), no llegan al navegador.
- **Por qué:** conserva `ADR-001`, el SEO y el rendimiento; sin secretos;
  y un error del dueño en la hoja no rompe producción.
- **Alternativas descartadas:**
  - *Leer la hoja desde el navegador:* contenido tardío (CLS, mal SEO), un
    visitante depende de Google y de su cuota, y expone la hoja.
  - *Google Sheets API con cuenta de servicio:* permitiría una hoja
    privada, pero exige un secreto y más configuración; queda como
    evolución si el dueño quiere la hoja privada.
  - *Un CMS (Sanity, Contentful):* más potente, pero otra herramienta y
    otro costo para un contenido pequeño.
- **Consecuencia:** un cambio tarda lo que tarda un build (1-2 minutos). La
  publicación depende de un `deploy hook`. Se agrega la regla "no editar
  a mano el respaldo ni `src/data` del contenido de la hoja" (`CLAUDE.md`).
- **Disparador para revisar:** hoja privada, más de ~200 filas o varios
  editores con permisos distintos → CMS o Sheets API.
- **A confirmar con el usuario:** pestañas y columnas, si la hoja puede
  ser pública, y quién crea el `deploy hook`.

> **Actualización (2026-10-13, decisión del usuario, `BR-047`):** el dueño
> necesita que un cambio en la hoja se vea **sin volver a desplegar**. Se
> elige leer la hoja **también desde el navegador**, además del build. Cambia
> lo decidido arriba así:
>
> - **Punto 2 (cambia):** el build sigue leyendo la hoja y deja ese contenido
>   en el sitio como punto de partida y respaldo. Cuando la página termina de
>   cargar, el navegador vuelve a pedir el CSV y, si responde, muestra lo que la
>   hoja diga (`ContentProvider`). Sin hoja configurada no hace ninguna petición
>   ni baja el código de lectura (se carga con `import()`).
> - **Punto 3 (se mantiene):** la misma validación corre en el navegador. Una
>   pestaña que no responde o no valida conserva el contenido del build; las
>   demás se actualizan.
> - **Punto 4 (ya no hace falta):** publicar un cambio no requiere `deploy
>   hook`. El `deploy hook` sigue sirviendo para renovar el contenido de
>   fábrica del build.
> - **Punto 5 (cambia):** el identificador y los `gid` llegan al navegador
>   (`virtual:site-sheet`). No son un secreto: quien tenga el enlace de una
>   hoja publicada puede leer esas pestañas. El código y la política de seguridad
>   (`connect-src`: `docs.google.com` y `*.googleusercontent.com`) lo permiten
>   solo para `fetch`.
> - **Costos que se aceptan** (eran las razones de descartar esta opción):
>   el contenido puede cambiar unos instantes después de cargar; el sitio
>   depende de Google solo para *refrescar* (si falla, queda el contenido del
>   build); y **todo lo que esté en una pestaña publicada es público**, incluidas
>   las filas con `activo = NO` y cualquier columna o nota de trabajo.
> - **Retraso esperado:** Google publica en cerca de 1 minuto y la respuesta se
>   cachea 5 minutos, así que un cambio se ve en 5 a 6 minutos.
> - **Por confirmar:** si el texto de privacidad debe mencionar que el
>   navegador consulta a Google al cargar el sitio.

### ADR-009 — CSS mobile-first con un conjunto cerrado de cortes

> **Estado: decidido por el usuario el 2026-10-18** (`BR-024`).

- **Contexto:** el sitio se escribió desde escritorio. Hay 31 bloques
  `max-width` de ancho en 32 archivos CSS, con cortes en 640, 767, 768, 968,
  1024, 1200 y 1600 px, y `min-width: 768px` choca con `max-width: 768px`
  justo a 768 px. En TypeScript, las media queries se repiten como texto en
  cinco archivos y una no reacciona al rotar la pantalla. Lo encontró la
  auditoría responsive del 2026-10-18 (`docs/handoff-movil-2026-10-18.md`).
- **Decisión:**
  1. **Mobile-first:** la base de cada módulo es el móvil, sin `@media`, y
     cada corte suma estilos con `min-width`. Nunca `max-width` de ancho.
  2. **Conjunto cerrado:** `640`, `769` (escritorio, el corte principal),
     `1025` y `1280` px de ancho, y `720` px de alto, este último solo junto a
     769 para las escenas fijas.
  3. En CSS, los cortes se escriben como literal (las variables no
     funcionan dentro de `@media`). En TypeScript, salen de `MEDIA`
     (`src/config/breakpoints.ts`) y se leen con `useMediaQuery`.
  4. `src/styles/breakpoints.test.ts` lo hace cumplir (`RNF-MANT-004`).
     Durante la migración (`BR-080` a `BR-083`) llevó una lista de archivos
     pendientes que solo podía achicarse; ya quedó vacía y se quitó.
  5. Lo que solo existe en móvil y no se puede deshacer desde un bloque de
     escritorio (un `!important` sobre un estilo de framer, o reglas que
     pisan las de otra sección) no va en una media query: lo decide el
     componente con `useMediaQuery(MEDIA.…)` y una clase o un estilo que
     solo existen en móvil (`CardCarousel`, `AnimatedGridSection`, `CTA1`,
     `Hero`).
  6. Fuera de la regla: las listas `sizes` de las imágenes, que eligen qué
     archivo descargar, y las media queries de preferencias (`hover`,
     `prefers-reduced-motion`, `print`).
- **Por qué:** el usuario no quiere que la deuda se enrede más. La mayoría de
  las visitas de una barbería llegan desde el celular, y una sola regla con
  su test evita que vuelvan los cortes sueltos.
- **Alternativa descartada (2026-10-18):** cerrar el conjunto de cortes
  sin reescribir lo existente, y escribir mobile-first solo en el código
  nuevo. Era más barata, pero dejaba los dos estilos mezclados por tiempo
  indefinido.

## 10. Deuda conocida y diferida

| Tema | Estado | Ticket |
|---|---|---|
| Unas 1000 líneas de código muerto (hooks de rendimiento, `ScrollProgressContext`, `SmoothParallax`, `Button` propio, `Services`) | Abierta | `BR-025` |
| Datos del negocio inconsistentes o de ejemplo (teléfono, email, horarios, redes) | Abierta, bloqueada por datos reales | `BR-005` |
| Imágenes de productos y servicios desde Unsplash | Abierta, bloqueada por fotos reales | `BR-008` |
| ~~`asyncCSSPlugin` difería todo el CSS, incluido el crítico~~ | Cerrada: plugin retirado, CSP sin hashes | `BR-013` |
| Prerender / SSG | Spike | `BR-034` |
| Monitoreo de errores | Diferida | backlog §4 |
| Analítica (Vercel Analytics y GA4) | Planificada, por confirmar (`ADR-007`) | `BR-036`..`BR-038`, `BR-044` |
| Contenido editable desde una hoja | Planificada, por confirmar (`ADR-008`) | `BR-039`..`BR-043` |
| CSS escrito desde escritorio (`max-width`) | En migración a mobile-first (`ADR-009`) | `BR-024`, `BR-080`..`BR-083` |

## 11. Dónde ir para…

| Quiero… | Voy a… |
|---|---|
| Cambiar teléfono, horario, redes o la URL de reserva | `src/config/constants.ts` (fuente única, `RNF-DATOS-001`) |
| Cambiar servicios, productos, equipo o preguntas | La hoja de Google (`ADR-008`) y publicar con el `deploy hook`; mientras no esté conectada, el respaldo del repo |
| Activar o desactivar la analítica | Variables `VITE_VERCEL_ANALYTICS` y `VITE_GA_MEASUREMENT_ID` en Vercel (`ADR-007`) |
| Agregar una página | `src/config/routes.ts` + `src/pages/` |
| Cambiar título o descripción de una página | `ROUTES` en `src/config/routes.ts` |
| Agregar un servicio, barbero, producto o pregunta | `src/data/` |
| Cambiar un color, espaciado o radio | `src/styles/tokens/` |
| Adaptar un componente a otro ancho de pantalla | Base móvil y `@media (min-width: …)` con los cortes de `ADR-009`; en TypeScript, `useMediaQuery(MEDIA.…)` de `src/config/breakpoints.ts` |
| Ajustar una animación de entrada o un parallax | `src/config/animations.config.ts` |
| Cambiar cabeceras, redirecciones o caché | `vercel.json` |
| Proponer trabajo nuevo | skill `nuevo-ticket` o `analisis-requerimientos` |
| Saber si algo ya está decidido | §9 de este documento |
