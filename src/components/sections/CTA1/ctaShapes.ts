import { fixedShape } from "@/components/common/FixedShape/shapeGeometry";

/**
 * Hexágonos de CTA1 con geometría fija (BR-091). Cada caja es la que tenían a 1920 × 1080 (forma de referencia elegida
 * por el usuario, 2026-10-21): 45vw × 90vh, 40vw × 80vh, 30vw × 60vh, y el hexágono rojo de detrás de la foto al 62 % de
 * la figura de 50vw × 100vh. Los puntos son los del `clip-path` de antes: la irregularidad es la diseñada.
 */
export const CTA_SHAPES = {
  textHexagonBackground: fixedShape(864, 972, [[45, 0], [85, 15], [95, 65], [65, 100], [15, 85], [5, 35]]),
  textHexagon: fixedShape(768, 864, [[50, 0], [90, 20], [100, 70], [70, 100], [20, 80], [10, 30]]),
  textHexagonForeground: fixedShape(576, 648, [[45, 5], [85, 20], [90, 65], [60, 95], [20, 75], [15, 35]]),
  imageHexagonForeground: fixedShape(595.2, 669.6, [[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]]),
};
