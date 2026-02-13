import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./CTA1.module.css";
import ctaImage from "@/assets/cta1_model.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInLeft, fadeInRight, parallaxLayers } from "@/lib/animations";

export const CTA1 = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { ref, controls } = useScrollAnimation();

  // Parallax effect para múltiples capas de hexágonos
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Hexágonos principales - capa media
  const hexagonsY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.middle.y,
  );
  const hexagonsRotate = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.middle.rotate,
  );

  // Capas decorativas de fondo - más lentas
  const bgLayerY = useTransform(scrollYProgress, [0, 1], parallaxLayers.slow.y);
  const bgLayerX = useTransform(scrollYProgress, [0, 1], parallaxLayers.slow.x);

  // Capa superior - más rápida
  const fgLayerY = useTransform(scrollYProgress, [0, 1], parallaxLayers.fast.y);
  const fgLayerX = useTransform(scrollYProgress, [0, 1], parallaxLayers.fast.x);

  // Imagen con parallax
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.foreground.y,
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.foreground.scale,
  );

  return (
    <section id="cta-1" className={styles.cta} ref={sectionRef}>
      {/* Capa de fondo - hexágonos con opacidad reducida */}
      <motion.div
        className={styles.textHexagonBackground}
        style={{ y: bgLayerY, x: bgLayerX }}
      ></motion.div>
      <motion.div
        className={styles.imageHexagonBackground}
        style={{ y: bgLayerY, x: bgLayerX }}
      ></motion.div>

      {/* Capa principal - hexágonos principales */}
      <motion.div
        className={styles.textHexagon}
        style={{ y: hexagonsY, rotate: hexagonsRotate }}
      ></motion.div>
      <motion.div
        className={styles.imageHexagon}
        style={{ y: hexagonsY }}
      ></motion.div>

      {/* Capa frontal - hexágonos pequeños decorativos */}
      <motion.div
        className={styles.textHexagonForeground}
        style={{ y: fgLayerY, x: fgLayerX }}
      ></motion.div>
      <motion.div
        className={styles.imageHexagonForeground}
        style={{ y: fgLayerY, x: fgLayerX }}
      ></motion.div>

      <div className={styles.container} ref={ref}>
        <motion.div
          className={styles.content}
          initial="hidden"
          animate={controls}
          variants={fadeInLeft}
        >
          <div className={styles.textContent}>
            <h2 className={styles.title}>
              Reserva tu
              <br />
              Experiencia
              <br />
              Premium Hoy.
            </h2>
            <p className={styles.subtitle}>
              ¿Listo para un cambio que te defina? Agenda tu cita y descubre por
              qué somos la barbería de elección para quienes buscan lo mejor.
            </p>
            <Button className={styles.ctaButton} size="lg">
              <Calendar size={20} />
              Agendar Ahora
            </Button>
          </div>
        </motion.div>
        <motion.img
          src={ctaImage}
          alt="Modelo con corte premium de Royce Barbería"
          className={styles.ctaImage}
          initial="hidden"
          animate={controls}
          variants={fadeInRight}
          style={{ y: imageY, scale: imageScale }}
        />
      </div>
    </section>
  );
};
