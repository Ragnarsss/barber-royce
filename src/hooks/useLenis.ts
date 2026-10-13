/**
 * Hook para integrar Lenis smooth scroll con React.
 * La instancia se comparte con LenisContext; nadie la lee de `window`.
 */

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";

const LENIS_CONFIG = {
  duration: 0.25,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  gestureOrientation: "vertical",
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
  autoResize: true, // Lenis ya recalcula al cambiar el tamaño de la ventana
} as const;

/**
 * Crea la instancia de Lenis y la mantiene sincronizada con el contenido.
 * @returns La instancia de Lenis, o null mientras no está lista o si el
 * usuario pidió reducir el movimiento (scroll nativo).
 */
export const useLenis = () => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  // Con "reducir movimiento" no hay smooth scroll: se usa el scroll nativo (BR-017)
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis(LENIS_CONFIG);

    // Loop de animación
    let rafId = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    });

    // Cambios de alto del contenido (imágenes que cargan, secciones lazy).
    // Un solo ResizeObserver sobre el body: sin MutationObserver, que
    // recalculaba en cada cambio de estilo que hace framer-motion (BR-014).
    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(document.body);

    // Publicar la instancia cuando el DOM ya está listo
    const readyFrame = requestAnimationFrame(() => {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true });
      setLenisInstance(lenis);
    });

    return () => {
      cancelAnimationFrame(readyFrame);
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      lenis.destroy();
      setLenisInstance(null);
    };
  }, [reducedMotion]);

  return lenisInstance;
};
