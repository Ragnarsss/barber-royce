# Historias de usuario — barber-royce

Fecha: 2026-10-12
Estado: activo. Fuente del **para qué** de cada ticket del
[`backlog.md`](./backlog.md).

**Origen (2026-10-12):** reconstruidas a partir de lo que el sitio ya hace,
de `docs/archivo/WEB_REQUIREMENTS_CHECKLIST.md` y de la auditoría previa al
despliegue (`BR-001`). Las HU de funcionalidades ya construidas están
`Aprobada` y sus criterios se verifican al cerrar los tickets que las
citan.

## Convenciones

- **ID:** `HU-<MOD>-NNN`. Módulos: `RES` (reserva y contacto), `INFO`
  (contenido del negocio), `SEO` (búsqueda local), `EXP` (experiencia:
  rendimiento, accesibilidad, errores), `OPS` (despliegue y calidad),
  `MED` (medición y privacidad), `CNT` (contenido editable por el dueño).
- **Prioridad:** Alta · Media · Baja.
- **Estimación:** story points de Fibonacci (1, 2, 3, 5, 8, 13).
- **Estado:** `Propuesta` · `Aprobada` · `En desarrollo` · `Cerrada`.
- **Criterios de aceptación:** `CA-NN` en formato Given/When/Then. Un
  ticket los cita como `(HU-XXX CA-NN)`.
- **Reglas de negocio:** `RN-NN`.
- Un cambio a una HU nunca se reescribe en silencio: se agrega
  `> Actualizada (AAAA-MM-DD): …` debajo del título.

## Actores

| Actor | Descripción |
|---|---|
| Cliente | Persona que visita el sitio, casi siempre desde el celular, para decidir si reserva y dónde. |
| Dueño | Administra la barbería. Hasta ahora no edita el sitio: pide los cambios. Con `HU-CNT-001` edita el contenido en una hoja de cálculo. |
| Desarrollador | Mantiene y despliega el sitio. |
| Buscador | Google y otros crawlers que indexan el sitio. |

## Resumen

| ID | Módulo | Título corto | Prioridad | Valor (1-5) | SP | Dependencias | Estado |
|---|---|---|---|---|---|---|---|
| HU-RES-001 | RES | Reservar hora desde cualquier página | Alta | 5 | 3 | HU-INFO-002 | Aprobada |
| HU-RES-002 | RES | Consultar por WhatsApp o teléfono | Alta | 4 | 2 | HU-INFO-002 | Aprobada |
| HU-INFO-001 | INFO | Ver servicios con precio y duración | Alta | 5 | 3 | — | Aprobada |
| HU-INFO-002 | INFO | Ver sucursales, horarios y contacto correctos | Alta | 5 | 3 | — | Aprobada |
| HU-INFO-003 | INFO | Conocer al equipo y la barbería | Media | 3 | 2 | — | Aprobada |
| HU-INFO-004 | INFO | Ver productos disponibles | Baja | 2 | 3 | — | Propuesta |
| HU-INFO-005 | INFO | Resolver dudas frecuentes | Media | 3 | 2 | — | Aprobada |
| HU-INFO-006 | INFO | Ver el trabajo real de la barbería en sus fotos de Instagram | Media | 4 | 5 | HU-INFO-003 | Propuesta |
| HU-SEO-001 | SEO | Aparecer en búsquedas locales | Alta | 5 | 5 | HU-INFO-002 | Aprobada |
| HU-EXP-001 | EXP | Sitio rápido y fluido en el celular | Alta | 5 | 8 | — | Aprobada |
| HU-EXP-002 | EXP | Sitio accesible y respetuoso con el movimiento | Media | 4 | 5 | — | Aprobada |
| HU-EXP-003 | EXP | Mensaje claro si algo falla o la página no existe | Alta | 4 | 3 | — | Aprobada |
| HU-EXP-004 | EXP | Una primera impresión visual que se recuerde | Media | 4 | 13 | HU-EXP-001, HU-EXP-002 | Propuesta |
| HU-OPS-001 | OPS | Desplegar cambios verificados sin romper producción | Alta | 5 | 5 | — | Aprobada |
| HU-MED-001 | MED | Ver cuántas personas visitan el sitio | Media | 4 | 2 | HU-OPS-001 | Propuesta |
| HU-MED-002 | MED | Saber cuántos visitantes tocan "Reservar" y de dónde llegan | Media | 4 | 5 | HU-MED-003, HU-RES-001 | Propuesta |
| HU-MED-003 | MED | Decidir si acepto que midan mi visita | Alta | 5 | 5 | — | Propuesta |
| HU-CNT-001 | CNT | Cambiar servicios, productos, equipo y preguntas desde una hoja | Alta | 5 | 8 | HU-INFO-001 | Propuesta |
| HU-CNT-002 | CNT | Cambiar títulos y textos del sitio desde la misma hoja | Baja | 3 | 5 | HU-CNT-001 | Propuesta |
| HU-CNT-003 | CNT | Cambiar datos de contacto, sucursales y redes desde la hoja | Alta | 5 | 8 | HU-CNT-001 | Propuesta |

## Épicas

| Épica | Historias |
|---|---|
| Captación y reserva | HU-RES-001, HU-RES-002 |
| Contenido del negocio | HU-INFO-001 .. HU-INFO-005 |
| Visibilidad local | HU-SEO-001 |
| Experiencia | HU-EXP-001 .. HU-EXP-004 |
| Operación | HU-OPS-001 |
| Medición y privacidad | HU-MED-001, HU-MED-002, HU-MED-003 |
| Contenido editable | HU-CNT-001, HU-CNT-002, HU-CNT-003 |

---

## HU-RES-001 - Reservar hora desde cualquier página

Como cliente, quiero un botón para reservar mi hora visible en cualquier
página, para agendar en el momento en que me decido sin buscar cómo
hacerlo.

- Epic: Captación y reserva
- Actor / Persona: Cliente
- Prioridad: Alta
- Estimación: 3 SP
- Fuente: objetivo del sitio (captación); ADR-001 de `architecture.md`.
- Dependencias: HU-INFO-002 (la reserva es por sucursal).
- Riesgo: Medio — la conversión depende de un enlace externo; un enlace
  roto o una URL desactualizada corta la captación sin que nadie se entere.
- Decisiones cerradas (2026-10-12): la reserva se hace en AgendaPro; el
  sitio solo deriva (ADR-001).
- RF relacionados: RF-RES-001.
- RNF impactados: RNF-SEG-002 (enlaces externos), RNF-DATOS-001 (URL única).
- Casos de uso relacionados: CU-RES-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given estoy en cualquier página, When busco cómo reservar, Then
  veo un botón "Reservar" en la barra de navegación (escritorio y menú
  móvil) sin hacer scroll.
- CA-02: Given hago clic en cualquier botón "Reservar", When se abre la
  reserva, Then se abre AgendaPro en una pestaña nueva y el sitio sigue
  abierto en la pestaña original.
- CA-03: Given la URL de AgendaPro cambia, When el desarrollador la
  actualiza, Then basta con editar un solo lugar del código.

### Reglas de negocio asociadas:

- RN-01: Todo enlace a AgendaPro abre en pestaña nueva con
  `rel="noopener noreferrer"`.
- RN-02: **Pregunta abierta (2026-10-12):** hay dos sucursales (La Serena y
  Coquimbo) y una sola URL de AgendaPro (`sucursal/400965`). Falta
  confirmar con el dueño si cada sucursal tiene su propia URL de reserva.

### Datos:

- Entrada: clic del cliente.
- Salida: navegación a la URL de AgendaPro de la sucursal.

---

## HU-RES-002 - Consultar por WhatsApp o teléfono

Como cliente, quiero escribir por WhatsApp o llamar a la barbería desde el
sitio, para resolver una duda antes de reservar.

- Epic: Captación y reserva
- Actor / Persona: Cliente
- Prioridad: Alta
- Estimación: 2 SP
- Fuente: sitio actual (footer, ubicación).
- Dependencias: HU-INFO-002.
- Riesgo: Alto — hoy el teléfono publicado es de ejemplo
  (`(123) 456-7890`) y el número de WhatsApp mostrado no coincide con el
  del enlace.
- RF relacionados: RF-RES-002.
- RNF impactados: RNF-DATOS-001.
- Casos de uso relacionados: CU-RES-001 (flujo alternativo).

### Criterios de aceptación (Given/When/Then)

- CA-01: Given estoy en el celular, When toco el teléfono, Then se abre el
  marcador con el número real de la sucursal.
- CA-02: Given toco "WhatsApp", When se abre la conversación, Then el
  número coincide con el que el sitio muestra y el mensaje viene
  prellenado.
- CA-03: Given cualquier página del sitio, When reviso los datos de
  contacto, Then son idénticos en el footer, la página de ubicación y los
  datos estructurados.

### Reglas de negocio asociadas:

- RN-01: El número mostrado y el del enlace salen del mismo dato.

### Datos:

- Entrada: clic o toque.
- Salida: `tel:` o enlace de WhatsApp con mensaje prellenado.

---

## HU-INFO-001 - Ver servicios con precio y duración

Como cliente, quiero ver los servicios con su precio, duración y qué
incluyen, para decidir qué reservar antes de entrar a AgendaPro.

- Epic: Contenido del negocio
- Actor / Persona: Cliente
- Prioridad: Alta
- Estimación: 3 SP
- Fuente: sitio actual (`/servicios`).
- Dependencias: Ninguna.
- Riesgo: Medio — un precio desactualizado genera reclamos en el local.
- RF relacionados: RF-INFO-001.
- RNF impactados: RNF-PERF-004 (imágenes).
- Casos de uso relacionados: CU-INFO-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given entro a `/servicios`, When carga la página, Then veo cada
  servicio con nombre, descripción, precio en pesos chilenos y duración.
- CA-02: Given elijo una categoría, When filtro, Then solo veo los
  servicios de esa categoría y puedo volver a ver todos.
- CA-03: Given veo un servicio, When quiero reservarlo, Then tengo a mano
  el botón de reserva (HU-RES-001).

### Reglas de negocio asociadas:

- RN-01: Precios en CLP con formato `$15.000`.
- RN-02: Las imágenes son propias de la barbería o con licencia
  verificada; no se enlazan imágenes de terceros (hoy vienen de Unsplash).

### Datos:

- Entrada: categoría elegida (opcional).
- Salida: lista de servicios (`src/data/servicesData.ts`).

---

## HU-INFO-002 - Ver sucursales, horarios y contacto correctos

Como cliente, quiero ver la dirección, el mapa, el horario y el contacto de
cada sucursal, para llegar sin perderme y no encontrarla cerrada.

- Epic: Contenido del negocio
- Actor / Persona: Cliente
- Prioridad: Alta
- Estimación: 3 SP
- Fuente: sitio actual (`/ubicacion`, footer); NAP consistency de
  `docs/archivo/WEB_REQUIREMENTS_CHECKLIST.md` §1.3.
- Dependencias: Ninguna.
- Riesgo: Alto — hoy hay horarios contradictorios ("Lun-Sáb 9:00-20:00"
  frente a "Lun-Vie 10:00-20:00"), dos emails distintos y redes que no
  coinciden entre el sitio y los datos estructurados.
- RF relacionados: RF-INFO-003.
- RNF impactados: RNF-DATOS-001.
- Casos de uso relacionados: CU-INFO-002.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given entro a `/ubicacion`, When elijo una sucursal, Then veo su
  dirección, mapa, horario por día y contacto.
- CA-02: Given cualquier lugar del sitio donde aparece un horario, un
  teléfono, un email o una red social, When los comparo, Then son
  idénticos (incluidos los datos estructurados de `index.html`).
- CA-03: Given el mapa embebido no carga, When miro la sucursal, Then sigo
  viendo la dirección en texto y un enlace para abrirla en Google Maps.

### Reglas de negocio asociadas:

- RN-01: Sucursales vigentes: Barbería Royce La Serena (Larrain Alcalde
  3108) y Barbería Royce Coquimbo (Pdte. Alessandri 1871). Confirmar con el
  dueño antes de desplegar.
- RN-02: Horario en formato de 24 horas, por día.

### Datos:

- Entrada: sucursal elegida.
- Salida: datos de `src/data/locationsData.ts` y `src/config/constants.ts`.

---

## HU-INFO-003 - Conocer al equipo y la barbería

Como cliente, quiero conocer a los barberos y la historia de la barbería, y
ver reseñas de otros clientes, para confiar antes de reservar.

- Epic: Contenido del negocio
- Actor / Persona: Cliente
- Prioridad: Media
- Estimación: 2 SP
- Fuente: sitio actual (`/equipo`, `/nosotros`, reseñas en la home).
- Dependencias: Ninguna.
- Riesgo: Bajo.
- RF relacionados: RF-INFO-004, RF-INFO-005, RF-INFO-007, RF-INFO-010.
- RNF impactados: RNF-PERF-004.
- Casos de uso relacionados: —

### Criterios de aceptación (Given/When/Then)

- CA-01: Given entro a `/equipo`, When carga, Then veo a cada barbero con
  foto, nombre y especialidad.
- CA-02: Given entro a `/nosotros`, When carga, Then veo la historia y los
  valores de la barbería.
- CA-03: Given estoy en la home, When llego a la sección de reseñas, Then
  veo reseñas reales con su autor.

### Reglas de negocio asociadas:

- RN-01: Las reseñas publicadas son reales. No se publica una calificación
  agregada en los datos estructurados que no salga de una fuente
  verificable (Google).

> Actualizada (2026-10-14, pedido del usuario): las reseñas de la home pasan a
> salir de las reseñas de Google de la barbería (`BR-052`). Hoy son tres textos
> de muestra en `src/data/reviewsData.ts`, así que CA-03 no se cumple. Se
> agregan CA-04 a CA-06 y RN-02. Nota sobre RN-01: las pautas de datos
> estructurados de Google no aceptan, para un negocio local, calificaciones
> copiadas de otros sitios; por eso `BR-052` no agrega `aggregateRating` al
> JSON-LD, y el valor fijo actual (4,6 con 15 reseñas) lo quita `BR-006`.

- CA-04 (2026-10-14): Given la ficha de Google de la barbería está conectada,
  When llego a la sección de reseñas, Then veo reseñas de Google con su autor,
  su calificación y la indicación de que vienen de Google.
- CA-05 (2026-10-14): Given toco «Ver todas las reseñas», When se abre el
  enlace, Then llego a la ficha de la barbería en Google Maps.
- CA-06 (2026-10-14): Given Google no responde o la conexión no está
  configurada, When abro la home, Then la sección no se ve rota ni muestra
  reseñas inventadas: se oculta o muestra solo el enlace a la ficha de Google.
- CA-07 (2026-10-14, pedido del usuario, `BR-063`): Given estoy en `/equipo`,
  When hago clic en un barbero (o lo activo con el teclado), Then se abre su
  ficha con foto, nombre, especialidades y una descripción que el dueño edita
  en la hoja; si alguna falta, la ficha se ve completa sin ella.
- RN-02 (2026-10-14): Las reseñas de Google se muestran tal como las escribió
  su autor: sin editar el texto ni cambiar la calificación.

### Datos:

- Salida: `src/data/teamData.ts`, `aboutData.ts`, `reviewsData.ts`.

---

## HU-INFO-004 - Ver productos disponibles

> Actualizada (2026-10-12): queda `Propuesta` hasta decidir qué hace el
> botón "Comprar" (`BR-009`).
>
> Actualizada (2026-10-15, decisión del usuario): el botón «Comprar» se quita
> (`BR-009`): por ahora el sitio no vende productos. CA-03 y RN-01 se cumplen
> sin botón.

Como cliente, quiero ver los productos que vende la barbería con su
precio, para saber qué puedo comprar en el local.

- Epic: Contenido del negocio
- Actor / Persona: Cliente
- Prioridad: Baja
- Estimación: 3 SP
- Fuente: sitio actual (`/productos`).
- Dependencias: Ninguna.
- Riesgo: Medio — hoy los precios están en formato de dólares (`$25`), las
  imágenes son de Unsplash y el botón "Comprar" no hace nada.
- RF relacionados: RF-INFO-002.
- RNF impactados: RNF-PERF-004.
- Casos de uso relacionados: CU-INFO-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given entro a `/productos`, When carga, Then veo cada producto con
  nombre, descripción, foto y precio en CLP.
- CA-02: Given filtro por categoría o busco por texto, When escribo, Then
  la lista se actualiza sin recargar la página.
- CA-03: Given toco la acción de un producto, When se ejecuta, Then hace lo
  que el texto del botón promete (decisión en `BR-009`).
  - Resuelto (2026-10-15, `BR-009`): no hay acción de compra; Given entro a
    `/productos`, When veo un producto, Then no hay ningún botón «Comprar».

### Reglas de negocio asociadas:

- RN-01: No se muestra un botón que no hace nada.

### Datos:

- Entrada: categoría y texto de búsqueda.
- Salida: `src/data/productsData.ts`.

---

## HU-INFO-005 - Resolver dudas frecuentes

Como cliente, quiero leer las preguntas frecuentes agrupadas por tema, para
resolver mis dudas sin tener que escribir.

- Epic: Contenido del negocio
- Actor / Persona: Cliente
- Prioridad: Media
- Estimación: 2 SP
- Fuente: sitio actual (`/preguntas-frecuentes`).
- Dependencias: Ninguna.
- Riesgo: Bajo.
- RF relacionados: RF-INFO-006, RF-SEO-002.
- RNF impactados: RNF-A11Y-002.
- Casos de uso relacionados: —

### Criterios de aceptación (Given/When/Then)

- CA-01: Given entro a `/preguntas-frecuentes`, When elijo una categoría,
  Then veo solo sus preguntas.
- CA-02: Given abro una pregunta con el teclado, When presiono Enter o
  Espacio, Then se despliega la respuesta y el lector de pantalla anuncia
  que está expandida.
- CA-03: Given las preguntas de `faqData.ts`, When se generan los datos
  estructurados `FAQPage`, Then contienen exactamente las mismas preguntas
  y respuestas.

### Datos:

- Salida: `src/data/faqData.ts`.

---

## HU-INFO-006 - Ver el trabajo real de la barbería en sus fotos de Instagram

Como cliente que está decidiendo dónde cortarse, quiero ver en el sitio las
fotos reales y recientes que la barbería publica en Instagram, para juzgar su
trabajo antes de reservar.

- Epic: Contenido del negocio
- Actor / Persona: Cliente
- Prioridad: Media
- Estimación: 5 SP
- Fuente: pedido del usuario (2026-10-14): «que la parrilla de fotos se conecte
  a Instagram», para que la prueba social deje de ser de muestra. Hoy la
  parrilla de la home (`SocialProof2`) muestra íconos de cámara en lugar de fotos.
- Dependencias: HU-INFO-003 (misma sección de confianza), HU-EXP-001 (las
  fotos no pueden costar velocidad), HU-MED-003 (privacidad del visitante).
- Riesgo: Alto — Instagram exige una cuenta profesional y un token de acceso que
  vence y es secreto (no puede llegar al navegador); las direcciones de las fotos
  de Instagram caducan; si la integración falla, la sección no puede quedar rota
  ni vacía.
- RF relacionados: RF-INFO-008.
- RNF impactados: RNF-PERF-004, RNF-SEG-002, RNF-SEG-004, RNF-PRIV-001,
  RNF-CONF-003.
- Casos de uso relacionados: —

### Criterios de aceptación (Given/When/Then)

- CA-01: Given la cuenta de Instagram está conectada, When abro la home, Then la
  parrilla muestra las publicaciones más recientes de la barbería, en su orden.
- CA-02: Given toco una foto, When se abre el enlace, Then llego a esa
  publicación en Instagram, en una pestaña nueva.
- CA-03: Given Instagram no responde o la conexión no está configurada, When
  abro la home, Then la sección no se ve rota: muestra las últimas fotos que se
  obtuvieron o, si nunca hubo, una invitación a seguir la cuenta.
- CA-04: Given abro la home en un celular de gama media, When mido con
  Lighthouse móvil, Then las fotos no empeoran LCP ni CLS y cada imagen respeta
  el peso máximo de RNF-PERF-004.
- CA-05: Given reviso el código del sitio publicado, When busco el token de
  Instagram, Then no aparece en ningún archivo que descargue el navegador.

### Reglas de negocio asociadas:

- RN-01: Solo se muestran publicaciones de la cuenta de la barbería; nada de
  fotos de banco de imágenes en esta sección.
- RN-02: Cada foto lleva un texto alternativo; si la publicación no tiene
  descripción, uno genérico («Publicación de Instagram de Royce Barbería»).

---

## HU-SEO-001 - Aparecer en búsquedas locales

Como dueño, quiero que la barbería aparezca con datos correctos cuando
alguien busca "barbería en Coquimbo" o "barbería en La Serena", para
recibir clientes nuevos.

- Epic: Visibilidad local
- Actor / Persona: Dueño (beneficiario), Buscador (actor técnico)
- Prioridad: Alta
- Estimación: 5 SP
- Fuente: `docs/archivo/WEB_REQUIREMENTS_CHECKLIST.md` §1.
- Dependencias: HU-INFO-002 (los datos tienen que ser correctos antes de
  publicarlos a Google).
- Riesgo: Alto — hoy el JSON-LD dice país `ES`, coordenadas `0,0`, una
  imagen inexistente y una calificación fija; el sitemap omite dos rutas.
  Publicar datos erróneos a Google es peor que no publicar nada.
- RF relacionados: RF-SEO-001, RF-SEO-002, RF-SEO-003.
- RNF impactados: RNF-SEO-001, RNF-SEO-002, RNF-SEO-003.
- Casos de uso relacionados: —

### Criterios de aceptación (Given/When/Then)

- CA-01: Given cada ruta pública, When la inspecciono, Then tiene título,
  descripción, canonical y metadatos Open Graph propios.
- CA-02: Given los datos estructurados del sitio, When los paso por la
  prueba de resultados enriquecidos de Google, Then no hay errores y
  describen las dos sucursales con dirección, país `CL`, coordenadas y
  horario reales.
- CA-03: Given `sitemap.xml`, When lo comparo con `ROUTES`, Then contiene
  todas las rutas públicas.

### Reglas de negocio asociadas:

- RN-01: Nada en los datos estructurados que no sea verificable
  (calificaciones, acciones de reserva a URLs inexistentes).

---

## HU-EXP-001 - Sitio rápido y fluido en el celular

Como cliente que entra desde el celular con datos móviles, quiero que el
sitio cargue rápido y el scroll sea fluido, para no abandonarlo antes de
ver los servicios.

- Epic: Experiencia
- Actor / Persona: Cliente
- Prioridad: Alta
- Estimación: 8 SP
- Fuente: auditoría Lighthouse del 2026-03-11
  (`docs/archivo/ANIMATION_OPTIMIZATION_PLAN.md`) y auditoría del
  2026-10-12.
- Dependencias: Ninguna.
- Riesgo: Alto — el LCP depende de un PNG de ~1 MB que se precarga y no se
  usa; cuatro componentes se re-renderizan en cada frame de scroll.
- RF relacionados: —
- RNF impactados: RNF-PERF-001 .. RNF-PERF-006, RNF-COMP-001.
- Casos de uso relacionados: —

### Criterios de aceptación (Given/When/Then)

- CA-01: Given un celular de gama media con 4G (perfil móvil de
  Lighthouse), When abro la home, Then el LCP es ≤ 2,5 s y el CLS ≤ 0,1.
- CA-02: Given hago scroll por toda la home, When grabo con el panel
  Performance, Then no hay tareas largas (> 50 ms) causadas por el scroll y
  ningún componente se re-renderiza por cada evento de scroll.
- CA-03: Given un ancho de 360 px, When recorro cada página, Then no hay
  scroll horizontal ni texto cortado.

---

## HU-EXP-002 - Sitio accesible y respetuoso con el movimiento

Como cliente que navega con teclado, lector de pantalla o que tiene
activada la reducción de movimiento, quiero usar el sitio completo sin
barreras ni mareos, para reservar como cualquier otra persona.

- Epic: Experiencia
- Actor / Persona: Cliente
- Prioridad: Media
- Estimación: 5 SP
- Fuente: WCAG 2.1 AA; `docs/archivo/WEB_REQUIREMENTS_CHECKLIST.md` §4.
- Dependencias: Ninguna.
- Riesgo: Medio — el parallax por JavaScript ignora hoy
  `prefers-reduced-motion`; el menú móvil usa `role="menu"` sin gestión de
  foco.
- RF relacionados: —
- RNF impactados: RNF-A11Y-001 .. RNF-A11Y-004.
- Casos de uso relacionados: —

### Criterios de aceptación (Given/When/Then)

- CA-01: Given navego solo con teclado, When recorro una página, Then puedo
  llegar a todos los enlaces y botones, veo dónde está el foco y el primer
  Tab ofrece "saltar al contenido".
- CA-02: Given tengo activada la reducción de movimiento en el sistema,
  When recorro el sitio, Then no hay parallax, scroll suave ni animaciones
  de desplazamiento.
- CA-03: Given abro el menú móvil, When navego con teclado, Then el foco
  entra al menú, Escape lo cierra y el foco vuelve al botón que lo abrió.
- CA-04: Given cada ruta, When corro Lighthouse, Then la puntuación de
  accesibilidad es ≥ 95.

---

## HU-EXP-003 - Mensaje claro si algo falla o la página no existe

Como cliente, si entro a una dirección que no existe o algo falla al
cargar, quiero un mensaje claro y una forma de seguir, para no quedarme
frente a una pantalla en blanco.

- Epic: Experiencia
- Actor / Persona: Cliente
- Prioridad: Alta
- Estimación: 3 SP
- Fuente: auditoría del 2026-10-12 (no hay ruta 404 ni rewrite SPA).
- Dependencias: HU-OPS-001 (el rewrite vive en la configuración del
  hosting).
- Riesgo: Alto — sin rewrite, recargar `/servicios` en producción da un 404
  del hosting.
- RF relacionados: RF-NAV-002, RF-NAV-003.
- RNF impactados: RNF-CONF-001, RNF-CONF-002.
- Casos de uso relacionados: CU-EXP-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given estoy en `/servicios` en producción, When recargo la página,
  Then se muestra `/servicios`, no un error del hosting.
- CA-02: Given escribo una ruta que no existe, When carga, Then veo una
  página "no encontrada" con la identidad de la barbería, un enlace al
  inicio y el botón de reservar.
- CA-03: Given una sección falla al renderizar, When ocurre el error, Then
  veo un mensaje y un botón para reintentar; el resto del sitio (navbar y
  footer) sigue funcionando.
- CA-04: Given tenía el sitio abierto y se desplegó una versión nueva, When
  navego a una página que no había cargado, Then la página carga (con una
  recarga automática como máximo), sin pantalla en blanco.

---

## HU-EXP-004 - Una primera impresión visual que se recuerde

Como persona que llega al sitio por primera vez, quiero que lo primero que
vea transmita la marca con carácter (tipografía propia, fondos con
profundidad y pequeñas reacciones a mi cursor), para recordar la barbería
y confiar en que el servicio está a la altura.

- Epic: Experiencia
- Actor / Persona: Cliente que llega por primera vez
- Prioridad: Media
- Estimación: 13 SP (se entrega por secciones: tipografía, loader, fondos y tarjetas)
- Fuente: pedido del dueño del sitio (2026-10-14): lograr un sitio más
  llamativo con efectos visuales, micro-interacciones y fondos trabajados,
  sección por sección.
- Dependencias: HU-EXP-001 (el efecto no puede costar velocidad),
  HU-EXP-002 (ni accesibilidad ni respeto a reducir el movimiento).
- Riesgo: Medio — una tipografía de display y las animaciones de entrada
  pueden empeorar LCP, CLS y TBT; las animaciones son un riesgo para quien
  tiene activada la reducción de movimiento.
- RF relacionados: —
- RNF impactados: RNF-PERF-001, RNF-PERF-002, RNF-PERF-003, RNF-A11Y-003,
  RNF-A11Y-004, RNF-A11Y-005.
- Casos de uso relacionados: —

### Criterios de aceptación (Given/When/Then)

- CA-01: Given abro la portada, When carga, Then el nombre de la marca es el
  elemento tipográfico dominante y el lema queda en un segundo nivel
  jerárquico claro.
- CA-02: Given abro la portada en un celular de gama media, When mido con
  Lighthouse móvil, Then LCP ≤ 2,5 s y CLS ≤ 0,1 no empeoran frente al estado
  anterior, y la fuente nueva no produce saltos de texto al cargar.
- CA-03: Given tengo activada la reducción de movimiento, When abro la
  portada, Then el texto aparece completo y estático, sin animación de
  entrada ni destellos.
- CA-04: Given el dueño cambia el lema en la hoja, When se publica, Then el
  diseño se mantiene sin desbordar ni romperse, y el nombre de la marca no
  depende de la hoja.
- CA-05: Given cada ancho de pantalla (móvil, tablet, escritorio), When veo
  la portada, Then el nombre cabe sin desbordar y el contraste del texto
  sobre el fondo cumple RNF-A11Y-004.
- CA-06: Given abro el sitio por primera vez en la sesión, When carga, Then
  veo una entrada de marca de no más de 2 s (el nombre como un letrero de neón
  que se enciende) antes de la portada, y cualquier interacción la salta;
  si recargo o cambio de ruta en la misma sesión, el letrero sale en cuanto
  carga el sitio, sin esperar.
- CA-07: Given tengo activada la reducción de movimiento, When abro el sitio,
  Then no hay entrada de marca ni parpadeos, y en ninguna animación hay más
  de 3 destellos por segundo (RNF-A11Y-003, RNF-A11Y-005).
- CA-08: Given abro la portada con ratón en escritorio, When muevo el cursor,
  Then un haz de luz suave sigue al cursor sobre el fondo sin que React vuelva
  a renderizar; en móvil o sin cursor fino el fondo es una forma geométrica
  simple y estática, no un color plano.
- CA-09: Given veo las tarjetas de beneficios de la portada, When entran en
  pantalla (o paso el cursor en escritorio), Then reaccionan con una animación
  ligada al scroll o al cursor, y su texto cumple el contraste de
  RNF-A11Y-004 en escritorio y móvil.
- CA-10: Given bajo hasta el bloque de reserva que sigue a la portada, When
  entra en pantalla, Then las barras de luz hexagonales (como las del techo
  de la barbería) se encienden una vez, la foto queda enmarcada en su figura,
  el botón de reservar es el elemento que más destaca y, en móvil, la foto no
  tapa el título.
- CA-11: Given paso el cursor o enfoco con teclado un enlace de la navegación,
  When se resalta, Then se ilumina con un resplandor de neón blanco, como las
  luces del techo, y su texto se sigue leyendo.
- CA-12 (2026-10-14, `BR-060`): Given entro a `/equipo`, When carga, Then veo
  al equipo en un panal de hexágonos (como las barras de luz del techo), con el
  líder más grande y con un marco distinto, y al pasar el cursor o enfocar un
  hexágono leo el nombre del barbero.
- CA-14: Given bajo hasta «Respaldados por los mejores», When avanzo con el
  scroll, Then un láser corta en diagonal y revela la foto y luego la tarjeta
  del testimonio, y si subo se vuelven a tapar; con reducir movimiento todo
  aparece revelado.
- CA-15 (2026-10-14, `BR-063`): Given abro la ficha de un barbero, When uso
  solo el teclado, Then el foco queda dentro de la ficha, Escape la cierra y
  vuelvo al barbero que la abrió, sin que la página de fondo se haya movido.
- CA-16: Given llego a «Estilo que te acompaña», When las tarjetas entran en
  pantalla, Then veo la foto clara con la franja roja diagonal, las tarjetas con
  los textos del diseño, y sus íconos se dibujan con un trazo.
- CA-17: Given llego a «Clientes felices, estilos impecables», When veo la
  parrilla de fotos, Then los recuadros siguen un bento apaisado como en el
  diseño, y en móvil quedan en dos columnas sin recuadros angostos.
- CA-18 (2026-10-15, `BR-067`): Given entro a `/productos`, When carga, Then veo
  el catálogo en un panal de hexágonos a la misma distancia entre sí; al pasar
  el cursor o enfocar uno se ilumina y leo su nombre y su precio, y al
  activarlo se abre su ficha con foto, categoría, descripción y precio, sin
  botón de compra.
- CA-19 (2026-10-15, `BR-068`): Given hay más productos de los que caben en una
  carga, When llego al final del panal, Then se suman los siguientes (con
  hexágonos grises de relleno mientras llegan), sin saltos de la página, y
  puedo pedirlos también con el teclado.

---

## HU-OPS-001 - Desplegar cambios verificados sin romper producción

Como desarrollador, quiero que cada cambio se verifique automáticamente y
se pueda probar en un preview antes de llegar a producción, para desplegar
sin miedo y volver atrás rápido si algo sale mal.

- Epic: Operación
- Actor / Persona: Desarrollador
- Prioridad: Alta
- Estimación: 5 SP
- Fuente: fase de despliegue (2026-10-12); ADR-003.
- Dependencias: Ninguna.
- Riesgo: Medio — hoy `npm run lint` falla con 20 errores y no hay CI ni
  tests.
- RF relacionados: RF-OPS-001, RF-OPS-002.
- RNF impactados: RNF-MANT-001, RNF-MANT-002, RNF-SEG-001, RNF-SEG-003.
- Casos de uso relacionados: CU-OPS-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given abro un PR, When el CI corre, Then ejecuta lint, chequeo de
  tipos, tests y build, y un paso roto bloquea el merge.
- CA-02: Given abro un PR, When Vercel termina, Then hay una URL de preview
  con ese cambio.
- CA-03: Given se integra un PR a `master`, When Vercel despliega, Then
  producción queda con el cambio y las cabeceras de seguridad activas.
- CA-04: Given un despliegue rompe producción, When lo detecto, Then puedo
  volver al despliegue anterior en menos de 5 minutos.

---

## HU-MED-001 - Ver cuántas personas visitan el sitio

> Origen (2026-10-12): pedido del usuario. Sale del ítem diferido
> "Analítica" de `backlog.md` §4, cuyo disparador (primer despliegue en
> producción) ya se cumplió.

Como dueño, quiero ver cuántas personas visitan el sitio y qué páginas
miran, para saber si la web trae gente sin tener que preguntarlo.

- Epic: Medición y privacidad
- Actor / Persona: Dueño
- Prioridad: Media
- Estimación: 2 SP
- Fuente: pedido del usuario (2026-10-12); `docs/archivo/WEB_REQUIREMENTS_CHECKLIST.md` §6.
- Dependencias: HU-OPS-001 (se activa en Vercel).
- Riesgo: Bajo — Vercel Analytics no usa cookies ni identifica personas.
  Si no está habilitado en el panel de Vercel, el script responde 404 y
  ensucia la consola; por eso se carga solo con una variable explícita.
- Decisiones cerradas (2026-10-12, por defecto, **por confirmar con el
  usuario**): es opt-in con `VITE_VERCEL_ANALYTICS=true`; solo páginas
  vistas (los eventos personalizados de Vercel requieren plan de pago).
- RF relacionados: RF-MED-001.
- RNF impactados: RNF-PRIV-001, RNF-PERF-007, RNF-SEG-004.
- Casos de uso relacionados: —

### Criterios de aceptación (Given/When/Then)

- CA-01: Given `VITE_VERCEL_ANALYTICS` no está definida o no es `true`,
  When abro el sitio, Then no se carga ningún script de analítica ni se
  hace ninguna petición a `/_vercel/insights`.
- CA-02: Given la variable es `true` y Analytics está habilitado en Vercel,
  When un visitante abre cualquier página, Then el panel de Vercel
  Analytics cuenta la visita y la ruta.
- CA-03: Given la variable es `true`, When Lighthouse mide la home, Then
  LCP y TBT no empeoran respecto a la medición sin analítica.

### Reglas de negocio asociadas:

- RN-01: No se envían datos personales ni se guardan cookies.

### Datos:

- Entrada: variable de entorno de build.
- Salida: visitas y rutas en el panel de Vercel.

---

## HU-MED-002 - Saber cuántos visitantes tocan "Reservar" y de dónde llegan

Como dueño, quiero saber cuántos visitantes tocan los botones de reserva,
WhatsApp y teléfono, y de dónde llegaron, para medir si la web capta
clientes y qué canal funciona mejor.

- Epic: Medición y privacidad
- Actor / Persona: Dueño
- Prioridad: Media
- Estimación: 5 SP
- Fuente: pedido del usuario (2026-10-12); checklist §6.3 (conversion tracking).
- Dependencias: HU-MED-003 (sin consentimiento no se mide), HU-RES-001.
- Riesgo: Medio — Google Analytics usa cookies y envía datos a Google:
  exige consentimiento previo y una política de privacidad. La reserva
  ocurre en AgendaPro (otro dominio), así que solo se mide el clic, no la
  reserva completada.
- Decisiones cerradas (2026-10-12, por defecto, **por confirmar**): GA4 con
  Consent Mode v2 en `denied` por defecto; el script de Google no se
  descarga hasta que el visitante acepta; se activa solo con
  `VITE_GA_MEASUREMENT_ID`.
- RF relacionados: RF-MED-002, RF-MED-004.
- RNF impactados: RNF-PRIV-001, RNF-PERF-007, RNF-SEG-004.
- Casos de uso relacionados: CU-MED-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given `VITE_GA_MEASUREMENT_ID` no está definida, When abro el
  sitio, Then no se carga nada de Google ni aparece ningún aviso.
- CA-02: Given el visitante aceptó, When navega entre páginas, Then GA4
  recibe un `page_view` por cada cambio de ruta (la app es una SPA).
- CA-03: Given el visitante aceptó, When toca un botón de reserva,
  WhatsApp o teléfono, Then GA4 recibe un evento (`reserve_click`,
  `whatsapp_click`, `phone_click`) con la sección donde estaba el botón.
- CA-04: Given el visitante rechazó o no ha decidido, When usa el sitio,
  Then no se envía ningún evento y el sitio funciona igual.

### Reglas de negocio asociadas:

- RN-01: Los eventos no llevan datos personales (sin teléfono, sin
  nombre, sin texto escrito por el visitante).
- RN-02: El clic en un enlace nunca se retrasa ni se bloquea por la
  analítica.

### Datos:

- Entrada: `VITE_GA_MEASUREMENT_ID` y el consentimiento del visitante.
- Salida: eventos en GA4.

---

## HU-MED-003 - Decidir si acepto que midan mi visita

Como visitante, quiero elegir si acepto o rechazo que midan mi visita y
poder leer qué datos se recogen, para decidir con información y cambiar de
opinión cuando quiera.

- Epic: Medición y privacidad
- Actor / Persona: Cliente
- Prioridad: Alta
- Estimación: 5 SP
- Fuente: pedido del usuario (2026-10-12); Ley 19.628 de Chile (protección
  de la vida privada) y su actualización (Ley 21.719); buenas prácticas
  de consentimiento.
- Dependencias: Ninguna.
- Riesgo: Medio — el texto de la política de privacidad es legal y lo debe
  validar el dueño o un abogado; el borrador del repo no es asesoría
  legal. El aviso no puede tapar el botón de reserva ni empeorar el CLS.
- Decisiones cerradas (2026-10-12, por defecto, **por confirmar**): el
  aviso solo aparece si GA está configurado; "Aceptar" y "Rechazar" con la
  misma prominencia; la elección se guarda en el navegador y se puede
  cambiar desde el footer; no hay ningún "rechazar" escondido.
- RF relacionados: RF-MED-003, RF-MED-005.
- RNF impactados: RNF-PRIV-001, RNF-A11Y-002, RNF-PERF-002.
- Casos de uso relacionados: CU-MED-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given GA está configurado y es mi primera visita, When abro el
  sitio, Then veo un aviso con "Aceptar" y "Rechazar" del mismo tamaño y
  un enlace a la política de privacidad.
- CA-02: Given hago clic en "Rechazar", When sigo navegando, Then no se
  descarga ningún script de Google y no se guardan cookies de analítica.
- CA-03: Given acepté, When abro "Preferencias de privacidad" en el
  footer y cambio a rechazar, Then la medición se detiene de inmediato.
- CA-04: Given el aviso está visible, When uso solo el teclado, Then
  puedo alcanzarlo, decidir y volver al contenido; el aviso no tapa el
  botón "Reservar" del navbar.
- CA-05: Given abro `/privacidad`, When leo, Then explica qué datos se
  recogen, con qué fin, quién los trata y cómo contactar al responsable.

### Reglas de negocio asociadas:

- RN-01: Sin elección explícita, el estado es "no medir".
- RN-02: La política de privacidad es un borrador a validar antes de
  activar GA en producción.

### Datos:

- Entrada: elección del visitante (guardada en `localStorage`).
- Salida: estado de consentimiento que habilita o no la medición.

---

## HU-CNT-001 - Cambiar servicios, productos, equipo y preguntas desde una hoja

Como dueño, quiero cambiar precios, servicios, productos, miembros del
equipo y preguntas frecuentes en una hoja de cálculo de Google y que el
sitio se actualice, para no depender de un desarrollador por cada cambio.

- Epic: Contenido editable
- Actor / Persona: Dueño
- Prioridad: Alta
- Estimación: 8 SP
- Fuente: pedido del usuario (2026-10-12). Hoy el contenido está escrito
  en `src/data/*.ts` y cada cambio exige un commit y un despliegue.
- Dependencias: HU-INFO-001 (el catálogo ya existe).
- Riesgo: Alto — una fila mal escrita (precio vacío, texto de más) no debe
  romper ni vaciar el sitio publicado; la hoja se publica en internet; un
  cambio puede tardar unos minutos en verse (hay que reconstruir el sitio).
- Decisiones cerradas (2026-10-12, por defecto, **por confirmar**): el
  sitio sigue siendo estático (`ADR-001`): la hoja se lee **al construir**,
  no en el navegador; la hoja se "publica en la web" como CSV (sin
  claves); si la hoja falla o es inválida, el sitio se construye con la
  última copia guardada en el repo; los cambios se publican con un enlace
  de despliegue de Vercel (`deploy hook`) que el dueño activa o se dispara
  solo al editar.
- RF relacionados: RF-CNT-001, RF-CNT-002, RF-CNT-003, RF-CNT-004.
- RNF impactados: RNF-CONF-003, RNF-DATOS-002, RNF-PERF-001, RNF-SEG-004.
- Casos de uso relacionados: CU-CNT-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given la hoja está configurada, When se construye el sitio, Then
  servicios, productos, equipo y preguntas salen de la hoja.
- CA-02: Given la hoja no está configurada o no responde en 10 s, When se
  construye el sitio, Then se usa la última copia guardada y el build no
  falla.
- CA-03: Given una fila inválida (por ejemplo, un servicio sin precio),
  When se construye el sitio, Then ese contenido se rechaza, se usa la
  última copia guardada de esa pestaña y el build deja escrito qué pestaña
  y qué fila falló.
- CA-04: Given edito un precio en la hoja y disparo la publicación, When
  termina el despliegue, Then el sitio muestra el precio nuevo sin
  cambios de código ni en el repo.
- CA-05: ~~Given el sitio ya publicado, When un visitante lo abre, Then no
  hace ninguna petición a Google Sheets (el contenido viaja en el sitio).~~
  **Reemplazado el 2026-10-13 por CA-06** (decisión del usuario, `BR-047`).
- CA-06 (2026-10-13): Given la hoja está configurada y el sitio publicado,
  When edito un precio en la hoja y, pasados unos minutos, un visitante abre o
  recarga el sitio, Then ve el precio nuevo sin un despliegue; y When la hoja
  no responde o una pestaña es inválida, Then ve el contenido con el que se
  construyó el sitio.
- CA-07 (2026-10-13): Given no hay hoja configurada, When un visitante abre
  el sitio, Then no se hace ninguna petición a Google ni se descarga el código
  de lectura de la hoja.

> Actualizada (2026-10-13): el dueño necesita ver sus cambios sin volver a
> desplegar. La hoja se lee en el build **y** en el navegador (`ADR-008`,
> actualización del 2026-10-13). El riesgo "un cambio puede tardar unos
> minutos" se mantiene (5 a 6 minutos, no un build). Lo publicado en la hoja
> es público, incluidas las filas con `activo = NO`.

### Reglas de negocio asociadas:

- RN-01: Los precios se escriben en pesos chilenos como número entero
  (`15000`); el sitio los muestra como `$15.000`.
- RN-02: Hay una sola fuente por contenido: la hoja, o la copia guardada
  cuando la hoja no está disponible. Nunca se editan a mano ambas.
- RN-03: Una pestaña inválida no afecta a las demás.

### Datos:

- Entrada: pestañas `servicios`, `productos`, `equipo` y `preguntas` de la
  hoja publicada.
- Salida: contenido tipado que reemplaza a `src/data/*.ts`.

---

## HU-CNT-002 - Cambiar títulos y textos del sitio desde la misma hoja

Como dueño, quiero cambiar los títulos y textos principales (por ejemplo,
el de la portada) desde la hoja, para ajustar el mensaje sin tocar código.

- Epic: Contenido editable
- Actor / Persona: Dueño
- Prioridad: Baja
- Estimación: 5 SP
- Fuente: pedido del usuario (2026-10-12): "headings, etc.".
- Dependencias: HU-CNT-001 (misma hoja y mismo mecanismo).
- Riesgo: Medio — hay textos con saltos de línea y partes en negrita
  dentro del JSX; hay que definir qué se puede editar como texto simple.
  Un título muy largo puede romper el diseño.
- Decisiones cerradas (2026-10-12, por defecto, **por confirmar**): pestaña
  `textos` con columnas `clave` y `valor`; cada texto tiene un valor por
  defecto en el código, así que una clave ausente no rompe nada; solo
  texto plano.
- RF relacionados: RF-CNT-005.
- RNF impactados: RNF-CONF-003, RNF-DATOS-002.
- Casos de uso relacionados: CU-CNT-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given la pestaña `textos` define `hero.lema`, When se construye
  el sitio, Then la portada muestra ese título.
- CA-02: Given una clave no existe en la hoja, When se construye el sitio,
  Then se muestra el texto por defecto del código.
- CA-03: Given un valor supera el largo máximo definido para esa clave,
  When se construye el sitio, Then se rechaza ese valor, se usa el texto
  por defecto y queda escrito en el build.

### Reglas de negocio asociadas:

- RN-01: Los textos de la hoja son texto plano; nunca se interpretan como
  HTML.

### Datos:

- Entrada: pestaña `textos` (`clave`, `valor`).
- Salida: textos que reemplazan a los literales del código.

---

## HU-CNT-003 - Cambiar datos de contacto, sucursales y redes desde la hoja

Como dueño, quiero cambiar teléfonos, direcciones, horarios, enlaces de
WhatsApp y AgendaPro y las redes sociales en la misma hoja, para corregir
un dato de contacto sin pedir un cambio de código.

- Epic: Contenido editable
- Actor / Persona: Dueño
- Prioridad: Alta
- Estimación: 8 SP
- Fuente: pedido del usuario (2026-10-13): «necesito que los datos de
  contacto estén en una hoja, los de la página de ubicación y contacto, y los
  enlaces a WhatsApp, AgendaPro, etc.; y los del footer también, redes
  sociales».
- Dependencias: HU-CNT-001 (BR-047: lectura en el navegador).
- Riesgo: Alto — un teléfono o un enlace de reserva mal escrito rompe el
  contacto; `index.html` (JSON-LD, meta) y el sitemap son estáticos y solo se
  actualizan al construir; **cambia la regla de `CLAUDE.md` 4 y `RNF-DATOS-001`**
  (los datos del negocio vivían solo en `src/config/`).
- Decisión del usuario (2026-10-13): estos datos también salen de la hoja.
  Decisiones por defecto al construir `BR-048`, **por confirmar**: pestañas
  `negocio` y `sucursales`; el SEO estático (`index.html`, sitemap) no cambia
  con la hoja; un valor inválido rechaza la pestaña entera.
- RF relacionados: RF-CNT-007.
- RNF impactados: RNF-DATOS-001, RNF-CONF-003, RNF-SEG-004.
- Casos de uso relacionados: CU-CNT-001.

### Criterios de aceptación (Given/When/Then)

- CA-01: Given la hoja está configurada, When cambio el teléfono de una
  sucursal y un visitante recarga el sitio, Then ve el teléfono nuevo en la
  página de ubicación y en el footer, sin desplegar.
- CA-02: Given edito la URL de AgendaPro o de WhatsApp, When un visitante
  pulsa «Reservar», Then llega al enlace nuevo.
- CA-03: Given un valor inválido (enlace sin `https://`, teléfono vacío),
  When se lee la hoja, Then se conserva el dato con el que se construyó el
  sitio y queda un aviso en el registro.

---

## Documentos relacionados

- [`casos-uso.md`](./casos-uso.md)
- [`rf-rnf-catalogo.md`](./rf-rnf-catalogo.md)
- [`backlog.md`](./backlog.md)
