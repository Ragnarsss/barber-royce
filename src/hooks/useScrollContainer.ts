import { useRef, useEffect, useState } from 'react';
import { useLenisInstance } from '@/contexts/LenisContext';

/**
 * Hook personalizado para manejar un contenedor con scroll horizontal
 * que pausa el scroll global (Lenis) cuando el usuario lo está usando
 * 
 * ✅ React 19: useCallback eliminado - overhead innecesario
 */
export const useScrollContainer = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const lenis = useLenisInstance();

    // Manejar eventos de wheel para convertir scroll vertical en horizontal
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleWheel = (e: WheelEvent) => {
            if (isHovering) {
                // Prevenir el scroll de la página
                e.preventDefault();
                e.stopPropagation();

                // Convertir el scroll vertical en horizontal
                const scrollAmount = e.deltaY;
                scrollContainer.scrollLeft += scrollAmount;
            }
        };

        // Agregar el event listener en la fase de captura para interceptar antes
        scrollContainer.addEventListener("wheel", handleWheel, {
            passive: false,
            capture: true,
        });

        return () => {
            scrollContainer.removeEventListener("wheel", handleWheel, true);
        };
    }, [isHovering]);

    // Pausar/reanudar Lenis cuando se hace hover
    useEffect(() => {
        if (!lenis) return;

        if (isHovering) {
            lenis.stop();
        } else {
            lenis.start();
        }

        // Cleanup: asegurarse de que Lenis esté activo al desmontar
        return () => {
            if (lenis) {
                lenis.start();
            }
        };
    }, [isHovering, lenis]);

    // ✅ React 19: Funciones inline - sin useCallback
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    return {
        scrollContainerRef,
        isHovering,
        handleMouseEnter,
        handleMouseLeave,
    };
};
