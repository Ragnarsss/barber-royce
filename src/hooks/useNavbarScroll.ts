import { useState, useEffect } from 'react';

/**
 * Hook personalizado para manejar el estado de scroll del Navbar
 * @param threshold - Píxeles de scroll necesarios para activar el estado (default: 50)
 * @returns isScrolled - True si el scroll supera el threshold
 * 
 * ✅ React 19: useCallback eliminado - overhead innecesario
 */
export const useNavbarScroll = (threshold: number = 50) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        // ✅ React 19: Función inline sin useCallback
        const handleScroll = () => {
            const scrolled = window.scrollY > threshold;
            setIsScrolled(scrolled);
        };

        // Verificar el estado inicial
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return { isScrolled };
};
