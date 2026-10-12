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
