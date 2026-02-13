/**
 * GUÍA DE ANIMACIONES AVANZADAS CON LENIS + FRAMER MOTION
 *
 * Este archivo contiene ejemplos y técnicas para aprovechar al máximo
 * la combinación de Lenis smooth scroll con animaciones de Framer Motion
 */

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { useLenisScroll } from "@/hooks/useLenisScroll";

/* ================================================================
   TÉCNICA 1: SCROLL PROGRESS BAR
   Barra que se llena mientras haces scroll en la página
   ================================================================ */

export const ScrollProgressBar = () => {
  const { progress } = useLenisScroll();

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "4px",
        background: "linear-gradient(90deg, #d52323, #fe0000)",
        transformOrigin: "0%",
        scaleX: progress, // 0 a 1
        zIndex: 9999,
      }}
    />
  );
};

/* ================================================================
   TÉCNICA 2: PARALLAX BASADO EN VELOCIDAD
   Elementos se mueven más rápido cuando scrolleas rápido
   ================================================================ */

export const VelocityParallax = () => {
  const { velocity, scroll } = useLenisScroll();

  return (
    <motion.div
      style={{
        transform: `translateY(${scroll * 0.5}px) rotate(${velocity * 2}deg)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      {/* Tu contenido aquí */}
    </motion.div>
  );
};

/* ================================================================
   TÉCNICA 3: DIRECCION-AWARE ANIMATIONS
   Animaciones diferentes según dirección del scroll
   ================================================================ */

export const DirectionAwareElement = () => {
  const { direction } = useLenisScroll();

  return (
    <motion.div
      animate={{
        x: direction === 1 ? 100 : -100, // Scrolling down vs up
        opacity: 1,
      }}
      transition={{ duration: 0.6 }}
    >
      {/* Tu contenido */}
    </motion.div>
  );
};

/* ================================================================
   TÉCNICA 4: PARALLAX SMOOTH CON SPRING
   Parallax con física realista usando useSpring
   ================================================================ */

export const SmoothParallaxSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Aplicar spring para movimiento suave y natural
  const y = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "30%"]), {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={sectionRef}>
      <motion.div style={{ y, opacity }}>
        {/* Contenido con parallax suave */}
      </motion.div>
    </section>
  );
};

/* ================================================================
   TÉCNICA 5: SCALE BASED ON SCROLL
   Escalar elemento según la posición en viewport
   ================================================================ */

export const ScaleOnScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <motion.div ref={ref} style={{ scale, rotate }}>
      {/* Elemento que escala y rota */}
    </motion.div>
  );
};

/* ================================================================
   TÉCNICA 6: REVEAL TEXT ON SCROLL
   Texto que aparece letra por letra mientras scrolleas
   ================================================================ */

export const RevealText = ({ text }: { text: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.5"],
  });

  return (
    <div ref={ref} style={{ display: "flex", gap: "0.1em" }}>
      {text.split("").map((char, i) => {
        const charProgress = useTransform(
          scrollYProgress,
          [i / text.length, (i + 1) / text.length],
          [0, 1],
        );
        const opacity = useTransform(charProgress, [0, 1], [0, 1]);
        const y = useTransform(charProgress, [0, 1], [20, 0]);

        return (
          <motion.span key={i} style={{ opacity, y, display: "inline-block" }}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ================================================================
   TÉCNICA 7: HORIZONTAL SCROLL SECTION
   Sección que scrollea horizontalmente mientras scrolleas vertical
   ================================================================ */

export const HorizontalScrollSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <section ref={sectionRef} style={{ overflow: "hidden" }}>
      <motion.div
        style={{
          x,
          display: "flex",
          gap: "20px",
          width: "300%", // Ancho total del contenido horizontal
        }}
      >
        <div style={{ minWidth: "100vw" }}>Item 1</div>
        <div style={{ minWidth: "100vw" }}>Item 2</div>
        <div style={{ minWidth: "100vw" }}>Item 3</div>
      </motion.div>
    </section>
  );
};

/* ================================================================
   TÉCNICA 8: STAGGER CARDS ON SCROLL
   Cards que aparecen con delay incremental
   ================================================================ */

export const StaggerCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "start 0.3"],
  });

  const cards = [1, 2, 3, 4];

  return (
    <div ref={containerRef}>
      {cards.map((card, i) => {
        const cardProgress = useTransform(
          scrollYProgress,
          [i * 0.2, (i + 1) * 0.2],
          [0, 1],
        );
        const opacity = useTransform(cardProgress, [0, 1], [0, 1]);
        const y = useTransform(cardProgress, [0, 1], [50, 0]);
        const scale = useTransform(cardProgress, [0, 1], [0.9, 1]);

        return (
          <motion.div key={card} style={{ opacity, y, scale }}>
            Card {card}
          </motion.div>
        );
      })}
    </div>
  );
};

/* ================================================================
   TÉCNICA 9: BLUR ON SCROLL
   Elemento se difumina al salir del viewport
   ================================================================ */

export const BlurOnScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const blur = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        filter: `blur(${blur}px)`,
        opacity,
      }}
    >
      {/* Contenido que se difumina */}
    </motion.div>
  );
};

/* ================================================================
   TÉCNICA 10: PIN SECTION (Scroll Hijacking)
   Sección que se queda fija mientras otras animaciones ocurren
   ================================================================ */

export const PinSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.5, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section
      ref={sectionRef}
      style={{
        height: "300vh", // Altura extra para el scroll
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <motion.div style={{ scale, rotate }}>
          {/* Contenido que se transforma mientras la sección está fija */}
        </motion.div>
      </div>
    </section>
  );
};

/* ================================================================
   TIPS Y MEJORES PRÁCTICAS:
   
   1. USA useSpring para parallax más suave y natural
   2. Combina velocity de Lenis con animaciones para efectos dinámicos
   3. direction te permite hacer animaciones asimétricas (up vs down)
   4. useTransform es más performante que animate()
   5. will-change: transform en CSS para mejor rendimiento
   6. Usa offset en useScroll para controlar cuándo inicia/termina
   7. requestAnimationFrame ya está manejado por Lenis
   8. Para scroll horizontal, usa overflowX y transform translateX
   9. Spring stiffness bajo (50-100) = más suave
   10. Spring damping alto (30-50) = menos rebote
   
   ================================================================ */
