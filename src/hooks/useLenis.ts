/**
 * Hook personalizado para integrar Lenis smooth scroll con React
 */

import { useEffect } from "react";
import Lenis from "lenis";

// Extender el tipo Window para incluir la instancia de Lenis
declare global {
  interface Window {
    lenis?: Lenis;
  }
}

/**
 * Configuración del smooth scroll usando Lenis
 * @param options - Opciones de configuración de Lenis
 * @returns Instancia de Lenis
 */
export const useLenis = (options?: ConstructorParameters<typeof Lenis>[0]) => {
  useEffect(() => {
    // Crear instancia de Lenis con configuración personalizada
    const lenis = new Lenis({
      duration: 1.2, // Duración de la animación en segundos (más alto = más suave y lento)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing personalizado (easeOutExpo)
      orientation: "vertical", // Dirección del scroll
      gestureOrientation: "vertical",
      smoothWheel: true, // Suavizar el scroll con la rueda del mouse
      wheelMultiplier: 1, // Multiplicador de velocidad de la rueda
      smoothTouch: false, // No suavizar en touch (mejor UX en móviles)
      touchMultiplier: 2, // Multiplicador de velocidad en touch
      infinite: false, // No hacer scroll infinito
      ...options,
    });

    // Exponer instancia globalmente para otros hooks
    window.lenis = lenis;

    // Función de animación que se ejecuta en cada frame
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Iniciar el loop de animación
    requestAnimationFrame(raf);

    // Cleanup: destruir la instancia cuando el componente se desmonte
    return () => {
      lenis.destroy();
      window.lenis = undefined;
    };
  }, [options]);
};
