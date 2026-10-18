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
  /** Con `true`, las capas son `div` y no `span`: para un bloque con párrafos adentro (HTML válido). */
  block?: boolean;
  /**
   * Desde qué punto del avance se cruza con el texto nítido; antes se ve solo la copia borrosa. Por defecto, la mitad.
   * Con `0`, el avance que se pase es exactamente la ventana del enfoque.
   */
  focusFrom?: number;
  children: ReactNode;
}

/**
 * Texto que se enfoca con el scroll (BR-074, HU-EXP-004 CA-25). Animar el radio de un desenfoque en cada fotograma no
 * es barato, así que hay dos capas: el texto nítido y una copia ya desenfocada (radio fijo), y con el scroll solo se
 * cruzan sus opacidades. La copia es `aria-hidden`: los lectores de pantalla leen el texto una sola vez.
 */
export function FocusText({
  as = "p",
  className,
  progress,
  blurPx = 8,
  enabled,
  block = false,
  focusFrom = TEXT_FOCUS_FROM,
  children,
}: FocusTextProps) {
  // Con una función y no con rangos: framer acelera los rangos con la API de animaciones web (ScrollTimeline), que jsdom
  // no trae. Son dos escrituras de `opacity` por fotograma, sin pasar por React: el costo es mínimo.
  // La primera mitad del avance el texto se ve solo borroso; recién en la segunda se cruza con el nítido. Si el nítido
  // empezara a aparecer antes, se vería un texto legible con un resplandor, no un texto desenfocado.
  const sharpOpacity = useTransform(progress, (value) => ramp(focusFrom, 1)(value));
  const blurOpacity = useTransform(progress, (value) => 1 - ramp(focusFrom, 1)(value));

  if (!enabled) return createElement(as, { className }, children);

  const Wrapper = block ? "div" : "span";
  const Layer = block ? motion.div : motion.span;

  return createElement(
    as,
    { className },
    <Wrapper className={styles.focus} style={{ "--focus-blur": `${blurPx}px` } as CSSProperties}>
      <Layer className={styles.sharp} style={{ opacity: sharpOpacity }}>
        {children}
      </Layer>
      <Layer className={styles.blur} aria-hidden="true" data-focus-blur style={{ opacity: blurOpacity }}>
        {children}
      </Layer>
    </Wrapper>,
  );
}
