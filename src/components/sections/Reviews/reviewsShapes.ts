import { fixedShape, type FixedShapeGeometry } from "@/components/common/FixedShape/shapeGeometry";
import type { Branch } from "@/config/branches";
import { edgeDraw } from "@/config/animations.config";

/**
 * Los dos polígonos decorativos de las reseñas (BR-096): el mismo `clip-path` de antes, sobre una caja cuadrada; el CSS
 * les da su tamaño (500 y 600 px) y su giro.
 */
export const REVIEWS_SHAPES_BY_BRANCH = {
  coquimbo: {
    octagon: fixedShape(100, 100, [[30, 0], [70, 0], [100, 30], [100, 70], [70, 100], [30, 100], [0, 70], [0, 30]]),
    hexagon: fixedShape(100, 100, [[50, 0], [100, 25], [100, 75], [50, 100], [0, 75], [0, 25]]),
  },
  // La Serena (BR-104): el octágono gira hasta un cuadrado de 45° (esquinas arriba, derecha, abajo e izquierda) y el
  // hexágono se abre hasta un cuadrado.
  "la-serena": {
    octagon: fixedShape(100, 100, [[50, 0], [75, 25], [100, 50], [75, 75], [50, 100], [25, 75], [0, 50], [25, 25]]),
    hexagon: fixedShape(100, 100, [[50, 0], [100, 0], [100, 100], [50, 100], [0, 100], [0, 0]]),
  },
} as const satisfies Record<Branch, Record<"octagon" | "hexagon", FixedShapeGeometry>>;

/** Cómo se dibuja el borde de cada uno: constantes, para que no sean objetos nuevos en cada render. */
export const REVIEWS_EDGE = { top: edgeDraw(0.1), bottom: edgeDraw(0.4) };
