import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useLenisInstance } from "@/hooks/useLenisContext";
import styles from "./BackToTop.module.css";

/** Hexágono de puntas arriba, con el trazo metido 3 unidades para que el anillo no lo recorte el `clip-path`. */
const RING = "M50 3 L97 30.5 L97 85 L50 112.5 L3 85 L3 30.5 Z";

const MAIN_ID = "main-content";
const SCROLL_DURATION = 1.2;

/**
 * Botón de volver arriba (BR-089, HU-EXP-004 CA-33): un hexágono como los del panal, con un anillo que se llena con el
 * avance de la página. Aparece pasada una pantalla de scroll. Sube con Lenis, o con `scrollTo` si no hay (y de golpe con
 * reducir movimiento), y deja el foco en el contenido principal: si no, el botón se oculta con el foco dentro.
 *
 * Nada reacciona a cada evento de scroll: el anillo es un `MotionValue` ligado a `scrollYProgress` y el estado
 * «visible» solo cambia al cruzar la pantalla, no en cada evento.
 */
export const BackToTop = () => {
  const reducedMotion = useReducedMotion() ?? false;
  const lenis = useLenisInstance();
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  const isVisible = useRef(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > window.innerHeight;
    if (next === isVisible.current) return;
    isVisible.current = next;
    setVisible(next);
  });

  const goTop = () => {
    if (lenis) {
      lenis.scrollTo(0, reducedMotion ? { immediate: true } : { duration: SCROLL_DURATION });
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
    document.getElementById(MAIN_ID)?.focus({ preventScroll: true });
  };

  return (
    <div className={styles.dock} data-visible={visible || undefined} inert={!visible}>
      <button type="button" className={styles.button} onClick={goTop} aria-label="Volver arriba">
        <svg className={styles.ring} viewBox="0 0 100 115.47" aria-hidden="true" focusable="false">
          <path className={styles.track} d={RING} />
          <motion.path className={styles.progress} d={RING} style={{ pathLength: scrollYProgress }} />
        </svg>
        <ArrowUp className={styles.arrow} aria-hidden="true" />
      </button>
    </div>
  );
};
