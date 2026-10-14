import { useEffect, useState, type RefObject } from "react";
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";

/**
 * Haz de luz del hero que sigue al cursor (BR-055, HU-EXP-004 CA-08).
 *
 * El haz es un círculo de tamaño fijo que se mueve con `transform` (lo compone la GPU, sin repintar el fondo). El
 * puntero solo actualiza `MotionValue`: nunca hay `setState` por `pointermove`.
 */
export const SPOTLIGHT_SIZE = 640;
const SPRING = { stiffness: 120, damping: 24, mass: 0.6 };

/** Traslación del haz para que su centro quede en el puntero, relativo a la esquina de la sección. */
export function spotlightOffset(
  pointer: { clientX: number; clientY: number },
  rect: { left: number; top: number },
  size: number,
): { x: number; y: number } {
  return { x: pointer.clientX - rect.left - size / 2, y: pointer.clientY - rect.top - size / 2 };
}

/** Solo con un puntero fino (ratón, trackpad) y sin «reducir movimiento». */
export function shouldTrackPointer({ finePointer, reducedMotion }: { finePointer: boolean; reducedMotion: boolean }): boolean {
  return finePointer && !reducedMotion;
}

const FINE_POINTER = "(pointer: fine)";

/**
 * Devuelve la posición y la opacidad del haz (con resorte) y si está activo. Se escucha `pointermove` en la
 * sección, no en la ventana: al salir del hero el haz se apaga.
 */
export function usePointerSpotlight(sectionRef: RefObject<HTMLElement | null>): {
  enabled: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
} {
  const reducedMotion = useReducedMotion() ?? false;
  // Se lee una vez al montar: cambiar de ratón a pantalla táctil en caliente no justifica un listener.
  const [finePointer] = useState(() => typeof window !== "undefined" && window.matchMedia?.(FINE_POINTER).matches === true);
  const enabled = shouldTrackPointer({ finePointer, reducedMotion });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);
  // Apagado hasta el primer movimiento (si no, aparecería en la esquina) y al salir del hero.
  const rawOpacity = useMotionValue(0);
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!enabled || !section) return;

    const onMove = (event: PointerEvent) => {
      const offset = spotlightOffset(event, section.getBoundingClientRect(), SPOTLIGHT_SIZE);
      rawX.set(offset.x);
      rawY.set(offset.y);
      rawOpacity.set(1);
    };
    const onLeave = () => rawOpacity.set(0);
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, sectionRef, rawX, rawY, rawOpacity]);

  return { enabled, x, y, opacity };
}
