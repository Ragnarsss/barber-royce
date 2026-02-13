/**
 * Hook personalizado para animaciones al hacer scroll
 */

import { useEffect, useRef } from "react";
import { useInView, useAnimation } from "framer-motion";

interface UseScrollAnimationOptions {
  /**
   * Si la animación debe ejecutarse solo una vez
   * @default true
   */
  once?: boolean;
  /**
   * Porcentaje del elemento que debe ser visible para activar la animación
   * @default 0.2
   */
  amount?: number;
  /**
   * Delay antes de iniciar la animación
   * @default 0
   */
  delay?: number;
}

interface UseScrollAnimationReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  controls: ReturnType<typeof useAnimation>;
  isInView: boolean;
}

/**
 * Hook que combina useInView y useAnimation para crear animaciones
 * activadas por scroll de manera sencilla
 */
export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {},
): UseScrollAnimationReturn => {
  const { once = true, amount = 0.2, delay = 0 } = options;

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        controls.start("visible");
      }, delay * 1000);

      return () => clearTimeout(timer);
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, delay, once]);

  return { ref, controls, isInView };
};
