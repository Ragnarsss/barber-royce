---
name: svg-workflow
description: Ciclo de un SVG en este repo - de dónde sale, cómo se limpia, cómo se importa (en línea para animarlo o como imagen estática), cómo se anima (trazo que se dibuja, neón, scroll) y cómo se valida. Úsala al agregar o animar cualquier SVG, o al revisar uno antes de un ticket. Adaptada de svg-workflow de alienskilez-web.
---

# Manejo de SVG

Hoy el repo no importa ningún SVG desde `src/` (hay un `favicon.svg` en
`public/` y los íconos vienen de `lucide-react`). Esta skill fija las reglas
antes del primero (`BR-054`, el loader de neón).

## Primera pregunta: ¿se anima o solo se muestra?

| Uso | Cómo se importa | Reglas |
|---|---|---|
| **Animado o estilizado por CSS** (trazo que se dibuja, neón, color de token) | En línea: componente `.tsx` con el `<svg>` escrito a mano, o `import x from "@/assets/foo.svg?raw"` insertado con `dangerouslySetInnerHTML` **solo si el archivo es nuestro** | Todo lo de abajo |
| **Imagen estática** (favicon, ilustración sin lógica) | `<img src={url}>` con `width` y `height` | El navegador lo rasteriza: no se anima ni se colorea por CSS |

Antes de agregar un SVG a `src/assets/`, busca con `grep` que no haya uno
con la misma geometría. Un asset que ningún componente importa no va en
`src/assets/`. Un SVG de más de ~10 KB para algo simple es señal de un
raster trazado (el `favicon.svg` actual pesa 130 KB): pide el vector original.

## Origen y limpieza (antes del primer commit)

1. Quita `<?xml ...?>`, comentarios del generador, `<defs>` vacíos y
   atributos que no se usan (`class`, `xmlns:xlink`).
2. **Sin comentarios con `--` dentro:** rompen `DOMParser` en silencio (en
   alienskilez-web costó varias sesiones). Lo mejor es no dejar ningún
   comentario.
3. El color sale de un token por CSS (`stroke: var(--color-brand-primary)`,
   `fill: currentColor`), no de un literal escrito en el SVG.
4. Si se anima con `stroke-dashoffset` (efecto «se dibuja»), agrega
   `pathLength="1"` al `<path>`: normaliza el largo del trazo sin depender de
   la longitud real de la curva.
5. Nombre de archivo descriptivo y sin espacios ni paréntesis
   (`royce-neon.svg`, no `icon (1).svg`).
6. **Texto a contornos:** un logo o rótulo no se deja como `<text>` (depende de
   que la fuente haya cargado). Los contornos se sacan de la fuente con una
   herramienta externa (Inkscape, Figma, Illustrator: «convertir texto a
   trazados») o con un comando directo; **no se dejan scripts propios en el
   repo**.

## Cómo se anima

| Efecto | Técnica | Nota |
|---|---|---|
| Trazo que se dibuja | `stroke-dasharray: 1` + animar `stroke-dashoffset` de `1` a `0` (requiere `pathLength="1"`) | Barato: no hay layout |
| Dibujo ligado al scroll | `motion.path` con `pathLength` ← `useTransform(scrollYProgress, …)` | `MotionValue`, nunca `setState` |
| Neón | Trazo sin relleno + varios `drop-shadow` (núcleo claro, halo con el color de marca); el parpadeo anima la `opacity` de una **capa borrosa duplicada** | No animes el radio del blur: se repinta cada fotograma |
| Parpadeo irregular | Keyframes con porcentajes desiguales; una letra con su propio ritmo | Máx. 3 destellos por segundo (`RNF-A11Y-005`) |
| Entrada por letras | Cada letra en su máscara con `overflow: hidden` y `y` animado | El resplandor va en el contenedor, no en la letra |
| Morph de forma | Mismo número de puntos en ambas formas | Si no, usa fundido |
| Movimiento a lo largo de un trazo | `offset-path` en CSS | Soporte amplio; con respaldo estático |

Preferencia: una secuencia fija y corta va en **CSS** con una variable como
fuente de verdad del tiempo (y un test que la ata a la constante de
TypeScript); algo que depende del scroll o del cursor va en **framer-motion**
con `MotionValue`. Evita SMIL (`<animate>`) en cosas nuevas.

## Accesibilidad y rendimiento

- Decorativo: `aria-hidden="true"`. Con significado: `role="img"` y
  `<title>`.
- Con `prefers-reduced-motion`, la secuencia no se monta, o el CSS la apaga.
- `will-change` solo mientras anima. Pocos nodos: un SVG con miles de puntos
  pesa en el repintado.
- Mide antes y después (LCP, CLS, TBT) si el SVG está en la ruta de carga.

## Validación (si el SVG se parsea o se inserta en línea)

1. Un test en `src/test/` (patrón: `readFileSync` del archivo) que compruebe:
   `viewBox` presente; al menos un `<path>` con `d` no vacío; `pathLength="1"`
   si se anima por trazo; sin `--` dentro de comentarios; sin `fill` o
   `stroke` con literales de color.
2. **Míralo fallar una vez:** reintroduce el defecto a propósito, corre los
   tests, confirma el rojo y revierte. Un test que nunca se vio en rojo no se
   sabe qué cubre.
3. `jsdom` acepta XML mal formado que un navegador real rechaza. Si el
   síntoma es «no se ve nada» pero el test pasa, manda el navegador.
