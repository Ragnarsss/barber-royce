import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook que limita la ejecución de una función usando requestAnimationFrame
 * Previene forced reflows al sincronizar actualizaciones con el render loop del navegador
 * 
 * @param callback - Función a ejecutar
 * @param fps - Frames por segundo objetivo (default: 30 para balance entre suavidad y rendimiento)
 * @returns Función throttled que respeta el FPS límite
 * 
 * @example
 * ```tsx
 * const handleScroll = useRAFThrottle((scrollY: number) => {
 *   // Esta función se ejecutará máximo 30 veces por segundo
 *   setTransform(scrollY);
 * }, 30);
 * 
 * useEffect(() => {
 *   window.addEventListener('scroll', () => handleScroll(window.scrollY));
 * }, []);
 * ```
 */
export const useRAFThrottle = <T extends (...args: unknown[]) => void>(
  callback: T,
  fps: number = 30
): ((...args: Parameters<T>) => void) => {
  const rafIdRef = useRef<number | null>(null);
  const lastExecutionRef = useRef<number>(0);
  const frameInterval = 1000 / fps; // Intervalo entre frames en ms

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      // Cancelar RAF anterior si existe
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame((timestamp) => {
        const timeSinceLastExecution = timestamp - lastExecutionRef.current;

        // Solo ejecutar si ha pasado el intervalo requerido
        if (timeSinceLastExecution >= frameInterval) {
          callback(...args);
          lastExecutionRef.current = timestamp;
          rafIdRef.current = null;
        } else {
          // Si no ha pasado suficiente tiempo, programar otro RAF
          rafIdRef.current = requestAnimationFrame(() => {
            callback(...args);
            lastExecutionRef.current = performance.now();
            rafIdRef.current = null;
          });
        }
      });
    },
    [callback, frameInterval]
  );

  // Cleanup: cancelar RAF pendiente al desmontar
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

/**
 * Hook para batch de lecturas y escrituras del DOM
 * Separa lecturas (mediciones) de escrituras (cambios de estilo) para evitar reflows
 * 
 * @returns Objeto con métodos schedule para lecturas y escrituras
 * 
 * @example
 * ```tsx
 * const { scheduleRead, scheduleWrite } = useBatchedDOM();
 * 
 * // Primero programar todas las lecturas
 * scheduleRead(() => {
 *   const height = element.offsetHeight;
 *   scheduleWrite(() => {
 *     // Luego aplicar escrituras usando los valores leídos
 *     element.style.height = `${height * 2}px`;
 *   });
 * });
 * ```
 */
export const useBatchedDOM = () => {
  const readCallbacksRef = useRef<(() => void)[]>([]);
  const writeCallbacksRef = useRef<(() => void)[]>([]);
  const rafIdRef = useRef<number | null>(null);

  const flush = useCallback(() => {
    // Ejecutar todas las lecturas primero (mediciones del DOM)
    const reads = readCallbacksRef.current;
    readCallbacksRef.current = [];
    reads.forEach(callback => callback());

    // Luego ejecutar todas las escrituras (cambios de estilo)
    const writes = writeCallbacksRef.current;
    writeCallbacksRef.current = [];
    writes.forEach(callback => callback());

    rafIdRef.current = null;
  }, []);

  const scheduleRead = useCallback((callback: () => void) => {
    readCallbacksRef.current.push(callback);

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(flush);
    }
  }, [flush]);

  const scheduleWrite = useCallback((callback: () => void) => {
    writeCallbacksRef.current.push(callback);

    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(flush);
    }
  }, [flush]);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return { scheduleRead, scheduleWrite };
};
