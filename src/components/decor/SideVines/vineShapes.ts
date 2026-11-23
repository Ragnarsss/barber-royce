/**
 * La geometría de las enredaderas laterales (BR-108), separada del componente a propósito: la primera versión la dibujó
 * Claude, y si más adelante se rehace en Figma o Illustrator solo cambian estos datos (ver la skill `svg-workflow`: el
 * tallo se exporta como trazo y cada hoja como figura). La enredadera del lado derecho es la misma, espejada.
 */

/** Caja de referencia: 120 de ancho por 1000 de alto. El tallo nace arriba y baja serpenteando junto al borde. */
export const VINE_BOX = { width: 120, height: 1000 } as const;

/** El tallo, un solo trazo (el que se dibuja con `pathLength`). */
export const VINE_STEM = "M18 0C54 90 -14 170 28 260S74 420 22 520S-6 700 32 800S62 930 26 1000";

/** Una hoja estilizada con la base en (30, 118) y la punta en (30, 4): se coloca por su base. */
export const VINE_LEAF = "M30 118C8 90 4 50 30 4c26 46 22 86 0 114Z";
/** El nervio central de la hoja. */
export const VINE_LEAF_VEIN = "M30 118V22";
/** Punto de la hoja que se coloca sobre el tallo. */
export const VINE_LEAF_BASE = { x: 30, y: 118 } as const;

export interface VineLeaf {
  /** Dónde nace sobre el tallo, en la caja de referencia. */
  x: number;
  y: number;
  /** Giro en grados: positivo hacia la derecha (hacia afuera del borde, en la enredadera izquierda). */
  rotate: number;
  /** Tamaño respecto de la hoja de 60 × 120. */
  scale: number;
}

/**
 * Las hojas, de arriba abajo y alternando de lado. Cada una aparece cuando el tallo llega a su altura (`y / alto`).
 * Todas cuelgan de un punto del tallo y caben dentro de la caja.
 */
export const VINE_LEAVES: readonly VineLeaf[] = [
  { x: 33, y: 62, rotate: 62, scale: 0.34 },
  { x: 16, y: 120, rotate: -58, scale: 0.4 },
  { x: 30, y: 262, rotate: 58, scale: 0.46 },
  { x: 40, y: 340, rotate: 70, scale: 0.34 },
  { x: 40, y: 430, rotate: -52, scale: 0.4 },
  { x: 22, y: 520, rotate: 60, scale: 0.5 },
  { x: 8, y: 610, rotate: -62, scale: 0.4 },
  { x: 18, y: 700, rotate: 54, scale: 0.44 },
  { x: 32, y: 800, rotate: 66, scale: 0.5 },
  { x: 44, y: 880, rotate: -56, scale: 0.36 },
  { x: 26, y: 960, rotate: 58, scale: 0.42 },
];
