# Casos de uso — barber-royce

Fecha: 2026-10-12
Estado: activo.

Solo se documentan como caso de uso los flujos con **decisiones o
caminos alternativos**. Una página que solo muestra contenido se cubre con
su HU y sus criterios de aceptación.

## Convenciones

- **ID:** `CU-<MOD>-NNN`, mismo módulo que la HU que lo origina.
- **Estado:** `Propuesto` (descrito, sin verificar) · `Verificado` (el
  flujo, incluidos los alternativos, se probó contra el preview de
  Vercel).
- Flujos alternativos numerados por el paso en que se desvían: `2a.`,
  `2b.`.

## Índice

| ID | Nombre | Actor | HU relacionada | Estado |
|---|---|---|---|---|
| CU-RES-001 | Reservar una hora | Cliente | HU-RES-001, HU-RES-002 | Propuesto |
| CU-RES-002 | Canjear la mascarilla de bienvenida | Cliente | HU-RES-003, HU-RES-004 | Propuesto |
| CU-INFO-001 | Filtrar servicios o productos | Cliente | HU-INFO-001, HU-INFO-004 | Propuesto |
| CU-INFO-002 | Consultar una sucursal | Cliente | HU-INFO-002 | Propuesto |
| CU-EXP-001 | Llegar a una ruta profunda, inexistente o con error | Cliente | HU-EXP-003 | Propuesto |
| CU-OPS-001 | Desplegar un cambio | Desarrollador | HU-OPS-001 | Propuesto |
| CU-MED-001 | Decidir sobre la medición de mi visita | Cliente | HU-MED-002, HU-MED-003 | Propuesto |
| CU-CNT-001 | Publicar un cambio de contenido desde la hoja | Dueño | HU-CNT-001, HU-CNT-002 | Propuesto |

---

## CU-RES-001 - Reservar una hora

- Actor: Cliente
- Historia de usuario relacionada: HU-RES-001, HU-RES-002
- Precondición: el cliente está en cualquier página del sitio.

### Flujo principal

1. El cliente toca "Reservar" (navbar, menú móvil o un CTA de sección).
2. El sistema abre la URL de AgendaPro de la sucursal en una pestaña nueva.
3. El cliente completa la reserva en AgendaPro.

### Flujos alternativos

- 1a. El cliente prefiere consultar antes de reservar: toca WhatsApp o el
  teléfono; el sistema abre la conversación con el mensaje prellenado o el
  marcador con el número real, y termina.
- 2a. El navegador bloquea la pestaña nueva: el enlace es un `<a>` estándar,
  así que el navegador lo abre en la misma pestaña; el cliente sigue en
  AgendaPro.
- 2b. AgendaPro no responde: el cliente vuelve a la pestaña del sitio, que
  sigue abierta, y usa el flujo 1a.

### Postcondición

El cliente está en AgendaPro (o en una conversación con la barbería) y el
sitio sigue abierto en la pestaña original.

---

## CU-RES-002 - Canjear la mascarilla de bienvenida

- Actor: Cliente
- Historia de usuario relacionada: HU-RES-003, HU-RES-004
- Precondición: la promoción está encendida (`promo.activa`) y el cliente no
  ha cerrado ni canjeado el modal antes.

### Flujo principal

1. El cliente entra a cualquier ruta; termina el loader de neón.
2. El sistema espera la respuesta al aviso de privacidad (si existe) y unos
   5 s, y abre el modal con la oferta.
3. El cliente toca «Canjear cupón»; el sistema muestra el formulario en la
   franja derecha.
4. El cliente completa los campos, acepta el uso de sus datos y toca
   «Obtener cupón».
5. El sistema registra el canje en la hoja y muestra el cupón con su nombre
   y la frase «Royce web».
6. El cliente muestra el cupón al barbero con un servicio pagado.

### Flujos alternativos

- 2a. El aviso de privacidad sigue sin responderse: el modal espera.
- 2b. `promo.activa` apagada o ausente: no hay modal.
- 3a. El cliente toca «Reservar» en vez de canjear: se abre AgendaPro en una
  pestaña nueva y termina.
- 3b. El cliente cierra el modal: se anota en el navegador y no vuelve a salir.
- 4a. Un campo es inválido: el error aparece junto al campo y no se envía nada.
- 4b. El cliente toca «Volver»: regresa al botón, sin enviar nada.
- 5a. El registro en la hoja falla: igual se muestra el cupón.
- 6a. El cliente solo dice «Royce web» al barbero (flujo de `HU-RES-003`, sin
  formulario).

### Postcondición

El cliente tiene su cupón (o conoce la frase), el canje queda anotado en el
navegador y, si hubo registro, en la hoja del dueño.

---

## CU-INFO-001 - Filtrar servicios o productos

- Actor: Cliente
- Historia de usuario relacionada: HU-INFO-001, HU-INFO-004
- Precondición: el cliente está en `/servicios` o `/productos`.

### Flujo principal

1. El sistema muestra todos los elementos y las categorías disponibles.
2. El cliente elige una categoría (y en productos, escribe un texto de
   búsqueda).
3. El sistema muestra solo los elementos que cumplen el filtro, sin
   recargar la página.
4. El cliente vuelve a "Todos" y el sistema muestra la lista completa.

### Flujos alternativos

- 3a. Ningún elemento cumple el filtro: el sistema muestra un estado vacío
  con un texto que lo explica y una acción para limpiar el filtro.

### Postcondición

La lista visible coincide con el filtro elegido.

---

## CU-INFO-002 - Consultar una sucursal

- Actor: Cliente
- Historia de usuario relacionada: HU-INFO-002
- Precondición: el cliente está en `/ubicacion`.

### Flujo principal

1. El sistema muestra las pestañas de las sucursales con la primera
   seleccionada.
2. El cliente elige una sucursal (clic, toque o flechas del teclado).
3. El sistema muestra su dirección, mapa, horario por día y contacto.
4. El cliente abre la dirección en Google Maps o toca "Reservar".

### Flujos alternativos

- 3a. El mapa embebido no carga: la dirección sigue visible en texto, con
  un enlace para abrirla en Google Maps.

### Postcondición

El cliente tiene los datos de la sucursal que eligió.

---

## CU-EXP-001 - Llegar a una ruta profunda, inexistente o con error

- Actor: Cliente
- Historia de usuario relacionada: HU-EXP-003
- Precondición: el sitio está desplegado en Vercel.

### Flujo principal

1. El cliente abre o recarga una ruta profunda (por ejemplo,
   `/servicios`).
2. Vercel responde `index.html` (rewrite SPA).
3. El router muestra la página de esa ruta.

### Flujos alternativos

- 3a. La ruta no existe: el router muestra la página "no encontrada" con
  enlace al inicio y botón de reservar.
- 3b. La página falla al renderizar: el error boundary de la ruta muestra
  un mensaje con "Reintentar"; navbar y footer siguen funcionando.
- 3c. El chunk de la página ya no existe porque hubo un despliegue nuevo:
  el sistema recarga la página una vez; si vuelve a fallar, se aplica 3b.

### Postcondición

El cliente ve la página pedida, la 404 o un fallback con una acción; nunca
una pantalla en blanco.

---

## CU-OPS-001 - Desplegar un cambio

- Actor: Desarrollador
- Historia de usuario relacionada: HU-OPS-001
- Precondición: el ticket tiene rama `tipo/br-nnn-...` con sus commits.

### Flujo principal

1. El desarrollador abre un PR contra `master` con la plantilla de PR.
2. El CI corre lint, tipos, tests y build.
3. Vercel publica un preview del PR.
4. El desarrollador verifica los criterios de aceptación en el preview
   (escritorio y móvil) y, si aplica, corre Lighthouse contra él.
5. Se integra el PR (`--no-ff`) y se borra la rama.
6. Vercel despliega producción desde `master`.
7. El desarrollador revisa que la home y la ruta tocada carguen en
   producción y marca el ticket `Hecho` (skill `cerrar-ticket`).

### Flujos alternativos

- 2a. Un paso del CI falla: el PR no se puede integrar; se corrige en la
  misma rama.
- 4a. El preview no cumple un criterio: se corrige en la rama y se vuelve
  al paso 2.
- 7a. Producción queda rota: se hace "Promote" del despliegue anterior en
  Vercel y se abre un ticket de bug con la skill `nuevo-ticket`.

### Postcondición

`master` y producción tienen el cambio, el ticket está `Hecho` y la rama
está borrada.

---

## CU-MED-001 - Decidir sobre la medición de mi visita

- Actor: Cliente
- Historia de usuario relacionada: HU-MED-003, HU-MED-002
- Precondición: el sitio se construyó con `VITE_GA_MEASUREMENT_ID` definida.

### Flujo principal

1. El cliente abre el sitio por primera vez.
2. El sistema no carga nada de Google y muestra el aviso de privacidad con
   "Aceptar" y "Rechazar" y un enlace a `/privacidad`.
3. El cliente elige "Aceptar".
4. El sistema guarda la elección en el navegador, descarga el script de
   Google, activa la medición y envía el `page_view` de la página actual.
5. Mientras navega, el sistema envía un `page_view` por ruta y un evento
   por cada clic en reserva, WhatsApp o teléfono.

### Flujos alternativos

- 3a. El cliente elige "Rechazar": el sistema guarda la elección, no
  descarga nada de Google, cierra el aviso y termina.
- 3b. El cliente no elige y sigue navegando: el estado sigue siendo "no
  medir"; el aviso permanece disponible sin tapar el botón de reserva.
- 1a. El cliente ya había elegido: el sistema aplica la elección guardada
  y no muestra el aviso.
- 1b. El navegador bloquea el almacenamiento local: el sistema trata la
  elección como "no medir" y muestra el aviso en cada visita.
- 6. En cualquier momento el cliente abre "Preferencias de privacidad" en
  el footer y cambia su elección: el sistema la guarda y, si pasa a
  rechazar, detiene la medición y borra las cookies de analítica.
- 4a. El script de Google no carga (bloqueador de anuncios, sin red): el
  sitio sigue funcionando igual y no se muestra ningún error.

### Postcondición

La medición está activa solo si el cliente aceptó; el sitio funciona igual
en todos los casos.

---

## CU-CNT-001 - Publicar un cambio de contenido desde la hoja

- Actor: Dueño
- Historia de usuario relacionada: HU-CNT-001, HU-CNT-002
- Precondición: la hoja está publicada en la web como CSV, sus identificadores
  están en las variables de Vercel y existe un `deploy hook`.

### Flujo principal

1. El dueño edita una fila de la hoja (por ejemplo, el precio de un
   servicio).
2. El dueño dispara la publicación (abre el enlace del `deploy hook`, o se
   dispara solo al editar si está automatizado).
3. Vercel construye el sitio; el paso de contenido descarga cada pestaña
   de la hoja.
4. El sistema valida cada pestaña, genera el contenido y lo incluye en el
   sitio.
5. Vercel publica la versión nueva; el dueño ve el precio actualizado en
   unos minutos.

### Flujos alternativos

- 3a. La hoja no está configurada o no responde en 10 s: el sistema usa la
  última copia guardada en el repo, escribe un aviso en el log del build y
  el despliegue sigue.
- 4a. Una pestaña tiene una fila inválida: el sistema rechaza esa pestaña
  completa, usa la copia guardada de esa pestaña, escribe en el log qué
  pestaña, qué fila y qué campo falló, y sigue con las demás pestañas.
- 4b. Todas las pestañas son válidas: el sistema actualiza también la
  copia guardada para futuros respaldos (la actualización la confirma el
  desarrollador en el repo; el build no escribe en el repo).
- 5a. El dueño nota un error después de publicar: corrige la hoja y repite
  desde el paso 2, o el desarrollador vuelve al despliegue anterior en
  Vercel.

### Postcondición

El sitio publicado refleja la hoja, o la última copia válida, y nunca queda
con contenido incompleto.

---

## Documentos relacionados

- [`historias-usuario.md`](./historias-usuario.md)
- [`rf-rnf-catalogo.md`](./rf-rnf-catalogo.md)
