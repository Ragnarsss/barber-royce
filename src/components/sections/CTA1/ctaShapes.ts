import { fixedShape, tiltedRect, type FixedShapeGeometry } from "@/components/common/FixedShape/shapeGeometry";
import type { Branch } from "@/config/branches";

/**
 * Hexágonos de CTA1 con geometría fija (BR-091). Cada caja es la que tenían a 1920 × 1080 (forma de referencia elegida
 * por el usuario, 2026-10-21): 45vw × 90vh, 40vw × 80vh, 30vw × 60vh, y el hexágono rojo de detrás de la foto al 62 % de
 * la figura de 50vw × 100vh. Los puntos son los del `clip-path` de antes: la irregularidad es la diseñada.
 */
const COQUIMBO = {
  textHexagonBackground: fixedShape(864, 972, [[45, 0], [85, 15], [95, 65], [65, 100], [15, 85], [5, 35]]),
  textHexagon: fixedShape(768, 864, [[50, 0], [90, 20], [100, 70], [70, 100], [20, 80], [10, 30]]),
  textHexagonForeground: fixedShape(576, 648, [[45, 5], [85, 20], [90, 65], [60, 95], [20, 75], [15, 35]]),
  imageHexagonForeground: fixedShape(595.2, 669.6, [[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]]),
};

/**
 * Las de La Serena (BR-104): rectángulos solapados y apenas girados, como las barras de luz del techo del local, con las
 * mismas cajas y la misma cantidad de puntos que su hexágono para que framer los transforme. El rojo detrás de la foto es
 * un cuadrado sin giro.
 */
const LA_SERENA: Record<keyof typeof COQUIMBO, FixedShapeGeometry> = {
  textHexagonBackground: tiltedRect(864, 972, 0.86, -4),
  textHexagon: tiltedRect(768, 864, 0.86, 3),
  textHexagonForeground: tiltedRect(576, 648, 0.86, -2),
  imageHexagonForeground: fixedShape(595.2, 669.6, [[0, 0], [100, 0], [100, 50], [100, 100], [0, 100], [0, 50]]),
};

export const CTA_SHAPES_BY_BRANCH = { coquimbo: COQUIMBO, "la-serena": LA_SERENA } as const satisfies Record<Branch, Record<keyof typeof COQUIMBO, FixedShapeGeometry>>;
