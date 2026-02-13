/**
 * Hook para obtener el progreso de scroll usando Lenis
 * Útil para animaciones basadas en posición de scroll
 */

import { useEffect, useState } from "react";
import Lenis from "lenis";

interface ScrollData {
  scroll: number; // Posición actual del scroll (px)
  limit: number; // Límite máximo de scroll (px)
  velocity: number; // Velocidad del scroll
  direction: number; // Dirección: 1 (down) o -1 (up)
  progress: number; // Progreso del scroll (0-1)
}

/**
 * Hook que se suscribe a los eventos de scroll de Lenis
 * y retorna información útil sobre el estado del scroll
 */
export const useLenisScroll = () => {
  const [scrollData, setScrollData] = useState<ScrollData>({
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 1,
    progress: 0,
  });

  useEffect(() => {
    // Esperar a que Lenis esté inicializado
    const checkLenis = () => {
      const lenis = window.lenis as Lenis | undefined;

      if (!lenis) {
        // Reintentar después de un frame
        requestAnimationFrame(checkLenis);
        return;
      }

      // Callback que se ejecuta en cada frame de scroll
      const handleScroll = (e: Lenis) => {
        setScrollData({
          scroll: e.scroll,
          limit: e.limit,
          velocity: e.velocity,
          direction: e.direction,
          progress: e.progress,
        });
      };

      // Suscribirse al evento de scroll
      lenis.on("scroll", handleScroll);

      // Cleanup: desuscribirse cuando el componente se desmonte
      return () => {
        lenis.off("scroll", handleScroll);
      };
    };

    const cleanup = checkLenis();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return scrollData;
};

/**
 * Hook para detectar cuando un elemento entra en el viewport
 * con información adicional de Lenis
 */
export const useLenisInView = (threshold = 0.2) => {
  const [isInView, setIsInView] = useState(false);
  const scrollData = useLenisScroll();

  return {
    isInView,
    setIsInView,
    scrollData,
  };
};
