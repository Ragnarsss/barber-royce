# Handoff: hallazgos de la home en móvil (2026-10-18)

Insumo para la próxima sesión, después del cierre de `BR-061` y `BR-069` a
`BR-079`. Es **diagnóstico, no decisión**: cada hallazgo se convierte en
ticket (skill `nuevo-ticket`, épica K salvo que se indique) solo si el
usuario lo prioriza. Hay dos fuentes:

1. **Revisión de diseño por sección** (skill `diseno-visual`, paso de
   diagnóstico), con capturas a 390 × 844 px en emulación móvil del build de
   `master` (`df6aae5`) y mediciones del DOM en Chrome.
2. **Auditoría responsive** hecha por un subagente con
   `docs/prompts/responsivness.md`, adaptado a este stack (ese prompt se
   escribió para otro proyecto con MUI y Tailwind, descartados aquí por
   ADR-001 y ADR-002).

Prioridad: **P0** rompe algo visible o una norma (contraste, datos);
**P1** se nota y cuesta poco; **P2** pulido.

## 1. Lo que ya tiene ticket (no duplicar)

| Qué se ve | Ticket | Estado |
|---|---|---|
| Galería de SocialProof2 con 7 cuadros grises con un ícono de cámara | `BR-051` (Instagram) | Bloqueada |
| Las 5 reseñas son de ejemplo | `BR-052` (Google) | Bloqueada |
| Teléfono `(123) 456-7890` y correos `@barberroyce.com` en el footer | `BR-005` | Bloqueada |
| Fotos de Unsplash rotas o ajenas | `BR-008` | Bloqueada |

La galería gris es el hallazgo que más resta: es lo primero que se ve
después del bloque rojo «Clientes Felices». Si `BR-051` sigue bloqueada,
conviene decidir un respaldo temporal (fotos propias del local o esconder la
parrilla).

## 2. Medición de rendimiento

Lighthouse móvil de la home en producción, mediana de 3: **LCP 5,72 s ·
CLS 0 · TBT 120 ms**. CLS (≤ 0,1) y TBT (≤ 200 ms) cumplen; **LCP no
cumple `RNF-PERF-001` (≤ 2,5 s)**. El elemento LCP es la foto móvil del hero
(`hero_mobile_780w.webp`, de `BR-061`). Ver la comparación con el build
anterior al lote en el registro (cierre de `BR-061` a `BR-079`).

## 3. Revisión de diseño por sección (390 px)

### Navbar

- **P0 · Área táctil de la hamburguesa: 34 × 19 px** (mínimo 44 × 44).
  «Agendar Sesión» mide 35 px de alto. Afecta al control más usado en móvil.
  Solución: `padding` en el botón hasta 44 × 44 sin agrandar el ícono.
- **P2 · Menú abierto sin velo:** el panel ocupa ~⅔ de la pantalla y debajo
  se ve el hero con sus tarjetas; se lee como una superposición a medias.
  Opciones: panel a pantalla completa (`100dvh`) o un velo oscuro bajo el
  panel. Además, «Agendar Sesión» aparece dos veces (cabecera y menú) y
  «TEAM» es el único ítem en inglés.

### Hero

- **P1 · Densidad:** antetítulo, «ROYCE», lema, línea, párrafo y tres
  tarjetas compiten en una sola pantalla; el modelo casi no se ve detrás del
  velo y del texto. Un solo gesto por sección: hoy no hay uno claro.
  Direcciones posibles: (a) dos tarjetas en lugar de tres, (b) párrafo más
  corto en móvil, (c) tarjetas en carrusel como Beneficios.
- **P1 · Texto de las tarjetas en 13 px** (cuerpo mínimo de 16 px en móvil
  según el criterio de la auditoría; 14–15 px sería un punto medio para
  tarjetas compactas).
- **P0 (rendimiento) · LCP 5,7 s** con la foto móvil como elemento LCP
  (sección 2).

### CTA1

- Es la sección más lograda en móvil: jerarquía clara, un rostro grande y
  dos acciones.
- **P2 · El mismo gesto dos veces seguidas:** la línea blanca a todo el
  ancho bajo el título repite la del hero, una pantalla antes. Se podría
  acortar la de CTA1 (como la roja de SocialProof1) para variar el ritmo.

### SocialProof1 (Respaldados por los que saben de estilo)

- **P1 · Sin margen derecho:** el `h2` y el subtítulo se salen 9 px del
  viewport (izquierda 24 px, derecha −9 px). No hay scroll horizontal
  porque la sección recorta, así que el texto queda pegado o cortado en el
  borde.
- **P1 · Texto chico:** subtítulo en 12,8 px y cita en 13,65 px.
- **P2 · Mayúsculas sueltas** en el texto de la hoja («Artistas musicales y
  Deportistas»): es contenido del dueño, se corrige en la hoja.

### Benefits

- **P1 · Franja vacía de ~130 px** de charcoal entre la cuña inferior y
  Reseñas.
- **P2 · Lectura de la tarjeta:** el logo del local (BARBER / ROYCE) de la
  foto de fondo queda justo detrás de la tarjeta activa. Velo un poco más
  denso o encuadre distinto en móvil.
- **P2 · Párrafo en 14,4 px.**

### Reviews

- **P1 · ~400 px vacíos** bajo el carrusel: la sección mide 972 px (una
  pantalla) con ~450 px de contenido. Sumado al relleno superior de
  Features, hay casi una pantalla vacía entre los puntos del carrusel y el
  título siguiente.
- **P2 · Alineación y márgenes cambian de sección a sección:** Reseñas
  alinea a la izquierda con 48 px de margen; Features centra con 24 px.
  Definir un patrón para los encabezados de sección en móvil.

### Features (Innovación y calidad)

- **P1 · ~180 px vacíos** después del carrusel, antes del bloque rojo.

### Carruseles (Benefits, Reviews, Features)

- **P2 · Puntos de 24 × 24 px** como área táctil. Si los puntos son solo
  indicadores, está bien; si son controles, pedir 44 px de área con
  `padding` sin agrandar el punto.

### SocialProof2 (Clientes Felices)

- **P0 · Galería gris** (`BR-051`, sección 1).
- **A confirmar visualmente:** en la captura algunas letras del párrafo
  («felicidad», «mejor») se ven con un tinte amarillo; puede ser un
  artefacto del renderizado en Chrome sin pantalla.

### CTA2

- **P1 · Contraste sobre foto, a confirmar:** el título rojo y el cuerpo
  negro van sobre una foto con mucho detalle (personas, letrero de neón).
  Revisar con `contrast.e2e.test.ts` o medir los píxeles de fondo en el
  peor punto.

### Footer

- **P0 · Títulos invisibles:** «Barber Royce», «Navegación», «Contacto» y
  «Síguenos» se pintan en `rgb(23, 23, 23)` sobre el fondo oscuro. La regla
  global de `h1`–`h6` (`src/styles/global.css:25`) les da
  `--color-text-primary` y `Footer.module.css` no define color para `.title`
  ni `.columnTitle`. Falla WCAG 1.4.3.
- **P0 · Marca escrita a mano y distinta:** «Barber Royce» en
  `Footer.tsx:30` y en el copyright (`Footer.tsx:126`). La marca es «Royce
  Barbería» y debe salir de `SITE` (`RNF-DATOS-001`).
- **P1 · Colores hex y `rgba` en `Footer.module.css`** (líneas 60, 61, 72,
  97, 123…): incumple ADR-002.
- **P2 · Enlaces de 24 px de alto** como área táctil, y el footer mide
  1133 px en móvil (más de una pantalla). Dos columnas para la navegación lo
  acortaría.

## 4. Auditoría responsive (subagente)

Evaluación del subagente: **🟡 aceptable pero mejorable**. El móvil
(≤ 768 px) está bien resuelto. Lo que falla está en la franja 769–~1024 px y
en escritorios bajos (alto ≤ 768 px). **[medido]** quiere decir medido en el
build con Chrome; lo demás se dedujo del código.

**Fortalezas:** el corte 768/769 es coherente en las secciones de la home.
`useMediaQuery` no renderiza por scroll. Ya se usan `svh`/`dvh` en el Hero,
CTA1 y los diálogos. El panal escala con `min()`/`clamp()`. Las escenas
fijas se apagan en móvil y con movimiento reducido. No hay scroll horizontal
salvo en `/nosotros`.

### P0

- **H1 · La navbar de escritorio no cabe entre 769 y ~950 px y se rompe a
  1024 px [medido].** El logo queda con ancho 0, «Agendar Sesión» sale de la
  pantalla, «UBICACIÓN Y HORARIOS» ocupa tres líneas y la barra crece a
  ~110 px (el layout reserva 80). A 1024 px el logo se solapa con «NOSOTROS».
  Hay dos salidas: mantener la hamburguesa hasta 1024 px (`Navbar.module.css:244`
  y el `innerWidth > 768` de `Navbar.tsx:23`) o compactar la barra entre 769
  y 1279 px. Las dos piden una etiqueta más corta para «Ubicación», y eso es
  decisión del usuario.
- **H2 · El menú móvil recorta su CTA [medido].** Tiene
  `max-height: 500px` (`Navbar.module.css:212`) para un contenido de 520 px.
  En apaisado (360 px de alto) FAQ y el CTA quedan inalcanzables. Solución:
  `max-height: calc(100dvh - var(--navbar-height)); overflow-y: auto`. Con el
  menú cerrado, los enlaces siguen enfocables: falta `inert` o `visibility`.
- **H4 · Escenas fijas en escritorio bajo [medido].** A 1024×600, 1280×650
  y 1366×768, los títulos de Hero, Benefits, SocialProof1 y CTA1 quedan bajo
  la navbar o las tarjetas se cortan por abajo. Es lo que ve un portátil con
  la barra del navegador. Solución: fijar la escena solo si cabe
  (`(min-width: 769px) and (min-height: 720px)` en `usePinnedScene.ts:13` y
  en el CSS de `.pinned`), y además `100svh`, `padding-top` con un token de
  navbar y alineación arriba.
- **H7 · `/nosotros` desborda 36 px en móvil y a 769 px [medido].** Las
  variantes `fadeInLeft`/`fadeInRight` (`x: ±60`) entran desde fuera.
  Solución: `overflow-x: clip` en `.page`, y global en `html, body`, que no
  rompe `sticky`.

### P1

- **H3, H13, H14 · Áreas táctiles bajo 44 px [medido].** Hamburguesa
  34×19, CTA móvil 123×35, chips de Servicios (38) y Productos (40),
  pestañas de Ubicación (39) y enlaces del footer (24). Coincide con la
  revisión de diseño.
- **H11 · Cuerpo de texto bajo 16 px en móvil [medido].** Entre 12,8 y 15
  px en Reviews, Features, Benefits, Hero, SocialProof1, CTA2, Servicios,
  FAQ, About, el footer y el banner de consentimiento. La causa más
  repetida: `clamp()` con un `vw` de escritorio (`clamp(0.85rem, 1.2vw,
  0.95rem)`) que en móvil siempre cae al mínimo. FAQ incluso baja de 16 a 15
  px en móvil.
- **H15 · Cortes inconsistentes.** Hay 640, 767, 768, 769, 968, 1024, 1200
  y 1600. `min-width: 768px` (Honeycomb, HoneycombPage, ModalDialog,
  BarberProfileDialog, `mixins.css`) se solapa con `max-width: 768px` justo a
  768 px (iPad mini en vertical).
- **H5 · `min-height: 100vh` que no se anula en móvil** en Reviews,
  Features y SocialProof2. Explica los huecos de ~400 y ~180 px que vio la
  revisión de diseño. Solución: `min-height: auto` en móvil, y
  `100vh` seguido de `100svh` donde la sección deba llenar la pantalla.
- **H8 · El carrusel de Servicios no usa `CardCarousel`.** Sus degradados
  fijos de 120 px tapan el 75 % del ancho a 320 px, no tiene snap y las
  tarjetas son de alto fijo. Migrarlo como se hizo con Reviews en `BR-073`.

### P2

- **H6 · La altura de la navbar como número mágico** (`80px`, `5rem`,
  `calc(100svh - 80px)`) en cinco sitios; la real mide ~66 px en móvil.
  Crear el token `--navbar-height`.
- **H16 · Media queries de JS repetidas:** `Hero.tsx:40` lee `matchMedia`
  una sola vez dentro de un `useState` y no reacciona al rotar;
  `CardCarousel.tsx` reimplementa el hook; `Navbar.tsx` usa `resize`. Crear
  `src/config/breakpoints.ts` con las queries con nombre.
- **H9/H10 · Puntos del carrusel de 24 px** y flechas que asoman
  (`left/right: -1.375rem`).
- **H12 · Tamaños en px sueltos** en las páginas internas en vez de los
  tokens de tipografía.
- **H17 · Anchos máximos distintos** (1200, 1240, 1400 px): a 1920 px el
  logo y los títulos no caen en la misma vertical.
- **H18 · `ui/card.tsx` sigue con clases de Tailwind** (ya cubierto por
  `BR-021`, `BR-022` y `BR-025`).
- **H19–H22:** foto del Hero en tablet apaisado (`object-fit: contain`),
  reglas muertas en `Hero.module.css`, banner de consentimiento que tapa
  media pantalla a 320×568, y `100vh` en las pantallas de carga y error.

### Propuesta de breakpoints (encaja con `BR-024`, que hoy dice otra cosa)

`src/styles/tokens/breakpoints.css` ya declara variables, pero no sirven
dentro de `@media` y no hay PostCSS para `@custom-media`. Propuesta sin
dependencias nuevas:

1. **Conjunto cerrado y documentado:** `(max-width: 768px)`,
   `(min-width: 769px)`, un corte compacto (**1024 o 1280: elegir uno**) y
   `(min-height: 720px)` para las escenas fijas.
2. **Las mismas queries en JS** (`src/config/breakpoints.ts`, objeto
   `MEDIA`) para `useMediaQuery`.
3. **Un test** que recorra los `*.module.css` y falle si aparece un corte
   fuera del conjunto (como `RNF-DATOS-001` con los datos).
4. **No reescribir a mobile-first** los ~45 bloques existentes: el riesgo
   de regresión es alto. Lo nuevo puede escribirse con `min-width: 769px`.
5. `BR-024` plantea hoy «640, 768, 1024, 1280, mobile-first». Cambiarlo es
   decisión del usuario (regla 10).

## 5. Orden sugerido para la próxima sesión

Cada punto necesita ticket (regla 1) y la prioridad la fija el usuario.

1. **Footer: títulos invisibles y marca escrita a mano** (diseño, P0). Es
   barato y se ve en todas las rutas.
2. **Navbar entre 769 y 1024 px, menú móvil desplazable y área táctil de la
   hamburguesa** (H1, H2, H3). Un solo ticket de navbar. Antes, decidir
   entre hamburguesa hasta 1024 px o barra compacta, y la etiqueta corta de
   «Ubicación».
3. **Escenas fijas solo cuando caben** (H4) y el token `--navbar-height`
   (H6).
4. **`overflow-x: clip`** global y en `/nosotros` (H7).
5. **LCP de la home (5,7 s en producción)**: investigar la foto del hero
   (tamaño, preload, momento en que se descubre). Es deuda previa a este
   lote.
6. **Huecos verticales en móvil** (H5: Reviews, Features, Benefits) y
   **margen derecho de SocialProof1**.
7. **Texto a 16 px en móvil** (H11) y **áreas táctiles** del resto (H13,
   H14).
8. **Breakpoints como conjunto cerrado** con su test (H15, H16, `BR-024`).
9. **Respaldo de la galería** mientras `BR-051` siga bloqueada.
10. El resto de P2.
