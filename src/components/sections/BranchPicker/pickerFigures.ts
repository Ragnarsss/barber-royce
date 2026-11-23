import { fixedShape, tiltedRect, type FixedShapeGeometry } from "@/components/common/FixedShape/shapeGeometry";
import type { Branch } from "@/config/branches";

/**
 * Las dos figuras que adornan cada mitad de la portada partida (BR-106): hexágonos en Coquimbo, cuadrados solapados y
 * girados en La Serena, como las barras de luz de cada local. Cada mitad lleva siempre las suyas, sea cual sea la
 * sucursal activa.
 */
export const PICKER_FIGURES = {
  coquimbo: [
    fixedShape(100, 100, [[50, 0], [100, 25], [100, 75], [50, 100], [0, 75], [0, 25]]),
    fixedShape(100, 100, [[50, 14], [86, 32], [86, 68], [50, 86], [14, 68], [14, 32]]),
  ],
  "la-serena": [tiltedRect(100, 100, 0.7, 0), tiltedRect(100, 100, 0.7, 18)],
} as const satisfies Record<Branch, readonly FixedShapeGeometry[]>;
