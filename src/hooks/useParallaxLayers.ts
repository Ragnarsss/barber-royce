import { useRef, type RefObject } from 'react';
import { useScroll, useTransform, type MotionValue, type UseScrollOptions } from 'framer-motion';
import { parallaxLayers } from '@/config/animations.config';
import { PARALLAX_INTERPOLATION_POINTS } from '@/config/performance.constants';

export interface ParallaxOptions {
    offset?: UseScrollOptions['offset'];
}

export interface ParallaxLayers {
    // Transformaciones para capa de fondo
    background: {
        y: MotionValue<string>;
        scale: MotionValue<number>;
    };
    // Transformaciones para capa media
    middle: {
        y: MotionValue<string>;
        scale: MotionValue<number>;
        rotate: MotionValue<number>;
    };
    // Transformaciones para capa frontal
    foreground: {
        y: MotionValue<string>;
        scale: MotionValue<number>;
        rotate: MotionValue<number>;
    };
    // Transformaciones lentas
    slow: {
        y: MotionValue<string>;
        x: MotionValue<string>;
    };
    // Transformaciones rápidas
    fast: {
        y: MotionValue<string>;
        x: MotionValue<string>;
    };
    // scrollYProgress para uso personalizado
    scrollYProgress: MotionValue<number>;
}

/**
 * Hook personalizado para crear efectos parallax en múltiples capas
 * Centraliza la lógica de parallax reutilizable
 * 
 * OPTIMIZADO: Usa interpolation points constantes para reducir cálculos
 * 
 * @param sectionRef - Referencia al elemento que se va a observar (opcional)
 * @param options - Opciones de configuración (offset, etc.)
 * @returns Objeto con todas las transformaciones de parallax y ref
 * 
 * @example
 * ```tsx
 * const { ref, layers } = useParallaxLayers();
 * 
 * <section ref={ref}>
 *   <motion.div style={{ y: layers.background.y, scale: layers.background.scale }}>
 *     Contenido de fondo
 *   </motion.div>
 * </section>
 * ```
 */
export const useParallaxLayers = <T extends HTMLElement = HTMLElement>(
    sectionRef?: RefObject<T>,
    options: ParallaxOptions = {}
): { ref: RefObject<T | null>; layers: ParallaxLayers } => {
    // Crear ref interna si no se proporciona una
    const internalRef = useRef<T>(null);
    const targetRef = sectionRef || internalRef;

    const defaultOffset = ['start end', 'end start'] as const;
    const { offset = defaultOffset } = options;

    // Configurar scroll tracking
    const { scrollYProgress } = useScroll({
        target: targetRef as RefObject<HTMLElement | null>,
        offset: offset as UseScrollOptions['offset'],
    });

    // OPTIMIZACIÓN: Usar arrays de interpolación constantes (reduce de [0, 0.5, 1] a [0, 1])
    const interpolationRange = Array.from({ length: PARALLAX_INTERPOLATION_POINTS }, (_, i) =>
        i / (PARALLAX_INTERPOLATION_POINTS - 1)
    );

    // Crear transformaciones para capa de fondo
    const bgY = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.background.y]);
    const bgScale = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.background.scale]);

    // Crear transformaciones para capa media
    const middleY = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.middle.y]);
    const middleScale = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.middle.scale]);
    const middleRotate = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.middle.rotate]);

    // Crear transformaciones para capa frontal
    const foregroundY = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.foreground.y]);
    const foregroundScale = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.foreground.scale]);
    const foregroundRotate = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.foreground.rotate]);

    // Crear transformaciones lentas
    const slowY = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.slow.y]);
    const slowX = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.slow.x]);

    // Crear transformaciones rápidas
    const fastY = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.fast.y]);
    const fastX = useTransform(scrollYProgress, interpolationRange, [...parallaxLayers.fast.x]);

    return {
        ref: targetRef,
        layers: {
            background: {
                y: bgY,
                scale: bgScale,
            },
            middle: {
                y: middleY,
                scale: middleScale,
                rotate: middleRotate,
            },
            foreground: {
                y: foregroundY,
                scale: foregroundScale,
                rotate: foregroundRotate,
            },
            slow: {
                y: slowY,
                x: slowX,
            },
            fast: {
                y: fastY,
                x: fastX,
            },
            scrollYProgress,
        },
    };
};
