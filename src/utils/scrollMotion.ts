/**
 * Umbrales de velocidad de scroll en px/s para efectos decorativos (BR-015).
 * Equivalen a los 1 y 2 px por frame que usaban los componentes con la
 * velocidad de Lenis (a 60 fps).
 */
export const SCROLL_SPEED_FAST = 60;
export const SCROLL_SPEED_FASTER = 120;

/** Dirección del scroll: 1 hacia abajo, -1 hacia arriba. Sin movimiento conserva la anterior. */
export function nextDirection(current: number, previousScroll: number, latestScroll: number): number {
  if (latestScroll > previousScroll) return 1;
  if (latestScroll < previousScroll) return -1;
  return current;
}
