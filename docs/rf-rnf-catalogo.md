# Catálogo de requisitos funcionales y no funcionales — barber-royce

Fecha: 2026-10-12
Estado: activo.

Documento formal de requisitos. Cada requisito tiene un ID, un criterio de
verificación concreto y trazabilidad hacia las historias de usuario
([`historias-usuario.md`](./historias-usuario.md)), los casos de uso
([`casos-uso.md`](./casos-uso.md)) y los tickets
([`backlog.md`](./backlog.md)).

**Origen (2026-10-12):** consolida lo que el sitio ya hace,
`docs/archivo/WEB_REQUIREMENTS_CHECKLIST.md` y la auditoría previa al
despliegue. Formato tomado de *Segunda Opinión de Build*.

---

## 1. Convenciones

### 1.1 Identificadores

- **RF:** `RF-<MOD>-NNN`. Módulos: `RES` (reserva y contacto), `INFO`
  (contenido), `NAV` (navegación y errores), `SEO`, `OPS` (despliegue y
  calidad), `MED` (medición y privacidad), `CNT` (contenido editable).
- **RNF:** `RNF-<CAT>-NNN`. Categorías en §3.1.
- **CP:** `CP-<MOD|CAT>-NNN`, criterio de prueba. Es el caso concreto que
  verifica el requisito. Un ticket lo cita así: "CP-RES-001 pasó en el
  preview". Cuando un módulo de RF y una categoría de RNF comparten
  nombre (`SEO`), el CP del RNF lleva el sufijo `-N` (`CP-SEO-001-N`).
- Los IDs nunca se reutilizan. Un requisito retirado queda con estado
  `Retirado` y el motivo.

### 1.2 Prioridad y estado

- **Prioridad:** Alta · Media · Baja (heredada de la HU).
- **Estado:**
  - `Propuesto`: definido; no existe en el código.
  - `Implementado`: existe en el código; no se verificó contra el sitio
    desplegado, o se conocen defectos (se citan sus tickets).
  - `Verificado`: su CP pasó contra el preview o la producción de Vercel.
    Una verificación en `npm run dev` no cuenta.
  - `Retirado`: ya no aplica (con motivo y fecha).

### 1.3 Reglas de redacción

**RF:**

- Una sola capacidad por requisito.
- Sin términos ambiguos (*rápido*, *intuitivo*, *adecuado*, *moderno*).
- Verificable con un caso concreto (el CP).

**RNF:**

- Lleva **métrica** y **umbral** numérico (o `0` para "nunca").
- Dice **cómo se verifica** (herramienta, entorno y condiciones).
- Dice a qué parte del sitio afecta.

### 1.4 Entorno de verificación por defecto

Salvo que el CP diga otra cosa:

- **Dónde:** preview de Vercel del PR (o `npm run preview` mientras no haya
  Vercel).
- **Lighthouse:** modo navegación, perfil **móvil** (Moto G Power
  emulado, 4G lenta), mediana de 3 corridas.
- **Navegadores:** Chrome y Safari iOS actuales.

---

## 2. Requisitos funcionales (RF)

### 2.1 Tabla

| ID | Mód. | Requisito funcional | Prior. | Criterio de verificación | HU | CU | Estado |
|---|---|---|---|---|---|---|---|
| RF-RES-001 | RES | Todo botón "Reservar" (navbar escritorio, menú móvil y CTAs de sección) abre la URL de AgendaPro de la sucursal en una pestaña nueva; la URL se define en un solo lugar del código. | Alta | **CP-RES-001:** en cada ruta, el botón "Reservar" del navbar es visible sin scroll y abre AgendaPro en pestaña nueva con `rel="noopener noreferrer"`; una búsqueda de `agendapro.com` en `src/` devuelve una sola definición. | HU-RES-001 | CU-RES-001 | Implementado (`BR-007`: URL única en `BOOKING.url` y `rel` en todos los CTAs, con test; falta confirmar en el preview) |
| RF-RES-002 | RES | Ofrecer contacto por WhatsApp (con mensaje prellenado) y por teléfono (`tel:`), con el número visible igual al del enlace. | Alta | **CP-RES-002:** en el celular, tocar el teléfono abre el marcador con el número real; tocar WhatsApp abre la conversación con el mismo número mostrado y el mensaje prellenado. | HU-RES-002 | CU-RES-001 | Implementado (defectos: teléfono de ejemplo, número mostrado distinto al del enlace; `BR-005`) |
| RF-RES-003 | RES | Mostrar un modal de bienvenida con la oferta de la mascarilla facial una vez por visitante y en cualquier ruta, después del loader de neón, después de que el visitante responda el aviso de privacidad (si existe) y tras unos 5 s de espera; al cerrarlo se anota en el navegador y no vuelve a salir. | Media | **CP-RES-003:** con una sesión nueva y la promoción encendida, el modal sale tras el loader, el aviso y los ~5 s en `/` y en `/productos`; mientras el aviso está visible no sale; cerrarlo y recargar no lo vuelve a mostrar; con `localStorage` bloqueado no falla. | HU-RES-003 | — | Propuesto (`BR-100`) |
| RF-RES-004 | RES | El modal informa la oferta (mascarilla gratis con cualquier servicio pagado, una por persona, ambas sucursales, frase «Royce web»), ofrece «Reservar» hacia AgendaPro y se cierra con botón, Escape o fondo devolviendo el foco; con reducir movimiento no se anima. | Media | **CP-RES-004:** el modal muestra las condiciones; «Reservar» abre `business.booking.url` en una pestaña nueva con `rel="noopener noreferrer"`; Escape, fondo y botón cierran y el foco vuelve; con `prefers-reduced-motion` no hay transición. | HU-RES-003 | — | Propuesto (`BR-100`) |
| RF-RES-005 | RES | Ofrecer dentro del modal un botón «Canjear cupón» que despliega un formulario (dos botones: completar y volver) y, al completarlo con consentimiento, mostrar un cupón con el nombre y la frase «Royce web». | Media | **CP-RES-005:** «Canjear cupón» muestra el formulario sin cerrar el modal; «Volver» regresa al botón sin enviar nada; un campo inválido muestra su error y no avanza; el formulario válido muestra el cupón. | HU-RES-004 | CU-RES-002 | Propuesto (`BR-101`) |
| RF-RES-006 | RES | Registrar cada canje (fecha, nombre y el contacto acordado) en una pestaña de la hoja mediante el receptor que decida el ADR nuevo, solo tras el consentimiento explícito; si el registro falla, el cupón igual se muestra. | Media | **CP-RES-006:** completar el formulario agrega una fila en la pestaña de canjes; sin consentimiento no se hace ninguna petición; con el receptor caído se ve el cupón. | HU-RES-004 | CU-RES-002 | Propuesto (`BR-101`; bloqueado hasta el ADR) |
| RF-RES-007 | RES | Recordar en el navegador el canje hecho y mostrar el mismo cupón en vez del formulario, sin permitir generar otro desde ese navegador. | Baja | **CP-RES-007:** tras canjear, al recargar el modal muestra el cupón y no el formulario; con `localStorage` bloqueado no falla. | HU-RES-004 | CU-RES-002 | Propuesto (`BR-101`) |
| RF-INFO-001 | INFO | Listar los servicios con nombre, descripción, precio en CLP, duración y qué incluye, filtrables por categoría. | Alta | **CP-INFO-001:** `/servicios` muestra todos los servicios de `servicesData.ts` con esos campos; elegir una categoría deja solo sus servicios; "Todos" restablece la lista. | HU-INFO-001 | CU-INFO-001 | Implementado (defecto: imágenes de Unsplash; `BR-008`) |
| RF-INFO-002 | INFO | Listar los productos con nombre, descripción, foto y precio en CLP, filtrables por categoría y por texto. | Baja | **CP-INFO-002:** `/productos` muestra los productos de `productsData.ts`; escribir un texto filtra por nombre sin recargar; un filtro sin resultados muestra un estado vacío con acción para limpiarlo. | HU-INFO-004 | CU-INFO-001 | Implementado (botón «Comprar» quitado por decisión del usuario, `BR-009`; defecto restante: imágenes de Unsplash, `BR-008`) |
| RF-INFO-003 | INFO | Mostrar por sucursal: dirección, mapa embebido, enlace a Google Maps, horario por día y contacto, con una pestaña por sucursal. | Alta | **CP-INFO-003:** `/ubicacion` muestra La Serena y Coquimbo; cambiar de pestaña con clic o flechas del teclado actualiza los datos; con el iframe del mapa bloqueado, la dirección y el enlace a Maps siguen visibles. | HU-INFO-002 | CU-INFO-002 | Implementado |
| RF-INFO-004 | INFO | Mostrar el equipo de barberos con foto, nombre y especialidad. | Media | **CP-INFO-004:** `/equipo` muestra cada barbero de `teamData.ts` con esos tres campos y un `alt` descriptivo en la foto. | HU-INFO-003 | — | Implementado |
| RF-INFO-005 | INFO | Mostrar la historia y los valores de la barbería. | Media | **CP-INFO-005:** `/nosotros` muestra el contenido de `aboutData.ts`. | HU-INFO-003 | — | Implementado |
| RF-INFO-006 | INFO | Mostrar las preguntas frecuentes agrupadas por categoría, en acordeón accesible por teclado. | Media | **CP-INFO-006:** `/preguntas-frecuentes` filtra por categoría; Enter o Espacio despliega una respuesta y `aria-expanded` cambia de valor. | HU-INFO-005 | — | Implementado |
| RF-INFO-007 | INFO | Mostrar reseñas de clientes en la home. | Media | **CP-INFO-007:** la sección de reseñas de la home muestra las reseñas de `reviewsData.ts` con autor. | HU-INFO-003 | — | Implementado |
| RF-INFO-008 | INFO | Mostrar en la parrilla de la home (`SocialProof2`) las publicaciones recientes de la cuenta de Instagram de la barbería, cada una enlazada a su publicación, sin exponer el token de acceso al navegador y con un respaldo si Instagram falla. | Media | **CP-INFO-008:** con la cuenta conectada la parrilla muestra las últimas publicaciones y cada una abre su enlace; sin conexión o con Instagram caído, la sección muestra el respaldo; el token no aparece en ningún archivo del build. | HU-INFO-006 | — | Propuesto (`BR-051`) |
| RF-INFO-009 | INFO | Mostrar en la sección de reseñas de la home reseñas reales de la ficha de Google de la barbería, con autor, calificación y atribución a Google, y un enlace a la ficha; sin reseñas inventadas si Google falla. | Media | **CP-INFO-009:** con la ficha conectada la sección muestra reseñas de Google con autor y la atribución; el enlace abre la ficha en Google Maps; sin conexión no aparece ninguna reseña de muestra. | HU-INFO-003 | — | Propuesto (`BR-052`; reemplaza a `RF-INFO-007` al cerrarse) |
| RF-INFO-010 | INFO | Mostrar la ficha de cada barbero en un diálogo accesible (foto, nombre, cargo, años de experiencia, frase, especialidades, días de atención, sucursal, descripción, fotos de sus trabajos, botón para reservar con él e Instagram), con esos datos editables y opcionales en la pestaña `equipo` de la hoja. | Baja | **CP-INFO-010:** en `/equipo`, activar un barbero con clic, Enter o Espacio abre su ficha con esos datos; Escape la cierra y el foco vuelve al barbero; una fila sin los campos opcionales se ve sin huecos; «Reservar con…» usa el enlace del barbero o, si no tiene, el general, y su clic se registra; una `sucursal` que no existe en la pestaña `sucursales` rechaza la pestaña `equipo`. | HU-INFO-003 | — | Implementado (`BR-063`: probado en Chrome real y verificado por el usuario en producción, 2026-10-15) |
| RF-INFO-011 | INFO | Mostrar el catálogo de productos en un panal de hexágonos, con el nombre y el precio al pasar el cursor o enfocar, una ficha accesible por producto (sin botón de compra) y carga progresiva al llegar al final. | Baja | **CP-INFO-011:** en `/productos`, pasar el cursor o enfocar con teclado un hexágono muestra su nombre y precio; clic, Enter o Espacio abre su ficha; Escape la cierra y el foco vuelve; con más de 12 productos, al llegar al final se suman los siguientes y «Ver más productos» hace lo mismo con el teclado. | HU-INFO-004 | CU-INFO-001 | Implementado (`BR-067`, `BR-068`: probado en Chrome real con la hoja real y verificado por el usuario en producción, 2026-10-17; la regresión de LCP de `/productos` fue aceptada, 2026-10-15) |
| RF-NAV-001 | NAV | Navegar entre rutas desde un navbar (con menú móvil) y un footer generados desde `ROUTES`, volviendo al inicio de la página en cada cambio de ruta. | Alta | **CP-NAV-001:** los enlaces del navbar y del footer coinciden con las entradas de `ROUTES` marcadas para cada uno; al cambiar de ruta, la nueva página empieza arriba. | HU-EXP-002 | — | Implementado (gap: `<Routes>` no sale de `ROUTES`; `BR-026`) |
| RF-NAV-002 | NAV | Mostrar una página "no encontrada" con identidad de marca, enlace al inicio y botón de reserva para cualquier ruta inexistente. | Alta | **CP-NAV-002:** `/no-existe` muestra la página 404 con ambos enlaces, `<title>` propio y `noindex`. | HU-EXP-003 | CU-EXP-001 | Verificado (`BR-003`; test en `NotFoundPage.test.tsx`, producción 2026-10-12) |
| RF-NAV-003 | NAV | Contener un error de render en la sección o ruta afectada con un mensaje y "Reintentar", y recargar una vez ante un chunk inexistente tras un despliegue. | Alta | **CP-NAV-003:** forzar un error en una sección deja navbar y footer operativos y muestra el fallback con "Reintentar"; simular un fallo de carga de chunk recarga la página una sola vez. | HU-EXP-003 | CU-EXP-001 | Implementado (boundary de páginas en producción desde `BR-019`; recuperación de chunk en `BR-020`) |
| RF-SEO-001 | SEO | Declarar por ruta: `<title>`, `meta description`, `canonical`, Open Graph y Twitter Card, tomados de `ROUTES`. | Alta | **CP-SEO-001:** cada una de las 7 rutas tiene esos metadatos, con título y descripción distintos entre rutas. | HU-SEO-001 | — | Implementado (defecto: `/productos` sin OG ni Twitter; `BR-006`) |
| RF-SEO-002 | SEO | Publicar datos estructurados JSON-LD de las dos sucursales (`HairSalon`: nombre, dirección, país `CL`, coordenadas, teléfono, horario) y `FAQPage` generado desde `faqData.ts`. | Alta | **CP-SEO-002:** la prueba de resultados enriquecidos de Google sobre la home y `/preguntas-frecuentes` no da errores; los datos coinciden con `src/config/` y `faqData.ts`. | HU-SEO-001, HU-INFO-005 | — | Implementado (defectos: país `ES`, `geo` 0,0, imagen inexistente, rating estático, FAQ duplicado a mano; `BR-006`) |
| RF-SEO-003 | SEO | Publicar `sitemap.xml` con todas las rutas públicas y `robots.txt` que lo referencie. | Alta | **CP-SEO-003:** las URLs de `sitemap.xml` coinciden con las rutas de `ROUTES`; `robots.txt` apunta al sitemap con el dominio de producción. | HU-SEO-001 | — | Implementado (defecto: faltan `/nosotros` y `/preguntas-frecuentes`; `BR-006`) |
| RF-OPS-001 | OPS | Desplegar en Vercel: preview por PR, producción desde `master`, rewrite SPA, cabeceras de seguridad y caché inmutable de assets con hash. | Alta | **CP-OPS-001:** un PR genera una URL de preview; recargar `/servicios` en el preview responde 200; `curl -I` muestra las cabeceras de RNF-SEG-001 y `Cache-Control: public, max-age=31536000, immutable` en `/assets/*`. | HU-OPS-001 | CU-OPS-001 | Verificado (`BR-002`, producción 2026-10-12; el preview por PR está activo) |
| RF-OPS-002 | OPS | Verificar cada PR con un pipeline que corre lint, chequeo de tipos, tests y build, y bloquea el merge si un paso falla. | Alta | **CP-OPS-002:** un PR con un error de lint, de tipos, un test roto o un build roto queda con el check en rojo y no se puede integrar. | HU-OPS-001 | CU-OPS-001 | Verificado (`BR-029`: PR #10 con error de tipos quedó en rojo en el paso "Tipos", 2026-10-12) |
| RF-MED-001 | MED | Cargar Vercel Analytics (sin cookies) solo si la variable de build `VITE_VERCEL_ANALYTICS` es `true`; sin ella no se carga ni se solicita nada. | Media | **CP-MED-001:** un build sin la variable no contiene la ruta `/_vercel/insights` en el HTML ni en los chunks; con `true`, la home pide `/_vercel/insights/script.js` y la visita aparece en el panel de Vercel Analytics. | HU-MED-001 | — | Implementado (`BR-036`; falta activarlo en Vercel y ver la visita en el panel) |
| RF-MED-002 | MED | Cargar Google Analytics 4 solo si existe `VITE_GA_MEASUREMENT_ID` **y** el visitante aceptó, con Consent Mode v2 en `denied` por defecto; sin ID no se carga nada. | Media | **CP-MED-002:** sin ID, o antes de aceptar, hay 0 peticiones a `googletagmanager.com` y `google-analytics.com` y 0 cookies `_ga*`; tras aceptar, GA4 recibe el `page_view` (DebugView). | HU-MED-002 | CU-MED-001 | Implementado (`BR-037`; falta verificarlo con un ID real y el DebugView de GA4) |
| RF-MED-003 | MED | Mostrar, solo si GA está configurado, un aviso de consentimiento con "Aceptar" y "Rechazar" de igual prominencia, cuya elección se conserva en el navegador. | Alta | **CP-MED-003:** la primera visita muestra el aviso; los dos botones tienen el mismo tamaño y contraste; "Rechazar" lo cierra sin cargar Google; al recargar no reaparece; con `localStorage` bloqueado reaparece en cada visita y no falla. | HU-MED-003 | CU-MED-001 | Implementado (`BR-037`; el texto de privacidad está por validar) |
| RF-MED-004 | MED | Con consentimiento, enviar a GA4 un `page_view` por cada cambio de ruta y los eventos `reserve_click`, `whatsapp_click` y `phone_click` con el parámetro `section`, sin datos personales y sin retrasar el enlace. | Media | **CP-MED-004:** con consentimiento, navegar 3 rutas genera 3 `page_view`; cada clic genera su evento con `section`; ningún parámetro lleva teléfono ni texto del visitante; sin consentimiento, 0 eventos. | HU-MED-002 | CU-MED-001 | Implementado (`BR-038`; verificado en Chrome real con `dataLayer`; falta ver los eventos en GA4) |
| RF-MED-005 | MED | Ofrecer "Preferencias de privacidad" en el footer para cambiar la elección, y publicar `/privacidad` con qué datos se recogen, para qué, quién los trata y cómo contactar. | Alta | **CP-MED-005:** el enlace del footer reabre el aviso; cambiar a rechazar detiene la medición y borra las cookies `_ga*`; `/privacidad` existe, lleva `noindex` y tiene los 4 apartados. | HU-MED-003 | CU-MED-001 | Implementado (`BR-037`, `BR-044`; el texto de `/privacidad` está por validar) |
| RF-MED-006 | MED | Con consentimiento, enviar a GA4 los eventos `promo_view`, `promo_close` y `reserve_click` con `section = promo` al ver, cerrar el modal de bienvenida o tocar «Reservar», sin datos personales. | Media | **CP-MED-006:** con consentimiento, ver, cerrar y tocar «Reservar» generan cada evento; ningún parámetro lleva texto del visitante; sin consentimiento, 0 eventos. | HU-RES-003 | CU-MED-001 | Propuesto (`BR-100`) |
| RF-CNT-001 | CNT | Descargar en el build cada pestaña publicada de la hoja (CSV), con un tiempo máximo de 10 s y sin claves, y generar el contenido del sitio. | Alta | **CP-CNT-001:** con las variables definidas, `npm run build` descarga las pestañas y el sitio muestra los valores de la hoja; sin variables no hace ninguna petición. | HU-CNT-001 | CU-CNT-001 | Implementado (`BR-040`; verificado con un servidor local que imita a Google; falta probarlo con la hoja real) |
| RF-CNT-002 | CNT | Validar cada pestaña (campos obligatorios, tipos, precio entero en CLP, largos máximos, ids únicos) y rechazarla completa si una fila falla, informando pestaña, fila y campo. | Alta | **CP-CNT-002:** una fila de servicios sin precio rechaza la pestaña; el log dice `servicios fila 4: precio requerido`; las demás pestañas siguen. | HU-CNT-001 | CU-CNT-001 | Implementado (`BR-039`: validación en el núcleo, con tests; falta conectarlo a la hoja real) |
| RF-CNT-003 | CNT | Conservar en el repo una copia (`snapshot`) del contenido como respaldo, usada cuando la hoja no está configurada, falla o es inválida; el build nunca la escribe. | Alta | **CP-CNT-003:** sin variables el sitio usa el snapshot y el build termina bien; con la hoja caída, igual más un aviso en el log del build. | HU-CNT-001 | CU-CNT-001 | Implementado (`BR-039`: lógica de respaldo; `BR-040`: descarga al construir; el snapshot sigue en `src/data` hasta `BR-041`) |
| RF-CNT-004 | CNT | Servicios, productos, equipo y preguntas frecuentes leen el contenido generado en lugar de listas escritas en `src/data`. | Alta | **CP-CNT-004:** los componentes importan el contenido generado; en `src/data` no quedan listas de esos cuatro contenidos salvo el snapshot; el JSON-LD de preguntas sale del mismo contenido. | HU-CNT-001 | — | Implementado (`BR-041`: las 4 páginas leen `siteContent`; el JSON-LD de preguntas pasa a `BR-006`) |
| RF-CNT-005 | CNT | Sustituir textos del sitio por clave desde la pestaña `textos`, con valor por defecto en el código y largo máximo por clave. | Baja | **CP-CNT-005:** `hero.lema` en la hoja cambia la portada; una clave ausente deja el texto por defecto; un valor demasiado largo se rechaza con aviso. | HU-CNT-002 | CU-CNT-001 | Implementado (`BR-042`: 13 textos de la home, probado con la home entera y de punta a punta con una hoja local) |
| RF-CNT-006 | CNT | Volver a leer la hoja en el navegador cuando la página termina de cargar y mostrar el contenido nuevo; una pestaña que falla conserva el contenido del build; sin hoja configurada no hay peticiones ni código de lectura. | Alta | **CP-CNT-006:** con la hoja configurada, cambiar un nombre en ella y recargar lo muestra sin reconstruir; con la hoja caída o una fila inválida se ve el contenido del build; sin variables no hay ninguna petición a Google. | HU-CNT-001 | CU-CNT-001 | Implementado (`BR-047`: probado con Chrome real, un servidor que imita a Google y con tu hoja real bajo la política de seguridad de Vercel) |
| RF-CNT-007 | CNT | Editar desde la hoja los datos de contacto, reservas, horarios y redes (pestaña `negocio`) y las sucursales (pestaña `sucursales`), validando teléfonos, correos y enlaces, y armar los enlaces de llamada, correo y WhatsApp a partir de lo que escribe el dueño. | Alta | **CP-CNT-007:** cambiar `telefono` en la hoja cambia el footer y el enlace `tel:`; un teléfono, correo o enlace inválido rechaza la pestaña y se conserva el dato anterior; el mapa solo acepta Google Maps. | HU-CNT-003 | CU-CNT-001 | Implementado (`BR-048`: probado con Chrome real; falta crear las pestañas en la hoja real) |
| RF-CNT-008 | CNT | Encender o apagar la promoción de bienvenida desde la clave `promo.activa` de la pestaña `textos` y editar desde ahí los textos del modal; una clave ausente deja la promoción apagada. | Media | **CP-CNT-008:** con `promo.activa` en `SI` el modal sale; en `NO` o ausente no sale ni se descarga su código; cambiar un texto de la hoja cambia el modal. | HU-RES-003 | CU-CNT-001 | Propuesto (`BR-100`) |

### 2.2 Notas de trazabilidad

- La reserva en sí (elegir hora, barbero y servicio) **no** es un RF de
  este sitio: la resuelve AgendaPro (ADR-001 de `architecture.md`).
- `HU-EXP-001` y `HU-EXP-002` no tienen RF propio: son requisitos de
  calidad y viven como RNF.

---

## 3. Requisitos no funcionales (RNF)

### 3.1 Categorías

- **PERF:** rendimiento percibido y peso de la página.
- **A11Y:** accesibilidad (WCAG 2.1 AA).
- **SEO:** visibilidad en buscadores.
- **SEG:** seguridad del sitio y de la cadena de dependencias.
- **CONF:** confiabilidad ante despliegues, recargas y fallos de terceros.
- **DATOS:** consistencia de los datos del negocio.
- **COMP:** compatibilidad de navegadores y dispositivos.
- **MANT:** mantenibilidad y verificación automática.
- **PRIV:** privacidad y consentimiento del visitante.

### 3.2 Tabla

| ID | Cat | Requisito no funcional | Métrica | Umbral | Método de verificación | Afecta a | Estado |
|---|---|---|---|---|---|---|---|
| RNF-PERF-001 | PERF | La página principal de cada ruta pinta rápido en un celular de gama media. | LCP (Lighthouse móvil) | ≤ 2,5 s en cada ruta | **CP-PERF-001:** Lighthouse móvil contra el preview, mediana de 3 corridas, las 7 rutas. | Todas las rutas | Implementado parcial (`BR-011`: LCP móvil local 7,5 s → 3,5 s al quitar el PNG; el resto es renderizado solo en el cliente, se resuelve con `BR-034`) |
| RNF-PERF-002 | PERF | El contenido no salta mientras carga. | CLS | ≤ 0,1 en cada ruta | **CP-PERF-002:** Lighthouse móvil; toda `<img>` tiene `width` y `height`. | Todas las rutas | Propuesto (`BR-012`, `BR-013`) |
| RNF-PERF-003 | PERF | La página responde a la interacción sin bloquear el hilo principal. | TBT (Lighthouse móvil) | ≤ 200 ms en cada ruta | **CP-PERF-003:** Lighthouse móvil. | Todas las rutas | Implementado (home: TBT móvil de 192 ms, mediana de 3 en producción el 2026-10-22, cierre de `BR-091` a `BR-095`; margen estrecho, una de las tres corridas pasó de 200 ms; faltan las demás rutas) |
| RNF-PERF-004 | PERF | Las imágenes llegan optimizadas. | Peso transferido de la home en la primera carga; peso de cualquier imagen servida | ≤ 1,5 MB; ≤ 300 KB por imagen | **CP-PERF-004:** pestaña Network del preview con caché deshabilitada; ninguna petición a dominios de imágenes de terceros. | Imágenes de todas las rutas | Propuesto (`BR-008`, `BR-011`, `BR-012`) |
| RNF-PERF-005 | PERF | El JavaScript inicial se mantiene acotado. | JS de la carga inicial de la home (gzip) | ≤ 200 KB | **CP-PERF-005:** `npm run build` + `vite-bundle-visualizer`; suma de los chunks que pide la home. | Home | Implementado (`BR-035`: 160 KB gzip medidos en el build local, 2026-10-12; falta confirmar en el preview) |
| RNF-PERF-006 | PERF | El scroll es fluido. | Componentes que se re-renderizan por evento de scroll; tareas largas durante el scroll de la home | 0; 0 tareas > 50 ms atribuibles al scroll | **CP-PERF-006:** React DevTools Profiler y panel Performance (CPU 4x) mientras se hace scroll por toda la home. | Home y páginas con parallax | Implementado (`BR-014`, `BR-015`, `BR-016`, `BR-049`: sin tareas largas durante el scroll de la home en el build, CPU 4x; falta el Profiler de re-renders y la prueba en un celular real) |
| RNF-A11Y-001 | A11Y | Cada ruta cumple las buenas prácticas de accesibilidad automatizables. | Puntuación de accesibilidad de Lighthouse | ≥ 95 en cada ruta | **CP-A11Y-001:** Lighthouse contra el preview; bloqueante en el CI (`BR-031`). | Todas las rutas | Propuesto |
| RNF-A11Y-002 | A11Y | Sin barreras graves para teclado y lector de pantalla. | Violaciones de axe con impacto `critical` o `serious` | 0 | **CP-A11Y-002:** axe DevTools en cada ruta y en el menú móvil abierto; recorrido manual solo con teclado. | Todas las rutas | Propuesto (menú móvil, `alt` del logo, buscador sin label; `BR-033`) |
| RNF-A11Y-003 | A11Y | Se respeta la preferencia de reducir el movimiento. | Animaciones de desplazamiento o parallax activas con `prefers-reduced-motion: reduce` | 0 | **CP-A11Y-003:** emular `prefers-reduced-motion: reduce` en DevTools y recorrer cada ruta. | Todas las rutas | Implementado (`BR-017`, `BR-049`: sin Lenis con reducir movimiento, comprobado en la home; falta el recorrido de las 7 rutas) |
| RNF-A11Y-004 | A11Y | El texto se puede leer sobre su fondo. | Contraste texto/fondo | ≥ 4,5:1 texto normal; ≥ 3:1 texto grande y componentes de UI | **CP-A11Y-004:** auditoría de contraste de Lighthouse y axe, **más** `contrast.e2e.test.ts` (estilos calculados en Chrome real, ruta por ruta): axe deja como "incompleto" el texto sobre fondos animados y no detectó un título invisible en la 404 (`BR-045`). | Todas las rutas | Propuesto |
| RNF-A11Y-005 | A11Y | Ninguna animación del sitio puede provocar una crisis por destellos (WCAG 2.3.1). | Destellos por segundo en cualquier secuencia animada | ≤ 3 por segundo, en un área pequeña de la pantalla; 0 con `prefers-reduced-motion: reduce` | **CP-A11Y-005:** capturar la secuencia (fotogramas o grabación en Chrome) y contar los cambios fuertes de luminancia por segundo; con `prefers-reduced-motion: reduce` emulado, la secuencia no se monta. | Loader de neón (`BR-054`) y toda animación nueva con parpadeo | Implementado (`BR-054`: `neonLoaderHtml.test.ts` cuenta los destellos de los keyframes, ≤ 3 por segundo; falta la grabación en Chrome real del CP) |
| RNF-SEO-001 | SEO | Cada ruta cumple las buenas prácticas de SEO automatizables. | Puntuación SEO de Lighthouse | ≥ 95 en cada ruta | **CP-SEO-001-N:** Lighthouse contra el preview. | Todas las rutas | Propuesto |
| RNF-SEO-002 | SEO | Los datos que Google recibe del negocio son correctos y válidos. | Errores en la prueba de resultados enriquecidos; datos del JSON-LD distintos a los de `src/config/` | 0; 0 | **CP-SEO-002-N:** prueba de resultados enriquecidos de Google sobre la URL de producción; test que compara el JSON-LD con `src/config/` (`BR-006`). | Home, FAQ | Propuesto |
| RNF-SEO-003 | SEO | Los metadatos de cada ruta son visibles sin ejecutar JavaScript. | Rutas cuyo HTML inicial trae su propio `<title>` y `description` | 7 de 7 | **CP-SEO-003-N:** `curl` a cada ruta del preview y lectura del `<head>`. | Todas las rutas | Propuesto (spike de prerender; `BR-034`) |
| RNF-SEG-001 | SEG | El sitio se sirve con cabeceras de seguridad. | Cabeceras presentes: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors` (o `X-Frame-Options`) | 6 de 6; nota A o superior en securityheaders.com | **CP-SEG-001:** `curl -I` a la producción y escaneo en securityheaders.com; la CSP no rompe el mapa embebido, las fuentes ni los enlaces externos. | Todo el sitio | Implementado (`BR-002`: 6 de 6 cabeceras en producción; falta la nota de securityheaders.com) |
| RNF-SEG-002 | SEG | Ningún secreto en el repo y ningún enlace externo inseguro. | Secretos versionados; enlaces `target="_blank"` sin `rel="noopener noreferrer"` | 0; 0 | **CP-SEG-002:** `.env*` en `.gitignore`; búsqueda de `target="_blank"` en `src/` sin `rel`. | Todo el sitio | Propuesto (`BR-007`, `BR-010`) |
| RNF-SEG-003 | SEG | Las dependencias de producción no tienen vulnerabilidades conocidas graves. | Vulnerabilidades `high` o `critical` en `npm audit --omit=dev` | 0 | **CP-SEG-003:** `npm audit --omit=dev` antes de cada despliegue y en el CI. | Build | Implementado (`BR-039` y `BR-040`: hoja caída, 404, HTML, fila inválida y timeout dejan el build en verde con el respaldo, con builds reales de prueba; falta probarlo con Google) |
| RNF-CONF-001 | CONF | Cualquier ruta funciona al entrar directo o al recargar. | Rutas que responden 200 con la app al recargarlas en producción; rutas inexistentes que muestran la 404 propia | 7 de 7; 100 % | **CP-CONF-001:** recargar cada ruta y una inexistente en el preview. | Todas las rutas | Verificado (`BR-002`, `BR-003`: 7 de 7 rutas y la 404 responden 200 en producción, 2026-10-12) |
| RNF-CONF-002 | CONF | Un despliegue nuevo no deja pestañas abiertas en blanco. | Pantallas en blanco tras un fallo de carga de chunk; recargas automáticas por incidente | 0; ≤ 1 | **CP-CONF-002:** con el sitio abierto, desplegar una versión nueva y navegar a una ruta no visitada. | Rutas lazy | Propuesto (`BR-020`) |
| RNF-DATOS-001 | DATOS | Los datos del negocio (sucursales, teléfono, WhatsApp, email, horario, redes, URL de reserva) tienen una sola fuente de verdad. | Definiciones literales de esos datos fuera de `src/config/` y `src/data/locationsData.ts`; diferencias entre esa fuente y `index.html`, `sitemap.xml` y el JSON-LD | 0; 0 | **CP-DATOS-001:** agente `datos-negocio-auditor` sin hallazgos y un test que compara el JSON-LD con la fuente. | Footer, ubicación, navbar, SEO | Propuesto (`BR-005`) |
| RNF-COMP-001 | COMP | El sitio funciona en los navegadores y anchos de pantalla de la clientela. | Defectos visuales o funcionales en las 2 últimas versiones de Chrome, Safari iOS, Firefox y Edge; scroll horizontal entre 360 y 1920 px | 0; 0 | **CP-COMP-001:** recorrido manual del preview en Safari iOS y Chrome Android reales, y en escritorio con 360, 768, 1280 y 1920 px. | Todo el sitio | Propuesto |
| RNF-MANT-001 | MANT | Ningún cambio llega a `master` sin pasar la verificación automática. | Pasos del pipeline (lint sin warnings, tipos, tests, build) en verde para integrar | 4 de 4 | **CP-MANT-001:** protección de rama en GitHub que exige el check del CI. | Todo el repo | Verificado (`BR-029` + protección de `master` que exige el check, 2026-10-12) |
| RNF-MANT-002 | MANT | Los tests cubren la lógica del sitio. | Cobertura de líneas de `src/config`, `src/hooks` y funciones puras | Línea base medida al cerrar `BR-030`, redondeada hacia abajo; solo sube | **CP-MANT-002:** `vitest --coverage` con umbral en la configuración; bajar del umbral falla el CI. | `src/` | Implementado (`BR-030`: umbral 4/19/16/4 en el CI; sube con cada ticket. `BR-095`: los e2e corren en su propio proyecto de Vitest, cinco corridas seguidas en verde) |
| RNF-MANT-003 | MANT | El repo no acumula código ni dependencias sin uso. | Exportaciones sin consumidores; dependencias declaradas sin importar | 0; 0 | **CP-MANT-003:** agente `deuda-tecnica-auditor` (chequeo de código muerto) sin hallazgos. | `src/`, `package.json` | Propuesto (`BR-025`; tramos de `BR-022` y `BR-027` hechos el 2026-10-22) |
| RNF-MANT-004 | MANT | Los estilos son mobile-first y usan un solo conjunto de cortes. | `@media` con `max-width` de ancho; cortes fuera de {640, 769, 1025, 1280} px de ancho y 720 px de alto | 0; 0 (fuera de la lista de pendientes mientras dure la migración) | **CP-MANT-004:** `src/styles/breakpoints.test.ts` recorre los `.css` de `src/`; agente `design-tokens-auditor` (chequeo 4). | `src/**/*.css`, `src/config/breakpoints.ts` | Propuesto (`BR-024`, `BR-080` a `BR-083`) |
| RNF-PRIV-001 | PRIV | Sin consentimiento no se envía información del visitante a terceros. | Peticiones a dominios de Google y cookies de analítica antes de aceptar | 0; 0 | **CP-PRIV-001:** en el preview con una sesión nueva, la pestaña Network y Application → Cookies no muestran peticiones a `googletagmanager.com` ni a `google-analytics.com` ni cookies `_ga*` hasta aceptar; un test automatizado comprueba que el cargador de GA no se ejecuta sin consentimiento. | Todo el sitio | Propuesto |
| RNF-PRIV-002 | PRIV | Los datos personales del formulario de canje no se envían ni se guardan sin aceptación explícita, y `/privacidad` los declara. | Peticiones con datos del formulario antes de aceptar; datos personales no declarados en `/privacidad` | 0; 0 | **CP-PRIV-002:** en el preview, completar el formulario sin aceptar no genera ninguna petición; con la aceptación, solo hay una petición al receptor del ADR; `/privacidad` explica qué se guarda, para qué, dónde y cómo pedir el borrado; un test automatizado cubre el primer caso. | Modal de canje, `/privacidad` | Propuesto (`BR-101`) |
| RNF-PERF-007 | PERF | La analítica no empeora la carga de la página. | Diferencia de LCP y de TBT con y sin las variables de analítica (Lighthouse móvil, mediana de 3) | ≤ 0,2 s y ≤ 50 ms | **CP-PERF-007:** Lighthouse contra el preview con y sin las variables; los scripts de analítica se piden después del evento `load`. | Todas las rutas | Propuesto |
| RNF-SEG-004 | SEG | La CSP permite solo lo necesario para la analítica y nada más. | Directivas de `script-src` con `unsafe-inline` o `unsafe-eval`; orígenes de terceros permitidos | 0; solo `googletagmanager.com`, `google-analytics.com` y `*.analytics.google.com` | **CP-SEG-004:** test sobre `vercel.json` y consola del preview sin violaciones de CSP con GA activo. | Todo el sitio | Propuesto |
| RNF-CONF-003 | CONF | El contenido de la hoja nunca rompe el build ni deja el sitio incompleto. | Builds que fallan por la hoja; tiempo máximo esperando la hoja | 0; 10 s | **CP-CONF-003:** build con la hoja caída, con una pestaña inválida y con el tiempo de espera agotado: termina bien usando el snapshot de lo que falló. | Build | Propuesto |
| RNF-DATOS-002 | DATOS | Hay una sola fuente editable por contenido y su formato es verificable. | Contenidos con dos fuentes editables; precios que no son enteros en CLP | 0; 0 | **CP-DATOS-002:** un test valida el snapshot con el mismo esquema que la hoja y comprueba que `src/data` no duplica el contenido. | Catálogo | Verificado en local (`BR-039` + `BR-041`: respaldo y plantillas se leen como hoja sin cambios y `src/data` ya no duplica el catálogo, con tests) |

### 3.3 Notas de trazabilidad RNF

- Los umbrales de rendimiento son los "buenos" de Core Web Vitals. El INP
  real solo se mide con usuarios reales; mientras no haya analítica
  (backlog §4), el TBT de laboratorio es su sustituto.
- `RNF-SEO-003` puede terminar en `Retirado` si el spike `BR-034` concluye
  que el prerender no se justifica; se deja escrito el motivo.

---

## 4. Matriz de trazabilidad HU → RF / RNF

| HU | RF | RNF |
|---|---|---|
| HU-RES-001 | RF-RES-001 | RNF-SEG-002, RNF-DATOS-001 |
| HU-RES-002 | RF-RES-002 | RNF-DATOS-001 |
| HU-RES-003 | RF-RES-003, RF-RES-004, RF-CNT-008, RF-MED-006 | RNF-PERF-002, RNF-PERF-003, RNF-A11Y-002 .. RNF-A11Y-005, RNF-DATOS-001, RNF-PRIV-001 |
| HU-RES-004 | RF-RES-005, RF-RES-006, RF-RES-007 | RNF-PRIV-002, RNF-SEG-004, RNF-A11Y-002, RNF-DATOS-001 |
| HU-INFO-001 | RF-INFO-001 | RNF-PERF-004 |
| HU-INFO-002 | RF-INFO-003 | RNF-DATOS-001 |
| HU-INFO-003 | RF-INFO-004, RF-INFO-005, RF-INFO-007, RF-INFO-009, RF-INFO-010 | RNF-PERF-004, RNF-A11Y-002, RNF-SEG-002, RNF-SEG-004, RNF-PRIV-001 |
| HU-INFO-004 | RF-INFO-002, RF-INFO-011 | RNF-PERF-004, RNF-A11Y-002 |
| HU-INFO-005 | RF-INFO-006, RF-SEO-002 | RNF-A11Y-002 |
| HU-INFO-006 | RF-INFO-008 | RNF-PERF-004, RNF-SEG-002, RNF-SEG-004, RNF-PRIV-001, RNF-CONF-003 |
| HU-SEO-001 | RF-SEO-001, RF-SEO-002, RF-SEO-003 | RNF-SEO-001, RNF-SEO-002, RNF-SEO-003 |
| HU-EXP-001 | — | RNF-PERF-001 .. RNF-PERF-006, RNF-COMP-001 |
| HU-EXP-002 | RF-NAV-001 | RNF-A11Y-001 .. RNF-A11Y-004 |
| HU-EXP-003 | RF-NAV-002, RF-NAV-003 | RNF-CONF-001, RNF-CONF-002 |
| HU-EXP-004 | RF-INFO-004, RF-INFO-010, RF-INFO-011 | RNF-PERF-001 .. RNF-PERF-003, RNF-A11Y-003 .. RNF-A11Y-005, RNF-DATOS-001 |
| HU-OPS-001 | RF-OPS-001, RF-OPS-002 | RNF-SEG-001, RNF-SEG-003, RNF-MANT-001, RNF-MANT-002, RNF-MANT-003, RNF-MANT-004 |
| HU-MED-001 | RF-MED-001 | RNF-PRIV-001, RNF-PERF-007, RNF-SEG-004 |
| HU-MED-002 | RF-MED-002, RF-MED-004 | RNF-PRIV-001, RNF-PERF-007, RNF-SEG-004 |
| HU-MED-003 | RF-MED-003, RF-MED-005 | RNF-PRIV-001, RNF-A11Y-002, RNF-PERF-002 |
| HU-CNT-001 | RF-CNT-001 .. RF-CNT-004, RF-CNT-006 | RNF-CONF-003, RNF-DATOS-002, RNF-PERF-001, RNF-SEG-004 |
| HU-CNT-002 | RF-CNT-005 | RNF-CONF-003, RNF-DATOS-002 |
| HU-CNT-003 | RF-CNT-007 | RNF-DATOS-001, RNF-CONF-003, RNF-SEG-004 |

## 5. Documentos relacionados

- [`historias-usuario.md`](./historias-usuario.md)
- [`casos-uso.md`](./casos-uso.md)
- [`backlog.md`](./backlog.md)
- [`engineering-guidelines.md`](./engineering-guidelines.md)
