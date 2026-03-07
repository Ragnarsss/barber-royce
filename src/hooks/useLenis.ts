/**
 * Hook personalizado para integrar Lenis smooth scroll con React
 */

import { useEffect, useState } from "react";
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
 * @returns Instancia de Lenis o null
 */
export const useLenis = (options?: ConstructorParameters<typeof Lenis>[0]) => {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    // Crear instancia de Lenis con configuración personalizada
    const lenis = new Lenis({
      duration: 1.2, // Duración de la animación en segundos (más alto = más suave y lento)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing personalizado (easeOutExpo)
      orientation: "vertical", // Dirección del scroll
      gestureOrientation: "vertical",
      smoothWheel: true, // Suavizar el scroll con la rueda del mouse
      wheelMultiplier: 1, // Multiplicador de velocidad de la rueda
      touchMultiplier: 2, // Multiplicador de velocidad en touch
      infinite: false, // No hacer scroll infinito
      ...options,
    });

    // Exponer instancia globalmente para otros hooks (backward compatibility)
    window.lenis = lenis;
    setLenisInstance(lenis);

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
      setLenisInstance(null);
    };
  }, [options]);

  return lenisInstance;
};
