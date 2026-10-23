import { fixedShape } from "@/components/common/FixedShape/shapeGeometry";
import { edgeDraw } from "@/config/animations.config";

/**
 * Pentágono de los dos polígonos decorativos de «Innovación y calidad» (BR-096): el mismo `clip-path` de antes, sobre
 * una caja cuadrada; el CSS le da su tamaño (600 y 700 px) y su giro.
 */
export const FEATURES_PENTAGON = fixedShape(100, 100, [[50, 0], [100, 38], [82, 100], [18, 100], [0, 38]]);

/** Cómo se dibuja el borde de cada uno: constantes, para que no sean objetos nuevos en cada render. */
export const FEATURES_EDGE = { top: edgeDraw(0.1), bottom: edgeDraw(0.4) };
