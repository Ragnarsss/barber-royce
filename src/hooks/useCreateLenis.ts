/**
 * Crea la instancia de Lenis (smooth scroll) para compartirla con LenisContext.
 * Nadie la lee de `window`.
 */

import { useEffect, useState } from "react";
import Lenis, { type LenisOptions } from "lenis";
import { useReducedMotion } from "framer-motion";

const LENIS_CONFIG: LenisOptions = {
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 2,
  // Lenis lleva su propio loop y observa el tamaño de la ventana y del contenido
  autoRaf: true,
  autoResize: true,
};

/**
 * @returns La instancia de Lenis, o null mientras no está lista o si el
 * usuario pidió reducir el movimiento (scroll nativo).
 */
export const useCreateLenis = () => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  // Con "reducir movimiento" no hay smooth scroll: se usa el scroll nativo (BR-017)
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis(LENIS_CONFIG);

    // Se publica al siguiente frame, cuando el DOM ya tiene su alto final
    const readyFrame = requestAnimationFrame(() => {
      lenis.scrollTo(0, { immediate: true });
      setLenisInstance(lenis);
    });

    return () => {
      cancelAnimationFrame(readyFrame);
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [reducedMotion]);

  return lenisInstance;
};
