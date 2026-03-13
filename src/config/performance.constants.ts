/**
 * Constantes de performance para animaciones y scroll
 * Centraliza valores críticos para optimizaciones
 */

// ============================================================================
// SCROLL PERFORMANCE
// ============================================================================

/**
 * Target FPS para scroll animations
 * 30 FPS ofrece buen balance entre suavidad y rendimiento
 * Reduce de ~60 actualizaciones/segundo a 30 (50% menos cálculos)
 */
export const SCROLL_TARGET_FPS = 30;

/**
 * Throttle delay para scroll events (ms)
 * Previene ejecución excesiva de callbacks de scroll
 */
export const SCROLL_THROTTLE_MS = 16; // ~60fps

/**
 * Umbral de velocidad para considerar scroll "activo"
 * Usado para aplicar will-change dinámicamente
 */
export const SCROLL_VELOCITY_THRESHOLD = 0.5;

// ============================================================================
// INTERSECTION OBSERVER
// ============================================================================

/**
 * Configuración para IntersectionObserver de animaciones
 * - rootMargin: Detecta elementos antes de que entren al viewport (prefetch will-change)
 * - threshold: Porcentaje visible del elemento para activar callback
 */
export const ANIMATION_OBSERVER_CONFIG = {
  rootMargin: '50px 0px 50px 0px', // Activar 50px antes/después del viewport
  threshold: [0, 0.1, 0.5, 1], // Múltiples checkpoints para control fino
} as const;

/**
 * Margin para lazy loading de imágenes
 * Más agresivo que animaciones (carga antes)
 */
export const LAZY_LOAD_MARGIN = '200px 0px';

// ============================================================================
// WILL-CHANGE OPTIMIZATION
// ============================================================================

/**
 * Duración para mantener will-change activo después de animación (ms)
 * Balance entre preparación GPU y liberación de memoria
 */
export const WILL_CHANGE_CLEANUP_DELAY = 1000; // 1 segundo después de animación

/**
 * Máximo de elementos con will-change simultáneos
 * Limita uso de memoria GPU (cada will-change consume recursos)
 * Objetivo: 3-5 elementos máximo
 */
export const MAX_WILL_CHANGE_ELEMENTS = 5;

// ============================================================================
// PARALLAX PERFORMANCE
// ============================================================================

/**
 * Número de puntos de interpolación para parallax
 * Menos puntos = menos cálculos
 * [0, 1] es suficiente para la mayoría de casos
 */
export const PARALLAX_INTERPOLATION_POINTS = 2;

/**
 * Umbral de scrollY delta para actualizar parallax
 * Ignora micro-scrolls para reducir recalculations
 */
export const PARALLAX_SCROLL_THRESHOLD = 1; // 1px

// ============================================================================
// RAF (RequestAnimationFrame) BATCHING
// ============================================================================

/**
 * Tamaño máximo de batch para operaciones DOM
 * Agrupa lecturas/escrituras para evitar layout thrashing
 */
export const DOM_BATCH_SIZE = 10;

/**
 * Timeout para flush de batch DOM (ms)
 * Si no se alcanza DOM_BATCH_SIZE, flush después de este tiempo
 */
export const DOM_BATCH_TIMEOUT = 100;

// ============================================================================
// FRAMER MOTION OPTIMIZATION
// ============================================================================

/**
 * Configuración optimizada para MotionValues
 * Reduce precisión para mejorar performance
 */
export const MOTION_VALUE_CONFIG = {
  // Redondear transformaciones a 2 decimales
  precision: 2,
  // Threshold mínimo de cambio para disparar re-render
  threshold: 0.01,
} as const;

/**
 * Limitar useTransform calls por componente
 * Objetivo: <= 3 useTransform por componente
 */
export const MAX_TRANSFORMS_PER_COMPONENT = 3;

// ============================================================================
// MONITORING
// ============================================================================

/**
 * Habilitar warnings de performance en desarrollo
 */
export const ENABLE_PERF_WARNINGS = import.meta.env.DEV;

/**
 * Umbral de Long Tasks para warning (ms)
 * Chrome considera Long Task > 50ms
 */
export const LONG_TASK_THRESHOLD = 50;

/**
 * Objetivo mínimo de FPS durante scroll
 * < 55 FPS genera lag perceptible
 */
export const TARGET_MIN_FPS = 55;
