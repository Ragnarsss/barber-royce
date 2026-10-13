# CLAUDE.md — Convenciones para Claude Code en barber-royce

Sitio web de **Royce Barbería** (La Serena y Coquimbo, Chile): una web de
captación que presenta servicios, equipo, productos, sucursales y
preguntas frecuentes, y deriva las reservas a **AgendaPro**. Es una SPA
estática, sin backend propio, desplegada en **Vercel**.

**Fase actual (2026-10-12):** preparación del primer despliegue. El orden
de trabajo lo fija la sección 6 de [`docs/backlog.md`](docs/backlog.md):
primero los P0 de la épica B.

## Stack

React 19 · TypeScript 5.9 (`strict`) · Vite 7 (SWC) · React Router 7 ·
CSS Modules + tokens CSS · framer-motion 12 · Lenis · react-helmet-async ·
lucide-react. Detalle y decisiones en
[`docs/architecture.md`](docs/architecture.md).

## Comandos

```bash
npm run dev          # servidor de desarrollo en http://localhost:8888
npm run build        # tsc -b && vite build
npm run preview      # sirve el build en http://localhost:4173
npm run lint         # ESLint
npm test             # Vitest en modo watch
npm run test:run     # Vitest una vez
npm run test:coverage  # Vitest con cobertura y umbral
npm run commit       # commit guiado (Conventional Commits)
npm run perf:lighthouse   # Lighthouse CI local
npm run perf:bundle       # visualizador del bundle
```

Tests junto al archivo que prueban (`*.test.ts(x)`); helper de render en `src/test/`.

## Mapa de la documentación

| Documento | Para qué |
|---|---|
| [`docs/backlog.md`](docs/backlog.md) | Qué se hace y en qué orden (tickets `BR-NNN`). Fuente oficial. |
| [`docs/historias-usuario.md`](docs/historias-usuario.md) | Para qué (`HU-*`, criterios Given/When/Then). |
| [`docs/casos-uso.md`](docs/casos-uso.md) | Flujos con caminos alternativos (`CU-*`). |
| [`docs/rf-rnf-catalogo.md`](docs/rf-rnf-catalogo.md) | Requisitos verificables (`RF-*`, `RNF-*`, `CP-*`). |
| [`docs/engineering-guidelines.md`](docs/engineering-guidelines.md) | Cómo se escribe y se entrega código; **Definition of Done** en §6. |
| [`docs/architecture.md`](docs/architecture.md) | Estructura, ADRs, deuda conocida y tabla "dónde ir para…". |
| [`docs/registro-construccion.md`](docs/registro-construccion.md) | Bitácora de cómo se construyó cada ticket. |
| [`AGENTS.md`](AGENTS.md) | Catálogo de skills y agentes de `.claude/`. |
| `docs/archivo/` | Documentos anteriores al 2026-10-12. **No son fuente de verdad.** |

## Reglas duras

1. **Ningún trabajo sin ticket.** Si no existe, se crea con la skill
   `nuevo-ticket` (y su HU, si falta) antes de escribir código.
2. **Rama por ticket** (`tipo/br-nnn-descripcion`); nunca commit directo a
   `master`. Commits `tipo(alcance): descripción (BR-NNN)`.
3. **Un ticket no está `Hecho`** hasta cumplir la DoD
   (`engineering-guidelines.md` §6), verificada en el preview de Vercel, no
   en `npm run dev`. La skill `cerrar-ticket` la aplica.
4. **Datos del negocio** (teléfonos, WhatsApp, email, horarios, redes, URL
   de AgendaPro, sucursales) solo en `src/config/` y
   `src/data/locationsData.ts`. Nunca un literal en un componente ni en
   `index.html` sin un test que lo compare (`RNF-DATOS-001`).
   El **catálogo** (servicios, productos, equipo, preguntas) y los textos
   editables viven en la hoja de Google, con un respaldo en el repo
   (`ADR-008`): se leen con `useSiteContent()` / `useSiteText()`
   (`src/content/`), nunca de `src/content/snapshot/` (el respaldo lo actualiza el desarrollador cuando
   el dueño confirma contenido nuevo). No se editan a mano en dos lugares.
5. **Estilos:** CSS Modules + tokens de `src/styles/tokens/`. Nada de
   colores hex en los módulos ni clases de Tailwind (ADR-002).
6. **Animación:** nunca `setState` por evento de scroll; usar `MotionValue`.
   Respetar `prefers-reduced-motion`. Nunca leer `window.lenis`
   (`architecture.md` §5).
7. **No agregar dependencias** de estado de servidor, formularios o UI kit
   (TanStack Query, Zustand, axios, MUI, Tailwind) sin un ADR nuevo: hoy
   están descartadas por ADR-001 y ADR-002.
8. **Enlaces externos:** `<a target="_blank" rel="noopener noreferrer">`,
   nunca `<Link>`.
9. **Secretos:** ninguno en el repo ni en variables `VITE_*`. La analítica
   (`VITE_VERCEL_ANALYTICS`, `VITE_GA_MEASUREMENT_ID`) es **opt-in**: sin
   variables no se carga ni se muestra nada, y GA nunca se carga antes del
   consentimiento (`ADR-007`).
10. Las decisiones del usuario se registran con fecha (en la HU, el ticket
    o un ADR); no se reescribe en silencio lo ya decidido.

## Idioma

- **Documentación y comentarios de código:** español neutro, con tuteo, sin
  voseo ni modismos regionales.
- **Texto visible del sitio:** español de Chile con tuteo estándar, sin
  voseo ni chilenismos marcados; precios `$15.000`; horas en formato de 24
  horas (`engineering-guidelines.md` §16).
- **Identificadores de código:** en inglés, como el código existente.
  Commits con tipo en inglés y descripción en español.

## Estilo de respuesta

- **Preguntas puntuales** (una duda, "¿esto ya está hecho?", un porqué) se
  responden breve y al grano: pocas líneas, sin tablas ni encabezados, una
  o dos referencias a archivo si ayudan.
- El formato extenso (checklists de DoD, planes, notas de construcción) es
  para **cerrar o entregar trabajo**, no para contestar una pregunta.
- Si la respuesta corta deja fuera algo que puede importar, se ofrece en
  una línea ("si quieres lo detallo").
- Antes de proponer un cambio de arquitectura, revisar si ya hay un ADR que
  lo decide (`architecture.md` §9).
