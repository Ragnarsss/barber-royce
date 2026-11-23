import { animate, mix, motion, useReducedMotion, type SVGMotionProps } from "framer-motion";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import type { FixedShapeGeometry } from "./shapeGeometry";
import styles from "./FixedShape.module.css";

/** Lo que tarda una figura en transformarse en la de la otra sucursal (BR-104). */
const MORPH_SECONDS = 0.7;

const pointCount = (points: string) => points.trim().split(/\s+/).length;

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
 *
 * Si `shape` cambia (el visitante cambió de sucursal, BR-104), la figura se transforma en la nueva punto a punto en vez de
 * saltar. Framer interpola los puntos solo si ambas formas tienen la misma cantidad; un test lo exige. Se anima el DOM
 * directamente, sin estado ni re-render, y con «reducir movimiento» el cambio es inmediato.
 */
export function FixedShape({ shape, edge, children }: FixedShapeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const previous = useRef(shape.points);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const [from, to] = [previous.current, shape.points];
    previous.current = to;
    const svg = svgRef.current;
    if (from === to || reducedMotion || !svg || pointCount(from) !== pointCount(to)) return;

    // React ya escribió los puntos nuevos; se vuelve a los anteriores antes de pintar y se anima hacia los nuevos. Entran
    // todos los polígonos de la figura (el principal y el filo de luz de sus hijos), que comparten los mismos puntos.
    const polygons = [...svg.querySelectorAll("polygon")].filter((polygon) => polygon.getAttribute("points") === to);
    polygons.forEach((polygon) => polygon.setAttribute("points", from));
    const between = mix(from, to);
    const controls = animate(0, 1, {
      duration: MORPH_SECONDS,
      ease: "easeInOut",
      onUpdate: (progress) => {
        const points = between(progress);
        polygons.forEach((polygon) => polygon.setAttribute("points", points));
      },
      onComplete: () => polygons.forEach((polygon) => polygon.setAttribute("points", to)),
    });
    return () => {
      controls.stop();
      polygons.forEach((polygon) => polygon.setAttribute("points", to));
    };
  }, [shape.points, reducedMotion]);

  return (
    <svg ref={svgRef} className={styles.shape} viewBox={`0 0 ${shape.width} ${shape.height}`} aria-hidden="true" focusable="false">
      {edge ? <motion.polygon points={shape.points} {...edge} /> : <polygon points={shape.points} />}
      {children}
    </svg>
  );
}
