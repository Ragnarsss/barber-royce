/**
 * Configuraciones de animaciones reutilizables usando Framer Motion
 */

import type { Variants } from "framer-motion";

/**
 * Variantes para animaciones de fade in desde abajo
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Variantes para animaciones de fade in desde la izquierda
 */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Variantes para animaciones de fade in desde la derecha
 */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Variantes para animaciones de scale in
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/**
 * Variantes para animaciones de contenedores (stagger children)
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Configuración de viewport para intersection observer
 */
export const defaultViewport = {
  once: true, // Solo animar una vez
  amount: 0.2, // Activar cuando el 20% del elemento es visible
  margin: "0px 0px -100px 0px", // Activar antes de que el elemento esté completamente visible
};

/**
 * Configuración para parallax suave
 */
export const parallaxConfig = {
  initial: { y: 0 },
  // Se usará con useScroll y useTransform para efectos parallax
};

/**
 * Funciones helper para calcular movimiento parallax por capas
 * Basado en profundidad: cuanto más lejos, más lento se mueve
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
  // Capa extra lenta para elementos decorativos
  slow: {
    y: ["0%", "10%"],
    x: ["0%", "5%"],
  },
  // Capa rápida para elementos destacados
  fast: {
    y: ["0%", "45%"],
    x: ["0%", "-3%"],
  },
};
