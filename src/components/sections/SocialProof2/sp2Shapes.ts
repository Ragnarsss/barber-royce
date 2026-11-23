import { fixedShape, type FixedShapeGeometry } from "@/components/common/FixedShape/shapeGeometry";
import type { Branch } from "@/config/branches";

/**
 * Hexágono de puntas arriba y abajo de los fondos de «Reseñas» (BR-092), y su cuadrado de La Serena (BR-104): las puntas
 * de arriba y abajo se quedan y los lados verticales se abren hasta las esquinas. Misma caja y mismos puntos, para que
 * framer pueda transformar uno en otro.
 */
export const SP2_HEXAGON_BY_BRANCH = {
  coquimbo: fixedShape(100, 100, [[50, 0], [100, 25], [100, 75], [50, 100], [0, 75], [0, 25]]),
  "la-serena": fixedShape(100, 100, [[50, 0], [100, 0], [100, 100], [50, 100], [0, 100], [0, 0]]),
} as const satisfies Record<Branch, FixedShapeGeometry>;
