import { createElement, type CSSProperties, type ElementType, type ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import styles from "./FocusText.module.css";
import { ramp, TEXT_FOCUS_FROM } from "@/utils/scrollReveal";

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
export function FocusText({ as = "p", className, progress, blurPx = 8, enabled, children }: FocusTextProps) {
  // Con una función y no con rangos: framer acelera los rangos con la API de animaciones web (ScrollTimeline), que jsdom
  // no trae. Son dos escrituras de `opacity` por fotograma, sin pasar por React: el costo es mínimo.
  // La primera mitad del avance el texto se ve solo borroso; recién en la segunda se cruza con el nítido. Si el nítido
  // empezara a aparecer antes, se vería un texto legible con un resplandor, no un texto desenfocado.
  const sharpOpacity = useTransform(progress, (value) => ramp(TEXT_FOCUS_FROM, 1)(value));
  const blurOpacity = useTransform(progress, (value) => 1 - ramp(TEXT_FOCUS_FROM, 1)(value));

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
