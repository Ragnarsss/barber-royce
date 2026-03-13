/**
 * Contexto global para compartir scrollYProgress entre componentes
 * 
 * BENEFICIO: Reduce múltiples useScroll() calls a uno solo
 * - Antes: Cada SmoothParallax crea su propio useScroll (N instancias)
 * - Después: Un solo useScroll compartido por toda la app (1 instancia)
 * 
 * USO:
 * ```tsx
 * // En App.tsx o Layout:
 * <ScrollProgressProvider>
 *   <HomePage />
 * </ScrollProgressProvider>
 * 
 * // En cualquier componente hijo:
 * const scrollYProgress = useScrollProgress();
 * const styles = useOptimizedParallax(scrollYProgress, { layers: ['background'] });
 * ```
 */

import { createContext, useRef, type ReactNode } from 'react';
import { useScroll, type MotionValue } from 'framer-motion';

// ============================================================================
// TYPES
// ============================================================================

interface ScrollProgressContextValue {
  scrollYProgress: MotionValue<number>;
}

interface ScrollProgressProviderProps {
  children: ReactNode;
}

// ============================================================================
// CONTEXT (exportado para hooks)
// ============================================================================

export const ScrollProgressContext = createContext<ScrollProgressContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

/**
 * Provider que crea un único scrollYProgress compartido
 * 
 * @example
 * ```tsx
 * <ScrollProgressProvider>
 *   <Hero />
 *   <Services />
 *   <SocialProof />
 * </ScrollProgressProvider>
 * ```
 */
export function ScrollProgressProvider({ children }: ScrollProgressProviderProps) {
  const ref = useRef<HTMLDivElement>(null);

  // UN SOLO useScroll para toda la app
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <ScrollProgressContext.Provider value={{ scrollYProgress }}>
      <div ref={ref} style={{ width: '100%' }}>
        {children}
      </div>
    </ScrollProgressContext.Provider>
  );
}
