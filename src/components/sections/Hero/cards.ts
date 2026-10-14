/**
 * Tarjetas de beneficios del hero (BR-056, HU-EXP-004 CA-09).
 *
 * En escritorio ya están en pantalla al cargar, así que su entrada es la de carga (escalonada, tras el letrero de
 * neón). El scroll les da profundidad al salir: cada tarjeta sube un poco más que la anterior, como capas separadas.
 */
export const CARD_DEPTH = {
  BASE_PX: 24,
  STEP_PX: 28,
} as const;

/** Desplazamiento vertical de la tarjeta `index` entre el inicio y el final del scroll del hero. */
export function cardDepthRange(index: number): [number, number] {
  return [0, -(CARD_DEPTH.BASE_PX + index * CARD_DEPTH.STEP_PX)];
}
