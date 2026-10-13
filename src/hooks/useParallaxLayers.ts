import { useRef, type RefObject } from 'react';
import { useReducedMotion, useScroll, useTransform, type MotionValue, type UseScrollOptions } from 'framer-motion';
import { parallaxLayers } from '@/config/animations.config';
import { PARALLAX_INTERPOLATION_POINTS } from '@/config/performance.constants';
import { calmRange } from '@/utils/reducedMotion';

/**
 * Parallax por capas (BR-016).
 *
 * Cada sección pide solo las capas que usa: un hook por capa, y cada hook crea
 * únicamente los useTransform de las propiedades que alguna sección anima.
 * Antes un solo hook creaba siempre 12 transforms por sección aunque usara 2.
 *
 * @example
 * ```tsx
 * const { ref, scrollYProgress } = useParallaxProgress<HTMLElement>();
 * const layers = { background: useBackgroundLayer(scrollYProgress) };
 *
 * <section ref={ref}>
 *   <motion.div style={{ y: layers.background.y, scale: layers.background.scale }} />
 * </section>
 * ```
 */

export interface ParallaxOptions {
    offset?: UseScrollOptions['offset'];
}

const INPUT_RANGE = Array.from({ length: PARALLAX_INTERPOLATION_POINTS }, (_, i) =>
    i / (PARALLAX_INTERPOLATION_POINTS - 1)
);

/**
 * Progreso de scroll de una sección (0 → 1) y el ref que hay que ponerle.
 * Con "reducir movimiento" las capas quedan quietas (BR-017, ver calmRange).
 */
export const useParallaxProgress = <T extends HTMLElement = HTMLElement>(
    sectionRef?: RefObject<T>,
    options: ParallaxOptions = {}
): { ref: RefObject<T | null>; scrollYProgress: MotionValue<number> } => {
    const internalRef = useRef<T>(null);
    const targetRef = sectionRef || internalRef;
    const { offset = ['start end', 'end start'] as const } = options;

    const { scrollYProgress } = useScroll({
        target: targetRef as RefObject<HTMLElement | null>,
        offset: offset as UseScrollOptions['offset'],
    });

    return { ref: targetRef, scrollYProgress };
};

/** Un valor de una capa: interpola el progreso hacia su rango, aplanado si se reduce el movimiento. */
function useLayerValue<T extends string | number>(
    progress: MotionValue<number>,
    range: readonly T[]
): MotionValue<T> {
    const reduced = useReducedMotion() ?? false;
    return useTransform(progress, INPUT_RANGE, calmRange(range, reduced));
}

/** Capa de fondo (la más lenta). */
export const useBackgroundLayer = (progress: MotionValue<number>) => ({
    y: useLayerValue(progress, parallaxLayers.background.y),
    scale: useLayerValue(progress, parallaxLayers.background.scale),
});

/** Capa media. */
export const useMiddleLayer = (progress: MotionValue<number>) => ({
    y: useLayerValue(progress, parallaxLayers.middle.y),
    rotate: useLayerValue(progress, parallaxLayers.middle.rotate),
});

/** Capa frontal. */
export const useForegroundLayer = (progress: MotionValue<number>) => ({
    y: useLayerValue(progress, parallaxLayers.foreground.y),
    scale: useLayerValue(progress, parallaxLayers.foreground.scale),
});

/** Elementos decorativos sutiles. */
export const useSlowLayer = (progress: MotionValue<number>) => ({
    y: useLayerValue(progress, parallaxLayers.slow.y),
    x: useLayerValue(progress, parallaxLayers.slow.x),
});

/** Elementos destacados (los más rápidos). */
export const useFastLayer = (progress: MotionValue<number>) => ({
    y: useLayerValue(progress, parallaxLayers.fast.y),
    x: useLayerValue(progress, parallaxLayers.fast.x),
});
