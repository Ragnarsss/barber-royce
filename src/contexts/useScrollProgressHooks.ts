/**
 * Hooks para acceder al scrollYProgress compartido
 * Separado del provider para evitar Fast Refresh warnings
 */

import { useContext } from 'react';
import { type MotionValue } from 'framer-motion';
import { ScrollProgressContext } from './ScrollProgressContext';

/**
 * Hook para acceder al scrollYProgress compartido
 * 
 * @returns scrollYProgress global (0-1)
 * @throws Error si se usa fuera del ScrollProgressProvider
 * 
 * @example
 * ```tsx
 * const Hero = () => {
 *   const scrollYProgress = useScrollProgress();
 *   const styles = useOptimizedParallax(scrollYProgress, {
 *     layers: ['background', 'middle']
 *   });
 *   
 *   return <motion.div style={styles.layers.background}>Hero</motion.div>;
 * };
 * ```
 */
export function useScrollProgress(): MotionValue<number> {
  const context = useContext(ScrollProgressContext);

  if (!context) {
    throw new Error(
      'useScrollProgress must be used within ScrollProgressProvider. ' +
      'Wrap your app with <ScrollProgressProvider>.'
    );
  }

  return context.scrollYProgress;
}

/**
 * Hook para verificar si el contexto está disponible (sin throw error)
 * Útil para componentes que pueden funcionar con o sin el provider
 * 
 * @returns scrollYProgress si está disponible, null si no
 * 
 * @example
 * ```tsx
 * const SmoothParallax = () => {
 *   const globalScroll = useScrollProgressOptional();
 *   
 *   // Usar global scroll si está disponible, sino crear uno local
 *   const localRef = useRef(null);
 *   const { scrollYProgress: localScroll } = useScroll({
 *     target: localRef,
 *     offset: ['start end', 'end start']
 *   });
 *   
 *   const scrollYProgress = globalScroll || localScroll;
 *   
 *   return <div ref={globalScroll ? undefined : localRef}>...</div>;
 * };
 * ```
 */
export function useScrollProgressOptional(): MotionValue<number> | null {
  const context = useContext(ScrollProgressContext);
  return context?.scrollYProgress || null;
}
