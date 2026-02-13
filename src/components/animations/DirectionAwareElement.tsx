/**
 * TÉCNICA 3: Direction-Aware Animations
 * Elementos que reaccionan a la dirección del scroll (arriba vs abajo)
 */

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useLenisScroll } from "@/hooks/useLenisScroll";

interface DirectionAwareProps {
  children: React.ReactNode;
  /**
   * Desplazamiento en px cuando scrolleas hacia abajo
   */
  downOffset?: number;
  /**
   * Desplazamiento en px cuando scrolleas hacia arriba
   */
  upOffset?: number;
  /**
   * Duración de la animación en segundos
   */
  duration?: number;
  className?: string;
}

/**
 * Componente que anima sus hijos según la dirección del scroll
 *
 * @example
 * <DirectionAwareElement downOffset={100} upOffset={-100}>
 *   <div>Contenido que se mueve según dirección</div>
 * </DirectionAwareElement>
 */
export const DirectionAwareElement = ({
  children,
  downOffset = 50,
  upOffset = -50,
  duration = 0.6,
  className,
}: DirectionAwareProps) => {
  const { direction } = useLenisScroll();
  const controls = useAnimation();

  useEffect(() => {
    // direction: 1 = scrolling down, -1 = scrolling up
    if (direction === 1) {
      controls.start({
        x: downOffset,
        opacity: 1,
        transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] },
      });
    } else if (direction === -1) {
      controls.start({
        x: upOffset,
        opacity: 1,
        transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] },
      });
    }
  }, [direction, downOffset, upOffset, duration, controls]);

  return (
    <motion.div
      initial={{ x: 0, opacity: 0.8 }}
      animate={controls}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Badge que muestra la dirección actual del scroll
 * Útil para debug y demos
 */
export const ScrollDirectionBadge = () => {
  const { direction, velocity } = useLenisScroll();

  return (
    <motion.div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        padding: "12px 20px",
        background: direction === 1 ? "#d52323" : "#fe0000",
        color: "white",
        borderRadius: "8px",
        fontWeight: 600,
        fontSize: "14px",
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
      animate={{
        scale: Math.abs(velocity) > 2 ? 1.1 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {direction === 1
        ? "↓ Scrolling Down"
        : direction === -1
          ? "↑ Scrolling Up"
          : "—"}
    </motion.div>
  );
};
