import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenisInstance } from "@/contexts/LenisContext";

/**
 * Hace scroll al top y refresca Lenis cuando cambia la ruta.
 * Un solo rAF garantiza que el resize ocurre post-paint del nuevo contenido.
 * El setTimeout cubre el caso de imágenes/componentes lazy que alteran el layout.
 */
export const ScrollToTop = () => {
    const { pathname } = useLocation();
    const lenis = useLenisInstance();

    useEffect(() => {
        let frameId: number | undefined;
        let resizeTimeoutId: number | undefined;

        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
            frameId = window.requestAnimationFrame(() => {
                lenis.resize();
                resizeTimeoutId = window.setTimeout(() => lenis.resize(), 300);
            });
        } else {
            window.scrollTo(0, 0);
        }

        return () => {
            if (frameId !== undefined) {
                window.cancelAnimationFrame(frameId);
            }
            if (resizeTimeoutId !== undefined) {
                window.clearTimeout(resizeTimeoutId);
            }
        };
    }, [pathname, lenis]);

    return null;
};
