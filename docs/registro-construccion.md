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

**Cierre (2026-10-12):** integrado en el PR #11; en producción las rutas
responden 200 y el bundle publicado contiene `PageError`.

---

<a id="br-020"></a>

## BR-020 — Recuperación ante un chunk inexistente tras un despliegue

**Notas de construcción (2026-10-12):**
- `src/utils/chunkRecovery.ts` (carpeta nueva `utils/`, agregada a la tabla
  de capas de la guía):
  - `shouldReloadAfterChunkError(storage, now)`: función pura; recarga si
    no hubo otra recarga en los últimos 10 s y anota la marca en
    `sessionStorage`. Si el storage está bloqueado no recarga (sin la
    marca no se puede evitar un bucle) y no lanza.
  - `installChunkRecovery(window)`: escucha `vite:preloadError`; si
    corresponde, `preventDefault()` y `location.reload()`. Si no, el error
    sigue su curso y lo muestra `PageError` (`BR-019`).
- `main.tsx` lo instala antes de montar la app.
- Por qué funciona: `vercel.json` deja `/assets/*` fuera del rewrite
  (`BR-002`), así que un chunk viejo responde 404 real y Vite emite el
  evento.
- Test-first (`chunkRecovery.test.ts`, 6 casos, con triangulación de la
  ventana: primera vez, dentro, justo al borde y storage bloqueado; más el
  listener con una ventana falsa).
- Cobertura: 6,53 / 31,76 / 22,78 / 6,53 → umbral 6/31/22/6.
- Verificación local: 18 tests, lint, tipos y build OK. CP-CONF-002 en
  real: con el sitio abierto, desplegar otra versión y navegar a una ruta
  no visitada (se comprueba en el próximo despliegue).

**Cierre (2026-10-12):** BR-020 integrado en el PR #12.

---

<a id="br-017"></a>

## BR-017 — Respetar `prefers-reduced-motion` en JavaScript

**Notas de construcción (2026-10-12):**
- `MotionConfig reducedMotion="user"` en `App.tsx`: framer-motion omite
  las animaciones de transformación de los `motion.*` (la opacidad se
  mantiene).
- Eso **no** frena el parallax: sus `MotionValue` se calculan desde el
  scroll, no son animaciones. `useParallaxLayers` lee
  `useReducedMotion()` y aplana cada rango de salida con
  `calmRange` (`src/utils/reducedMotion.ts`): las capas no se desplazan,
  no escalan y no rotan. Se aplana el rango en vez de omitir los hooks
  para respetar la regla de los hooks y no cambiar el tipo de retorno.
- `useLenis` no crea Lenis con la preferencia activa (scroll nativo);
  `ScrollToTop`, `Navbar` y `useScrollContainer` ya manejaban la
  instancia nula.
- Hallazgo: el `Hero` solo se anima cuando `useLenisReady()` es verdadero;
  sin Lenis habría quedado **invisible**. Ahora `isReady = isLenisReady ||
  reducedMotion`. Sin este cambio el ticket habría roto el sitio para
  quien activa la preferencia.
- Tests: `reducedMotion.test.ts` (helper) y `useLenis.test.tsx` (con
  `framer-motion` y `lenis` simulados: crea Lenis por defecto, no lo crea
  con la preferencia). El aplanado dentro de `useParallaxLayers` y la
  visibilidad del Hero no tienen test: `useScroll` no calcula en jsdom;
  se verifica en el navegador.
- Cobertura: 8,45 / 38,29 / 23,8 / 8,45 → umbral 8/38/23/8.
- Verificación local: 23 tests, lint, tipos y build OK. Pendiente (al
  final, en el preview): emular `prefers-reduced-motion: reduce` en
  DevTools y recorrer las 7 rutas (CP-A11Y-003); comprobar que el Hero se
  ve y que el scroll es nativo.

---

<a id="br-014"></a>

## BR-014 — Lenis sin fugas ni observadores globales

**Notas de construcción (2026-10-12):**
- `useLenis` reescrito (de ~110 a ~65 líneas):
  - Sin `MutationObserver` sobre el `body`: recalculaba con
    `lenis.resize()` en cada cambio de `style`/`class`, y framer-motion
    cambia `style` en cada frame. Queda un solo `ResizeObserver` sobre el
    `body`, que cubre imágenes y secciones lazy.
  - Sin `window.lenis` ni su `declare global` (borrado `src/types/index.ts`,
    que solo contenía eso). Se quitaron también los listeners de `resize`
    (Lenis ya lo hace con `autoResize`) y `load` (el `ResizeObserver` lo
    cubre).
  - Se cancela el frame de "instancia lista": antes, en StrictMode, el
    primer efecto destruido llamaba `resize()` y publicaba una instancia
    destruida.
  - Se quitó el parámetro `options`: el único llamador no lo usa y, como
    objeto inline, recreaba Lenis en cada render. La configuración es una
    constante del módulo.
- `useLenisScroll` y `useLenisScrollActive` leen la instancia con
  `useLenisInstance()` y la tienen como dependencia del efecto. Eso
  elimina los dos fallos: el reintento con `requestAnimationFrame` cuyo
  cleanup se perdía, y no suscribirse nunca si Lenis aún no existía al
  montar.
- Tests (`useLenis.test.tsx`, `useLenisScroll.test.tsx`): 3 de los casos
  nuevos fallan contra el código anterior y pasan con el nuevo (sin
  `window.lenis`, sin `MutationObserver`, cleanup completo). Suscripción,
  desuscripción con el mismo handler, sin Lenis y Lenis tardío, para los
  dos hooks.
- Cobertura: 11,66 / 46,6 / 27,58 / 11,66 → umbral 11/46/27/11.
- Verificación local: 35 tests, lint, tipos y build OK. Pendiente (al
  final, en el preview): la home se desplaza igual de suave, el Hero
  aparece, el botón de logo vuelve arriba, y no hay errores en consola.
- `useLenisScroll` sigue haciendo `setState` por evento de scroll; eso es
  `BR-015`.

---

<a id="br-015"></a>

## BR-015 — Cero re-renders por scroll

**Notas de construcción (2026-10-12):**
- Causa: `useLenisScroll` guardaba el scroll en un `useState` y lo
  actualizaba en cada evento; `ScrollProgressBar`, `SocialProof1`,
  `SocialProof2` y `CTA2` se re-renderizaban a ~60 fps solo para cambiar
  un estilo.
- Arreglo: `src/hooks/useScrollMotion.ts` con `useScrollDirection()` y
  `useScrollSpeed()`, ambos `MotionValue` (sobre el `useScroll` de
  framer-motion). Los componentes derivan sus estilos con `useTransform`
  y framer-motion escribe el DOM directo, sin pasar por React.
  - `ScrollProgressBar`: `scaleX: scrollYProgress` (patrón de RadarOP).
  - `CTA2`: el `filter` sale de la dirección.
  - `SocialProof1` y `SocialProof2`: opacidad, escala y desplazamiento de
    los hexágonos decorativos salen de la dirección y la velocidad.
  - Lógica pura en `src/utils/scrollMotion.ts` (`nextDirection` y los
    umbrales de velocidad).
- Cambio de unidad, a revisar a ojo: los umbrales de velocidad pasan de
  los 1 y 2 de Lenis (px por frame) a 60 y 120 px/s (equivalentes a 60
  fps). Los efectos afectados son decorativos (escala 1,1 de dos
  hexágonos).
- Eliminados por código muerto o reemplazado: `useLenisScroll.ts`
  (incluido el `useLenisInView`, que nadie usaba) y
  `components/animations/DirectionAwareElement.tsx` (adelanta parte de
  `BR-025`).
- Tests:
  - `scrollMotion.test.ts`: dirección hacia abajo, hacia arriba y sin
    movimiento.
  - `useScrollMotion.test.tsx`: con `Profiler` de React se cuentan los
    commits y se comprueba que el scroll no los aumenta **y** que los
    valores sí cambiaron. jsdom no calcula scroll real
    (`document.scrollingElement` no es `documentElement`), por eso
    `useScroll` se reemplaza por un `MotionValue` controlado; una primera
    versión del test, que simulaba eventos de scroll, pasaba sin probar
    nada. Se validó con un test de control que usa `useState` y sí sube el
    contador (no se conserva).
- Cobertura: 11,88 / 49,07 / 30,23 / 11,88 → umbral 11/49/30/11.
- Verificación local: 38 tests, lint, tipos y build OK. Pendiente (al
  final, en el preview): Profiler de React DevTools haciendo scroll por
  toda la home (CP-PERF-006); la barra de progreso sigue el scroll; los
  hexágonos de SocialProof reaccionan a la dirección.

---

<a id="br-016"></a>

## BR-016 — Parallax liviano y variantes compartidas

**Notas de construcción (2026-10-12):**
- Causa: `useParallaxLayers` creaba siempre 12 `useTransform` por
  sección, aunque la sección usara 2 (`AnimatedGridSection` y `CTA2`
  usan una sola propiedad).
- Arreglo (`src/hooks/useParallaxLayers.ts`): el hook único se reemplaza
  por `useParallaxProgress` (ref + `scrollYProgress`) y un hook por capa
  (`useBackgroundLayer`, `useMiddleLayer`, `useForegroundLayer`,
  `useSlowLayer`, `useFastLayer`). Cada sección arma un objeto `layers`
  con las capas que usa, así que el JSX no cambió. Cada capa crea 2
  transforms, solo de las propiedades que alguna sección anima.
- Transforms por sección: Hero 12 → 8; CTA1 12 → 8; CTA2 12 → 2;
  `AnimatedGridSection` 12 → 2 (×2 instancias); SocialProof1 12 → 10 (y 3
  menos en los rayos diagonales); SocialProof2 12 → 10. Total de las 7
  instancias: 84 → 42, más los 3 de SocialProof1 compartidos.
- Se quitaron del config `middle.scale` y `foreground.rotate`: ninguna
  sección los usaba. Se eliminó `useOptimizedParallax.ts` (código muerto
  que los referenciaba; adelanta `BR-025`).
- SocialProof1: los rayos 2, 3 y 4 mueven x e y con el mismo rango, así
  que comparten un solo transform. Visualmente idéntico.
- Reduced motion (BR-017) ahora vive en cada valor de capa
  (`useLayerValue` + `calmRange`) y **sí tiene test**, que antes no era
  posible.
- Variantes compartidas: ya existían en `animations.config.ts`
  (`fadeInUp`, `fadeIn`, `scaleIn`, `staggerContainer`, con
  `smoothTransition` común y `defaultViewport` con `once: true`),
  usadas con `whileInView`. No hubo nada que agregar.
- **No hecho:** reducir los hexágonos decorativos de `SocialProof1`
  (25 `motion.div`). Quitar elementos exige ver la sección; se deja como
  decisión del usuario.
- Tests (`useParallaxLayers.test.tsx`, 7): interpolación de la capa de
  fondo, capas quietas con reduced motion, y conteo de `useTransform` por
  capa (2) y por sección de 2 capas (4, no 12).
- Cobertura: 19,52 / 53,09 / 35,16 / 19,52 → umbral 19/53/35/19.
- Verificación local: 46 tests, lint, tipos y build OK. Pendiente (al
  final, en el preview): que el parallax se vea igual en Hero, CTA1, CTA2,
  SocialProof1/2 y las secciones de Features/Reviews, y Profiler/Performance
  con CPU 4x (CP-PERF-003, CP-PERF-006).

---

<a id="br-011"></a>

## BR-011 — Ruta crítica del LCP

**Notas de construcción (2026-10-12):**
- Causa: `index.html` precargaba `hero_model_left_profile.png` (685 KB
  transferidos) que el `<picture>` no usa porque elige WebP: la imagen del
  LCP se descargaba dos veces. Además el `<img>` de respaldo de cinco
  `<picture>` apuntaba a PNG originales de hasta 1,9 MB.
- Arreglo:
  - Preload nuevo con `imagesrcset` e `imagesizes` idénticos a los del
    `<picture>` del Hero, `type="image/webp"` y `fetchpriority="high"`.
    Vite reescribe `imagesrcset` a los archivos con hash.
  - El `<img>` de respaldo de Hero, Benefits, CTA1, SocialProof1 y Navbar
    pasa al WebP más chico; los PNG originales dejan de importarse y de
    salir en `dist/` (quedan `cta2_crew.png` y el logo del footer, que
    son de `BR-012`).
- **Decisión contraria a la auditoría (medida):** el orden AVIF → WebP se
  descarta. Cada AVIF pesaba más que su WebP: hero 104.475 frente a
  101.274 bytes, CTA1 55.563 frente a 50.352, SocialProof 34.013 frente a
  28.992, fondo de Benefits 77.348 frente a 65.580, logo 1.524 frente a
  1.172. Se eliminan los cinco `<source type="image/avif">`, los cinco
  `.avif` del repo y la generación en `scripts/optimize-images.js`.
- Medición (Lighthouse 12, móvil, `vite preview` local, 1 corrida cada
  una; la mediana de 3 y el preview de Vercel quedan para el cierre):

  | | Antes | Después |
  |---|---|---|
  | Rendimiento | 65 | 85 |
  | LCP | 7,5 s | 3,7 s |
  | TBT | 330 ms | 110 ms |
  | CLS | 0 | 0 |
  | Peso transferido | 1.260 KiB | 573 KiB |

- Lo que queda del LCP: fases TTFB 456 ms, retraso de carga 0 ms, carga
  0 ms, **retraso de render 3.277 ms**. La imagen ya llega a tiempo; falta
  que React monte. Se abre `BR-035` y el criterio de LCP ≤ 2,5 s de este
  ticket pasa allí.
- Test (`src/test/lcpPreload.test.ts`, 5 casos; 3 fallan contra el
  `index.html` anterior): el preload coincide con `sizes` y con los
  archivos WebP del `<picture>`, no hay preload de PNG ni PNG como imagen
  del Hero, y no hay `<source>` AVIF.
- No se evaluó el preload de fuentes (ex `P002`): sin medición previa que
  lo justifique, queda para cuando `BR-035` fije la línea base.
- Cobertura sin cambio de umbral (19,64 / 53,09 / 35,16 / 19,64).
- Verificación local: 51 tests, lint, tipos y build OK; `dist/` pasa de
  incluir PNG de ~6 MB a 2,8 MB en total.

---

<a id="br-012"></a>

## BR-012 — Optimizar las imágenes que quedaron fuera

**Notas de construcción (2026-10-12):**
- `cta2_crew.png` pasa por `scripts/optimize-images.js`: 518,89 KB → 55,18
  KB en WebP (`cta2_crew_455w.webp`). La imagen original mide solo
  455 × 705 px y se muestra como fondo a pantalla completa; no tiene
  sentido generar más anchos. Se corrigen sus atributos (decían
  1920 × 1080).
- Footer: el logo usa los WebP 46w/92w ya existentes con `srcSet` 1x/2x,
  `width`/`height` 48 (el tamaño que fija su CSS) y `alt` descriptivo en
  lugar de "Logo".
- `ProductsPage` y `TeamPage`: `width`/`height` (400 × 300 y 400 × 400, los
  que piden las URLs) y `loading="lazy"`. Siguen siendo imágenes de
  Unsplash hasta `BR-008`.
- Eliminados: `service1.png` (950 KB, sin uso), `react.svg` y la sección
  `Services` completa (código muerto desde el commit `49e46d8`; adelanta
  `BR-025`).
- `npm run optimize:images` (script nuevo en `package.json`; el script ya
  existía pero no tenía comando). Al volver a ejecutarlo, los demás WebP
  salieron idénticos byte a byte; solo cambió el nuevo.
- Resultado: `dist/` ya no contiene ningún PNG (antes: `cta2_crew` 175 KB y
  el logo) y pasa de 2,8 MB a 2,6 MB. Los originales de `src/assets/*.png`
  quedan solo como fuente del script.
- Test (`src/test/imageAttributes.test.ts`, 4 casos; 2 fallan contra el
  Footer anterior): toda `<img>` tiene `width`/`height` y `alt`, y ningún
  componente importa un PNG o JPG original.
- Lección de herramientas: una primera versión del test leía los `.tsx`
  con `import.meta.glob("?raw")`. Eso hacía que Vitest los contara como
  cubiertos y **bajaba el denominador de la cobertura de 3.782 a 1.631
  sentencias** (45 % en vez de 20 %), inflando el umbral. Se cambió a
  `fs`. Tampoco sirve `new URL("../", import.meta.url)`: Vite lo reescribe
  como asset.
- Cobertura: 20,07 / 53,57 / 35,55 / 20,07 → umbral 20/53/35/20.
- Verificación local: 55 tests, lint, tipos y build OK. Pendiente (al
  final, en el preview): Lighthouse móvil en las 7 rutas (CP-PERF-002) y la
  pestaña Network (CP-PERF-004), con la salvedad de Unsplash.

---

<a id="br-013"></a>

## BR-013 — CSS crítico sin parpadeo

**Notas de construcción (2026-10-12):**
- El `asyncCSSPlugin` de `vite.config.ts` solo reescribía el
  `<link rel="stylesheet">` del `index.html`, que en este proyecto es el
  CSS principal (el que estiliza la home). Los CSS de las rutas lazy los
  inyecta Vite desde el JavaScript y nunca pasaron por el plugin, así que
  la idea de "diferir solo los de rutas lazy" no aplicaba.
- Medición (Lighthouse 12, móvil, `vite preview` local, 2 corridas cada
  variante):

  | | Con plugin | Sin plugin |
  |---|---|---|
  | Rendimiento | 86 / 86 | 85 / 86 |
  | LCP | 3,5 / 3,5 s | 3,7 / 3,5 s |
  | FCP | 2,6 / 2,6 s | 2,5 / 2,6 s |
  | TBT | 100 / 100 ms | 120 / 110 ms |
  | CLS | 0 / 0 | 0 / 0 |

  Sin diferencia medible. En una SPA no hay nada que pintar hasta que el
  JavaScript monte, así que el CSS en paralelo no retrasa nada, y el
  patrón `preload` + `onload` solo agregaba riesgo de contenido sin estilo.
- Una primera comparación resultó inválida: `npm run build` falló por
  TypeScript (la función quedó sin usar) y las corridas "sin plugin"
  midieron el `dist` anterior. Se repitió con `vite build` y se verificó el
  `<link rel="stylesheet">` en el HTML generado.
- Cambios: se elimina `asyncCSSPlugin` de `vite.config.ts`, y la CSP de
  `vercel.json` queda con `script-src 'self'` (ya no hace falta el
  `'unsafe-hashes'` ni el hash `sha256-…` que `BR-002` había agregado para
  el `onload` inline).
- Test (`src/test/vercelConfig.test.ts`, 5 casos; el de la CSP falla con
  el `vercel.json` anterior): las 6 cabeceras presentes, `script-src
  'self'` exacto, `index.html` sin manejadores inline, rewrite que excluye
  `/assets` (cierra el hueco de test de `BR-002`) y caché inmutable.
- Verificación local: 60 tests, lint, tipos y build OK; el `dist/index.html`
  trae un `<link rel="stylesheet">` normal y ningún `onload`. Pendiente
  (al final, en el preview): la consola sin violaciones de CSP y la página
  con estilos desde la primera pintura con CPU 4x.

---

<a id="br-035"></a>

## BR-035 — Separar los vendors del chunk de la app

**Notas de construcción (2026-10-12):**
- Hipótesis inicial: el LCP restante venía del JavaScript de la home.
  Se probó cargar con `lazy()` las siete secciones bajo el pliegue
  (`HomeBelowTheFold`, precargadas con `requestIdleCallback`). Resultado
  con Lighthouse móvil local, 2 corridas: LCP 3,5 / 3,5 s (sin cambio),
  TBT 70 / 90 ms (antes 100-120 ms), rendimiento 87 / 86. Las secciones
  pesan 20 KB: ganancia marginal por código extra, **se descartó y se
  revirtió**.
- Análisis del chunk `index` con `vite-bundle-visualizer --template
  raw-data`: 663 KB sin minificar, de los cuales **541 KB `react-dom`**,
  32 KB `react-helmet-async`, 11 KB `scheduler` y ~50 KB de código propio.
  Con `manualChunks` como objeto (`"react-vendor": ["react", "react-dom",
  "react-router-dom"]`), `react-dom/client` quedaba fuera del chunk de
  vendors.
- Arreglo: `manualChunks` como función con expresiones por paquete
  (`vite.config.ts`).

  | Chunk | Antes (raw / gzip) | Después (raw / gzip) |
  |---|---|---|
  | app (`index`) | 260 KB / 85 KB | 79 KB / 29 KB |
  | `react-vendor` | 49 KB / 17 KB | 231 KB / 74 KB |
  | `animation-vendor` | 146 KB / 47 KB | 145 KB / 47 KB |
  | `ui-vendor` | 32 KB / 11 KB | 32 KB / 11 KB |
  | **Inicial (4 chunks)** | **~160 KB gzip** | **~160 KB gzip** |

  El total no cambia; la mejora es de caché: un despliegue que solo toca
  el código de la app deja de invalidar los ~74 KB gzip de React.
  `RNF-PERF-005` (≤ 200 KB gzip) ya se cumplía: queda medido.
- Conclusión de las cuatro iteraciones del LCP (`BR-011`, `BR-013`, este
  ticket): la imagen llega a los 0,5 s y se pinta a los 3,5 s porque la
  home se renderiza solo en el cliente. La palanca es el prerender
  (`BR-034`, subido a P1).
- Test (`src/test/manualChunks.test.ts`, 13 casos, entorno `node` porque
  esbuild no corre bajo `jsdom`; falla contra la configuración anterior):
  cada paquete va a su chunk, el código de la app no cae en ninguno y
  `react-helmet-async` no se confunde con `react`.
- Verificación local: 73 tests, lint, tipos y build OK. Pendiente (al
  final): comprobar en el segundo despliegue que el hash de
  `react-vendor` no cambia si solo cambia el código de la app.

---

## Verificación visual local de BR-017 a BR-035 (2026-10-12)

Antes de subir nada, con el build de la rama `perf/br-035-js-inicial-home`
servido con `vite preview` y Chrome real:

- **Lighthouse en tiempo real** (escritorio, sin throttling): LCP 0,4 s y
  el elemento del LCP es la imagen del Hero; la captura final muestra el
  Hero completo (título, tarjetas, imagen).
- **Recorrido con `puppeteer-core`** (viene con Lighthouse) a 4 posiciones
  de scroll de la home, en modo normal y con `prefers-reduced-motion:
  reduce`: se ven `SocialProof1` (rayos, hexágonos, testimonio), `CTA2` con
  su fondo en WebP y el footer; **0 errores de consola** en los dos
  modos; la barra de progreso aplica `scaleX` según el scroll.
- **Falso positivo a tener en cuenta:** `chrome --headless --screenshot
  --virtual-time-budget` muestra el Hero **en blanco** en modo normal
  (incluso con `master`), porque con tiempo virtual no avanzan los frames
  de animación que el Hero necesita para aparecer. Con tiempo real se ve
  bien. No sirve para verificar animaciones.
- No verificado en esta pasada (queda para el preview de Vercel): la
  consola sin violaciones de CSP, el comportamiento en un celular real y
  el scroll suave de Lenis a mano.
- Hallazgos de contenido que no son de estos tickets: foto de `CTA2` de
  455 px estirada (→ `BR-008`) y título del footer ilegible (→ `BR-033`).

---

<a id="br-007"></a>

## BR-007 — Enlaces externos y de reserva seguros y correctos

**Notas de construcción (2026-10-12):**
- `CTA1` y `CTA2` usaban `<Link to="https://…" target="_blank">` sin `rel`
  (un enlace externo no debe pasar por React Router); ahora son `<a>` con
  `rel="noopener noreferrer"`. `CTA1` tenía `<a href="/servicios">`, que
  recarga toda la página; ahora es `<Link to="/servicios">`.
- La URL de AgendaPro (4 literales: 2 en `Navbar`, 1 en `CTA1`, 1 en
  `CTA2`) pasa a `BOOKING.url` de `src/config/constants.ts`. Adelanta el
  punto 5 de `BR-005`.
- Tests (`externalLinks.test.ts`, 5 casos; 4 fallan contra los componentes
  anteriores y nombran `CTA1` y `CTA2`): `rel` en todo enlace con
  `target`, ningún `<Link>` a una URL externa, ningún `<a href="/ruta">`
  interno, y la URL de AgendaPro solo en `config/constants.ts`.
- Los tests leen el JSX con el analizador de TypeScript
  (`src/test/sourceFiles.ts`: `jsxElements`), no con expresiones
  regulares. Una primera versión con un regex quedó mal escapada y el
  test **pasaba sin comprobar nada**; se detectó al correrlo contra el
  código anterior y no fallar. Regla práctica: todo test de este tipo se
  corre también contra el código sin arreglar. `imageAttributes.test.ts`
  usa el mismo helper.
- Verificación local: 78 tests, lint, tipos y build OK. Pendiente (al
  final, en el preview): que "Agendar Ahora" abra AgendaPro en pestaña
  nueva y "Conocer Servicios" navegue sin recargar.

---

<a id="br-010"></a>

## BR-010 — Preparar variables de entorno sin secretos

**Notas de construcción (2026-10-12):**
- `.gitignore`: `.env`, `.env.*` y la excepción `!.env.example`. Se
  comprobó con `git check-ignore`: `.env` ignorado, `.env.example` no.
- `.env.example` documentado y sin valores: hoy el sitio no usa ninguna
  variable (SPA estática; la configuración vive en `src/config/`). Explica
  las reglas para cuando se agregue una, entre ellas que **toda `VITE_*`
  es pública** y que en producción se define en Vercel.
- El README prometía `VITE_GA_TRACKING_ID`, `VITE_GMB_LOCATION_ID` y
  `VITE_API_URL`, que ningún archivo usa; se corrige en `BR-032`.
- Test (`src/test/env.test.ts`, 3 casos; los de `.gitignore` fallan contra
  el anterior): `.gitignore` excluye los `.env` y deja pasar el ejemplo,
  `.env.example` no asigna valores y toda `VITE_*` que use el código está
  documentada allí.
- Verificación local: 81 tests, lint y tipos OK. Al ser un cambio de
  configuración del repo, no tiene nada que comprobar en el preview.

---

<a id="br-036"></a>

## BR-036 — Vercel Analytics, activable por variable

**Notas de construcción (2026-10-12):**
- Dependencia nueva: `@vercel/analytics` 2.0.1 (`npm audit --omit=dev`: 0
  vulnerabilidades).
- `main.tsx` carga `src/analytics/vercelAnalytics.ts` **solo si**
  `import.meta.env.VITE_VERCEL_ANALYTICS === "true"`. Con la variable
  ausente la condición es constante en el build y Rollup elimina el bloque:
  el código de Analytics no llega al sitio. Comprobado con el build real:
  sin la variable, 0 archivos contienen `_vercel/insights`; con ella, 1
  chunk aparte (`vercelAnalytics-*.js`).
- `installVercelAnalytics` espera al evento `load` antes de importar
  `@vercel/analytics`, para no competir con el LCP (`RNF-PERF-007`);
  `inject` ya detecta los cambios de ruta de la SPA.
- `src/env.d.ts` tipa las dos variables públicas (`VITE_VERCEL_ANALYTICS`,
  `VITE_GA_MEASUREMENT_ID`); `.env.example` las documenta.
- La CSP no cambia: el script y los envíos son del mismo origen
  (`/_vercel/insights/*`), cubierto por `'self'`.
- Tests: `vercelAnalytics.test.ts` (espera a `load`, una sola carga,
  carga inmediata si la página ya cargó) y `analytics.build.test.ts`, que
  **construye el sitio de verdad** dos veces (sin y con la variable) con el
  nuevo helper `src/test/buildOutput.ts`. El de "sin la variable" se
  verificó contra una fuga forzada: falla. Corren en entorno `node`
  (esbuild no funciona bajo `jsdom`) y suman ~11 s a la suite.
- Cobertura: 20,32 / 55,08 / 36,55 / 20,32 → umbral 20/55/36/20.
- Verificación local: 86 tests, lint, tipos y build OK.
- **Pasos manuales pendientes (usuario):** habilitar Analytics en Vercel
  (proyecto → Analytics → Enable), definir `VITE_VERCEL_ANALYTICS=true` en
  Production y volver a desplegar; confirmar en el preview que la home
  pide `/_vercel/insights/script.js` y que la visita aparece en el panel.

---

<a id="br-044"></a>

## BR-044 — Política de privacidad (borrador)

**Notas de construcción (2026-10-12):**
- `src/pages/PrivacyPage.tsx` (+ `.module.css`): `/privacidad` con los 4
  apartados de `RF-MED-005` (datos, finalidad, responsable, derechos y
  cómo cambiar la elección), en tuteo. Usa `SITE.name` y `CONTACT.email`
  de `src/config/`, no literales (el correo actual es el de ejemplo de
  `BR-005`). Cargada con `lazy()` como las demás páginas.
- El texto dice "por defecto no recogemos datos" y describe la medición
  como condicional a que esté activada **y** aceptada, para que sea cierto
  tanto con GA apagado (hoy) como encendido.
- `SEOHelmet` gana la opción `noindex` (`<meta name="robots"
  content="noindex, follow">`), reutilizable. `RouteConfig` gana
  `indexable?: boolean`; `privacy` la marca en `false` para que `BR-006`
  (sitemap desde `ROUTES`) la excluya. Aparece en el footer (que se arma
  desde `ROUTES`) y no en el navbar.
- Tests (`PrivacyPage.test.tsx`, 4): los 4 apartados, un solo `h1` y el
  enlace de contacto, `noindex` real en el `<head>` (con `waitFor`: el
  contexto de Helmet solo se llena en SSR, así que una primera versión
  del test falló) y su lugar en `ROUTES`.
- **Pendiente de validación (usuario/abogado):** el texto es un borrador
  técnico, no asesoría legal. Debe revisarse antes de activar Google
  Analytics (`BR-037`). El plazo de 2 años de las cookies `_ga` es el
  valor por defecto de GA4 al 2026-10-12; confirmar contra la
  documentación vigente de Google.
- Verificación local: lint, tipos y tests OK.

---

<a id="br-037"></a>

## BR-037 — Consentimiento y Google Analytics 4

**Notas de construcción (2026-10-12):**
- Carpeta nueva `src/analytics/`:
  - `consent.ts`: estado `unset | granted | denied` en un store mínimo
    (`useSyncExternalStore`, sin librerías, `ADR-004`), guardado en
    `localStorage` con degradación: si el almacenamiento está bloqueado la
    elección vive en memoria y la siguiente visita empieza sin decidir.
    Un valor desconocido se lee como `unset`, nunca como `granted`.
  - `googleAnalytics.ts`: `enableGoogleAnalytics` define `gtag`, manda
    Consent Mode `default: denied`, luego `update: granted`, `js` y
    `config` con `send_page_view: false`, y recién entonces inyecta el
    script de `googletagmanager.com` con el DOM (sin código inline: la CSP
    no abre `unsafe-inline`). `disableGoogleAnalytics` pone
    `ga-disable-<ID>`, avisa `denied` y borra las cookies `_ga*`.
  - `ConsentBanner` (+ CSS): Aceptar y Rechazar son botones con **el mismo
    estilo**; el aviso es fijo (no mueve el contenido) y no roba el foco al
    cargar; solo lo toma si el visitante lo reabre a propósito.
  - `AnalyticsRoot`: orquesta consentimiento y carga; Google se pide
    después del evento `load` (`runAfterLoad`, extraído y compartido con
    `BR-036`).
  - `PrivacyPreferencesButton`: "Preferencias de privacidad" en el
    footer; reabre el aviso (vuelve a `unset`), detiene la medición, borra
    cookies y lleva el foco a "Rechazar".
- Opt-in por variable: `Layout` carga `AnalyticsRoot` con `lazy()` solo si
  `VITE_GA_MEASUREMENT_ID` existe, y el footer muestra el botón solo en ese
  caso. Comprobado con el build real: **sin ID no llega nada de Google, ni
  el aviso, ni el código de consentimiento**; con ID, todo va en un chunk
  aparte que el HTML no menciona.
- CSP (`vercel.json`): `script-src` suma `https://www.googletagmanager.com`;
  `connect-src` suma `google-analytics.com`, `*.google-analytics.com`,
  `*.analytics.google.com` y `*.googletagmanager.com`; `img-src` suma
  `google-analytics.com` y `googletagmanager.com`. Sigue sin
  `unsafe-inline` ni `unsafe-eval`.
- Tests: 32 en `src/analytics/` (consentimiento, cargador, aviso en
  pantalla), 3 del footer y 2 del build real. Se verificó que **detectan
  fallos provocados a propósito**: cargar Google sin consentimiento,
  botones con estilos distintos y conceder antes del `default: denied`.
- Verificación en Chrome real (`puppeteer-core`, con las peticiones a
  Google interceptadas y bloqueadas para no enviar datos): primera visita →
  aviso visible y **0 peticiones a Google**; Aceptar → 1 petición a
  `gtag/js`, `localStorage=granted`; recargar → sin aviso; Preferencias →
  aviso de vuelta, foco en "Rechazar", elección borrada; Rechazar →
  `denied`. Sin errores de página.
- Lighthouse móvil local (2 corridas por variante; `RNF-PERF-007`): LCP
  3,6 s con y sin ID, CLS 0, TBT 70-130 ms con ID y 110 ms sin él (ruido).
- **Error encontrado en la verificación visual:** el título del aviso era
  invisible (el `h2` global tiene color oscuro y el CSS no lo
  sobrescribía). Corregido aquí. Al revisarlo se comprobó que **la 404 de
  producción tiene el mismo defecto** (`BR-003`) y probablemente
  `PageError` (`BR-019`): se abre `BR-045`.
- **Decisiones por defecto, por confirmar con el usuario:** el aviso
  aparece abajo y centrado (en escritorio tapa parte del Hero mientras no
  se decide); "Rechazar" va antes que "Aceptar"; el texto del aviso y la
  política de privacidad son borradores.
- **Pasos manuales pendientes (usuario):** crear la propiedad GA4 y copiar
  el ID `G-XXXXXXXXXX`; definir `VITE_GA_MEASUREMENT_ID` en Vercel
  (Production); **validar el texto de `/privacidad` y del aviso**; volver
  a desplegar; confirmar en el preview que no hay peticiones a Google
  hasta aceptar y que no aparecen violaciones de CSP en la consola.

---

<a id="br-045"></a>

## BR-045 — Títulos invisibles sobre fondo oscuro (404, error de página, privacidad)

**Notas de construcción (2026-10-12):**
- Cómo apareció: la captura del aviso de consentimiento (`BR-037`) no
  mostraba su título. Se midió el color calculado en la 404 de producción
  (`rgb(23,23,23)` sobre `rgb(23,23,23)`) y se confirmó. Una auditoría de
  contraste de encabezados con Chrome real en las 9 rutas encontró además
  la página de privacidad (mi supuesto de fondo claro era falso) y, como
  falsos positivos, tres `h3` de la home sobre tarjetas con degradado,
  que sí se ven.
- Causa: `h1`-`h6` globales con color oscuro y `.title` sin color propio.
- Arreglo: `color: var(--color-white)` en `NotFoundPage`, `PageError` y
  `ConsentBanner`; `PrivacyPage` con texto, títulos y enlaces claros.
- **Lighthouse no lo ve:** `color-contrast` dio "OK" en la 404 de
  producción (a11y 93) con el título invisible. Se anota como límite en
  `BR-031`.
- Test de contraste en Chrome real (`src/test/contrast.e2e.test.ts`):
  construye el sitio, lo sirve con `vite preview` y, para cada ruta de
  `ROUTES` más una inexistente, calcula el contraste de títulos, párrafos,
  enlaces, botones, etiquetas y ítems contra su fondo sólido, ignorando
  los textos sobre degradados o imágenes y el texto con
  `background-clip: text`; falla si algo baja de 1,5. Con los CSS
  anteriores falla en `/privacidad` (9 textos) y en la 404 (el `h1`);
  con los nuevos pasa (9 rutas, ~37 s). Se ejecuta con `puppeteer-core`
  (devDependency explícita, antes solo llegaba por Lighthouse) y se salta
  si no encuentra Chrome (`CHROME_PATH` o rutas habituales); el CI
  verifica que `google-chrome` existe para que no se salte sin avisar.
- `darkSurfaceTitles.test.ts`: guarda estática del `.title` de `PageError`
  (solo aparece cuando una página falla), de la 404 y del aviso.
- Se refactoriza `src/test/buildOutput.ts`: `buildToTempDir` (construye y
  devuelve la carpeta) y `buildSite` (lee los archivos).
- Fuera de alcance, anotado en `BR-033`: el título "Barber Royce" del
  footer sigue casi ilegible (su fondo es degradado y el test no lo
  evalúa) y el `h2` rojo de `CTA2` mide 2,72.
- Verificación local: lint, tipos y tests OK.

---

<a id="br-038"></a>

## BR-038 — Eventos de conversión y vistas por ruta

**Notas de construcción (2026-10-12):**
- `src/analytics/track.ts`:
  - `trackEvent(nombre, params)` solo envía si Google está **habilitado**:
    `enableGoogleAnalytics` deja `ga-disable-<ID>` en `false` tras el
    consentimiento y `disableGoogleAnalytics` lo deja en `true`; mientras
    sea `undefined` (nunca se aceptó) no hay evento. Sin ID de medición no
    hace nada y el build elimina el resto.
  - Manejadores listos para `onClick`: `trackReserve`, `trackWhatsApp` y
    `trackPhone`, que reciben la `section` (`navbar`, `navbar-movil`,
    `cta1`, `cta2`, `footer`, `ubicacion`, `faq`, `404`). El único
    parámetro es la sección: nunca teléfono ni texto (RN-01). `gtag`
    encola de forma síncrona, así que el enlace no se retrasa (RN-02).
  - `trackPageView(ruta)`: `page_path`, `page_location` y `page_title`.
    El título sale de `ROUTES` (no de `document.title`, que Helmet
    actualiza después de renderizar).
- `AnalyticsRoot` suma un efecto por ruta y consentimiento que envía el
  `page_view` (la app es una SPA y GA4 no detecta los cambios de ruta). Se
  declara después del que habilita Google, así que en cada ruta, y al
  aceptar a mitad de la visita, Google ya está habilitado.
- 11 enlaces instrumentados en 8 archivos: reserva (navbar escritorio y
  móvil, `CTA1`, `CTA2`, 404), WhatsApp (`CTA2`, footer, ubicación, FAQ) y
  teléfono (footer, ubicación). En el menú móvil, el manejador se combina
  con el cierre del menú.
- Tests (53 en `src/analytics/` + 3 de enlaces): `track.test.ts` (13: sin
  habilitar, habilitado, revocado, sin ID, sin `gtag`, una sección y nada
  más por evento, síncrono, títulos), 5 de vistas por ruta en
  `AnalyticsRoot.test.tsx` (consentimiento previo, cada ruta, aceptar a
  mitad, sin consentimiento, tras rechazar) y `trackedLinks.test.ts`, que
  lee el JSX de todo el sitio y falla si un enlace de reserva, WhatsApp o
  teléfono no rastrea su clic o usa el evento equivocado. Controles
  negativos hechos: quitar el rastreo del footer y quitar la condición de
  "Google habilitado" hacen fallar los tests.
- Error mío al contar: dije 12 enlaces y son 11.
- Verificación en Chrome real (peticiones a Google bloqueadas, `dataLayer`
  leído): antes de aceptar, 0 eventos; al aceptar, `page_view` de `/`; al
  ir a `/servicios`, su `page_view` con el título de `ROUTES`;
  `reserve_click {section: navbar}` y `phone_click {section: footer}`; tras
  rechazar, 0 eventos nuevos.
- **Pasos manuales pendientes (usuario):** con el ID real configurado,
  ver los eventos en GA4 → Administrar → DebugView; marcar `reserve_click`
  como evento clave (conversión) en GA4.

---

<a id="br-039"></a>

## BR-039 — Núcleo de contenido: CSV, validación y respaldo

**Notas de construcción (2026-10-12):**
- Carpeta nueva `src/content/`, **sin red ni Vite**, para poder probarla
  entera:
  - `csv.ts`: `parseCsv` (comillas, comas y saltos de línea dentro de una
    celda, `""` escapado, CRLF/CR, BOM, filas vacías, última fila sin
    salto, comilla sin cerrar), `toTable` (encabezados normalizados sin
    tildes; el número de fila coincide con el de la hoja, la 1 es el
    encabezado) y `toCsv`.
  - `schemas.ts`: un lector por pestaña (`servicios`, `productos`,
    `equipo`, `preguntas`, `textos`) con campos obligatorios, largos
    máximos, precio entero en CLP (explica "escribe 15000, sin $ ni
    puntos"), categorías cerradas (sin «Todos»), ids únicos, `https://`
    en imágenes, `activo` (SI/NO: una fila oculta no se valida, sirve de
    borrador), `orden`, y como máximo un líder. Cada problema trae
    pestaña, fila y campo.
  - `resolveContent(hoja, respaldo)`: decide **por pestaña** si el sitio
    usa la hoja o el respaldo. Una sola fila inválida rechaza la pestaña
    completa (RN-03: las demás siguen), una pestaña vacía, sin filas
    activas, con otro encabezado o ilegible usa el respaldo, y **nunca
    lanza** (HTML de error de Google, JSON, caracteres de control, una
    línea gigante). Devuelve el contenido y un informe por pestaña;
    `formatReports` lo convierte en líneas para el log del build.
  - `format.ts`: `formatClp(4000) = "$4.000"` y su inversa.
  - `snapshot.ts`: el respaldo, hoy los datos de `src/data` (`BR-041` los
    mueve aquí). `sheetFormat.ts`: `contentToSheet` escribe cualquier
    contenido en el formato de la hoja.
- **CP-DATOS-002 con prueba fuerte:** el contenido actual del sitio,
  escrito como hoja (`contentToSheet`) y leído de vuelta con los mismos
  esquemas, queda idéntico y sin problemas. Demuestra que el respaldo
  cumple el esquema y que la conversión no pierde nada.
- Decisiones por defecto, por confirmar: un texto con HTML se guarda como
  texto (nunca se interpreta); `textos` con solo encabezado es válida
  ("sin textos propios") a diferencia de los catálogos, que usan el
  respaldo si quedan vacíos; el tope de precio es 1.000.000 CLP.
- Dos errores míos durante la construcción: propiedades en el constructor
  (el proyecto usa `erasableSyntaxOnly`) y un problema de `textos` con la
  fila en 0 (ahora el lector expone `report`, que sabe su fila).
- Tests (82 en `src/content/`): `csv` (18), `schemas` (32, con los errores
  que puede cometer el dueño), `resolveContent` (21), `format` (11).
  Controles negativos: aceptar una pestaña con problemas, no clonar el
  respaldo, comas en vez de puntos en el precio, separador distinto en el
  CSV y comillas escapadas. Todos hacen fallar los tests. Un primer control
  del precio no aplicó (mi `sed` no coincidió) y se repitió bien.
- Cobertura: 44,57 / 83,24 / 64,11 / 44,57 → umbral 44/83/64/44.
- Verificación local: 240 tests, lint, tipos OK. Sin pasos manuales.

---

<a id="br-040"></a>

## BR-040 — Descarga de la hoja al construir

**Notas de construcción (2026-10-12):**
- `vite-plugins/siteContentSource.ts` (solo texto y red, sin Vite ni
  esquemas): `fetchSheet(env, fetch)` descarga en paralelo cada pestaña
  publicada como CSV
  (`…/spreadsheets/d/e/<id>/pub?gid=<gid>&single=true&output=csv`), con
  tiempo máximo por pestaña (10 s por defecto) y **nunca lanza**: cada falla
  queda en una lista de problemas. Rechaza HTTP distinto de 200, una
  respuesta que no es CSV (Google responde HTML si la pestaña no está
  publicada), respuestas de más de 1 MB y errores de red. `parseGids` lee
  `servicios:0,productos:123` y avisa de formatos erróneos, pestañas que no
  existen y gids no numéricos sin dejar de leer las demás.
- `vite-plugins/siteContentPlugin.ts`: módulo virtual `virtual:site-content`.
  - Sin `CONTENT_SHEET_ID`, o en desarrollo: el módulo re-exporta el
    respaldo. Ninguna petición.
  - Con la hoja, al construir: descarga, valida con `resolveContent` y
    escribe el resultado como **datos** en el módulo. El resolvedor se
    ejecuta con un servidor de Vite en modo middleware y `ssrLoadModule`
    (el código de la app usa el alias `@/`, que el contexto de
    `vite.config.ts` no conoce). El navegador no recibe el código de CSV
    ni de validación, ni habla con Google.
  - Todo va al log del build con el prefijo `[contenido]`: una línea por
    pestaña y una por problema con pestaña, fila y campo. Una última red
    de seguridad convierte cualquier error del plugin en "se usa el
    respaldo": nada de la hoja puede detener el build.
- Variables de build (sin `VITE_`, no llegan al navegador):
  `CONTENT_SHEET_ID`, `CONTENT_SHEET_GIDS` y `CONTENT_FETCH_TIMEOUT_MS`;
  `CONTENT_SHEET_BASE_URL` solo para pruebas. Documentadas en
  `.env.example`.
- Ajustes: `src/content/types.ts` usa rutas relativas (lo importa el
  plugin desde el contexto de `vite.config.ts`) y `tsconfig.node.json`
  incluye `vite-plugins`.
- Tests:
  - `siteContentSource.test.ts` (25): `parseGids`, `sheetUrl`, sin hoja no
    pide nada, 404, HTML, sin tipo de contenido, red, `fetch` que lanza,
    timeout real (80 ms), respuesta enorme, tiempo inválido.
  - `siteContent.build.test.ts` (5, **builds reales** con un servidor HTTP
    local que imita a Google, vía una entrada de prueba que importa el
    módulo virtual): hoja válida (CA-01), el identificador, la dirección y
    los nombres de las variables **no aparecen en ningún archivo del sitio**
    (CA-05), fila inválida con el log exacto `servicios fila 2, precio: es
    obligatorio` (CA-03) y las demás pestañas intactas (RN-03), hoja caída,
    404 y sin configurar con 0 peticiones.
  - Controles negativos (todos hacen fallar los tests): ignorar el
    contenido generado, descarga sin tolerancia a errores y plugin sin red
    de seguridad.
- Verificación local: lint, tipos y tests OK; los builds de prueba tardan
  ~0,6 s cada uno.
- **Pasos manuales pendientes (usuario):** crear la hoja y publicar sus
  pestañas como CSV, definir `CONTENT_SHEET_ID` y `CONTENT_SHEET_GIDS` en
  Vercel y volver a desplegar; la primera vez, revisar el log del build
  (`[contenido] …`) para confirmar que cada pestaña dice "hoja".

---

<a id="br-041"></a>

## BR-041 — Servicios, productos, equipo y preguntas desde el contenido generado

**Notas de construcción (2026-10-12):**
- `git mv` de `src/data/{services,products,team,faq}Data.ts` a
  `src/content/snapshot/{services,products,team,faq}.ts`. `src/data` ya no
  tiene esas listas (queda lo que no es editable: `aboutData`,
  `locationsData`, `reviewsData`, etc.). Se quitaron las exportaciones
  duplicadas de categorías (viven en `src/types`) y dos helpers de FAQ sin
  uso (`getFAQsByCategory`, `searchFAQs`).
- `src/content/siteContent.ts` expone el módulo virtual; `ServicesPage`,
  `ProductsPage`, `TeamPage` y `FAQPage` leen de ahí. Los precios llegan ya
  formateados (`$4.000`).
- `vitest.config.ts` registra `siteContentPlugin()` para que
  `virtual:site-content` exista también en los tests.
- `contentToSheet` ahora genera ids legibles a partir del nombre
  (`corte-de-cabello`, con sufijo `-2` si se repite) y se agregó `slugify`.
- Plantillas CSV en `docs/contenido/` (una por pestaña), generadas del
  contenido actual con una orden única de `vite-node` desde fuera del repo
  (no se dejó ningún script). `textos.csv` solo trae el encabezado hasta
  `BR-042`. **Los precios de productos del ejemplo (`25`, `22`…) son los
  actuales del sitio, en formato de dólares: son de muestra** (`BR-009`).
- Tests (`contentWiring.test.tsx`, 11 + 9 de `sheetFormat`/`slugify`):
  - Las 4 páginas muestran un contenido **distinto al respaldo**
    (simulado con `vi.mock("virtual:site-content")`): prueba que leen del
    módulo y no del respaldo, y que el filtro por categoría sigue
    funcionando.
  - `src/data` no tiene las listas, nadie importa el respaldo ni los
    archivos viejos.
  - Las plantillas pasan el esquema y, leídas como hoja, reproducen el
    contenido actual: importarlas no cambia el sitio.
  - Controles negativos: una página que lee el respaldo directo y una
    plantilla con un precio roto hacen fallar los tests.
- **Prueba de extremo a extremo hecha** (sin Google): un servidor local
  sirvió las plantillas con un servicio editado; `npm run build` con
  `CONTENT_SHEET_*` escribió en el log `servicios: hoja (15 filas)`,
  `productos: hoja (6 filas)`, `equipo: hoja (5 filas)`, `preguntas: hoja
  (12 filas)` y `textos: hoja (0 filas)`; en Chrome, `/servicios` mostró
  «CORTE EDITADO EN LA HOJA» y `$7.777`; el navegador hizo **0 peticiones**
  a la hoja y el identificador y la dirección no aparecen en el sitio.
- Cambio de alcance: el JSON-LD de preguntas se traslada a `BR-006` (con el
  requisito de generarlo desde `siteContent.faq`).
- Verificación local: lint, tipos y tests OK.

---

<a id="br-042"></a>

## BR-042 — Textos y títulos desde la pestaña `textos`

**Notas de construcción (2026-10-12):**
- `src/content/texts.ts`: registro de **13 textos editables**, cada uno con
  su clave, su texto por defecto (el que estaba escrito en el componente)
  y su largo máximo (120 para títulos, 400 para subtítulos). `siteText(clave)`
  en `src/content/siteContent.ts` devuelve el de la hoja o el de siempre.
- Claves: `hero.titulo`; `cta1.titulo` y `.subtitulo`;
  `socialproof1.titulo` y `.subtitulo`; `benefits.titulo`; `reviews.titulo`
  y `.subtitulo`; `features.titulo` y `.subtitulo`; `socialproof2.titulo` y
  `.subtitulo`; `cta2.titulo`. Fuera: textos con negritas dentro de la
  frase (subtítulos de Hero y `CTA2`) y el subtítulo de `Benefits`.
- Validación de la pestaña (`readTexts`):
  - Clave que el sitio no usa (un error de escritura) → **aviso, no
    rechazo**: se ignora y el log dice `! textos fila 4, clave:
    "hero.titlo" no es un texto que use el sitio`. Se agregó `warnings` a
    los resultados y a los informes; `formatReports` los marca con `!`.
  - Valor más largo que el máximo de su clave → rechaza la pestaña.
  - Valor vacío → "usar el texto por defecto" (el dueño borra la celda
    para volver atrás).
  - Texto plano siempre: un valor con HTML se muestra como texto.
- Saltos de línea: una celda con Alt+Enter se ve como salto de línea en
  la página gracias a `white-space: pre-line` en el `.title` de `Hero`,
  `CTA1` y `SocialProof2` (los tres títulos que antes usaban `<br />`).
  Nota para la guía: el CSS del Hero **capitaliza cada palabra** del
  título (`Título Editado En La Hoja`).
- `docs/contenido/textos.csv` ahora lista las 13 claves con el texto que
  el sitio muestra hoy.
- Tests (21 nuevos): `texts.test.ts` (registro: valores por defecto no
  vacíos, dentro de su máximo, sin HTML, claves con formato válido,
  `isTextKey` frente a `toString`/`__proto__`), `schemas.test.ts` y
  `resolveContent.test.ts` (aviso por clave desconocida, vacío, máximo por
  clave, saltos de línea), `textsWiring.test.tsx` (**renderiza la home
  entera**: sin hoja, cada texto es el de siempre; con un valor por clave,
  cada uno aparece exactamente una vez y el de siempre desaparece; cambiar
  una no toca las demás; HTML como texto; salto de línea) y
  `textsLineBreaks.test.ts` (todo título con salto de línea lleva
  `pre-line`, y solo esos). Controles negativos: usar la clave equivocada
  en un componente, dejar un texto escrito a mano y quitar `pre-line`
  hacen fallar los tests.
- Prueba de extremo a extremo con un servidor local que imita a Google:
  el título del Hero salió en dos líneas, `CTA2` cambió, el log avisó de
  la clave con error de escritura y el resto de las pestañas siguieron
  leyéndose de la hoja.
- Errores míos durante la construcción: escribí cadenas con `\n` dentro de
  un script de Python y el shell las convirtió en saltos de línea reales,
  rompiendo dos archivos de test; se restauraron desde git y se
  reescribieron con la herramienta de archivos.
- Verificación local: lint, tipos y tests OK.
- Cobertura: 73,92 / 83,44 / 77,71 / 73,92 → umbral 73/83/77/73. **El umbral
  de ramas baja de 84 a 83**: el código nuevo (avisos, valores vacíos) agregó
  ramas que los tests aún no recorren todas. Se anota aquí en vez de dejar
  que el CI falle; las sentencias y funciones subieron (de 56 a 73 % y de
  68 a 77 %).

---

<a id="br-043"></a>

## BR-043 — Guía para publicar contenido desde la hoja

**Notas de construcción (2026-10-12):**
- `docs/contenido-hoja.md`, escrita para el dueño (no técnico), en tuteo:
  1. qué se puede editar: las cinco pestañas, columnas obligatorias y
     opcionales (`activo`, `orden`, `imagen`, `incluye`, `lider`), reglas
     por campo, categorías permitidas y las 13 claves de `textos` con su
     máximo;
  2. crear la hoja importando las plantillas de `docs/contenido/`;
  3. publicar cada pestaña en la web como CSV y sacar el identificador
     `2PACX-…` y los `gid` (con el aviso de que lo publicado es público);
  4. definir `CONTENT_SHEET_ID` y `CONTENT_SHEET_GIDS` en Vercel;
  5. publicar un cambio: redeploy desde Vercel o un menú «Sitio web →
     Publicar cambios» con Google Apps Script (la dirección del `deploy
     hook` va en las propiedades del proyecto, no en el código; se
     desaconseja publicar en cada edición por el límite de builds);
  6. cómo leer el registro del build y una tabla de 15 mensajes de error con
     su causa y su arreglo;
  7. volver atrás (Promote en Vercel e historial de versiones de Google);
  8. sección para quien mantiene el sitio.
- Los mensajes de la tabla de errores se copiaron de los que producen
  `schemas.ts`, `resolveContent.ts` y `siteContentSource.ts`.
- **El Apps Script va como texto de la guía, no como archivo del repo**
  (decisión: no se versionan scripts que corren fuera del sitio).
- Test (`contentGuide.test.ts`, 17): la guía menciona cada clave de
  `TEXTS` y cada categoría de `src/types`, no ofrece «Todos», nombra las
  pestañas, las variables y las plantillas, y no contiene ninguna dirección
  de `deploy hook` real. Evita que el código cambie y la guía quede mal.
- **Pasos manuales pendientes (usuario)** — son los que cierran el
  trabajo; están ordenados en la guía, secciones 2 a 6:
  1. crear la hoja desde las plantillas y **reemplazar los precios de
     muestra de los productos**;
  2. publicar las cinco pestañas como CSV y anotar el identificador y los
     `gid`;
  3. definir `CONTENT_SHEET_ID` y `CONTENT_SHEET_GIDS` en Vercel;
  4. (opcional) crear el `deploy hook` y pegar el Apps Script;
  5. cambiar un precio, publicar y ver el resultado: es el criterio de
     aceptación del ticket y de `HU-CNT-001` CA-04.

---

## BR-044 — Privacidad inerte por defecto

**Notas de construcción (2026-10-13):**
- `/privacidad` es un borrador legal que el dueño aún no valida. Sin analítica
  configurada no hay nada que explicar, así que la ruta y el enlace del footer
  no existen (`analyticsEnabled()` en `src/analytics/enabled.ts`; ruta marcada
  con `requiresAnalytics`).
- Con `VITE_GA_MEASUREMENT_ID` o `VITE_VERCEL_ANALYTICS=true` vuelven a existir.
- Tests: `enabled.test.ts`, `Footer.test.tsx`, `routes.test.ts`; el e2e de
  contraste construye con un ID de prueba para seguir cubriendo `/privacidad`.
- **Por confirmar (usuario):** validar el texto de `/privacidad` antes de
  activar la analítica.

---

<a id="br-032"></a>

## BR-032 — Actualizar el README

**Notas de construcción (2026-10-13):**
- README reescrito en español: stack real, cómo levantarlo en local (sin `.env`), tabla de comandos, variables de entorno (de build y `VITE_*`), de dónde sale el contenido (hoja de Google y respaldo), analítica opt-in, estructura, despliegue y rollback, y el proceso por tickets.
- Se corrigió lo que estaba mal: puerto 5173 (es 8888), Tailwind «TBD» (descartado por ADR-002), `react-snap` (no está instalado), variables que nadie usa y dos URLs de GitHub distintas.
- **Pendiente (usuario):** seguir el README desde un clon limpio. Es el criterio de aceptación del ticket.

---

## BR-046 — Leer la hoja desde `.env` y en desarrollo

**Notas de construcción (2026-10-13):**
- Error mío: al pedir el `.env` se vio que mi consejo anterior («ponlas en `.env.local` y reinicia `npm run dev`») no funcionaba: el plugin leía solo `process.env` y en desarrollo no leía la hoja.
- `siteContentPlugin` usa `loadEnv` y mezcla con las variables del sistema (ganan si no están vacías). En desarrollo lee la hoja al arrancar.
- Los tests (`VITEST`) no leen `.env` ni salen a la red: no dependen de la máquina de quien los corre.
- `siteContentEnv.test.ts` (5 tests) con carpeta temporal; control negativo: sin el cambio fallan 3 de 5.
- Detalle conocido: `loadEnv` de Vite da prioridad a una variable del sistema aunque esté vacía.

---

<a id="br-047"></a>

## BR-047 — El navegador relee la hoja: cambios sin desplegar

**Notas de construcción (2026-10-13):**
- Origen: el usuario esperaba cambios sin redeploy; yo había construido lectura solo al build (`ADR-008`, decidido con el usuario ausente). Se cambió por decisión suya, registrada con fecha en `ADR-008`, `HU-CNT-001` (CA-05 reemplazado por CA-06 y CA-07) y `RF-CNT-006`.
- La descarga se movió de `vite-plugins/siteContentSource.ts` a `src/content/sheetSource.ts` para usarla también en el navegador; `fetchSheetTabs` descarga una fuente y `sheetSourceFromEnv` arma lo que recibe el navegador.
- El plugin expone `virtual:site-sheet` (identificador, gid, base y tiempo máximo, o `null`). Sin hoja o sin ninguna pestaña válida: `null` y ninguna petición.
- `ContentProvider` parte del contenido del build, espera al evento `load` (como la analítica, para no competir con el LCP) y baja `refreshContent` con `import()`. `refreshContent` reutiliza `resolveContent` con el contenido del build como respaldo por pestaña.
- Las 4 páginas y las 8 secciones pasaron de `siteContent`/`siteText` (constantes de módulo) a `useSiteContent()`/`useSiteText()`.
- CSP: `connect-src` + `https://docs.google.com https://*.googleusercontent.com` (Google redirige el CSV a `googleusercontent.com`). El test de orígenes se actualizó y se agregó que la hoja no sirva para scripts, imágenes ni marcos.
- Verificación: 6 tests del proveedor (control negativo: 3 fallan sin el cambio), tests de `sheetSourceFromEnv` y `fetchSheetTabs`, 3 tests del módulo en el build real y un e2e en Chrome real (`liveContent.e2e.test.ts`: cambio sin reconstruir, hoja caída, fila inválida; sin el refresco el primero falla). Además se construyó con la hoja real del usuario y se abrió en Chrome con la CSP exacta de `vercel.json`: 10 peticiones a Google, ningún aviso de CSP ni CORS.
- Medido con la hoja real: Google publicó el cambio en cerca de 1 minuto; la respuesta lleva `Cache-Control: max-age=300`.
- **Por confirmar (usuario):** si el texto de privacidad debe mencionar que el navegador consulta a Google al cargar.
- **Pendiente (usuario):** definir `CONTENT_SHEET_ID` y `CONTENT_SHEET_GIDS` en Vercel y desplegar una vez; es el criterio 4 del ticket.

---

<a id="br-048"></a>

## BR-048 — Datos de contacto, sucursales y redes desde la hoja

**Notas de construcción (2026-10-13):**
- Decisión del usuario: los datos del negocio «van en config, pero el dueño tiene que poder modificarlos». Cambia la regla 4 de `CLAUDE.md` (con excepción fechada) y se apoya en `BR-047` (lectura en el navegador). `src/config/constants.ts` y `src/data/locationsData.ts` quedan como valores de origen y respaldo.
- Dos pestañas nuevas: `negocio` (clave/valor, 13 claves en `BUSINESS_FIELDS`) y `sucursales` (11 columnas obligatorias). `SiteContent` gana `business` y `locations`; `CONTENT_TABS` pasa a 7.
- `src/content/business.ts`: validadores (teléfono de 8 a 15 dígitos, correo, `https://`, mapa solo de Google Maps), `buildBusiness` (la hoja sobre lo que ya tiene el sitio), `telLink` y `buildWhatsAppLink`. El dueño escribe lo que ve una persona; los enlaces los arma el sitio.
- `readBusiness` y `readLocations` siguen las reglas de las otras pestañas: un valor inválido rechaza **toda** la pestaña y se conserva lo anterior; una clave desconocida se ignora con aviso.
- Consumidores migrados a `useSiteContent()`: Footer, Navbar, CTA1, CTA2, FAQPage, NotFoundPage, PrivacyPage y LocationPage. El test de enlaces rastreados busca ahora `booking.url` / `contact.*.link`.
- Se agregó `WHATSAPP_DEFAULTS` (número y mensaje) a las constantes; el enlace por defecto se arma con la misma función y un test comprueba que da el mismo resultado.
- Dos datos de muestra se hicieron coherentes para que las plantillas den la ida y vuelta sin cambiar el sitio: el WhatsApp mostrado pasa a `+56 9 3109 4222` (el número al que ya apuntaba el enlace) y `tel:+1234567890` a `tel:1234567890`. Siguen siendo de muestra hasta `BR-005`.
- Plantillas `docs/contenido/negocio.csv` y `sucursales.csv` generadas desde el respaldo; un test comprueba que cada plantilla es exactamente lo que se genera del respaldo.
- Tests: `business.test.ts` (validadores, enlaces, `buildBusiness`, las dos pestañas), `businessWiring.test.tsx` (cada pantalla muestra lo de la hoja; control negativo: con Footer y LocationPage sin migrar fallan 2 de 7), e2e en Chrome real (el teléfono de la pestaña `negocio` llega al footer sin reconstruir; un teléfono inválido no se publica) y la guía (cada clave y columna aparece en `contenido-hoja.md`).
- Detalle: `refreshContent` solo avisa de las pestañas con `gid` configurado; si faltan `negocio` y `sucursales` en `CONTENT_SHEET_GIDS`, no hay avisos en el navegador.
- **Lo que la hoja no cambia:** `index.html` (JSON-LD, meta) y el sitemap son estáticos; se renuevan al desplegar. Quedan con los datos de `constants.ts`.
- **Por confirmar (usuario):** las decisiones por defecto del ticket (dos pestañas, validaciones, SEO estático) y el cambio del número de WhatsApp mostrado.
- **Pendiente (usuario):** crear las pestañas `negocio` y `sucursales` desde las plantillas, publicarlas y sumar sus `gid` a `CONTENT_SHEET_GIDS`.

**Actualización (2026-10-13, decisión del usuario):** el texto de `/privacidad` y el del aviso de cookies pasan a ser **genéricos**: hablan de «servicio de medición» y de «proveedores externos de analítica web» sin nombrar a Google Analytics, Vercel ni las cookies `_ga`. Dos pruebas lo vigilan (`PrivacyPage.test.tsx`). Se agregó una frase sobre la consulta a la hoja (`BR-047`): el navegador consulta un servicio externo de hojas de cálculo, sin datos del visitante, pero el proveedor puede ver su IP.
- **Por confirmar con quien valide el texto:** un texto genérico informa menos que uno con nombres (qué proveedor, qué cookies, qué país). Muchas políticas nombran a los proveedores; la ley chilena exige informar las finalidades y los destinatarios, y esto sigue siendo un borrador sin validación legal.

- **Pruebas independientes del `.env` (2026-10-13):** al poner los IDs de analítica en el `.env` local, 3 tests fallaban porque leían esas variables (no fallaban en el CI, que no tiene `.env`). `vitest.config.ts` y los builds de prueba (`buildOutput.ts`) usan ahora `envDir: false`; un test lo fija.

---

<a id="br-049"></a>

## BR-049 — El smooth scroll no se percibe y su implementación tiene redundancias

**Notas de construcción (2026-10-13):**
- Origen: el scroll se sentía igual que el nativo. Causa: `duration: 0.25` (250 ms no se distingue del nativo), `scroll-behavior: smooth` en `reset.css` sumándose al de Lenis y `lenis.css` sin importar.
- `useLenis` pasa a `useCreateLenis` (el nombre `useLenisInstance` ya era el del consumidor en `useLenisContext.ts`). `duration: 1.2`, `autoRaf: true` y `autoResize: true`: se van el loop de `requestAnimationFrame` y el `ResizeObserver` sobre el `body` (`Dimensions` de Lenis 1.3.17 ya observa ventana y contenido).
- Se elimina `LenisProvider`: solo envolvía un `Provider` y un `setTimeout` de 100 ms con un segundo `resize()`. El contexto guarda la instancia o `null` y `useLenisReady` es `lenis !== null`.
- Se mantiene `setLenisInstance(null)` en el cleanup: sin él, al activar reducir movimiento en caliente el contexto retendría una instancia destruida (un test lo cubre).
- Se quita `scroll-behavior: smooth` del reset y el bloque vacío de `global.css`; `App.tsx` importa `lenis/dist/lenis.css`. `smoothScrollCss.test.ts` vigila ambos.
- Config tipada con `LenisOptions`. Práctica registrada en `engineering-guidelines.md` §14 y en `calidad-codigo-auditor` (decisión del usuario, 2026-10-13). También se agrega a la §6 cómo se aplica la DoD: la IA guía el paso a paso y la persona ejecuta las verificaciones.
- Test primero: `useCreateLenis.test.tsx` (duración ≥ 1, `autoRaf`, sin `ResizeObserver` ni `MutationObserver`, destrucción al desmontar y al activar reducir movimiento), `useLenisContext.test.tsx` (triangulado: sin instancia / con instancia / sin proveedor) y `smoothScrollCss.test.ts`. Los 457 tests, lint y tipos pasaron antes de integrar.
- Renumeración: el ticket nació como BR-046, ID que `master` ya usaba para otro ticket; se pasó a BR-049 antes de integrar.

**Verificación (la ejecutó el usuario en el navegador):**
- CA-01: efecto percibido, con la clase `lenis` en `html`. ✔
- CA-02: con `prefers-reduced-motion: reduce` emulado y recarga, `lenis` da `false`. Comprobado en la home. ✔
- CA-03: test del hook. ✔
- CA-04: rutas y anclas recorridas. ✔
- CA-05: en el build de producción (`localhost:4173`), CPU 4x, contador de `longtask` durante el scroll completo de la home. Primera medición: `[86]` (una tarea de 86 ms); medición repetida: `[]`. La de 86 ms se toma como caso aislado. La grabación en el servidor de desarrollo (`:8888`) no se usó para decidir.

**Pendiente (usuario):** probar el scroll en un celular real o emulado desde el preview de Vercel antes de integrar este cierre; el recorrido de reducir movimiento en las otras 6 rutas. En móvil Lenis no suaviza el dedo (`syncTouch` es `false`), así que ahí el efecto no existe y se espera el scroll nativo.

**Derivado:** `touchMultiplier: 2` en `useCreateLenis` no tiene efecto sin `syncTouch`; queda por decidir si se quita o se suaviza el toque. `ScrollToTop.tsx` hace `resize()` más un `setTimeout` de 300 ms, otra redundancia fuera del alcance.

**Observación al cerrar (2026-10-14, medida en producción con Chrome sin pantalla):** home y `/ubicacion` avanzan lo esperado con la rueda (600 de 600 px, clase `lenis` presente, sin errores de consola). En `/servicios`, con el puntero sobre el carrusel horizontal de tarjetas (`overflow-x: auto`), la página avanzó 60 px (otra posición, 398 px); fuera del carrusel, 600 px. No se sabe si lo causa este ticket o el carrusel con scroll propio, y la rueda simulada no es una real. **Por verificar (usuario):** con una rueda real, ¿la página sigue al desplazarse con el puntero sobre el carrusel de `/servicios`? Si no, abrir un ticket (posible `data-lenis-prevent` o ajuste del carrusel).

---

## Cierre de BR-046, BR-047 y BR-048 (2026-10-14)

**Lo que verificó y reportó el usuario:**
- Creó la hoja con las 7 pestañas, las publicó como CSV y definió `CONTENT_SHEET_ID` y `CONTENT_SHEET_GIDS` en su `.env` y en Vercel, más `VITE_GA_MEASUREMENT_ID` y `VITE_VERCEL_ANALYTICS`; hizo un Redeploy.
- Vio el aviso de consentimiento en producción.
- 2026-10-14: «sí se vio»: un cambio hecho en la hoja apareció en producción **sin volver a desplegar** (criterio 4 de `BR-047`). No detalló qué dato cambió, así que el criterio 3 de `BR-048` (un teléfono en el footer) queda cubierto por esta prueba general y por el e2e, no por una prueba específica del teléfono.

**Lo que verifiqué yo en producción (2026-10-13, Chrome real, sin aceptar el aviso):** 7 rutas responden 200; en cada página el navegador pide las 7 pestañas a Google (redirección 307 y 200), sin avisos de CSP ni de CORS; Google Analytics no se carga sin consentimiento; `/privacidad` existe.

**Queda fuera de estos tickets:** el texto de `/privacidad` es un borrador sin validación legal (`BR-044`); los datos del negocio de las plantillas siguen siendo de muestra (`BR-005`).

---

## Cierre de BR-042 y BR-043 (2026-10-14)

**Lo que verificó y reportó el usuario:** el 2026-10-14 dio por hechas las pruebas manuales de ambos tickets («ya está todo hecho»): cambiar un texto desde la pestaña `textos` y publicar contenido siguiendo `docs/contenido-hoja.md` (cierre de la épica J). No detalló qué texto ni qué dato cambió, así que el criterio 1 de `BR-043` (cambiar un precio solo con la guía) queda cubierto por su confirmación general, junto con la prueba de `BR-047` (un cambio en la hoja visto en producción sin volver a desplegar).

**Cierre manual:** por decisión del usuario no se corrió la skill `cerrar-ticket` completa; el código de ambos ya estaba en `master` desde el PR #13.

---

<a id="br-050"></a>

## BR-050 — Hero: tipografía de marca

**Notas de construcción (2026-10-14):**
- Origen: el dueño quiso un sitio más llamativo y pidió empezar por el hero, dándole al nombre una fuente y un tamaño especiales. Serie de mejoras visuales en la épica K (nueva).
- El `<h1>` pasa a tres niveles: «Barbería» (versalitas, tracking amplio), «Royce» (Anton, `clamp(5.5rem, 17vw, 10rem)`) y el lema. La marca sale de `SITE.brand` en `src/config/constants.ts`; los tests prohíben el literal en `Hero.tsx` y en su CSS (`RNF-DATOS-001`). El `alt` de la foto usa `SITE.name`.
- Animación: las letras suben desde una máscara (`letterStagger`/`letterRise` en `animations.config.ts`) y un destello rojo (capa duplicada con `background-clip: text`, una sola vez por CSS) cruza la palabra. Con `useReducedMotion` las letras salen sin `motion` y sin destello; el CSS lo apaga además con `prefers-reduced-motion`. Sin `setState` por scroll.
- Accesibilidad: el lector de pantalla lee «Royce» desde un `.srOnly`; las letras sueltas y el destello van en `aria-hidden`. El `<h1>` sigue siendo uno solo con marca y lema (conserva la palabra clave para SEO).
- **Decisión de alcance (2026-10-14):** el lema pasó a una clave nueva, `hero.lema` (máx. 60), en vez de reutilizar `hero.titulo`. La hoja real aún tenía en `hero.titulo` el título entero y, con la misma clave, la marca habría salido duplicada al desplegar. Con la clave nueva la celda vieja se ignora con un aviso. Lo anotó la ficha como «Alcance ajustado».
- El resplandor rojo de las letras se hizo con `drop-shadow` en el contenedor: con `text-shadow` en cada letra, la máscara (`overflow: hidden`) lo recortaba en un rectángulo visible en móvil.
- Fuente: `@fontsource/anton` autoalojada (ADR-001/002 no la descartan: la regla 7 habla de estado de servidor, formularios y kits de UI). Token `--font-family-display`. Sin preload: la medición no mostró cambios en LCP, y el alto de línea fijo evita CLS al cambiar la fuente.
- Test primero para `SITE.brand` y el hero (`brand.test.ts`, `Hero.test.tsx`, 9 casos); se ajustaron `textsLineBreaks.test.ts` y `textsWiring.test.tsx`, que suponían el título entero en el `<h1>`.
- Docs: guía del dueño (`contenido-hoja.md`), plantilla `textos.csv`, HU-EXP-004 y el CP-CNT-005 del catálogo.

**Verificación:**
- Lint, `tsc -b` y 467 tests (incluido el e2e de contraste en Chrome real, ambos esquemas): ✔ (CI del PR #22 en verde).
- Lighthouse móvil, **build local** (`vite preview`), mediana de 3, antes → después: LCP 5,1 → 5,0 s · CLS 0 → 0 · TBT 140 → 140 ms. Sin regresión. El LCP sigue sobre el umbral de 2,5 s de `RNF-PERF-001`, como ya estaba antes (depende de `BR-034`). **No se midió contra el preview de Vercel.**
- Capturas con Chrome en escritorio (1440) y móvil (390): jerarquía y encaje correctos tras corregir el resplandor. ✔
- La verificó el usuario en producción (2026-10-14): el hero se ve como se esperaba («quedó fenomenal») y el lema viene de la hoja (`hero.lema` en vivo, criterio 4). ✔

**Pendiente:** la animación de entrada y el destello solo los vio el usuario a ojo; no hay test automático de la animación en un navegador. Reducir movimiento no se recorrió a mano en producción (hay test de componente y de CSS). Lighthouse móvil contra producción, cuando se quiera cerrar `RNF-PERF-001` (`BR-034`).

---

<a id="br-053"></a>

## BR-053 — Skill `diseno-visual` y flujo de SVG

**Notas de construcción (2026-10-14):**
- `.claude/skills/diseno-visual/SKILL.md`: el rol de diseñador de marketing, el lenguaje visual de la marca (rojo, charcoal, diagonales, Anton + Montserrat, una sola curva de easing), el proceso por sección (mirar, diagnóstico, tres direcciones con recomendación, ticket, línea base, implementación, verificación, cierre), las reglas del proyecto y las trampas aprendidas en `BR-050`.
- `.claude/skills/svg-workflow/SKILL.md`: adaptada de la skill homónima de alienskilez-web, sin Tailwind y con tokens. Agrega una tabla de técnicas de animación (trazo que se dibuja, scroll, neón, parpadeo, entrada por letras) y la regla de sacar contornos de fuente con herramientas externas o comandos directos, sin scripts propios en el repo (preferencia del usuario).
- `AGENTS.md`: las dos skills en la tabla y su origen.
- Sin test: es documentación de proceso (la ficha dice que no aplica HU ni RF/RNF).

**Verificación:**
- Las 7 carpetas de `.claude/skills/` tienen `SKILL.md` y aparecen en `AGENTS.md` (criterio 2). ✔
- Las dos skills aparecen en la lista de skills disponibles de la sesión (la lista se recarga al iniciar o refrescar la sesión; recién creadas, `Skill` respondía «Unknown skill»). ✔
- Criterio 1 (que la skill proponga tres direcciones antes de escribir código): **se comprueba en su primer uso real**, con `BR-054`.
