import { createElement, type CSSProperties, type ElementType, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import styles from "./FocusText.module.css";

interface FocusTextProps {
  /** Etiqueta del texto: «h2» para el título, «p» para el subtítulo. */
  as?: ElementType;
  className?: string;
  /** Avance del scroll de 0 a 1: con 0 el texto se ve desenfocado y con 1, nítido. */
  progress: MotionValue<number>;
  /** Radio del desenfoque de la copia, en px. */
  blurPx?: number;
  /** Con `false` (reducir movimiento) se pinta el texto nítido y quieto, sin copia desenfocada. */
  enabled: boolean;
  children: ReactNode;
}

/**
 * Texto que se enfoca con el scroll (BR-074, HU-EXP-004 CA-25). Animar el radio de un desenfoque en cada fotograma no
 * es barato, así que hay dos capas: el texto nítido y una copia ya desenfocada (radio fijo), y con el scroll solo se
 * cruzan sus opacidades. La copia es `aria-hidden`: los lectores de pantalla leen el texto una sola vez.
 */
/** Rampa de 0 a 1 entre dos puntos del avance, fuera de ellos queda en 0 o en 1. */
const ramp = (from: number, to: number) => (value: number) => Math.min(1, Math.max(0, (value - from) / (to - from)));

export function FocusText({ as = "p", className, progress, blurPx = 8, enabled, children }: FocusTextProps) {
  // Con una función y no con rangos: framer acelera los rangos con la API de animaciones web (ScrollTimeline), que jsdom
  // no trae. Son dos escrituras de `opacity` por fotograma, sin pasar por React: el costo es mínimo.
  const sharpOpacity = useTransform(progress, (value) => ramp(0.15, 1)(value));
  const blurOpacity = useTransform(progress, (value) => 1 - ramp(0, 0.85)(value));

  if (!enabled) return createElement(as, { className }, children);

  return createElement(
    as,
    { className },
    <span className={styles.focus} style={{ "--focus-blur": `${blurPx}px` } as CSSProperties}>
      <motion.span className={styles.sharp} style={{ opacity: sharpOpacity }}>
        {children}
      </motion.span>
      <motion.span className={styles.blur} aria-hidden="true" data-focus-blur style={{ opacity: blurOpacity }}>
        {children}
      </motion.span>
    </span>,
  );
}
