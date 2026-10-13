/**
 * Ejecuta `callback` cuando la página terminó de cargar (evento `load`), o de inmediato si ya
 * cargó. La analítica espera a este momento para no competir con el LCP (RNF-PERF-007).
 * Devuelve una función que cancela la ejecución pendiente.
 */
export function runAfterLoad(callback: () => void, target: Window = window): () => void {
  if (target.document.readyState === "complete") {
    callback();
    return () => {};
  }

  target.addEventListener("load", callback, { once: true });
  return () => target.removeEventListener("load", callback);
}
