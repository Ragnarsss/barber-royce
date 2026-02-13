/**
 * TÉCNICA 4: Smooth Parallax con Spring Physics
 * Parallax con física realista usando useSpring
 */

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import type { ReactNode, CSSProperties } from "react";

interface SmoothParallaxProps {
  children: ReactNode;
  /**
   * Velocidad del parallax
   * - Valores negativos: se mueve hacia arriba
   * - Valores positivos: se mueve hacia abajo
   * - Rango típico: -50 a 50
   */
  speed?: number;
  /**
   * Rigidez del spring (mayor = más rápido y menos suave)
   * Rango típico: 50-300
   */
  stiffness?: number;
  /**
   * Amortiguamiento del spring (mayor = menos rebote)
   * Rango típico: 20-100
   */
  damping?: number;
  /**
   * Escala durante el parallax
   */
  scale?: [number, number];
  /**
   * Opacidad durante el parallax
   */
  opacity?: [number, number];
  /**
   * Clase CSS adicional
   */
  className?: string;
  /**
   * Estilos inline adicionales
   */
  style?: CSSProperties;
}

/**
 * Componente de parallax suave con física de spring
 *
 * @example
 * <SmoothParallax speed={-30} stiffness={100} damping={30}>
 *   <img src="hero.jpg" alt="Hero" />
 * </SmoothParallax>
 */
export const SmoothParallax = ({
  children,
  speed = -20,
  stiffness = 100,
  damping = 30,
  scale,
  opacity,
  className,
  style,
}: SmoothParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Transformaciones base
  const yRaw = useTransform(scrollYProgress, [0, 1], [0, speed]);
  const scaleRaw = useTransform(scrollYProgress, [0, 1], scale || [1, 1]);
  const opacityRaw = useTransform(scrollYProgress, [0, 1], opacity || [1, 1]);

  // Aplicar spring para movimiento suave
  const y = useSpring(yRaw, {
    stiffness,
    damping,
    restDelta: 0.001,
  });

  const scaleSpring = useSpring(scaleRaw, {
    stiffness,
    damping,
  });

  const opacitySpring = useSpring(opacityRaw, {
    stiffness,
    damping,
  });

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        scale: scale ? scaleSpring : 1,
        opacity: opacity ? opacitySpring : 1,
        willChange: "transform",
        ...style,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Sección completa con parallax suave
 * Wrapper conveniente para crear secciones enteras con parallax
 */
interface SmoothParallaxSectionProps {
  children: ReactNode;
  backgroundSpeed?: number;
  contentSpeed?: number;
  className?: string;
}

export const SmoothParallaxSection = ({
  children,
  backgroundSpeed = -30,
  contentSpeed = -10,
  className,
}: SmoothParallaxSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background parallax (más lento)
  const bgY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, backgroundSpeed]),
    { stiffness: 100, damping: 30 },
  );

  // Content parallax (más rápido)
  const contentY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, contentSpeed]),
    { stiffness: 100, damping: 30 },
  );

  // Fade in/out
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className={className}
      style={{ position: "relative" }}
    >
      {/* Background layer */}
      <motion.div
        style={{
          y: bgY,
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        {/* Puedes agregar background aquí */}
      </motion.div>

      {/* Content layer */}
      <motion.div
        style={{
          y: contentY,
          opacity,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </motion.div>
    </section>
  );
};
