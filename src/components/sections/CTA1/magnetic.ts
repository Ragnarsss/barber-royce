import { useEffect, useState, type RefObject } from "react";
import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from "framer-motion";

/**
 * Botón «magnético» (BR-058): con el ratón encima, el botón se corre una fracción hacia el cursor, con tope. Solo
 * `MotionValue` (nunca `setState` por `pointermove`) y solo con un puntero fino y sin «reducir movimiento».
 */
export const MAGNET = {
  STRENGTH: 0.25,
  MAX_PX: 10,
} as const;

const SPRING = { stiffness: 220, damping: 18, mass: 0.4 };
const clamp = (value: number) => Math.max(-MAGNET.MAX_PX, Math.min(MAGNET.MAX_PX, value));

/** Desplazamiento del botón hacia el cursor, desde su centro. */
export function magneticOffset(
  pointer: { clientX: number; clientY: number },
  rect: { left: number; top: number; width: number; height: number },
): { x: number; y: number } {
  const dx = pointer.clientX - (rect.left + rect.width / 2);
  const dy = pointer.clientY - (rect.top + rect.height / 2);
  return { x: clamp(dx * MAGNET.STRENGTH), y: clamp(dy * MAGNET.STRENGTH) };
}

/** Posición del botón con resorte; vuelve al centro al salir el cursor. */
export function useMagnetic(ref: RefObject<HTMLElement | null>): { x: MotionValue<number>; y: MotionValue<number> } {
  const reducedMotion = useReducedMotion() ?? false;
  // Se lee una vez al montar, como el haz del hero.
  const [finePointer] = useState(() => typeof window !== "undefined" && window.matchMedia?.("(pointer: fine)").matches === true);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer || reducedMotion) return;

    const onMove = (event: PointerEvent) => {
      const offset = magneticOffset(event, el.getBoundingClientRect());
      rawX.set(offset.x);
      rawY.set(offset.y);
    };
    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, finePointer, reducedMotion, rawX, rawY]);

  return { x, y };
}
