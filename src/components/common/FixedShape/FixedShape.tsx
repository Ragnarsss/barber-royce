import { motion, type SVGMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import type { FixedShapeGeometry } from "./shapeGeometry";
import styles from "./FixedShape.module.css";

interface FixedShapeProps {
  shape: FixedShapeGeometry;
  /**
   * Hace que el trazo del polígono se dibuje (BR-096): variantes de `edgeDraw`, o un `style={{ pathLength }}` ligado al
   * scroll. Sin esto el polígono es un elemento SVG común y no suma ningún nodo animado. El grosor del trazo se mide en
   * unidades del `viewBox` (no con non-scaling-stroke, que impide dibujarlo).
   */
  edge?: SVGMotionProps<SVGPolygonElement>;
  /** Lo que se dibuja sobre el polígono (un filo de luz) o lo que este usa (un degradado en `<defs>`). */
  children?: ReactNode;
}

/**
 * Figura decorativa de fondo con geometría fija (BR-091): llena el ancho de su contenedor y toma el alto de la proporción
 * de su `viewBox`, así nunca se deforma. El color sale del CSS de la sección (`fill` y `stroke` del `polygon`), no de aquí.
 */
export function FixedShape({ shape, edge, children }: FixedShapeProps) {
  return (
    <svg className={styles.shape} viewBox={`0 0 ${shape.width} ${shape.height}`} aria-hidden="true" focusable="false">
      {edge ? <motion.polygon points={shape.points} {...edge} /> : <polygon points={shape.points} />}
      {children}
    </svg>
  );
}
