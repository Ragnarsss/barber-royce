# Handoff: modal de bienvenida con una mascarilla facial gratis (2026-10-27)

Insumo para una sesión nueva. Es **una necesidad todavía sin ticket**: lo primero es convertirla en HU, requisitos y
ticket (regla 1 de `CLAUDE.md`), no escribir código. Este documento reúne lo que el repo ya tiene y sirve para ese
modal, las decisiones que **no** están tomadas y el orden sugerido.

## 1. Qué pidió el usuario (2026-10-27)

> «Un modal que aparezca al entrar en la página y que ofrezca una mascarilla facial gratis mencionando "royce web" en
> su próxima visita.»

Nada más. No hay diseño, texto final, vigencia ni condiciones. Lo que sigue son preguntas, no supuestos.

## 2. Cómo trabajar (reglas que aplican)

- **Ticket primero.** La skill `analisis-requerimientos` está hecha para esto («quiero que el sitio haga X»): produce HU,
  casos de uso, RF/RNF y ticket. Después `iniciar-ticket`, `diseno-visual` (propone tres direcciones antes de tocar
  código, porque es una pieza visual) y `cerrar-ticket`. El siguiente ID libre es **`BR-100`** (`BR-098` es el footer y `BR-099`, las tarjetas de sucursales; confírmalo con
  `grep` en `docs/backlog.md`, que es la fuente) y las historias llegan
  hasta `HU-EXP-004`, `HU-CNT-003` y `HU-MED-003`; decide con la skill si va en la épica K o en una HU nueva de promociones.
- **Preguntar antes de decidir** lo que cambie alcance o estructura (`CLAUDE.md`, «Decisiones no explícitas»). Agregar
  una columna o pestaña a la hoja de Google está en esa lista.
- Rama por ticket, commits `tipo(alcance): descripción (BR-NNN)`, nunca commit directo a `master`.
- **`git add` con rutas concretas**, nunca `git add docs`: `docs/prompts/` es del usuario y está sin seguimiento.
- Sin dependencias nuevas (regla 7), sin scripts propios, estilos con CSS Modules y tokens (nada de hex), mobile-first
  (ADR-009) y enlaces externos con `target="_blank" rel="noopener noreferrer"`.
- **No publicar a producción sin que el usuario lo pida** (PR y fusión incluidos).

## 3. Lo que el repo ya trae y conviene reutilizar

| Qué | Dónde | Para qué sirve aquí |
|---|---|---|
| Diálogo modal accesible | `src/components/common/ModalDialog/ModalDialog.tsx` | Foco atrapado, Tab y Mayús+Tab, Escape y fondo cierran, devuelve el foco, detiene Lenis y bloquea el scroll de `html`, se anima con `AnimatePresence` y no anima con reducir movimiento. Lo usan las fichas del barbero y del producto. Recibe `onClose`, `titleId`, `descriptionId`, `split` y `className`. |
| Textos editables desde la hoja | `src/content/texts.ts` (`TEXTS`) y `useSiteText()` | Cada clave tiene `default` y `max`. Los textos son texto plano. La guía para el dueño es `docs/contenido-hoja.md`. |
| Reserva en AgendaPro | `useSiteContent().business.booking` | URL y etiqueta del botón. Nunca un literal en el componente (regla 4). |
| Eventos de analítica | `src/analytics/track.ts` | `trackReserve`, `trackWhatsApp`, `trackPhone`. `ClickSection` y `AnalyticsEventName` son uniones cerradas: hay que ampliarlas. |
| Montaje diferido | `src/components/layout/Layout/Layout.tsx` y `src/analytics/runAfterLoad.ts` | Así se monta `AnalyticsRoot` con `lazy()` y `Suspense`. El modal debería seguir ese patrón. |
| Figura hexagonal SVG | `src/components/common/FixedShape/` | Si el diseño quiere un hexágono irregular, ya existe el componente (`BR-091`). |
| Variantes de animación | `src/config/animations.config.ts` | Las variantes nuevas van ahí, no sueltas en el componente. |

## 4. Choques y riesgos que hay que resolver

1. **El aviso de privacidad también aparece al entrar.** `src/analytics/ConsentBanner.tsx` es un cuadro fijo
   (`z-index: 10000`) que sale mientras el visitante no decide, y solo existe si hay `VITE_GA_MEASUREMENT_ID` (hoy sí en
   producción). Dos capas encima de la portada, a la vez, son un mal comienzo. Hay que decidir el orden (por ejemplo, el
   modal espera a que el visitante responda el aviso, o a un tiempo o a un scroll).
2. **El loader de neón.** `index.html` muestra un letrero de neón al cargar y el Hero espera `useNeonLoaderDone()`
   (`src/loader/neonLoader.ts`). El modal no puede salir antes de que termine ni tapar la primera impresión.
3. **Rendimiento.** En producción el TBT móvil de la home está en 192 ms (límite 200) y el LCP móvil en 5,51 s (deuda
   previa, no de este trabajo). El modal debe montarse **después de la carga**, con `lazy()`, sin CLS (`position: fixed`
   y sin cambiar el layout) y sin ser el LCP. Mide con la skill `cerrar-ticket` (Lighthouse móvil, mediana de 3,
   alternando build base y nueva: la máquina varía unos 60 ms de TBT entre corridas).
4. **Recordar que ya lo vio.** Hay que guardar algo («ya lo cerró»). El sitio usa `localStorage` para el consentimiento
   (`barber-royce:analytics-consent` en `src/analytics/consent.ts`, con lectura y escritura dentro de `try/catch`). La
   página `/privacidad` promete que no se guardan datos personales: un indicador de «ya lo vio» no lo es, pero conviene
   que el texto de privacidad lo mencione y que el guardado siga el mismo patrón tolerante a fallos.
5. **Los tests de Chrome real.** `src/test/contrast.e2e.test.ts` abre las rutas y mide contraste con la página en
   reposo: un modal que aparece solo puede tapar o alterar esa medición. Hay que apagarlo en esas pruebas o cerrarlo.
6. **Accesibilidad.** `ModalDialog` ya cubre el foco y Escape. Falta: contraste 4,5:1 del texto, objetivos táctiles de
   al menos 44 px, sin destellos (`RNF-A11Y-005`) y con reducir movimiento sin animación (`RNF-A11Y-003`). Un modal que
   abre solo y roba el foco es agresivo para un lector de pantalla: hay que decidir si debe hacerlo.

## 5. Preguntas abiertas para el usuario (antes de escribir código)

**Oferta y condiciones** (conviene que las confirme el dueño, y que el modal las muestre):
- ¿Qué dice exactamente el cliente? ¿«Royce web», «Royce Web» o el nombre del sitio completo? ¿Se lo dice al barbero o al
  reservar en AgendaPro? ¿Hay alguna validación?
- «Próxima visita»: ¿la mascarilla va con cualquier servicio o con uno pagado? ¿Una por persona? ¿En las dos sucursales
  (La Serena y Coquimbo)? ¿Hay vigencia o es indefinida? ¿Hay un tope de cupos?
- ¿Hay una foto o un diseño del producto o de la mascarilla?

**Cuándo y a quién aparece:**
- ¿Solo en la home o en cualquier ruta por la que alguien entre (`/productos`, `/servicios`…)?
- ¿Una sola vez por visitante, una por sesión, o cada vez que entra? ¿Con cuánta espera o con qué gatillo (tiempo,
  scroll, intención de salida)?
- ¿Qué pasa con quien ya tiene una reserva o ya la usó? (Probablemente nada: no hay cómo saberlo en el sitio.)

**Dónde se edita:**
- ¿El dueño debe poder cambiar el texto y **apagar la promoción** desde la hoja? Cambiar el texto cabe en la pestaña
  `textos` (claves nuevas en `TEXTS`). Un interruptor de encendido o una fecha de término **no existen** en la hoja y
  hay que decidir cómo (una clave `promo.activa`, una fecha, o sacar el modal en un despliegue). Eso es agregar campos
  a la hoja: pregunta al usuario.

**Medición:**
- ¿Qué se quiere saber? El sitio puede contar cuántos lo ven, lo cierran y tocan «reservar»; **no** puede saber quién la
  canjeó en el local. Eventos nuevos (`promo_view`, `promo_close`, `reserve_click` con sección `promo`) implican ampliar
  `src/analytics/track.ts` y el requisito de `HU-MED-002`, y solo se envían con consentimiento (`ADR-007`).

## 6. Orden sugerido

1. `analisis-requerimientos` con la frase del usuario y las respuestas a la sección 5: HU, CU, RF/RNF (`RNF-PERF-003`,
   `RNF-A11Y-003`, `RNF-A11Y-005`, `RNF-DATOS-001`), ticket y tablero.
2. `iniciar-ticket`: rama, línea base de Lighthouse móvil de la home (mediana de 3).
3. `diseno-visual`: tres direcciones (segura, media, audaz) con su costo, y a esperar la elección del usuario.
4. Implementación, **tests primero** para la lógica pura (cuándo se muestra, cómo se recuerda, qué pasa con reducir
   movimiento) y de render para el modal; el e2e de contraste sin la promoción activa.
5. Textos nuevos en `TEXTS` y en `docs/contenido-hoja.md`, y las fichas del registro.
6. Verificación en Chrome real (escritorio y 390 px, con y sin reducir movimiento), medición contra la línea base y
   `cerrar-ticket`. Lo que solo se ve en movimiento lo mira el usuario.

## 7. Estado del repo al escribir esto (para no pisarse)

- `BR-006` (SEO técnico, solo su parte sin datos del dueño) ya está integrado en `master` local: `SEOHelmet` acepta ahora
  una propiedad `jsonLd` y `src/seo/structuredData.ts` arma los datos estructurados. Si el modal necesita metadatos, ahí
  está el patrón.
- `master` local tiene commits **sin publicar** (`BR-006`, `BR-098` y `BR-099`; el PR #44 de `BR-096` y `BR-097` ya se
  fusionó en GitHub). Mira `git log origin/master..master` antes de empezar y no publiques sin que el usuario lo pida.
- `BR-099` toca solo `LocationPage.module.css`; `BR-098`, el footer. Ninguno se cruza con un modal de bienvenida.
- La suite completa (`npm run test:run`) tarda 1 a 3 minutos y desde `BR-095` los e2e de Chrome real van en su propio
  proyecto de Vitest.
