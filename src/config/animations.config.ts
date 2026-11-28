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
 * Barras de luz hexagonales que se encienden una vez (BR-058), como las del techo de la barbería: apagadas, un
 * parpadeo corto y encendidas. Con 2,5 destellos en 0,9 s queda bajo el límite de 3 por segundo (WCAG 2.3.1).
 * Con «reducir movimiento» el componente no usa esta variante: las barras aparecen encendidas.
 */
export const lightBarIgnite: Variants = {
    hidden: { opacity: 0.15 },
    visible: {
        opacity: [0.15, 1, 0.2, 1, 0.3, 1],
        transition: { duration: 0.9, times: [0, 0.3, 0.42, 0.55, 0.66, 0.8], ease: "linear" }
    }
};

/**
 * Borde de una figura SVG que se dibuja una vez (BR-096): el trazo va de nada a completo, como el filo de una navaja.
 * Solo anima `pathLength`, nunca `opacity`: en una figura con relleno la opacidad ocultaría también el relleno. `delay`
 * desfasa unas figuras de otras. Con «reducir movimiento» el componente no usa esta variante: el borde aparece dibujado.
 */
export const edgeDraw = (delay = 0): Variants => ({
    hidden: { pathLength: 0 },
    visible: { pathLength: 1, transition: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] } }
});

/**
 * Corte láser de una sola vez (BR-062): en pantallas chicas, el panel que tapa la foto o la tarjeta se retira al
 * entrar la sección, en vez de seguir el scroll. `to` es cuánto se corre (de su propio ancho) y hacia qué lado.
 */
export const laserCutOneShot = (to: string): Variants => ({
    hidden: { x: "0%" },
    visible: { x: to, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }
});

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
 * Las tres franjas del modal de bienvenida (BR-100): entran escalonadas desde la izquierda, una tras otra, con la
 * curva de siempre. El índice de la franja llega por `custom`. Solo `transform` y `opacity`.
 */
export const promoStripIn: Variants = {
    hidden: { opacity: 0, x: -28 },
    visible: (index: number = 0) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 + index * 0.12 }
    })
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
        rotate: [0, -2],
    },
    // Capa frontal (más rápida) - profundidad 3
    foreground: {
        y: ["0%", "35%"],
        scale: [1, 1.12],
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

/**
 * Línea de tiempo del hero de La Serena (BR-114): cada tramo es [inicio, fin] del avance del scroll por la sección (0..1).
 * Todo depende del scroll (decisión del usuario, 2026-11-27): la marca estalla, queda el fondo en blanco, sube el título,
 * el subtítulo aparece letra por letra, entran las tres tarjetas (cada una con su gesto) y al final los carruseles.
 */
export const HERO_SERENA_TIMELINE = {
    hint: [0, 0.04],
    // La explosión dura unas 190 svh de scroll (antes 70): con la sección de 710 svh (escritorio) son unas 8 vueltas de rueda
    explode: [0, 0.3],
    title: [0.34, 0.44],
    // El neón del techo se dibuja abajo, detrás de las tarjetas, mientras entran, y se enciende cuando terminan
    neon: [0.56, 0.72],
    neonOn: [0.72, 0.74],
    subtitle: [0.44, 0.59],
    cards: [
        [0.59, 0.65],
        [0.63, 0.69],
        [0.67, 0.73],
    ],
    rails: [0.74, 0.885],
} as const satisfies Record<string, readonly [number, number] | ReadonlyArray<readonly [number, number]>>;

/**
 * La marca «Royce» del hero de La Serena al cargar (BR-114): el contorno se dibuja solo y después se rellena. Es lo único
 * del hero que no depende del scroll, para que la marca se vea sin bajar. Con «reducir movimiento» aparece completa.
 */
export const wordmarkDraw: Variants = {
    hidden: { pathLength: 0, fillOpacity: 0 },
    // `custom` es el número de la letra: cada una entra un poco después que la anterior
    visible: (letter: number = 0) => ({
        pathLength: 1,
        fillOpacity: 1,
        transition: {
            pathLength: { duration: 1.2, delay: letter * 0.07, ease: [0.22, 1, 0.36, 1] },
            fillOpacity: { duration: 0.5, delay: 0.9 + letter * 0.07, ease: "easeOut" },
        },
    }),
};

/**
 * Línea de tiempo de «Estilo que te acompaña» de La Serena (BR-117), de 0 a 1 mientras la sección está fija en escritorio:
 * el velo se cierra y la franja se aleja, sube el título, aparece el subtítulo y entran las tres tarjetas, una tras otra.
 * Del 0,5 al 1 no pasa nada nuevo: es el tramo en que la vista se asienta y solo corre la franja de fotos (decisión del
 * usuario, 2026-11-27: que el scroll deje unos segundos la sección quieta antes de pasar a la siguiente).
 */
export const BENEFITS_SERENA_TIMELINE = {
    veil: [0, 0.18],
    strip: [0, 0.6],
    title: [0.02, 0.16],
    subtitle: [0.12, 0.26],
    cards: [
        [0.2, 0.34],
        [0.28, 0.42],
        [0.36, 0.5],
    ],
} as const satisfies Record<string, readonly [number, number] | ReadonlyArray<readonly [number, number]>>;
