# Guía de ingeniería — barber-royce

Fecha: 2026-10-12
Estado: activo, vinculante desde `BR-001`.
Alcance: **cómo** se escribe y se entrega código en este repo. No cubre
**qué** se construye (eso lo fija [`backlog.md`](./backlog.md)) ni la
organización de carpetas y las decisiones de stack (eso lo fija
[`architecture.md`](./architecture.md)).

**Origen:** adaptado de los estándares de ingeniería de *Segunda Opinión de
Build* (dos niveles: principios genéricos + guía por repo). Aquí hay un
solo repo, así que los dos niveles se fusionan en este documento. La
numeración de las 15 primeras secciones se mantiene a propósito, para que
un principio se cite igual en cualquiera de los proyectos.

Cuando una regla todavía no se cumple, se dice con **Gap honesto:** y se
cita el ticket que la cierra.

## 1. Tests — primero cuando hay lógica real que probar

No es "todo test-first". La regla práctica:

- **Lógica pura y bugs conocidos → test primero.** Ejemplos en este repo:
  la función que arma los `<Routes>` desde `ROUTES`, el cálculo de capas de
  parallax, el formateo de horarios o precios, un filtro de servicios o
  productos. Se escribe el spec en rojo, se implementa, se refactoriza.
- **Triangulación** cuando la regla no es obvia con un ejemplo: al menos
  dos casos con entradas y resultados distintos antes de generalizar (por
  ejemplo, un filtro sin coincidencias y uno con coincidencias parciales).
- **Componentes de presentación → test después, pero antes de cerrar el
  ticket.** Un test de render con Testing Library que fije el contrato
  mínimo (se ve el CTA de reserva, el enlace abre en pestaña nueva con
  `rel`, la 404 ofrece volver al inicio).
- **Regla dura:** ningún ticket P0/P1 se cierra sin un test en verde que
  cubra su criterio de aceptación, salvo que la ficha diga por qué no
  aplica (por ejemplo, un cambio solo de configuración de Vercel, que se
  verifica contra el preview desplegado).
- **Aislamiento:** ningún test depende del orden ni del estado que dejó
  otro. Nada de `window.lenis` u otros globales compartidos entre tests.

Herramientas: Vitest + Testing Library (`BR-030`). Los flujos completos
(reserva, navegación, 404) se verifican contra el preview de Vercel.

Los tests viven junto al archivo que prueban (`*.test.ts(x)`). Para renderizar una página se usa `renderWithProviders` de `src/test/` (router en memoria + Helmet). El umbral de cobertura de `vitest.config.ts` solo sube.

## 2. Separación de responsabilidades

| Capa | Responsabilidad | Dónde vive |
|---|---|---|
| `pages/` | Componer secciones de una ruta y declarar su SEO. No calcula ni filtra. | `src/pages/*Page.tsx` |
| `components/sections/` | Una sección visual de una página; recibe datos ya listos. | `src/components/sections/<Seccion>/` |
| `components/common/`, `components/layout/` | Piezas reutilizadas por ≥ 2 páginas (SEO, errores, navbar, footer). | |
| `hooks/` | Lógica con estado o efectos reutilizable (scroll, Lenis, parallax). Sin JSX. | `src/hooks/` |
| `data/` | Contenido estático del negocio (servicios, equipo, FAQ). Solo datos tipados. | `src/data/*.ts` |
| `config/` | Constantes de configuración: rutas, datos de contacto, URLs externas, animación. **Fuente única.** | `src/config/` |
| `types/` | Tipos e interfaces. Sin valores de runtime. | `src/types/` |
| `utils/` | Funciones puras o de infraestructura del navegador sin JSX (por ejemplo, la recuperación de chunks). | `src/utils/` |
| `styles/` | Tokens de diseño y CSS global. | `src/styles/` |

No mezclar capas: un componente no declara una URL externa ni un teléfono
(los lee de `config/`), un archivo de `types/` no exporta constantes, un
componente de `sections/` no importa el CSS Module de una página.

**Gap honesto:** hoy `types/*.types.ts` exporta constantes de runtime y
`Location/*` importa `LocationPage.module.css` (`BR-027`).

## 3. KISS

- El idiom directo de React, framer-motion y CSS Modules antes que una
  abstracción propia encima.
- **Regla del "ya observado dos veces":** algo se abstrae o se generaliza
  solo si resuelve una duplicación o complejidad que ya apareció dos veces
  en este repo. Ejemplo de lo que pasa si no: el commit `49e46d8` agregó
  ~1000 líneas de hooks de rendimiento que nadie usa (`BR-025`).
- Un ticket, un cambio con propósito claro.

## 4. DRY

- Lo transversal vive en un solo lugar, recién cuando el segundo consumidor
  existe de verdad.
- **Datos del negocio una sola vez:** teléfono, email, WhatsApp, horario,
  redes, dirección y la URL de AgendaPro viven solo en `src/config/`. El
  JSON-LD, el sitemap y cualquier otra copia se generan desde ahí o se
  verifican con un test (`RNF-DATOS-001`, `BR-005`).
- **Rutas una sola vez:** `ROUTES` es la fuente de navegación, SEO y
  `<Routes>` (`BR-026`).
- Valores de diseño una sola vez: colores, espaciados y radios salen de los
  tokens (§4 de `architecture.md`), nunca como hex sueltos.

## 5. SOLID, con criterio práctico

- **S:** un componente, una razón de cambio. Una sección no decide reglas
  de animación globales ni datos de contacto.
- **O:** una variante nueva (un tipo de servicio, una sucursal) se agrega
  como dato en `data/` o `config/`, no como un `if` más en el componente.
- **I:** props angostas por componente; nada de un `Props` gigante
  compartido por todo un árbol.
- **D:** lo externo (Lenis, AgendaPro, WhatsApp) entra por `config/` o por
  un contexto, no instanciado dentro de cada componente.
- **Regla de honestidad:** no se crea una interfaz o un "sistema" genérico
  con un solo consumidor.

## 6. Definition of Done

Un ticket está `Hecho` cuando se cumple **todo** esto:

1. Tests en verde para lo que el ticket tocó (§1).
2. `npm run lint` sin errores ni warnings.
3. `npm run build` (`tsc -b && vite build`) limpio.

   Los puntos 1–3 son el pipeline de CI en verde (`BR-029`). Mientras no
   exista, se corren a mano los mismos comandos.
4. Criterio de aceptación verificado **en el sistema real**: el preview de
   Vercel del PR (o `npm run preview` mientras no haya Vercel), en un
   navegador de escritorio **y** en uno móvil (o emulación). "Funciona en
   `npm run dev`" no alcanza: el build de producción, el rewrite SPA y los
   assets optimizados solo existen en el preview.
5. Si el ticket toca rendimiento, SEO o accesibilidad: Lighthouse contra el
   preview, con los umbrales de los RNF que cita la ficha.
6. `backlog.md` actualizado a `Estado: Hecho (fecha, rama → master)` y las
   notas de construcción en `registro-construccion.md`.
7. El ticket cita su `HU-XXX` y su `RF/RNF`, o dice por qué no aplica.
8. Commits atómicos que referencian el ticket (§7), en una rama de trabajo.
9. Integrado a `master` vía PR (merge `--no-ff`), rama borrada, y el
   despliegue de producción que dispara ese merge revisado (la home y la
   ruta tocada cargan).

## 7. Convención de commits y ramas

Conventional Commits con el ID del ticket:

```
feat(reserva): CTA de AgendaPro desde config única (BR-005)
fix(seo): país y geo correctos en el JSON-LD (BR-006)
perf(hero): quitar preload del PNG y priorizar AVIF (BR-011)
docs(backlog): marcar BR-003 como Hecho
```

Tipos: `feat`, `fix`, `perf`, `refactor`, `style`, `test`, `docs`,
`build`, `ci`, `chore`. `npm run commit` (commitizen) arma el mensaje.

Ramas cortas por ticket, desde `master`:

```
feat/br-003-pagina-404
fix/br-006-json-ld
docs/br-001-organizacion-proceso
```

Nunca se hace commit directo a `master`. El merge es el del PR aprobado.

## 8. Vigencia

- React 19 con hooks: sin componentes de clase nuevos (el `ErrorBoundary`
  propio se reemplaza por `react-error-boundary`, `BR-019`).
- Un warning de deprecación es deuda, no ruido: se resuelve o se abre un
  ticket.
- Versiones estables de dependencias. Nada de beta/RC sin una razón escrita
  en la ficha.
- Una dependencia que nadie importa se elimina (`BR-025`). Una dependencia
  que se importa debe estar declarada en `package.json` (hoy
  `@radix-ui/react-progress` llega de forma transitiva).

## 9. Rendimiento, con criterio

Es una web de captación: el rendimiento en móvil **es** el producto. Los
umbrales están en `rf-rnf-catalogo.md` (`RNF-PERF-*`).

- **Imágenes:** toda imagen de contenido sale optimizada en **WebP**
  (`npm run optimize:images`; el AVIF se descartó porque pesaba más que el
  WebP, `BR-011`), con `srcset`/`sizes` cuando hay varios anchos,
  `width`/`height`, `loading="lazy"` salvo la del LCP, que lleva
  `fetchpriority="high"`. Ningún PNG o JPG original se importa desde un
  componente. Dos tests lo vigilan (`imageAttributes.test.ts`,
  `lcpPreload.test.ts`).
- **Animación:** nunca `setState` por evento de scroll. Lo que depende del
  scroll se calcula con `MotionValue` (`useScroll`/`useTransform`), que no
  re-renderiza. Solo se crean los `useTransform` que se usan.
- **Observers:** nada de `MutationObserver` sobre todo `document.body`.
  Un `ResizeObserver` acotado alcanza para Lenis.
- **Medir antes de optimizar:** Lighthouse y el panel Performance contra el
  preview. "No se ve lento en mi PC" no es una medición.

## 10. Seguridad, por defecto

- Ningún secreto en el repo. `.env*` está en `.gitignore` y existe un
  `.env.example` sin valores (`BR-010`). Toda variable `VITE_*` es pública
  por definición: nunca se pone un secreto en una.
- Todo enlace externo con `target="_blank"` lleva
  `rel="noopener noreferrer"`. Los enlaces externos son `<a>`, no `<Link>`.
- Cabeceras de seguridad y CSP en `vercel.json` (`BR-002`).
- Nunca `dangerouslySetInnerHTML` con contenido que no sea del propio repo.
  El JSON-LD se serializa con `JSON.stringify`.
- `npm audit --omit=dev` sin vulnerabilidades altas o críticas antes de
  desplegar.

## 11. Confiabilidad

- Un redeploy cambia los nombres de los chunks: una pestaña abierta que
  pide un chunk viejo no puede quedar en blanco. Se recarga una vez y, si
  vuelve a fallar, se muestra el fallback (`BR-020`).
- Recargar en cualquier ruta profunda (`/servicios`) responde la app, no un
  404 del hosting (`BR-002`).
- Si AgendaPro o el mapa embebido no cargan, la página sigue siendo usable
  y muestra el contacto alternativo (teléfono o WhatsApp).

## 12. Observabilidad mínima

- Los errores de render los captura un error boundary y se registran con
  `console.error` en un único lugar (`onError` del boundary).
- **Gap honesto:** no hay monitoreo de errores ni analítica en producción.
  Queda diferido hasta decidir proveedor (backlog §4).

## 13. Legibilidad

- Máximo dos niveles de anidamiento por función; guard clauses al inicio.
- **Una página compone, no calcula.** Si una página filtra, ordena o arma
  textos, esa lógica va a una función pura o a un hook.
- Un valor por caso → `Record<Caso, Valor>`. Un comportamiento por caso →
  `switch` exhaustivo. No cadenas de `if`/`else if`.
- JSX sin ternarios anidados: con más de una condición, una variable con
  nombre o un componente.
- SVG inline repetidos → `lucide-react` o `src/components/icons`.
- **Todo título (`h1`-`h6`) sobre un fondo oscuro fija su color** en su
  clase: los globales son oscuros y, sin esto, el texto desaparece
  (`BR-045`). Lo vigilan `contrast.e2e.test.ts` (Chrome real, todas las
  rutas) y `darkSurfaceTitles.test.ts`.
- Formato: Prettier y `.editorconfig` (`BR-028`). Imports con el alias
  `@/`, sin `../`.

## 14. Tipos y estados

- `strict` está encendido en `tsconfig.app.json`; se mantiene así.
- Las constantes de configuración se declaran `as const` y, cuando cubren
  un catálogo, con `satisfies Record<Clave, Valor>` para que el compilador
  avise si falta un caso.
- Un estado con variantes es una unión discriminada (`'abierto' |
  'cerrado'`), no varios booleanos.
- Un cast `as` sobre un dato externo va detrás de un *type guard*.

## 15. Manejo de errores

- Ningún `catch` que silencie: relanza, traduce con más contexto o degrada
  a propósito y lo deja escrito en un comentario.
- Los errores de render terminan en un fallback con mensaje claro y una
  acción (reintentar o volver al inicio), nunca en una pantalla en blanco.
- El mensaje que ve el usuario es texto de la UI, nunca un `error.message`
  crudo ni una traza.
- El catálogo tipado de errores (`AppError` de RadarOP) se incorpora
  **cuando exista una llamada de red propia** (reserva propia, formulario).
  Hoy no hay red que manejar (ADR-005 de `architecture.md`).

## 16. Texto de la interfaz

- Todo texto visible (botones, títulos, `alt`, `aria-label`, mensajes de
  error) va en **español de Chile con tuteo estándar**: "reserva tu hora",
  "revisa", "vuelve al inicio". Sin voseo ("reservá") y sin chilenismos
  marcados ("po", "al tiro").
- Precios en pesos chilenos con el formato `$15.000`.
- Fechas y horarios en formato de 24 horas (`10:00 – 20:00`).

## 17. Despliegue

- Producción: Vercel, desde `master` (ADR-003 de `architecture.md`). Cada
  PR genera un preview, que es donde se verifica el criterio de aceptación
  (§6.4).
- Ningún cambio llega a `master` con el CI en rojo.
- Un rollback es "Promote" del despliegue anterior en Vercel. Se usa antes
  que un hotfix apurado.
- La configuración del hosting (rewrites, cabeceras, caché) vive en
  `vercel.json`, versionada, nunca solo en el panel de Vercel.

## 18. Documentos relacionados

- [`architecture.md`](./architecture.md): estructura, decisiones (ADR) y
  deuda conocida.
- [`backlog.md`](./backlog.md): plan y estado por ticket.
- [`rf-rnf-catalogo.md`](./rf-rnf-catalogo.md): requisitos con criterio de
  verificación.
- [`../CLAUDE.md`](../CLAUDE.md) y [`../AGENTS.md`](../AGENTS.md):
  convenciones para trabajar con Claude Code y catálogo de skills y
  agentes.
