# Handoff: excepciones que dejó la épica M (2026-11-23)

Insumo para una **sesión nueva**. La épica M (multi-sucursal) está integrada en `master` y sus fichas cerradas. Lo que
este documento reúne son los hallazgos de las auditorías y de Lighthouse que quedaron **fuera** de esos tickets, ya
asignados a tickets existentes o nuevos. No hay que rehacer la épica: hay que tratar cada excepción en su ticket.

## 1. Dónde quedó todo

**Integrado en `master` y en producción** (`barber-royce.vercel.app`): BR-103 a BR-108 y BR-022 (épica M), más BR-110
(textos por sucursal, solo el código). El detalle de cómo se construyó cada uno está en
[`registro-construccion.md`](./registro-construccion.md) (entradas `br-022`, `br-103` a `br-108`).

**Tickets que reciben las excepciones**

| Ticket | Qué recibe | Estado |
|---|---|---|
| `BR-033` | Accesibilidad del menú móvil y del carrusel (§3) | Propuesta, sube a P1 |
| `BR-111` | Rendimiento y SEO de las portadas (§4) | Propuesta, P2 (nuevo) |
| `BR-005` | Datos del negocio por sucursal y sin relleno (§5) | Bloqueada: faltan datos del dueño |
| `BR-034` | Spike de prerender: la causa del LCP (§6) | Propuesta, P1 |
| `BR-110` | Faltan el despliegue con las pestañas nuevas y los textos de La Serena (§7) | En curso |

**Pendientes que no son excepciones y son decisión del usuario:** elegir las secciones definitivas de las enredaderas
(`BR-108`, hoy en Features y «Visítanos»); el logo de La Serena (la barra y el pie muestran el de Coquimbo); las formas
con `clip-path` que siguen siendo hexágonos (tarjeta de testimonio, foto de CTA1, `Honeycomb` de `/equipo` y
`/productos`); y las fotos propias de La Serena (el ticket `BR-110` solo cubre textos).

## 2. Cómo trabajar (reglas que aplican)

- **Ticket primero** (`CLAUDE.md`, regla 1). Rama por ticket (`tipo/br-nnn-descripcion`), commits
  `tipo(alcance): descripción (BR-NNN)`, nunca commit directo a `master`. Skills: `iniciar-ticket`, `cerrar-ticket`.
- **Preguntar antes de decidir** lo que cambie alcance, estructura o prioridades. Tocar la hoja de Google (columnas,
  pestañas) está en esa lista.
- **`git add` con rutas concretas.** `docs/prompts/` es del usuario y se queda sin seguimiento.
- Sin scripts propios en el repo: comandos directos. Sin dependencias nuevas sin un ADR. Estilos con CSS Modules y
  tokens (nada de hex), mobile-first con los cortes de `ADR-009`.
- **Fusionar PR solo cuando el usuario lo pida.** La rama debe estar al día con `master` (si no, GitHub rechaza la
  fusión: `gh pr update-branch <n>` y esperar al CI).
- Un ticket **no está «Hecho»** hasta cumplir su DoD (`engineering-guidelines.md` §6). Si un criterio no se cumple, se
  reporta; solo el usuario decide mover una excepción a otro ticket (se anota con fecha en la ficha).

## 3. `BR-033`: accesibilidad (excepciones de `BR-105` y `BR-107`)

Salen de `accesibilidad-auditor` (2026-11-23). No hay hallazgos altos.

1. **Menú móvil como *disclosure* completo** (`src/components/layout/Navbar/Navbar.tsx`): Escape para cerrar, foco al
   abrir y foco de vuelta al botón al cerrar. Hoy el menú aloja el `BranchSwitch`, así que más personas dependen de
   él por debajo de 1280 px.
2. **Nombre fijo del botón del menú:** cambia entre «Abrir menú» y «Cerrar menú» a la vez que `aria-expanded`, y se
   anuncia doble. Dejar «Menú» y que `aria-expanded` lleve el estado.
3. **`BranchSwitch`** (`src/components/layout/BranchSwitch/BranchSwitch.tsx`): las flechas navegan (cambian de página y
   de tema) con solo mover el foco. Está decidido así; falta documentarlo en `HU-SUC-001` (CA-05 a CA-08) o pasar a
   «flechas mueven el foco, Enter o Espacio activan». Faltan además las teclas Inicio y Fin.
4. **Carrusel** (`src/components/common/CardCarousel/CardCarousel.tsx`): al llegar al primer o último paso, el botón
   pulsado queda `disabled` y el foco cae a `body`. Usar `aria-disabled` con un guard en `onClick`, o pasar el foco al
   otro botón.
5. **Enlaces a AgendaPro en otra pestaña sin aviso** (`HeroLaSerena.tsx`, `Navbar.tsx`, `CTA1`,
   `CTA2`, `Footer`, equipo): texto oculto «(se abre en una pestaña nueva)» aplicado a todos a la vez.
6. Sin prioridad de bloqueo, de la misma auditoría: la transición del `Navbar` (`.navbar`, `.ctaButton` y
   `.mobileMenu`) no está dentro de `prefers-reduced-motion`; el logo tiene un `aria-label` que no coincide con el
   texto visible.

**Verificar con:** `accesibilidad-auditor`, y `axe` en el preview con los dos temas, `/`, `/la-serena`, `/equipo` y
`/coquimbo`, en 390 y 1280 px, con el zoom al 200 % y con `prefers-reduced-motion` activo. Lighthouse de accesibilidad
hoy: 100 en `/`, `/la-serena` y 96 en `/coquimbo`.

## 4. `BR-111`: rendimiento y SEO de las portadas (excepciones de `BR-106`)

Salen de `seo-performance-auditor`. El LCP en sí no es de este ticket (§6).

1. **Preload de las imágenes del hero de Coquimbo en todas las rutas** (`index.html`, bloque de preloads con
   `fetchpriority="high"`): en `/` y `/la-serena` se descargan sin usarse (100 a 198 KB) y compiten con la imagen que sí
   es el LCP. El script `branch-init` ya conoce la ruta. **Cuidado:** si se inyecta el preload desde ese script inline,
   cambia su hash en la CSP de `vercel.json` y hay que actualizar `src/test/vercelConfig.test.ts`.
2. **`HomePage` y `Hero` en el JS inicial** (`src/App.tsx` los importa de forma estática): `/` y `/la-serena` descargan
   hero, CTA1, etc. aunque no los usen. Pasar `HomePage` a `lazy`, como ya está `LaSerenaPage`. **Medir antes y
   después** (es la ruta de la primera visita).
3. **`/` con elección guardada** (`src/pages/BranchPickerPage.tsx`): redirige en el cliente a una ruta `lazy`; la cadena
   es HTML, JS principal, render, y recién ahí el trozo de la portada. Precargar el trozo de la sucursal guardada.
4. **Textos de `ROUTES` que dicen solo «Coquimbo»** (`src/config/routes.ts`, `location` y `about`), aunque Ubicación
   muestra las dos sucursales. Neutralizar título y descripción.
5. **JSON-LD:** `url` y `@id` de cada `HairSalon` apuntan siempre a `/ubicacion` (`src/seo/structuredData.ts`), aunque
   la página sea `/la-serena`. Usar la ruta de cada portada o documentar que `/ubicacion` es la ficha canónica.
6. Menores: dos `<meta name="description">` y duplicados de `og:*` (los estáticos de `index.html` y los de la
   página; los estáticos son útiles para quien no ejecuta JavaScript hasta el prerender); fotos del selector sin
   `srcset` (`src/components/sections/BranchPicker/BranchPicker.tsx`); precios del `ItemList` de `index.html`
   copiados a mano, sin test que los compare.

## 5. `BR-005`: datos del negocio (excepciones de `BR-103`)

Salen de `datos-negocio-auditor`. **Bloqueado por datos del dueño**: hay que pedírselos antes de tocar código.

1. **Teléfono de relleno** `(123) 456-7890` en el pie (`src/config/constants.ts`, `Footer.tsx`).
2. **Mapa de Coquimbo que apunta a Bogotá** (`mapUrl` en `src/data/locationsData.ts`). `geoFromMapUrl` lo descarta del
   JSON-LD, así que Coquimbo sale sin `geo`.
3. **Horarios contradictorios:** `SCHEDULE.display` («Lun-Sáb 9:00-20:00»), `weekdays` y `saturday` (10:00 a 20:00 y
   hasta las 18:00), `locationsData.ts` (09:00 a 20:00) y la respuesta de la FAQ (`src/content/snapshot/faq.ts`).
4. **WhatsApp y teléfono por sucursal:** el pie y `CONTACT.whatsapp` no cambian con la sucursal activa; en `/la-serena`
   se ve el de Coquimbo (el de La Serena existe solo en `locationsData`). Es el hueco del diseño de `BR-103`: la reserva
   sí sigue a la sucursal, el contacto no. Decidir si el pie usa la fila de la sucursal activa (`useBranchLocation`).
5. **Correos:** `centro@` y `norte@barberroyce.com` frente a `info@barberroyce.com`, con el dominio `barberroyce.com`
   y no `roycebarber.com`: confirmarlos con el dueño.
6. `LocationCard.tsx` arma `tel:`, `mailto:` y `wa.me` a mano; usar `telLink` y `whatsappLink` de
   `src/content/business.ts`.

## 6. `BR-034`: el LCP móvil (excepción de `BR-106`)

El LCP móvil no llega a 2,5 s (`RNF-PERF-001`) en **ninguna** ruta, tampoco en la línea base (`/coquimbo`): la página se
arma en el navegador, y hasta que React monta no se pinta el hero (retraso de render de unos 3,3 s medido en `BR-034`).

**Mediciones de referencia** (Lighthouse móvil contra producción tras el PR #58, mediana de 3):

| Ruta | Rendimiento | SEO | Accesibilidad | LCP | TBT | CLS |
|---|---|---|---|---|---|---|
| `/` | 74 | 100 | 100 | 5,6 s | 35 ms | 0 |
| `/la-serena` | 73 | 100 | 100 | 5,3 s | 103 ms | 0 |
| `/coquimbo` | 71 | 100 | 96 | 5,6 s | 150 ms | 0 |

**Conversación ya tenida con el usuario (2026-11-23)** sobre el spike, para no repetirla:
- Opción recomendada: **prerender en el build** de las rutas (`vite-react-ssg` u otro plugin que se acople a React
  Router y Vite), sin servidor. SSR queda descartado para este sitio; migrar a Astro con islas sería un ADR nuevo y
  solo se justifica si el prerender exige demasiados parches.
- El spike es una **rama de prueba, con medición y sin ir a producción**, sobre `/coquimbo` y `/la-serena` (no `/`, que
  depende de `localStorage`). Resultado esperado: números antes y después, lista de parches, recomendación y borrador
  de ADR (lo decide el usuario).
- Dificultades conocidas: en el build no existen `window` ni `localStorage` (`BranchProvider`, Lenis, `matchMedia`,
  lectura de la hoja); la sucursal activa sale de la URL en las portadas, así que prerenderizarlas por separado es
  viable; `/` debe redirigir sin parpadeo.
- La hoja de Google ya se lee **al construir** (`ADR-008`), así que el prerender podría escribir esos datos en el HTML.
- Criterio de descarte: si hay que reescribir el tema por sucursal, si el LCP no baja de 3,5 s o si aparecen errores de
  hidratación sin solución.

## 7. `BR-110` y la hoja de Google

El código ya está en `master`: cada texto se resuelve en la pestaña de la sucursal activa (`textos-coquimbo` o
`textos-la-serena`), luego en `textos` (base común) y por último en el código. Si una pestaña de sucursal falta, esa
sucursal usa `textos`. **Falta, y lo hace el usuario:**

1. En **Vercel**, sumar a `CONTENT_SHEET_GIDS` las pestañas `textos-coquimbo` y `textos-la-serena` (los `gid` están en
   su `.env` local, que git ignora; no copiarlos a documentos ni a PR) y volver a desplegar.
2. Que el dueño reemplace por los suyos los textos de `textos-la-serena`, hoy copia de los de Coquimbo.
3. Marcar «Volver a publicar automáticamente cuando se realicen cambios» en *Archivo → Compartir → Publicar en la web*.

**Trampas de la hoja que ya pasaron:**
- Google permite **una sola publicación por documento**. Publicar una pestaña suelta reemplaza la de «Todo el
  documento» y las demás pestañas dan **401**. Se arregla republicando «Todo el documento» (el identificador `2PACX-…`
  puede conservarse si se cambia desde el menú de «Contenido publicado»).
- Justo después de republicar, una pestaña puede dar 401 unos segundos y luego 200.
- El enlace que pasa el usuario trae el `gid` de la pestaña: revisar que sea la que dice (una vez se confundió el de
  preguntas con el de textos). Los nombres de las pestañas publicadas salen de la versión `pubhtml` de la hoja.
- Verificación rápida: `npm run build` imprime una línea `[contenido]` por pestaña (`hoja (N filas)` o `respaldo`).
  Con las nueve pestañas debe decir `hoja`.

## 8. Trampas del entorno (Windows) y de la verificación

- **CRLF:** los archivos del repo son CRLF; al editar con scripts, conservar el fin de línea.
- `python3` se cuelga: usar `node`. Un `sleep` largo se bloquea: usar `run_in_background` y esperar la notificación.
- **Lighthouse** (`npx lighthouse <url> --form-factor=mobile --output=json --output-path=<archivo>`): al terminar da un
  `EPERM` al borrar su carpeta temporal en `%TEMP%`, **pero el JSON sí queda escrito**. Mediana de 3 corridas por ruta.
  El servicio mide más lento que un celular real: sirve para comparar rutas, no como cifra absoluta.
- **Capturas con Chrome** (`puppeteer-core` + `C:/Program Files/Google/Chrome/Application/chrome.exe`): para saltar el
  loader y el modal, `sessionStorage["neon-loader-seen"]="1"` y `localStorage["barber-royce:promo-dismissed"]="1"`;
  el aviso de analítica se descarta con el botón «Rechazar». Para forzar la sucursal, `localStorage["royce:branch"]`.
  Cuidado con la posición del cursor: pasar el mouse sobre una mitad del selector la ilumina.
- Tres tests basados en el build fallan **solo en Windows** (`analytics.build`, y los e2e `contrast` y `fixedShapes`
  según el entorno); en el CI pasan y son el criterio. Los tests que usan `lazy()` pueden tardar más con toda la suite
  en paralelo: dar 5 s de margen a sus `waitFor`.
- React 19 + `react-helmet-async`: las etiquetas de `SEOHelmet` **no reemplazan** a las estáticas de `index.html`
  (por eso se quitaron la canonical, `og:url` y `twitter:url` estáticas; hay un test que lo guarda).
- Un hallazgo de la sesión: el clasificador de permisos bloquea comandos que mezclan commit y pegado de identificadores
  de la hoja; hacerlo por partes y sin los números en el texto.

## 9. Orden sugerido

1. `BR-033` (accesibilidad): lo más acotado y sin dependencias externas; se verifica con `axe` y con el auditor.
2. `BR-111` (rendimiento y SEO): medir antes, cambiar de a uno (preload, `lazy` de `HomePage`, precarga del trozo) y
   volver a medir con Lighthouse en el preview.
3. Spike `BR-034` (prerender), si el usuario quiere atacar el LCP de fondo; es lo que más mueve ese número.
4. `BR-005` cuando el dueño entregue los datos reales (teléfono, mapa de Coquimbo, horarios, correos, WhatsApp por
   sucursal).
5. Cerrar `BR-110` cuando estén desplegadas las pestañas y escritos los textos de La Serena.
