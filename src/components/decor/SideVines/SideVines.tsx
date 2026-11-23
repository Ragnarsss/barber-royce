import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { VINE_BOX, VINE_LEAF, VINE_LEAF_BASE, VINE_LEAF_VEIN, VINE_LEAVES, VINE_STEM, type VineLeaf } from "./vineShapes";
import styles from "./SideVines.module.css";

/** Cuánto del recorrido del scroll usa el tallo para crecer entero; el resto, las últimas hojas terminan de abrirse. */
const GROW_UNTIL = 0.85;
/** Lo que tarda una hoja en abrirse, como fracción del recorrido. */
const LEAF_SPAN = 0.07;

/** La caja donde va la hoja: su base (30, 118) cae sobre el punto del tallo. */
const placement = ({ x, y, rotate }: VineLeaf) => `translate(${x} ${y}) rotate(${rotate}) translate(${-VINE_LEAF_BASE.x} ${-VINE_LEAF_BASE.y})`;

function LeafShape() {
  return (
    <>
      <path d={VINE_LEAF} className={styles.leaf} />
      <path d={VINE_LEAF_VEIN} className={styles.vein} />
    </>
  );
}

/** Una hoja que se abre (escala y opacidad) cuando el tallo llega a su altura. Cada una lee el mismo `MotionValue`. */
function GrowingLeaf({ leaf, progress }: { leaf: VineLeaf; progress: MotionValue<number> }) {
  const start = (leaf.y / VINE_BOX.height) * GROW_UNTIL;
  const opened = useTransform(progress, [start, start + LEAF_SPAN], [0, 1], { clamp: true });
  return (
    <g transform={placement(leaf)}>
      <motion.g style={{ scale: useTransform(opened, (value) => leaf.scale * value), opacity: opened, originX: 0.5, originY: 1 }}>
        <LeafShape />
      </motion.g>
    </g>
  );
}

/**
 * Una enredadera decorativa que crece con el scroll (BR-108, HU-SUC-002 CA-06): el tallo se dibuja con `pathLength`
 * ligado al avance de su sección y las hojas se abren cuando el tallo llega a su altura. Todo es `MotionValue`, sin
 * estado por scroll (CP-PERF-006). Con «reducir movimiento» se ve completa y quieta. `aria-hidden`: no dice nada que el
 * resto de la página no diga, y el contenedor no recibe clics.
 *
 * Va en un contenedor con `position: relative` (la sección), que ella llena. `side="right"` la espeja.
 */
export default function SideVines({ side }: { side: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });
  const length = useTransform(scrollYProgress, [0, GROW_UNTIL], [0, 1], { clamp: true });

  return (
    <div ref={ref} className={`${styles.vines} ${side === "right" ? styles.right : styles.left}`} aria-hidden="true">
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VINE_BOX.width} ${VINE_BOX.height}`}
        preserveAspectRatio="xMinYMin slice"
        focusable="false"
      >
        {reducedMotion ? (
          <>
            <path d={VINE_STEM} className={styles.stem} />
            {VINE_LEAVES.map((leaf, index) => (
              <g key={index} transform={`${placement(leaf)} translate(${VINE_LEAF_BASE.x} ${VINE_LEAF_BASE.y}) scale(${leaf.scale}) translate(${-VINE_LEAF_BASE.x} ${-VINE_LEAF_BASE.y})`}>
                <LeafShape />
              </g>
            ))}
          </>
        ) : (
          <>
            <motion.path d={VINE_STEM} className={styles.stem} style={{ pathLength: length }} />
            {VINE_LEAVES.map((leaf, index) => (
              <GrowingLeaf key={index} leaf={leaf} progress={scrollYProgress} />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
