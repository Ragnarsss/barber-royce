import { fixedShape } from "@/components/common/FixedShape/shapeGeometry";

/**
 * Triángulos de fondo del Hero con geometría fija (BR-091). Cada caja es la que tenían a 1920 × 1080 (forma de referencia
 * elegida por el usuario, 2026-10-21): 50vw × 100vh, 50vw × 110vh y los de la capa rápida con su tope en px. Los puntos
 * son los del `clip-path` de antes, ya sin estirarse con la proporción de la ventana.
 */
export const HERO_SHAPES = {
  leftTriangleBackground: fixedShape(960, 1188, [[0, 0], [95, 5], [5, 95]]),
  rightTriangleBackground: fixedShape(960, 1188, [[95, 5], [100, 100], [5, 95]]),
  leftTriangle: fixedShape(960, 1080, [[0, 0], [100, 0], [0, 100]]),
  rightTriangle: fixedShape(960, 1080, [[100, 0], [100, 100], [0, 100]]),
  leftTriangleForeground: fixedShape(650, 756, [[0, 0], [100, 10], [10, 100]]),
  rightTriangleForeground: fixedShape(700, 702, [[90, 0], [100, 100], [0, 90]]),
};

/** Diagonal de los dos triángulos principales, donde va el filo de luz: de la esquina superior derecha a la inferior izquierda. */
export const HERO_DIAGONAL = { x1: 960, y1: 0, x2: 0, y2: 1080 };
