# Cambiar el contenido del sitio desde una hoja de Google

Guía para el dueño (y, al final, para quien mantiene el sitio). Con esto puedes
cambiar **precios, servicios, productos, equipo, preguntas frecuentes y los
títulos de la portada** editando una hoja de cálculo, sin pedirle nada a un
desarrollador.

> **Antes de empezar:** el sitio sigue siendo una página fija. La hoja se lee
> **cuando se publica un cambio** (tarda 1 o 2 minutos), no cada vez que alguien
> entra. Si la hoja falla o tiene un error, el sitio **no se rompe**: sigue
> mostrando la última versión buena de lo que falló.

Decisión de diseño y alternativas descartadas: [`architecture.md`](./architecture.md),
`ADR-008`. Historia de usuario: `HU-CNT-001` y `HU-CNT-002`.

---

## 1. Qué se puede editar

La hoja tiene **cinco pestañas**. Los nombres tienen que ser exactamente estos, en
minúsculas.

| Pestaña | Qué controla | Columnas obligatorias |
|---|---|---|
| `servicios` | La página de servicios | `id`, `nombre`, `descripcion`, `precio`, `duracion`, `categoria` |
| `productos` | La página de productos | `id`, `nombre`, `descripcion`, `precio`, `categoria` |
| `equipo` | La página del equipo | `id`, `nombre`, `cargo`, `experiencia` |
| `preguntas` | Las preguntas frecuentes | `id`, `categoria`, `pregunta`, `respuesta` |
| `textos` | Títulos y textos de la portada | `clave`, `valor` |

Cada fila es un servicio, un producto, un barbero, una pregunta o un texto. La
**primera fila** de cada pestaña es el encabezado: no la borres ni cambies sus
nombres.

### Columnas opcionales (en servicios, productos, equipo y preguntas)

- `activo`: escribe `NO` para **ocultar** una fila sin borrarla (sirve de borrador).
  Vacío o `SI` = se muestra.
- `orden`: un número (1, 2, 3…) para decidir en qué orden aparecen. Las filas sin
  número van después, en el orden de la hoja.
- `imagen` (servicios, productos, equipo): dirección que empiece con `https://`.
  Puede ir vacía.
- `incluye` (servicios): texto corto, por ejemplo «Cortesía».
- `lider` (equipo): `SI` para destacar a una persona. **Solo una** puede ser líder.

### Reglas de cada campo

| Campo | Regla | Ejemplo |
|---|---|---|
| `id` | Único dentro de la pestaña. Solo minúsculas, números y guiones. No lo cambies después: es el nombre interno de la fila | `corte-clasico` |
| `precio` | **Número entero, sin `$` ni puntos**, en pesos chilenos. El sitio lo muestra como `$15.000` | `15000` |
| `categoria` | Solo una de las permitidas (abajo) | `Barba` |
| `nombre` | Hasta 60 caracteres | |
| `descripcion` | Servicios: hasta 300. Productos: hasta 200 | |
| `duracion` | Hasta 20 caracteres | `45 min` |
| `pregunta` / `respuesta` | Hasta 150 / hasta 800 caracteres | |

**Categorías permitidas** (escríbelas igual, con mayúsculas y tildes):

- Servicios: `Corte de Cabello`, `Barba`, `Colorimetría`, `Otros`
- Productos: `Styling`, `Barba`, `Cuidado`, `Kits`
- Preguntas: `Reservas y Horarios`, `Servicios`, `Precios y Pagos`, `Otros`

### La pestaña `textos`

Cada fila cambia **un texto** del sitio. En `clave` va el nombre del texto y en
`valor` lo que quieres que diga. Si dejas el valor **vacío**, el sitio usa el texto
de siempre. Para un salto de línea dentro de la celda, presiona **Alt + Enter**
(en Mac, **Ctrl + Opción + Enter**).

| Clave | Dónde aparece | Máximo |
|---|---|---|
| `hero.titulo` | Título grande de la portada | 120 |
| `cta1.titulo`, `cta1.subtitulo` | Primer bloque de reserva | 120 / 400 |
| `socialproof1.titulo`, `socialproof1.subtitulo` | «Respaldados por los mejores» | 120 / 400 |
| `benefits.titulo` | Título de la sección de beneficios | 120 |
| `reviews.titulo`, `reviews.subtitulo` | Opiniones de clientes | 120 / 400 |
| `features.titulo`, `features.subtitulo` | «Innovación y calidad…» | 120 / 400 |
| `socialproof2.titulo`, `socialproof2.subtitulo` | «Clientes felices…» | 120 / 400 |
| `cta2.titulo` | Segundo bloque de reserva | 120 |

Notas:

- Es **texto plano**: no uses HTML, negritas ni enlaces; se mostrarían tal cual.
- Algunos títulos se muestran con **cada palabra en mayúscula inicial** (por ejemplo
  el de la portada): es el diseño, no un error.
- Si te equivocas al escribir una clave (por ejemplo `hero.titlo`), el sitio la
  **ignora** y lo avisa en el registro de la publicación (sección 6).

---

## 2. Crear la hoja (una sola vez)

1. Entra a [Google Sheets](https://sheets.google.com) y crea una hoja nueva
   (por ejemplo, «Contenido Royce Barbería»).
2. Por cada pestaña, importa su plantilla desde la carpeta
   [`docs/contenido/`](./contenido/) de este repositorio:
   `servicios.csv`, `productos.csv`, `equipo.csv`, `preguntas.csv` y `textos.csv`.
   - **Archivo → Importar → Subir**, elige el archivo y, en «Ubicación de
     importación», **«Insertar hoja(s) nueva(s)»**.
   - Renombra cada pestaña con el nombre exacto de la tabla de arriba.
3. Las plantillas traen **el contenido que el sitio muestra hoy**, así que
   importarlas no cambia nada.

> **Los precios de los productos de las plantillas son de muestra** (`25`, `22`,
> `18`…: vienen en formato de dólares). Reemplázalos por los precios reales en
> pesos antes de publicar.

---

## 3. Publicar la hoja en la web (una sola vez)

Esto genera un enlace de solo lectura por pestaña. **Cualquier persona con el
enlace podrá leer lo publicado**, así que no pongas en la hoja nada que no quieras
que sea público.

1. **Archivo → Compartir → Publicar en la web**.
2. En «Vínculo», elige **la pestaña** (no «Documento completo») y el formato
   **«Valores separados por comas (.csv)»**. Pulsa **Publicar**.
3. Repite para cada una de las cinco pestañas.
4. De la dirección que aparece, anota dos cosas:

```
https://docs.google.com/spreadsheets/d/e/2PACX-1vABC…/pub?gid=123456&single=true&output=csv
                                         └─── identificador ───┘     └ gid ┘
```

   - El **identificador** (`2PACX-…`): es el mismo en todas las pestañas.
   - El **`gid`** (el número después de `gid=`): es distinto en cada pestaña. La
     primera pestaña suele ser `0`.
   - **No** uses el identificador largo de la dirección de edición
     (`/d/1AbC…/edit`): no sirve.

---

## 4. Conectar la hoja con el sitio (una sola vez)

En [Vercel](https://vercel.com) → tu proyecto → **Settings → Environment Variables**
agrega estas dos variables, para **Production** (y, si quieres probar antes de
publicar, también **Preview**):

| Nombre | Valor |
|---|---|
| `CONTENT_SHEET_ID` | El identificador `2PACX-…` |
| `CONTENT_SHEET_GIDS` | `servicios:0,productos:111,equipo:222,preguntas:333,textos:444` (cambia los números por los `gid` reales de cada pestaña) |

Luego **vuelve a desplegar** el sitio una vez (Deployments → los tres puntos del
último → Redeploy) para que las lea.

> Estas variables **no llegan al navegador**: son solo del momento de publicar. Nadie
> que visite el sitio puede verlas.

---

## 5. Publicar un cambio (cada vez)

1. Edita la hoja (un precio, un texto, una pregunta…).
2. Pide que se publique de una de estas dos formas:
   - **Con un botón en la hoja** (recomendado, sección 5.1), o
   - **Desde Vercel**: Deployments → los tres puntos del último despliegue →
     **Redeploy**.
3. Espera **1 o 2 minutos** y recarga el sitio.

### 5.1 Un botón «Publicar cambios» dentro de la hoja (opcional)

Primero crea un **enlace de despliegue**: en Vercel → **Settings → Git → Deploy
Hooks** → nombre «contenido», rama `master` → **Create Hook** → copia la dirección.
**Trátala como una contraseña**: quien la tenga puede lanzar publicaciones.

Después, en la hoja: **Extensiones → Apps Script**, pega este código y guarda:

```javascript
// Menú «Sitio web → Publicar cambios». La dirección del enlace de despliegue
// NO va en el código: se guarda en Propiedades del proyecto (Configuración del
// proyecto → Propiedades de la secuencia de comandos → DEPLOY_HOOK_URL).
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Sitio web').addItem('Publicar cambios', 'publicarSitio').addToUi();
}

function publicarSitio() {
  const ui = SpreadsheetApp.getUi();
  const url = PropertiesService.getScriptProperties().getProperty('DEPLOY_HOOK_URL');
  if (!url) {
    ui.alert('Falta configurar DEPLOY_HOOK_URL (ver la guía).');
    return;
  }
  const respuesta = UrlFetchApp.fetch(url, { method: 'post', muteHttpExceptions: true });
  const codigo = respuesta.getResponseCode();
  ui.alert(codigo >= 200 && codigo < 300
    ? 'Publicando… tarda 1 o 2 minutos. Recarga el sitio después.'
    : 'No se pudo publicar (código ' + codigo + '). Avisa a quien mantiene el sitio.');
}
```

La primera vez, Google te pedirá autorizar el script. Recarga la hoja y aparecerá el
menú **Sitio web → Publicar cambios**.

> **No** conviene publicar automáticamente en cada edición: cada publicación es una
> construcción del sitio y Vercel limita cuántas se pueden hacer por día. Es mejor
> editar varias cosas y publicar una vez.

---

## 6. Comprobar que funcionó

En Vercel → **Deployments** → el último → **Build Logs**, busca las líneas que
empiezan con `[contenido]`:

```
[contenido] leyendo la hoja de cálculo…
[contenido] servicios: hoja (15 filas)        ← bien: usó tu hoja
[contenido] productos: hoja (6 filas)
[contenido] equipo: hoja (5 filas)
[contenido] preguntas: hoja (12 filas)
[contenido] textos: hoja (2 filas)
```

Cada pestaña dice **`hoja`** (se usó lo que escribiste) o **`respaldo`** (se usó la
última versión buena, y la línea dice por qué).

### Si algo dice `respaldo`

El sitio **no se rompió**: sigue mostrando lo de antes para esa pestaña. Las demás
pestañas sí se actualizaron. Busca la línea con `-` o `!` debajo para ver qué corregir:

| Mensaje | Qué pasó | Cómo se arregla |
|---|---|---|
| `servicios fila 4, precio: es obligatorio` | La fila 4 no tiene precio | Escribe el precio como número entero |
| `… "$4.000" no es un número entero (escribe 15000, sin $ ni puntos)` | Escribiste el precio con `$` o puntos | Escribe solo `4000` |
| `… categoria: "Peluquería" no es válido; usa una de: …` | La categoría no existe | Usa una de la lista exacta de la sección 1 |
| `… id: "corte" está repetido (ya aparece en la fila 2)` | Dos filas con el mismo `id` | Cambia uno de los dos |
| `… id: solo admite minúsculas, números y guiones` | El `id` tiene mayúsculas o espacios | Escribe `corte-clasico` |
| `… descripcion: tiene 321 caracteres y el máximo es 300` | Texto demasiado largo | Acórtalo |
| `… imagen: "…" debe empezar con https:// o con /` | La imagen no es una dirección válida | Usa una dirección `https://` o déjala vacía |
| `… falta esta columna en el encabezado` | Cambiaste o borraste un encabezado | Restaura el nombre exacto de la columna |
| `… hay 2 líderes (…)` | Dos personas con `lider = SI` | Deja solo una |
| `la pestaña está vacía` | Pestaña sin contenido | Revisa que importaste los datos |
| `no tiene ninguna fila activa` | Todas las filas están en `NO` | Activa al menos una |
| `no se obtuvo de la hoja` / `respondió HTTP 404` | La pestaña no está publicada, o el `gid` está mal | Repite la sección 3 y revisa `CONTENT_SHEET_GIDS` |
| `la respuesta no es CSV sino "text/html"` | El enlace no es de publicación en CSV | Repite la sección 3 con formato `.csv` |
| `no respondió en 10 s` / `no se pudo conectar` | Google no respondió | Vuelve a publicar en unos minutos |
| `! textos fila 3, clave: "hero.titlo" no es un texto que use el sitio` | Error de escritura en una clave | Corrige la clave (aviso: no impide publicar) |

**Una sola fila con error rechaza esa pestaña completa** (así nunca se publica contenido
a medias). Corrige la fila y publica de nuevo.

---

## 7. Volver atrás

- **Si publicaste algo mal:** corrige la hoja y publica de nuevo, o en Vercel →
  Deployments elige el despliegue anterior → **Promote to Production** (vuelve a la
  versión anterior en segundos).
- **Google guarda el historial de la hoja:** **Archivo → Historial de versiones** para
  recuperar un valor anterior.

---

## 8. Para quien mantiene el sitio

- **Variables de build** (`.env.example`, sin prefijo `VITE_`): `CONTENT_SHEET_ID`,
  `CONTENT_SHEET_GIDS`, opcional `CONTENT_FETCH_TIMEOUT_MS` (10 s por pestaña).
  Sin `CONTENT_SHEET_ID` no se hace ninguna petición y el sitio usa el respaldo.
- **Respaldo:** `src/content/snapshot/*.ts`. El build **nunca** lo escribe. Cuando el
  dueño confirme contenido nuevo, cópialo ahí para que sirva de respaldo (y
  actualiza `docs/contenido/*.csv` si cambia la forma de las tablas).
- **Probar en local con la hoja real:** define las variables en tu terminal y
  ejecuta `npm run build`; el log muestra el estado de cada pestaña.
- **Esquemas y reglas:** `src/content/schemas.ts`; textos editables y sus máximos:
  `src/content/texts.ts`. Cada texto nuevo se registra ahí, se usa con
  `siteText("clave")` y, si tiene saltos de línea, su título lleva
  `white-space: pre-line`. Los tests lo vigilan.
- **Descarga y plugin:** `vite-plugins/siteContentSource.ts` y
  `siteContentPlugin.ts`. Los tests construyen el sitio de verdad contra un servidor
  local que imita a Google.
- **Hoja privada o muchos editores:** si algún día la hoja no puede ser pública, el
  camino es la API de Google Sheets con una cuenta de servicio (un secreto más), o un
  CMS; ver el disparador en `ADR-008`.
