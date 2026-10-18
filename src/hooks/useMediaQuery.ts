import { useSyncExternalStore } from "react";

/**
 * Si la pantalla cumple una media query. Cambia solo cuando la ventana cruza el punto de corte, no con el scroll, y no
 * vuelve a renderizar mientras tanto. Sin `matchMedia` (pruebas en jsdom, servidor) responde que no.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia?.(query);
      list?.addEventListener("change", notify);
      return () => list?.removeEventListener("change", notify);
    },
    () => window.matchMedia?.(query).matches === true,
    () => false,
  );
}
