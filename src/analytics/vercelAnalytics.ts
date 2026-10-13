import { runAfterLoad } from "./runAfterLoad";

/**
 * Vercel Analytics (BR-036, HU-MED-001): visitas y rutas, sin cookies.
 * Se carga después del evento `load` para no competir con el LCP (RNF-PERF-007).
 * `inject` ya detecta los cambios de ruta de la SPA (pushState).
 */
export function installVercelAnalytics(target: Window = window): void {
  runAfterLoad(() => {
    void import("@vercel/analytics").then(({ inject }) => inject());
  }, target);
}
