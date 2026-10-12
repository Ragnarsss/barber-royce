/**
 * Recuperación ante chunks inexistentes tras un despliegue (BR-020, RNF-CONF-002).
 *
 * Cada despliegue cambia el nombre (hash) de los chunks. Una pestaña abierta
 * desde antes pide el chunk viejo, que Vercel ya responde con 404, y la
 * navegación falla. Vite avisa con el evento `vite:preloadError`: se recarga
 * la página una vez para traer el index.html nuevo. Si vuelve a fallar dentro
 * de la ventana, no se recarga de nuevo (evita un bucle) y el error llega a
 * RouteErrorBoundary, que muestra PageError.
 */

const STORAGE_KEY = "barber-royce:chunk-reload-at";
export const RELOAD_WINDOW_MS = 10_000;

type MinimalStorage = Pick<Storage, "getItem" | "setItem">;

/**
 * Decide si corresponde recargar y, si corresponde, anota cuándo.
 * Sin storage disponible (modo privado estricto) no recarga: sin la marca no
 * hay forma de evitar un bucle, y el fallback de la página es un camino seguro.
 */
export function shouldReloadAfterChunkError(storage: MinimalStorage, now: number): boolean {
  try {
    const lastReloadAt = Number(storage.getItem(STORAGE_KEY));
    const reloadedRecently = lastReloadAt > 0 && now - lastReloadAt < RELOAD_WINDOW_MS;
    if (reloadedRecently) return false;

    storage.setItem(STORAGE_KEY, String(now));
    return true;
  } catch {
    // Degradación a propósito: storage bloqueado → sin recarga automática.
    return false;
  }
}

export function installChunkRecovery(target: Window = window): void {
  target.addEventListener("vite:preloadError", (event) => {
    if (!shouldReloadAfterChunkError(target.sessionStorage, Date.now())) return;

    // preventDefault evita que Vite relance el error: la recarga lo reemplaza.
    event.preventDefault();
    target.location.reload();
  });
}
