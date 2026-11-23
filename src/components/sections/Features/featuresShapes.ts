import { fixedShape, type FixedShapeGeometry } from "@/components/common/FixedShape/shapeGeometry";
import type { Branch } from "@/config/branches";
import { edgeDraw } from "@/config/animations.config";

/**
 * Pentágono de los dos polígonos decorativos de «Innovación y calidad» (BR-096): el mismo `clip-path` de antes, sobre
 * una caja cuadrada; el CSS le da su tamaño (600 y 700 px) y su giro.
 */
export const FEATURES_PENTAGON_BY_BRANCH = {
  coquimbo: fixedShape(100, 100, [[50, 0], [100, 38], [82, 100], [18, 100], [0, 38]]),
  // El cuadrado de La Serena (BR-104): el vértice de arriba se queda y los demás se abren hasta las esquinas.
  "la-serena": fixedShape(100, 100, [[50, 0], [100, 0], [100, 100], [0, 100], [0, 0]]),
} as const satisfies Record<Branch, FixedShapeGeometry>;

/** Cómo se dibuja el borde de cada uno: constantes, para que no sean objetos nuevos en cada render. */
export const FEATURES_EDGE = { top: edgeDraw(0.1), bottom: edgeDraw(0.4) };
