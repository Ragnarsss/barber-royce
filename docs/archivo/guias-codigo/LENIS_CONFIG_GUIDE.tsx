/**
 * GUÍA RÁPIDA: CONFIGURACIÓN DE LENIS
 *
 * Personaliza el comportamiento del smooth scroll editando estos valores
 */

import { useLenis } from "@/hooks/useLenis";

// ====================================================================
// EJEMPLOS DE CONFIGURACIONES
// ====================================================================

// 1. SMOOTH SCROLL LENTO Y ELEGANTE (sitios de lujo/portfolio)
export const LuxuryScroll = () => {
  useLenis({
    duration: 2.0, // Muy lento y suave
    easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    wheelMultiplier: 0.8, // Scroll más lento con rueda
  });
};

// 2. SMOOTH SCROLL RÁPIDO Y RESPONSIVE (e-commerce/noticias)
export const FastScroll = () => {
  useLenis({
    duration: 0.6, // Rápido
    easing: (t) => t, // Linear
    wheelMultiplier: 1.5, // Scroll más rápido
  });
};

// 3. SMOOTH SCROLL CON BOUNCE (divertido/creativo)
export const BounceScroll = () => {
  useLenis({
    duration: 1.5,
    easing: (t) => {
      // easeOutBounce
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
  });
};

// 4. SMOOTH SCROLL MÓVIL-FRIENDLY (mejor UX en touch)
export const MobileOptimized = () => {
  useLenis({
    duration: 1.0,
    smoothWheel: true,
    smoothTouch: false, // ¡IMPORTANTE! No suavizar en touch
    touchMultiplier: 2.5, // Scroll más rápido en móvil
  });
};

// 5. CONFIGURACIÓN ACTUAL (TU IMPLEMENTACIÓN)
export const CurrentConfig = () => {
  useLenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });
};

// ====================================================================
// FUNCIONES DE EASING POPULARES
// ====================================================================

export const easingFunctions = {
  // Suave al inicio
  easeInQuad: (t: number) => t * t,
  easeInCubic: (t: number) => t * t * t,
  easeInQuart: (t: number) => t * t * t * t,

  // Suave al final
  easeOutQuad: (t: number) => t * (2 - t),
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeOutExpo: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

  // Suave inicio y final
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,

  // Especiales
  linear: (t: number) => t,
  elastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

// ====================================================================
// MÉTODOS PROGRAMÁTICOS DE LENIS
// ====================================================================

// Scrollear a una posición específica
export const scrollTo = (
  target: number | string,
  options?: {
    offset?: number;
    duration?: number;
    easing?: (t: number) => number;
  },
) => {
  window.lenis?.scrollTo(target, {
    offset: options?.offset || 0,
    duration: options?.duration,
    easing: options?.easing,
  });
};

// Ejemplos de uso:
// scrollTo(0); // Ir al top
// scrollTo(1000); // Scrollear a 1000px
// scrollTo("#section-id"); // Scrollear a un elemento
// scrollTo("#services", { offset: -100, duration: 2 }); // Con opciones

// Detener el scroll
export const stopScroll = () => {
  window.lenis?.stop();
};

// Reanudar el scroll
export const startScroll = () => {
  window.lenis?.start();
};

// ====================================================================
// TIPS DE RENDIMIENTO
// ====================================================================

/*
  1. DURACIÓN:
     - 0.6-0.8s: Rápido, sitios con mucho contenido
     - 1.0-1.4s: Normal, mayoría de sitios
     - 1.5-2.5s: Lento, portfolios/lujo
  
  2. WHEEL MULTIPLIER:
     - 0.5-0.8: Scroll más lento (más control)
     - 1.0: Velocidad normal
     - 1.5-2.0: Scroll más rápido
  
  3. TOUCH:
     - smoothTouch: false es MEJOR para móviles (respeta gestos nativos)
     - touchMultiplier: 2-3 compensa la desactivación del smoothing
  
  4. EASING:
     - easeOutExpo: Muy suave y natural (RECOMENDADO)
     - easeOutCubic: Suave pero más rápido
     - linear: Sin suavizado (más preciso)
  
  5. OPTIMIZACIÓN:
     - Usa will-change: transform en elementos con parallax
     - Evita animaciones pesadas durante el scroll
     - Considera desactivar en dispositivos de baja potencia
*/
