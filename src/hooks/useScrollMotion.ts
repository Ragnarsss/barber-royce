import { useMotionValue, useMotionValueEvent, useScroll, useTransform, useVelocity, type MotionValue } from "framer-motion";
import { nextDirection } from "@/utils/scrollMotion";

/**
 * Dirección y velocidad del scroll como MotionValue (BR-015, RNF-PERF-006).
 * A diferencia de guardar el valor en un useState, un MotionValue cambia sin
 * re-renderizar el componente: framer-motion escribe el estilo directo en el
 * DOM. Se combinan con useTransform para derivar el estilo.
 */

/** 1 si el último movimiento fue hacia abajo, -1 si fue hacia arriba. */
export function useScrollDirection(): MotionValue<number> {
  const { scrollY } = useScroll();
  const direction = useMotionValue(1);

  useMotionValueEvent(scrollY, "change", (latest) => {
    direction.set(nextDirection(direction.get(), scrollY.getPrevious() ?? latest, latest));
  });

  return direction;
}

/** Velocidad absoluta del scroll en px/s. */
export function useScrollSpeed(): MotionValue<number> {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  return useTransform(velocity, (value) => Math.abs(value));
}
