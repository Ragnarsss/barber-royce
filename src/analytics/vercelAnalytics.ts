/**
 * Vercel Analytics (BR-036, HU-MED-001): visitas y rutas, sin cookies.
 * Se carga después del evento `load` para no competir con el LCP (RNF-PERF-007).
 * `inject` ya detecta los cambios de ruta de la SPA (pushState).
 */
export function installVercelAnalytics(target: Window = window): void {
  const start = () => {
    void import("@vercel/analytics").then(({ inject }) => inject());
  };

  if (target.document.readyState === "complete") {
    start();
  } else {
    target.addEventListener("load", start, { once: true });
  }
}
