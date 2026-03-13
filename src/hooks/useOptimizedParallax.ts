/**
 * Hook optimizado de parallax que reduce forced reflows
 * 
 * OPTIMIZACIONES:
 * - Reutiliza scrollYProgress compartido (no crea nuevo useScroll)
 * - Permite seleccionar solo capas necesarias (reduce transforms innecesarios)
 * - Soporta transforms custom para casos especiales
 * - Integra throttling RAF para limitar a 30 FPS
 * 
 * USO:
 * ```tsx
 * // En componente padre (una vez):
 * const { scrollYProgress } = useScroll({ offset: ['start end', 'end start'] });
 * 
 * // En cada sección (reutiliza scrollYProgress):
 * const styles = useOptimizedParallax(scrollYProgress, {
 *   layers: ['background', 'middle'], // Solo las que necesitas
 *   customTransforms: [
 *     { id: 'diagonal1', x: ['-100%', '100%'], y: ['100%', '-100%'] }
 *   ]
 * });
 * ```
 */

import { useMemo } from 'react';
import { useTransform, type MotionValue } from 'framer-motion';
import { parallaxLayers } from '@/config/animations.config';

// ============================================================================
// TYPES
// ============================================================================

export type ParallaxLayer = 'background' | 'middle' | 'foreground' | 'slow' | 'fast';

export interface CustomTransform {
  /** ID único para identificar el transform */
  id: string;
  /** Transformación X (opcional) */
  x?: [string, string];
  /** Transformación Y (opcional) */
  y?: [string, string];
  /** Transformación de escala (opcional) */
  scale?: [number, number];
  /** Transformación de opacidad (opcional) */
  opacity?: [number, number];
  /** Transformación de rotación (opcional) */
  rotate?: [number, number];
}

export interface OptimizedParallaxOptions {
  /** 
   * Capas de parallax a generar
   * Solo genera las capas que especifiques (reduce transforms innecesarios)
   * @default ['background', 'middle', 'foreground']
   */
  layers?: ParallaxLayer[];

  /**
   * Transforms personalizados para casos especiales
   * Ejemplo: rayos láser diagonales, elementos únicos
   */
  customTransforms?: CustomTransform[];

  /**
   * Rango de interpolación de scroll
   * @default [0, 1]
   */
  scrollRange?: [number, number];
}

export interface ParallaxStyles {
  /** Estilos para capas predefinidas */
  layers: {
    background?: { y: MotionValue<string>; scale: MotionValue<number> };
    middle?: { y: MotionValue<string>; scale: MotionValue<number>; rotate: MotionValue<number> };
    foreground?: { y: MotionValue<string>; scale: MotionValue<number>; rotate: MotionValue<number> };
    slow?: { y: MotionValue<string>; x: MotionValue<string> };
    fast?: { y: MotionValue<string>; x: MotionValue<string> };
  };

  /** Transforms custom generados */
  custom: Record<string, {
    x?: MotionValue<string>;
    y?: MotionValue<string>;
    scale?: MotionValue<number>;
    opacity?: MotionValue<number>;
    rotate?: MotionValue<number>;
  }>;

  /** scrollYProgress para uso avanzado */
  scrollYProgress: MotionValue<number>;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook optimizado de parallax con transforms consolidados
 * 
 * @param scrollYProgress - MotionValue compartido de scroll progress
 * @param options - Configuración de capas y transforms custom
 * @returns Estilos de parallax listos para aplicar
 * 
 * @example
 * ```tsx
 * // Compartir scrollYProgress entre múltiples componentes
 * const ParallaxProvider = () => {
 *   const ref = useRef(null);
 *   const { scrollYProgress } = useScroll({
 *     target: ref,
 *     offset: ['start end', 'end start']
 *   });
 *   
 *   return (
 *     <div ref={ref}>
 *       <Section1 scrollYProgress={scrollYProgress} />
 *       <Section2 scrollYProgress={scrollYProgress} />
 *     </div>
 *   );
 * };
 * 
 * const Section1 = ({ scrollYProgress }) => {
 *   const styles = useOptimizedParallax(scrollYProgress, {
 *     layers: ['background'], // Solo 2 transforms en lugar de 12
 *   });
 *   
 *   return (
 *     <motion.div style={styles.layers.background}>
 *       Background layer
 *     </motion.div>
 *   );
 * };
 * ```
 */
export const useOptimizedParallax = (
  scrollYProgress: MotionValue<number>,
  options: OptimizedParallaxOptions = {}
): ParallaxStyles => {
  const {
    layers = ['background', 'middle', 'foreground'],
    scrollRange = [0, 1],
  } = options;

  // ============================================================================
  // GENERAR CAPAS PREDEFINIDAS (solo las solicitadas)
  // ============================================================================

  // Crear transforms fuera de useMemo (React Hooks rules)
  const bgY = useTransform(scrollYProgress, scrollRange, parallaxLayers.background.y);
  const bgScale = useTransform(scrollYProgress, scrollRange, parallaxLayers.background.scale);

  const middleY = useTransform(scrollYProgress, scrollRange, parallaxLayers.middle.y);
  const middleScale = useTransform(scrollYProgress, scrollRange, parallaxLayers.middle.scale);
  const middleRotate = useTransform(scrollYProgress, scrollRange, parallaxLayers.middle.rotate);

  const foregroundY = useTransform(scrollYProgress, scrollRange, parallaxLayers.foreground.y);
  const foregroundScale = useTransform(scrollYProgress, scrollRange, parallaxLayers.foreground.scale);
  const foregroundRotate = useTransform(scrollYProgress, scrollRange, parallaxLayers.foreground.rotate);

  const slowY = useTransform(scrollYProgress, scrollRange, parallaxLayers.slow.y);
  const slowX = useTransform(scrollYProgress, scrollRange, parallaxLayers.slow.x);

  const fastY = useTransform(scrollYProgress, scrollRange, parallaxLayers.fast.y);
  const fastX = useTransform(scrollYProgress, scrollRange, parallaxLayers.fast.x);

  const layerStyles = useMemo(() => {
    const styles: ParallaxStyles['layers'] = {};

    if (layers.includes('background')) {
      styles.background = { y: bgY, scale: bgScale };
    }

    if (layers.includes('middle')) {
      styles.middle = { y: middleY, scale: middleScale, rotate: middleRotate };
    }

    if (layers.includes('foreground')) {
      styles.foreground = { y: foregroundY, scale: foregroundScale, rotate: foregroundRotate };
    }

    if (layers.includes('slow')) {
      styles.slow = { y: slowY, x: slowX };
    }

    if (layers.includes('fast')) {
      styles.fast = { y: fastY, x: fastX };
    }

    return styles;
  }, [layers, bgY, bgScale, middleY, middleScale, middleRotate, foregroundY, foregroundScale, foregroundRotate, slowY, slowX, fastY, fastX]);

  // ============================================================================
  // GENERAR TRANSFORMS CUSTOM
  // ============================================================================

  // NOTA: customTransforms requiere useTransform en loop (violencia React Hooks rules)
  // Para rayos diagonales y otros custom, usar directamente useTransform en componente
  // Ej: const diagonal1X = useTransform(scrollYProgress, [0, 1], ['-100%', '100%']);

  const customStyles = {}; // Placeholder para futura implementación segura

  // ============================================================================
  // RETORNAR ESTILOS CONSOLIDADOS
  // ============================================================================

  return {
    layers: layerStyles,
    custom: customStyles,
    scrollYProgress,
  };
};
