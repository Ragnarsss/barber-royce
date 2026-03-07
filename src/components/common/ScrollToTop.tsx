import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenisInstance } from "@/contexts/LenisContext";

/**
 * Componente que hace scroll al top cuando cambia la ruta
 */
export const ScrollToTop = () => {
    const { pathname } = useLocation();
    const lenis = useLenisInstance();

    useEffect(() => {
        // Usar Lenis si está disponible, sino usar scrollTo nativo
        if (lenis) {
            // Usar Lenis para scroll suave al top
            lenis.scrollTo(0, { immediate: true });
        } else {
            // Fallback a scroll nativo
            window.scrollTo(0, 0);
        }
    }, [pathname, lenis]);

    return null;
};
