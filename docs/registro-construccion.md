# Registro de construcción — barber-royce

Bitácora de **cómo** se construyó cada ticket: qué se implementó, archivos
tocados, decisiones de implementación, qué fue test-first y el estado de la
verificación al cierre. La ficha del [`backlog.md`](./backlog.md) es
planificación y solo apunta aquí.

Formato de cada entrada:

```markdown
<a id="br-nnn"></a>

## BR-NNN — <título del ticket>

**Notas de construcción (AAAA-MM-DD):**
- Qué se implementó y archivos tocados.
- Decisiones de implementación (y alternativas descartadas).
- Test-first o test-after, y por qué.
- Verificación: lint, build, tests, preview (URL), Lighthouse si aplica.
```

---

<a id="br-001"></a>

## BR-001 — Ordenar la documentación y el proceso de trabajo

**Notas de construcción (2026-10-12):**
- Análisis previo con tres subagentes: este repo, el frontend de RadarOP
  (`D:\UCN\capstone\frontend`: estado, errores, estilos, efectos) y
  *Segunda Opinión de Build* (backlog, HU, CU, RF/RNF, estándares, skills y
  agentes).
- Decisiones del usuario: reservas en AgendaPro (ADR-001), CSS Modules +
  tokens (ADR-002), Vercel (ADR-003), migrar y archivar los documentos
  anteriores, y catálogo formal de RF/RNF.
- Creados: `docs/engineering-guidelines.md`, `architecture.md`,
  `backlog.md`, `registro-construccion.md`, `historias-usuario.md`,
  `casos-uso.md`, `rf-rnf-catalogo.md`, `archivo/README.md`; `CLAUDE.md`,
  `AGENTS.md`; `.claude/skills/` y `.claude/agents/`;
  `.github/pull_request_template.md`.
- Movidos con `git mv` a `docs/archivo/`: los 8 Markdown de la raíz y las 3
  guías `.tsx` (a `docs/archivo/guias-codigo/`).
- `eslint.config.js`: `docs` en `globalIgnores`. Efecto: el lint pasa de 20
  a 8 errores (los restantes son de `BR-004`).
- De SOB **no** se trajo: catálogo RF/RNF con fichas individuales, DDD y
  hexagonal, prefijos dobles, handoffs por fase, auditores de dominio.
- De RadarOP **no** se trae (por ADR-001 y ADR-002): MUI, TanStack Query,
  Zustand, axios, `AppError` completo.
- Test: no aplica (solo documentación y configuración de ESLint).
- Pendiente para cerrar: revisión del usuario, commit y PR.

---

<a id="br-004"></a>

## BR-004 — Dejar `npm run lint` sin errores

**Notas de construcción (2026-10-12):**
- `LenisContext` partido en tres archivos para cumplir
  `react-refresh/only-export-components`:
  `src/contexts/lenisContextValue.ts` (contexto y tipo),
  `src/contexts/LenisContext.tsx` (solo `LenisProvider`) y
  `src/hooks/useLenisContext.ts` (`useLenisInstance`, `useLenisReady`,
  `useRefreshLenis`). Los 5 consumidores cambian solo el import.
- `setState` síncrono en el efecto: el Provider guarda qué instancia ya
  se inicializó (`readyLenis`) y deriva `isReady` comparándola con la
  actual. Mismo comportamiento: `false` hasta 100 ms después de tener
  instancia, y `false` si la instancia pasa a `null`.
- Se elimina `useLenisContext` (lanzaba si no había instancia; sin
  consumidores).
- `ui/button.tsx` y `ui/tabs.tsx` dejan de exportar `buttonVariants` y
  `tabsListVariants` (sin consumidores externos). Se retiran del todo en
  `BR-023`.
- Eliminados por código muerto (adelanta parte de `BR-025`):
  `ScrollProgressContext.tsx`, `useScrollProgressHooks.ts` y
  `SmoothParallax.tsx`, su único consumidor, que nadie importa.
- Test: no aplica (refactor sin cambio de comportamiento; no hay runner
  hasta `BR-030`).
- Verificación: `npx eslint . --max-warnings=0` sin errores, `tsc -b`
  limpio y `npm run build` OK. Pendiente: recorrer la home en el preview
  (Hero depende de `useLenisReady`).

---

<a id="br-003"></a>

## BR-003 — Página 404 con identidad de marca

**Notas de construcción (2026-10-12):**
- `src/pages/NotFoundPage.tsx` + `NotFoundPage.module.css`, cargada con
  `lazy()` en una ruta `path="*"` dentro del `Layout` (navbar y footer
  visibles), con su `ErrorBoundary` y `Suspense` como las demás rutas.
- Contenido: "404" con franjas de poste de barbero (rojo de marca y
  blanco) que se desplazan, título, texto en tuteo, "Volver al inicio"
  (`<Link>`) y "Reservar hora" (`<a>` a AgendaPro con
  `rel="noopener noreferrer"` y aviso de pestaña nueva para lectores de
  pantalla). Idea adaptada del barrido de radar de la 404 de RadarOP.
- `<title>` propio y `<meta name="robots" content="noindex">` con
  `Helmet` directo: no usa `SEOHelmet` porque una 404 no lleva canonical.
- Estilos solo con tokens existentes (`--color-background-inverse`,
  `--color-white`, `--color-accent-500`, espaciado, tipografía, radio) y
  `color-mix()`. Con `prefers-reduced-motion: reduce` no hay animaciones.
- Nueva constante `BOOKING` en `src/config/constants.ts` con la URL de
  AgendaPro. Por ahora solo la usa la 404; `BR-005` migra ahí los otros 4
  CTAs.
- Test: pendiente de `BR-030` (no hay runner). Queda como criterio
  abierto del ticket.
- Verificación: `eslint --max-warnings=0` y `npm run build` OK (chunk de
  0,74 KB gzip). Pendiente: revisar `/no-existe` en el navegador y en el
  preview de Vercel (`BR-002`).

---

<a id="br-002"></a>

## BR-002 — Configurar Vercel: rewrite SPA, cabeceras de seguridad y caché

**Notas de construcción (2026-10-12):**
- `vercel.json` en la raíz:
  - `framework: vite`, `npm run build`, salida `dist`.
  - Rewrite `/((?!assets/).*)` → `/index.html`. Vercel sirve primero los
    archivos que existen (`robots.txt`, `sitemap.xml`, favicons). Lo que
    está bajo `/assets/` queda **fuera** del rewrite a propósito: un chunk
    que ya no existe tras un redeploy responde 404 real en lugar de
    `index.html` con tipo HTML, y eso es lo que `BR-020` necesita detectar.
  - Cabeceras en todo el sitio: CSP, HSTS (2 años, `preload`),
    `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y
    `X-Frame-Options: DENY` (junto a `frame-ancestors 'none'`, para
    navegadores viejos).
  - `/assets/*` con `Cache-Control: public, max-age=31536000, immutable`
    (los nombres llevan hash).
- CSP armada desde el inventario real de orígenes (`src/` e `index.html`):
  - `script-src 'self' 'unsafe-hashes' 'sha256-1jAm…'`: el `asyncCSSPlugin`
    de `vite.config.ts` agrega `onload="this.onload=null;this.rel='stylesheet'"`
    a cada `<link>` de CSS; sin ese hash la CSP bloquearía el handler y **el
    CSS no se aplicaría nunca**. Se evitó `'unsafe-inline'`. Acoplamiento
    anotado en `BR-013`.
  - `style-src 'unsafe-inline'`: framer-motion y React escriben estilos
    inline; el riesgo de inyección de estilos es bajo en un sitio sin
    contenido de usuarios.
  - `img-src` incluye `images.unsplash.com` solo mientras exista
    `BR-008`; se quita al cerrarlo.
  - `frame-src` para el embed de Google Maps.
  - Los bloques JSON-LD (`type="application/ld+json"`) no se ejecutan y la
    CSP no los afecta.
- Hallazgo: el mapa de Coquimbo apunta a Bogotá → agregado a `BR-005`.
- Test: no aplica (configuración del hosting); se verifica con
  CP-CONF-001 y CP-SEG-001 contra el preview.
- Verificación local: JSON válido y patrón del rewrite probado con
  `/servicios`, `/no-existe`, `/` (reescriben) y `/assets/js/x.js` (no
  reescribe). **Pendiente:** conectar el repo en Vercel (lo hace el
  usuario con su cuenta), y en el preview recargar las 7 rutas, revisar
  `curl -I`, securityheaders.com y la consola sin violaciones de CSP.

**Cierre BR-001..BR-004 (2026-10-12):** integrados a `master` (PR #3 y
PR #7; los PR #4..#6 del stack se cerraron al borrar la rama base y su
contenido se integró sin cambios en el #7). Verificado en producción
(`https://barber-royce.vercel.app`) con `curl`: las 7 rutas y una
inexistente responden 200 con la app; `robots.txt` y `sitemap.xml` se
sirven como archivos; 6 de 6 cabeceras de seguridad; `/assets/*` con
caché inmutable; un chunk inexistente responde 404; el `onload` del CSS
servido coincide con el hash de la CSP; el chunk de `NotFoundPage` está
publicado. Queda a cargo del usuario la revisión visual (home, 404 y
consola sin violaciones de CSP).

---

<a id="br-030"></a>

## BR-030 — Vitest y Testing Library con los primeros tests

**Notas de construcción (2026-10-12):**
- Dependencias de desarrollo: `vitest` 3.2, `@vitest/coverage-v8`,
  `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`,
  `@testing-library/user-event`. Scripts `test`, `test:run` y
  `test:coverage`.
- `vitest.config.ts` propio: no hereda los plugins de build de
  `vite.config.ts` (optimización de imágenes, CSS asíncrono). Alias `@/`,
  entorno `jsdom`, CSS Modules sin hash para poder consultar clases.
- `src/test/setup.ts` (jest-dom + `cleanup`) y
  `src/test/renderWithProviders.tsx` (router en memoria y un contexto de
  Helmet nuevo por render, para que los tests no compartan `<title>`).
- Tests iniciales:
  - `src/pages/NotFoundPage.test.tsx`: cierra el criterio de test de
    `BR-003` (ruta comodín, enlace al inicio, reserva con `target` y
    `rel` seguros, y que no aparece en una ruta existente).
  - `src/config/routes.test.ts`: paths únicos y absolutos, títulos y
    descripciones presentes y distintos (CP-SEO-001), navbar y footer
    desde `ROUTES`.
  - El test de enlaces externos sin `rel` se escribe en `BR-007` y el de
    datos del negocio en `BR-005`: hoy fallarían, y sus tickets son los
    que los dejan en verde.
- Cobertura: línea base 4,19 % de sentencias, 19,23 % de ramas, 16,88 % de
  funciones. Umbral fijado en 4/19/16/4, redondeado hacia abajo; solo
  sube (`RNF-MANT-002`).
- `coverage/` ignorado en Git y en ESLint.
- Verificación: 7 tests en verde, `eslint --max-warnings=0`, `tsc -b` y
  `npm run build` OK.

---

<a id="br-029"></a>

## BR-029 — CI en GitHub Actions

**Notas de construcción (2026-10-12):**
- `.github/workflows/ci.yml`: en `push` a `master` y en todo
  `pull_request`. Un job (`verificacion`), un paso por comando: `npm ci`,
  `eslint --max-warnings=0`, `tsc -b`, `test:coverage` (con el umbral de
  `BR-030`), `build` y `npm audit --omit=dev --audit-level=high`.
  `concurrency` cancela corridas viejas de la misma rama; permisos de solo
  lectura; `timeout-minutes: 15`.
- `.nvmrc` con Node 24 (la versión local), usado por `setup-node`.
- `npm audit fix` sin `--force`: Vite pasa de 7.3.1 a 7.3.7 y corrige 8
  vulnerabilidades altas del servidor de desarrollo. Aparecían en el
  árbol de producción porque `@tailwindcss/vite` está en `dependencies`
  (se retira en `BR-023`). Producción queda con 0 vulnerabilidades; las
  que restan son de herramientas de desarrollo (Lighthouse CI, Vitest) y
  el CI no las audita.
- El despliegue no está en el workflow: lo hace Vercel.
- **CP-OPS-002 (2026-10-12):** un PR temporal (#10) con un error de tipos
  dejó el check en rojo en el paso "Tipos"
  (`src/ciRoto.ts(1,14): error TS2322`). Se cerró sin integrar y se borró
  su rama.
- Protección de `master` (pedida por el usuario el 2026-10-12): exige el
  check "Lint, tipos, tests y build" y la rama al día para integrar.

---

<a id="br-019"></a>

## BR-019 — Error boundaries con `react-error-boundary` y `PageError`

**Notas de construcción (2026-10-12):**
- Dependencia nueva: `react-error-boundary` (patrón de RadarOP; ADR-005).
- `src/components/common/ErrorBoundary/`:
  - `RouteErrorBoundary.tsx`: `ErrorBoundary` + `Suspense` con
    `resetKeys={[pathname]}`. Va en el `Layout`, alrededor del
    `<Outlet />`.
  - `PageError.tsx` + `.module.css`: `role="alert"`, texto en tuteo, sin
    el mensaje técnico, "Reintentar" (`resetErrorBoundary`, sin recargar)
    y "Volver al inicio". Estilos con tokens; las acciones repiten las de
    `NotFoundPage` (segundo uso observado → se unifican en un `Button`
    base en `BR-023`).
  - `reportError.ts`: único punto de registro (consola). Ahí se conecta un
    monitoreo futuro.
  - Eliminados el `ErrorBoundary` de clase, `ErrorFallback` (usaba el
    `Button` de shadcn sin estilos) y su CSS.
- `App.tsx`: boundary global de `react-error-boundary` con
  `CatastrophicError`; las 8 rutas quedan como elementos simples, sin los
  bloques repetidos de `ErrorBoundary` + `Suspense` (de ~125 a ~55
  líneas). Ayuda a `BR-026`.
- Decisión: un solo boundary de páginas en el `Layout` en lugar de uno
  por ruta. Mismo aislamiento (navbar y footer quedan fuera), cubre la
  home, que antes no tenía, y una ruta nueva queda protegida sin tener
  que acordarse.
- Test-first del comportamiento en `RouteErrorBoundary.test.tsx` (5
  casos): fallback con navbar visible, sin mensaje técnico, registro del
  error, "Reintentar" recupera la página y navegar a otra ruta limpia el
  error.
- Cobertura: 5,91 / 23,68 / 20,77 / 5,91 → umbral 5/23/20/5.
- Verificación local: 12 tests, lint, tipos y build OK. Pendiente: forzar
  un error en el preview para verlo en el navegador.
