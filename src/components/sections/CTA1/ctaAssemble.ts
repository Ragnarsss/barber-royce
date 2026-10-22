import { useTransform, type MotionValue } from "framer-motion";

/** De dónde llega una pieza: desfase (px) y giro (grados) respecto de su sitio de reposo. */
export interface AssembleOffsets {
  x: number;
  y: number;
  rotate: number;
}

/**
 * Ensamble de los hexágonos de CTA1 con el scroll (BR-097, HU-EXP-004 CA-39). Los tres hexágonos del texto llegan
 * desfasados y rotados, cada uno desde un lado distinto, y encajan en su sitio de reposo (el de `BR-091`) a medida que
 * la sección entra en pantalla; las barras de luz bajan unos píxeles. Al volver a subir, se separan: es scrub.
 */
export const CTA_ASSEMBLE: {
  /** Tramo del avance de la sección (0 al asomar por abajo, 0,5 al alinearse con la ventana) en el que ocurre. */
  WINDOW: number[];
  background: AssembleOffsets;
  text: AssembleOffsets;
  foreground: AssembleOffsets;
  bars: { y: number };
} = {
  // Termina antes de que la sección quede alineada con la ventana (0,5): ahí ya está todo armado
  WINDOW: [0.05, 0.45],
  // El de atrás llega desde arriba a la izquierda, el rojo desde arriba a la derecha y el pequeño desde abajo a la derecha
  background: { x: -90, y: -70, rotate: -12 },
  text: { x: 80, y: -110, rotate: 9 },
  foreground: { x: 130, y: 90, rotate: 18 },
  bars: { y: -40 },
};

/** Cuánto falta para que una pieza llegue: `from` cuando el avance es 0 y nada cuando es 1. */
export const assembleOffset = (from: number, progress: number): number => from * (1 - progress);

/** Estilo (`x`, `y` y `rotate` como `MotionValue`) de una pieza que se ensambla con el avance `progress` de 0 a 1. */
export function useAssembleStyle(progress: MotionValue<number>, from: AssembleOffsets) {
  return {
    x: useTransform(progress, (value) => assembleOffset(from.x, value)),
    y: useTransform(progress, (value) => assembleOffset(from.y, value)),
    rotate: useTransform(progress, (value) => assembleOffset(from.rotate, value)),
  };
}
