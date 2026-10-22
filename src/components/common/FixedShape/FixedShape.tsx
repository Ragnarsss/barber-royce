import type { ReactNode } from "react";
import type { FixedShapeGeometry } from "./shapeGeometry";
import styles from "./FixedShape.module.css";

interface FixedShapeProps {
  shape: FixedShapeGeometry;
  /** Lo que se dibuja sobre el polígono (un filo de luz) o lo que este usa (un degradado en `<defs>`). */
  children?: ReactNode;
}

/**
 * Figura decorativa de fondo con geometría fija (BR-091): llena el ancho de su contenedor y toma el alto de la proporción
 * de su `viewBox`, así nunca se deforma. El color sale del CSS de la sección (`fill` del `polygon`), no de aquí.
 */
export function FixedShape({ shape, children }: FixedShapeProps) {
  return (
    <svg className={styles.shape} viewBox={`0 0 ${shape.width} ${shape.height}`} aria-hidden="true" focusable="false">
      <polygon points={shape.points} />
      {children}
    </svg>
  );
}
