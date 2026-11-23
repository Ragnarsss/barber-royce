import { tiltedRect, type FixedShapeGeometry } from "@/components/common/FixedShape/shapeGeometry";

/**
 * Los cuatro cuadrados de neón solapados del hero de La Serena (BR-106), como los del techo del local. Cada uno ocupa
 * `size` del ancho del racimo desde (`left`, `top`) y se gira unos grados (al 70 % de su caja, hasta 45° caben dentro).
 * El orden es el de dibujo: `delay` desfasa el trazo de cada uno para que se completen uno tras otro.
 */
interface NeonSquare {
  shape: FixedShapeGeometry;
  /** Posición y ancho en % del racimo. */
  left: number;
  top: number;
  size: number;
  /** Segundos antes de empezar a dibujarse. */
  delay: number;
}

export const NEON_SQUARES: readonly NeonSquare[] = [
  { shape: tiltedRect(100, 100, 0.7, 0), left: 0, top: 12, size: 62, delay: 0.2 },
  { shape: tiltedRect(100, 100, 0.7, -8), left: 24, top: 0, size: 58, delay: 0.55 },
  { shape: tiltedRect(100, 100, 0.7, 14), left: 32, top: 30, size: 64, delay: 0.9 },
  { shape: tiltedRect(100, 100, 0.7, 30), left: 8, top: 44, size: 46, delay: 1.25 },
];
