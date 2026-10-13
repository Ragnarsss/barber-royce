/**
 * Hook para obtener el progreso de scroll usando Lenis
 * Útil para animaciones basadas en posición de scroll
 */

import { useEffect, useState } from "react";
import type Lenis from "lenis";
import { useLenisInstance } from "@/hooks/useLenisContext";

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
  const lenis = useLenisInstance();
  const [scrollData, setScrollData] = useState<ScrollData>({
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 1,
    progress: 0,
  });

  useEffect(() => {
    // Sin Lenis (aún no listo, o scroll nativo) no hay a qué suscribirse;
    // cuando la instancia llega por el contexto, el efecto vuelve a correr.
    if (!lenis) return;

    const handleScroll = (e: Lenis) => {
      setScrollData({
        scroll: e.scroll,
        limit: e.limit,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress,
      });
    };

    lenis.on("scroll", handleScroll);
    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis]);

  return scrollData;
};

/**
 * Hook para detectar cuando un elemento entra en el viewport
 * con información adicional de Lenis
 */
export const useLenisInView = () => {
  const [isInView, setIsInView] = useState(false);
  const scrollData = useLenisScroll();

  return {
    isInView,
    setIsInView,
    scrollData,
  };
};
