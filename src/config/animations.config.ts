/**
 * Configuración de animaciones con Framer Motion
 * Single source of truth para todas las animaciones del proyecto
 */

import type { Variants, Transition } from "framer-motion";

// ============================================================================
// VIEWPORTS - Configuraciones de intersección
// ============================================================================

export const defaultViewport = {
    once: true,
    amount: 0.2,
    margin: "0px 0px -100px 0px"
} as const;

export const immediateViewport = {
    once: true,
    amount: 0.1,
    margin: "0px"
} as const;

// ============================================================================
// TRANSITIONS - Configuraciones de timing
// ============================================================================

export const springTransition: Transition = {
    type: "spring",
    stiffness: 100,
    damping: 15
};

export const easeTransition: Transition = {
    type: "tween",
    duration: 0.4,
    ease: "easeOut"
};

export const smoothTransition: Transition = {
    type: "tween",
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1]
};

export const fastTransition: Transition = {
    type: "tween",
    duration: 0.2,
    ease: "easeOut"
};

// ============================================================================
// VARIANTS - Animaciones predefinidas
// ============================================================================

/**
 * Fade in desde abajo
 */
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: smoothTransition
    }
};

/**
 * Fade in desde la izquierda
 */
export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: smoothTransition
    }
};

/**
 * Fade in desde la derecha
 */
export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1,
        x: 0,
        transition: smoothTransition
    }
};

/**
 * Scale in con fade
 */
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { ...smoothTransition, duration: 0.5 }
    }
};

/**
 * Fade in simple (sin movimiento)
 */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: easeTransition
    }
};

/**
 * Fade in con movimiento corto hacia arriba (sutil)
 */
export const fadeInUpShort: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: easeTransition
    }
};

/**
 * Fade in con scale sutil
 */
export const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: easeTransition
    }
};

/**
 * Slide in desde abajo (más dramático)
 */
export const slideInUp: Variants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
        opacity: 1,
        y: 0,
        transition: smoothTransition
    }
};

/**
 * Contenedor con stagger para animar hijos
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

/**
 * Stagger rápido para listas
 */
export const staggerFast: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0
        }
    }
};

/**
 * Stagger lento para efectos más dramáticos
 */
export const staggerSlow: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.2
        }
    }
};

// ============================================================================
// ANIMACIONES ESPECÍFICAS
// ============================================================================

/**
 * Para cards de servicios/productos
 */
export const cardAnimation: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: easeTransition
    }
};

/**
 * Para secciones de página
 */
export const sectionAnimation: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: smoothTransition
    }
};

/**
 * Para títulos importantes
 */
export const titleAnimation: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: smoothTransition
    }
};

// ============================================================================
// HELPER TYPES
// ============================================================================

export type AnimationName =
    | "fadeInUp"
    | "fadeInLeft"
    | "fadeInRight"
    | "scaleIn"
    | "fadeIn"
    | "fadeInUpShort"
    | "fadeInScale"
    | "slideInUp"
    | "cardAnimation"
    | "sectionAnimation"
    | "titleAnimation";

/**
 * Mapa de nombres de animación a variants
 */
export const animations: Record<AnimationName, Variants> = {
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    fadeIn,
    fadeInUpShort,
    fadeInScale,
    slideInUp,
    cardAnimation,
    sectionAnimation,
    titleAnimation
};

/**
 * Helper para obtener props de animación comunes
 */
export const getAnimationProps = (
    variantName: AnimationName = "fadeInUp",
    viewport = defaultViewport
) => ({
    initial: "hidden",
    whileInView: "visible",
    viewport,
    variants: animations[variantName]
});

// ============================================================================
// PARALLAX LAYERS - Configuración para efectos parallax
// ============================================================================

/**
 * Configuración de capas parallax para useParallaxLayers hook
 * Define los rangos de movimiento para cada capa basado en profundidad
 */
export const parallaxLayers = {
    // Capa de fondo (más lenta) - profundidad 1
    background: {
        y: ["0%", "15%"],
        scale: [1, 1.05],
    },
    // Capa media - profundidad 2
    middle: {
        y: ["0%", "25%"],
        scale: [1, 1.08],
        rotate: [0, -2],
    },
    // Capa frontal (más rápida) - profundidad 3
    foreground: {
        y: ["0%", "35%"],
        scale: [1, 1.12],
        rotate: [0, 3],
    },
    // Elementos decorativos sutiles
    slow: {
        y: ["0%", "10%"],
        x: ["0%", "5%"],
    },
    // Elementos destacados
    fast: {
        y: ["0%", "45%"],
        x: ["0%", "-3%"],
    },
};
