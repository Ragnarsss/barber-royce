/**
 * Cambio de sucursal con una cortina en diagonal (ADR-010 punto 8, BR-105): el navegador toma una captura de la página,
 * `update` la deja en la otra sucursal y la nueva aparece sobre la vieja (el recorte está en `branchTransition.css`).
 * `update` puede devolver una promesa: la captura de «después» se toma cuando se resuelve, es decir, cuando React ya
 * pintó la sucursal nueva.
 *
 * Sin View Transitions (Firefox, jsdom) o con «reducir movimiento», `update` corre sin animación (HU-SUC-001 CA-08).
 */
type StartViewTransition = (update: () => void | Promise<void>) => unknown;

export function withBranchTransition(update: () => void | Promise<void>): void {
  const start = (document as Document & { startViewTransition?: StartViewTransition }).startViewTransition;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  if (typeof start !== "function" || reducedMotion) {
    void update();
    return;
  }
  start.call(document, update);
}
