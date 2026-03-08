import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./CTA1.module.css";
import ctaImage from "@/assets/cta1_model.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxLayers } from "@/hooks/useParallaxLayers";
import { fadeInLeft, fadeInRight } from "@/config/animations.config";

export function CTA1() {
  const { ref, controls } = useScrollAnimation();

  const { ref: sectionRef, layers } = useParallaxLayers<HTMLElement>(undefined, {
    offset: ["start end", "end start"],
  });

  return (
    <section id="cta-1" className={styles.cta} ref={sectionRef}>
      {/* Capa de fondo - hexágonos con opacidad reducida */}
      <motion.div
        className={styles.textHexagonBackground}
        style={{ y: layers.slow.y, x: layers.slow.x }}
      ></motion.div>
      <motion.div
        className={styles.imageHexagonBackground}
        style={{ y: layers.slow.y, x: layers.slow.x }}
      ></motion.div>

      {/* Capa principal - hexágonos principales */}
      <motion.div
        className={styles.textHexagon}
        style={{ y: layers.middle.y, rotate: layers.middle.rotate }}
      ></motion.div>
      <motion.div
        className={styles.imageHexagon}
        style={{ y: layers.middle.y }}
      ></motion.div>

      {/* Capa frontal - hexágonos pequeños decorativos */}
      <motion.div
        className={styles.textHexagonForeground}
        style={{ y: layers.fast.y, x: layers.fast.x }}
      ></motion.div>
      <motion.div
        className={styles.imageHexagonForeground}
        style={{ y: layers.fast.y, x: layers.fast.x }}
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
            <div className={styles.ctaButtons}>
              <Button className={styles.ctaButton} size="lg">
                <Calendar size={20} />
                Agendar Ahora
              </Button>
              <a
                href="#services"
                className={styles.ctaButtonGhost}
              >
                Conocer Servicios
                <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </motion.div>
        <motion.img
          src={ctaImage}
          alt="Modelo con corte premium de Royce Barbería"
          className={styles.ctaImage}
          loading="lazy"
          width="500"
          height="700"
          initial="hidden"
          animate={controls}
          variants={fadeInRight}
          style={{ y: layers.foreground.y, scale: layers.foreground.scale }}
        />
      </div>
    </section>
  );
}
