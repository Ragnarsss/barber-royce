/**
 * Hook para detectar cuando hay scroll activo
 * Útil para aplicar will-change dinámicamente durante parallax
 * 
 * BENEFICIO: Reduce GPU memory usage
 * - will-change permanente: 20+ elementos siempre en GPU
 * - will-change dinámico: 3-5 elementos solo mientras scrolleas
 * 
 * USO:
 * ```tsx
 * const isScrolling = useScrollActive();
 * <motion.div className={isScrolling ? styles.isAnimating : ''}>
 *   Parallax element
 * </motion.div>
 * ```
 */

import { useState, useEffect } from 'react';
import { SCROLL_VELOCITY_THRESHOLD } from '@/config/performance.constants';

/**
 * Hook que detecta scroll activo con threshold de velocidad
 * 
 * @param threshold - Velocidad mínima para considerar scroll activo (default: 0.5)
 * @param delay - Tiempo en ms antes de desactivar después de scroll stop (default: 300ms)
 * @returns true si hay scroll activo, false si está idle
 * 
 * @example
 * ```tsx
 * const Hero = () => {
 *   const isScrolling = useScrollActive(0.5, 300);
 *   
 *   return (
 *     <motion.div 
 *       className={isScrolling ? 'isAnimating' : ''}
 *       style={{ y: parallaxY }}
 *     >
 *       Content with dynamic will-change
 *     </motion.div>
 *   );
 * };
 * ```
 */
export const useScrollActive = (
  threshold: number = SCROLL_VELOCITY_THRESHOLD,
  delay: number = 300
): boolean => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let timeoutId: number | null = null;
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();

      // Calcular velocidad (pixels/ms)
      const deltaY = Math.abs(currentScrollY - lastScrollY);
      const deltaTime = currentTime - lastTime;
      const velocity = deltaTime > 0 ? deltaY / deltaTime : 0;

      // Activar si velocity supera threshold
      if (velocity > threshold) {
        setIsScrolling(true);

        // Cancelar timeout pendiente
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        // Programar desactivación después de delay
        timeoutId = window.setTimeout(() => {
          setIsScrolling(false);
          timeoutId = null;
        }, delay);
      }

      lastScrollY = currentScrollY;
      lastTime = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [threshold, delay]);

  return isScrolling;
};

/**
 * Variant del hook que usa Lenis scroll data (más preciso)
 * Requiere Lenis context configurado
 * 
 * @returns true si hay scroll activo según Lenis velocity
 * 
 * @example
 * ```tsx
 * import { useLenisScrollActive } from '@/hooks/useScrollActive';
 * 
 * const Hero = () => {
 *   const isScrolling = useLenisScrollActive();
 *   return <motion.div className={isScrolling ? 'isAnimating' : ''}>...</motion.div>;
 * };
 * ```
 */
export const useLenisScrollActive = (): boolean => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Verificar si Lenis está disponible
    const lenis = (window as unknown as { lenis?: { on: (event: string, handler: (e: { velocity: number }) => void) => void; off: (event: string, handler: (e: { velocity: number }) => void) => void } }).lenis;
    if (!lenis) {
      // Fallback a scroll nativo
      return;
    }

    let timeoutId: number | null = null;

    const handleLenisScroll = (e: { velocity: number }) => {
      const velocity = Math.abs(e.velocity);

      if (velocity > SCROLL_VELOCITY_THRESHOLD) {
        setIsScrolling(true);

        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        timeoutId = window.setTimeout(() => {
          setIsScrolling(false);
          timeoutId = null;
        }, 300);
      }
    };

    lenis.on('scroll', handleLenisScroll);

    return () => {
      lenis.off('scroll', handleLenisScroll);
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return isScrolling;
};
