/**
 * Hook para integrar Lenis smooth scroll con React
 * Incluye ResizeObserver para sincronización automática con contenido dinámico
 */

import { useEffect, useState, useRef } from "react";
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
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Crear instancia de Lenis con configuración personalizada
    const lenis = new Lenis({
      duration: 0.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true, // Activar auto-resize nativo de Lenis
      ...options,
    });

    // Exponer instancia globalmente
    window.lenis = lenis;

    // Función de animación RAF
    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }

    // Iniciar loop de animación
    rafIdRef.current = requestAnimationFrame(raf);

    // ResizeObserver para detectar cambios de contenido
    const resizeObserver = new ResizeObserver(() => {
      // Recalcular dimensiones cuando el contenido cambia
      lenis.resize();
    });

    // Observar el body (contiene todo el contenido)
    resizeObserver.observe(document.body);

    // MutationObserver para detectar cambios en el DOM (imágenes que cargan)
    const mutationObserver = new MutationObserver(() => {
      lenis.resize();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Esperar a que el DOM esté listo antes de exponer la instancia
    requestAnimationFrame(() => {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true });
      setLenisInstance(lenis);
    });

    // Listener de resize de ventana
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener("resize", handleResize);

    // Listener de carga de imágenes (para recalcular cuando cargan)
    const handleImageLoad = () => {
      lenis.resize();
    };
    window.addEventListener("load", handleImageLoad);

    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleImageLoad);
      lenis.destroy();
      window.lenis = undefined;
      setLenisInstance(null);
    };
  }, [options]);

  return lenisInstance;
};
