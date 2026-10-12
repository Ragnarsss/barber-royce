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
| Imágenes | `sharp` (`scripts/optimize-images.js`) + `vite-plugin-image-optimizer` |
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
  contexts/               LenisContext
  hooks/                  Lenis, scroll, parallax
  data/                   contenido estático del negocio
  types/                  tipos
  styles/                 global.css, reset.css, tokens/
  assets/                 imágenes originales + optimized/ (AVIF/WebP)
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
- **Gap:** los breakpoints no son coherentes (768, 968, 1024, 640, 1200,
  1600; mezcla de `max-width` y `min-width`) (`BR-024`).

## 5. Animación y scroll

- **Lenis** da el scroll suave. Se crea en `useLenis()` (llamado en
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
5. Nadie lee `window.lenis`: se usa el contexto.

- **Gap:** hoy `useLenisScroll` hace `setState` por scroll (re-render a
  ~60 fps en 4 componentes), `useLenis` observa todo `document.body` con
  un `MutationObserver`, `useParallaxLayers` crea 12 transforms por
  sección, y el parallax ignora `prefers-reduced-motion` (`BR-014`..`BR-017`).

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
- **Gap:** no hay recuperación ante un chunk viejo tras un redeploy
  (`BR-020`).

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

## 10. Deuda conocida y diferida

| Tema | Estado | Ticket |
|---|---|---|
| Unas 1000 líneas de código muerto (hooks de rendimiento, `ScrollProgressContext`, `SmoothParallax`, `Button` propio, `Services`) | Abierta | `BR-025` |
| Datos del negocio inconsistentes o de ejemplo (teléfono, email, horarios, redes) | Abierta, bloqueada por datos reales | `BR-005` |
| Imágenes de productos y servicios desde Unsplash | Abierta, bloqueada por fotos reales | `BR-008` |
| `asyncCSSPlugin` aplica carga diferida a todo el CSS, incluido el crítico | Abierta | `BR-013` |
| Prerender / SSG | Spike | `BR-034` |
| Analítica y monitoreo de errores | Diferida | backlog §4 |

## 11. Dónde ir para…

| Quiero… | Voy a… |
|---|---|
| Cambiar teléfono, horario, redes o la URL de reserva | `src/config/constants.ts` (fuente única, `RNF-DATOS-001`) |
| Agregar una página | `src/config/routes.ts` + `src/pages/` |
| Cambiar título o descripción de una página | `ROUTES` en `src/config/routes.ts` |
| Agregar un servicio, barbero, producto o pregunta | `src/data/` |
| Cambiar un color, espaciado o radio | `src/styles/tokens/` |
| Ajustar una animación de entrada o un parallax | `src/config/animations.config.ts` |
| Cambiar cabeceras, redirecciones o caché | `vercel.json` |
| Proponer trabajo nuevo | skill `nuevo-ticket` o `analisis-requerimientos` |
| Saber si algo ya está decidido | §9 de este documento |
