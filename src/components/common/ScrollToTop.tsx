import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenisInstance } from "@/contexts/LenisContext";

/**
 * Componente que hace scroll al top cuando cambia la ruta
 * y refresca las dimensiones de Lenis para el nuevo contenido
 */
export const ScrollToTop = () => {
    const { pathname } = useLocation();
    const lenis = useLenisInstance();

    useEffect(() => {
        if (lenis) {
            // Scroll inmediato al top
            lenis.scrollTo(0, { immediate: true });

            // Refrescar dimensiones después de que el nuevo contenido se monte
            // Múltiples checks para asegurar sincronización
            requestAnimationFrame(() => {
                lenis.resize();

                // Check adicional después de imágenes/layout
                setTimeout(() => {
                    lenis.resize();
                }, 100);

                // Check final para contenido lazy
                setTimeout(() => {
                    lenis.resize();
                }, 500);
            });
        } else {
            // Fallback a scroll nativo
            window.scrollTo(0, 0);
        }
    }, [pathname, lenis]);

    return null;
};
