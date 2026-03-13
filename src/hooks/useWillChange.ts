import { useEffect, useRef, useState, type RefObject } from 'react';
import {
  WILL_CHANGE_CLEANUP_DELAY,
  MAX_WILL_CHANGE_ELEMENTS
} from '@/config/performance.constants';

/**
 * Clase para gestionar will-change dinámicamente
 * Limita el número de elementos con will-change activo simultáneamente
 */
class WillChangeManager {
  private activeElements = new Set<HTMLElement>();
  private readonly maxElements: number;

  constructor(maxElements: number = MAX_WILL_CHANGE_ELEMENTS) {
    this.maxElements = maxElements;
  }

  /**
   * Aplica will-change a un elemento si no se ha alcanzado el límite
   */
  apply(element: HTMLElement, properties: string = 'transform'): boolean {
    if (this.activeElements.size >= this.maxElements && !this.activeElements.has(element)) {
      // Ya hay demasiados elementos con will-change
      return false;
    }

    element.style.willChange = properties;
    this.activeElements.add(element);
    return true;
  }

  /**
   * Remueve will-change de un elemento
   */
  remove(element: HTMLElement): void {
    element.style.willChange = 'auto';
    this.activeElements.delete(element);
  }

  /**
   * Obtiene el número de elementos activos
   */
  getActiveCount(): number {
    return this.activeElements.size;
  }
}

// Instancia singleton global
const willChangeManager = new WillChangeManager();

/**
 * Hook para aplicar will-change dinámicamente usando IntersectionObserver
 * Solo aplica will-change cuando elemento está cerca del viewport
 * 
 * @param ref - Referencia al elemento a observar
 * @param properties - Propiedades CSS a optimizar (default: 'transform')
 * @param options - Configuración del IntersectionObserver
 * 
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * useWillChange(ref, 'transform, opacity');
 * 
 * return <motion.div ref={ref}>...</motion.div>;
 * ```
 */
export const useWillChange = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  properties: string = 'transform',
  options: IntersectionObserverInit = {
    rootMargin: '50px 0px 50px 0px',
    threshold: [0, 0.1, 0.5, 1],
  }
) => {
  const cleanupTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Elemento entrando al viewport: aplicar will-change
          const applied = willChangeManager.apply(element, properties);

          if (!applied && import.meta.env.DEV) {
            console.warn(
              `[Performance] will-change limit reached (${MAX_WILL_CHANGE_ELEMENTS}). ` +
              `Element will animate without GPU optimization.`
            );
          }

          // Cancelar cleanup pendiente si existe
          if (cleanupTimeoutRef.current !== null) {
            clearTimeout(cleanupTimeoutRef.current);
            cleanupTimeoutRef.current = null;
          }
        } else {
          // Elemento saliendo del viewport: programar remoción
          // Esperar un poco por si vuelve a entrar rápidamente
          cleanupTimeoutRef.current = window.setTimeout(() => {
            willChangeManager.remove(element);
            cleanupTimeoutRef.current = null;
          }, WILL_CHANGE_CLEANUP_DELAY);
        }
      });
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (cleanupTimeoutRef.current !== null) {
        clearTimeout(cleanupTimeoutRef.current);
      }
      willChangeManager.remove(element);
    };
  }, [ref, properties, options]);
};

/**
 * Hook para aplicar will-change solo durante animación activa
 * Útil para animaciones disparadas por scroll
 * 
 * @param ref - Referencia al elemento
 * @param isAnimating - Estado de animación (true = animando)
 * @param properties - Propiedades CSS a optimizar
 * 
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null);
 * const [isScrolling, setIsScrolling] = useState(false);
 * 
 * useWillChangeOnActive(ref, isScrolling, 'transform');
 * 
 * return <motion.div ref={ref} style={{ y: scrollY }}>...</motion.div>;
 * ```
 */
export const useWillChangeOnActive = <T extends HTMLElement>(
  ref: RefObject<T | null>,
  isAnimating: boolean,
  properties: string = 'transform'
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (isAnimating) {
      willChangeManager.apply(element, properties);
    } else {
      // Esperar un poco antes de remover (la animación puede tener inertia)
      const timeout = window.setTimeout(() => {
        willChangeManager.remove(element);
      }, WILL_CHANGE_CLEANUP_DELAY);

      return () => clearTimeout(timeout);
    }
  }, [ref, isAnimating, properties]);
};

/**
 * Hook para obtener estadísticas del WillChangeManager (debugging)
 */
export const useWillChangeStats = () => {
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCount(willChangeManager.getActiveCount());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    activeCount,
    maxElements: MAX_WILL_CHANGE_ELEMENTS,
    utilization: (activeCount / MAX_WILL_CHANGE_ELEMENTS) * 100,
  };
};
